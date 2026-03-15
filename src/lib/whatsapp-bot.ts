import { sendWhatsAppMessage } from './whatsapp'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe, formatAmountForStripe } from './stripe'
import type { MenuWithItems, MenuItem } from '@/types/database.types'

// État conversationnel simple (en production, stocker en Redis/DB)
const sessionStore = new Map<string, BotSession>()

interface BotSession {
  state: 'idle' | 'browsing' | 'cart' | 'checkout'
  tenantSlug: string
  tenantId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: Array<{ item: any; quantity: number }>
  lastActivity: number
}

function getSession(phone: string): BotSession | null {
  const session = sessionStore.get(phone)
  if (!session) return null
  // Expire après 30 minutes d'inactivité
  if (Date.now() - session.lastActivity > 30 * 60 * 1000) {
    sessionStore.delete(phone)
    return null
  }
  return session
}

function setSession(phone: string, session: BotSession) {
  sessionStore.set(phone, { ...session, lastActivity: Date.now() })
}

export async function handleWhatsAppMessage(
  from: string,
  text: string,
  phoneNumberId: string
) {
  const supabase = await createServiceClient()
  const normalizedText = text.trim().toLowerCase()

  // Trouver le restaurant par numéro WhatsApp
  const { data: configs } = await supabase
    .from('tenant_config')
    .select('tenant_id')
    .eq('whatsapp_number', phoneNumberId)
    .limit(1)

  const config = configs?.[0]
  if (!config) {
    await sendWhatsAppMessage(from, '❌ Service non disponible.', phoneNumberId)
    return
  }

  const tenantId = config.tenant_id

  const { data: tenantData } = await supabase
    .from('tenants')
    .select('slug, name, status')
    .eq('id', tenantId)
    .single()

  const tenant = tenantData

  if (!tenant || tenant.status !== 'active') {
    await sendWhatsAppMessage(from, '❌ Service non disponible.', phoneNumberId)
    return
  }
  const session = getSession(from) ?? {
    state: 'idle' as const,
    tenantSlug: tenant.slug,
    tenantId,
    cart: [],
    lastActivity: Date.now(),
  }

  // Commande "menu" ou "bonjour"
  if (['menu', 'bonjour', 'hello', 'start', '0'].includes(normalizedText) || session.state === 'idle') {
    const { data: menus } = await supabase
      .from('menus')
      .select('*, menu_items(*)')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('sort_order')

    const menuText = buildMenuText(tenant.name, menus as MenuWithItems[] ?? [])

    await sendWhatsAppMessage(from, menuText, phoneNumberId)
    setSession(from, { ...session, state: 'browsing', cart: [] })
    return
  }

  // Commande "panier" ou "commander"
  if (['panier', 'cart', 'commander', 'commande'].includes(normalizedText)) {
    if (session.cart.length === 0) {
      await sendWhatsAppMessage(from, '🛒 Votre panier est vide. Tapez *menu* pour voir nos plats.', phoneNumberId)
      return
    }

    const cartText = buildCartText(session.cart)
    await sendWhatsAppMessage(from, cartText, phoneNumberId)
    return
  }

  // Commande "payer"
  if (['payer', 'pay', 'checkout'].includes(normalizedText)) {
    if (session.cart.length === 0) {
      await sendWhatsAppMessage(from, '🛒 Votre panier est vide.', phoneNumberId)
      return
    }

    // Créer un lien de paiement Stripe
    const total = session.cart.reduce((sum, i) => sum + Number(i.item.price) * i.quantity, 0)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vge.gp'

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: session.cart.map(({ item, quantity }) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: formatAmountForStripe(Number(item.price)),
        },
        quantity,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/${session.tenantSlug}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${session.tenantSlug}`,
      metadata: { tenant_id: tenantId, channel: 'whatsapp', customer_phone: from },
    })

    const msg = `💳 *Paiement sécurisé*\n\nTotal : ${total.toFixed(2)} €\n\n👉 ${stripeSession.url}\n\n_Lien valable 30 minutes_`
    await sendWhatsAppMessage(from, msg, phoneNumberId)
    setSession(from, { ...session, state: 'checkout' })
    return
  }

  // Sélection d'un plat par numéro
  const itemNum = parseInt(normalizedText)
  if (!isNaN(itemNum) && session.state === 'browsing') {
    const { data: allItems } = await supabase
      .from('menu_items')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_available', true)
      .order('sort_order')

    if (allItems && itemNum > 0 && itemNum <= allItems.length) {
      const item = allItems[itemNum - 1]
      const existing = session.cart.find(i => i.item.id === item.id)

      if (existing) {
        existing.quantity++
      } else {
        session.cart.push({ item, quantity: 1 })
      }

      const selectedItem = item as MenuItem
      const msg = `✅ *${selectedItem.name}* ajouté au panier !\n\n${Number(selectedItem.price).toFixed(2)} €\n\nTapez *panier* pour voir votre panier\nTapez *payer* pour commander\nTapez *menu* pour continuer à choisir`
      await sendWhatsAppMessage(from, msg, phoneNumberId)
      setSession(from, session)
      return
    }
  }

  // Message par défaut
  await sendWhatsAppMessage(
    from,
    `🌴 *Voyage Gourmand Express*\n\nJe n'ai pas compris votre message. Voici ce que vous pouvez faire :\n\n📋 *menu* — Voir le menu\n🛒 *panier* — Voir votre panier\n💳 *payer* — Passer à la caisse\n\nOu tapez le *numéro* d'un plat pour l'ajouter.`,
    phoneNumberId
  )
}

function buildMenuText(restaurantName: string, menus: MenuWithItems[] | null): string {
  if (!menus) return `🌴 *${restaurantName}*\n\nMenu temporairement indisponible.`
  let text = `🌴 *${restaurantName}*\n\n`
  let itemCount = 1

  for (const menu of menus) {
    text += `*${menu.name}*\n`
    for (const item of menu.menu_items) {
      if (item.is_available) {
        text += `${itemCount}. ${item.name} — ${Number(item.price).toFixed(2)} €\n`
        if (item.description) text += `   _${item.description}_\n`
        itemCount++
      }
    }
    text += '\n'
  }

  text += `Tapez un *numéro* pour ajouter un plat au panier.\nTapez *panier* pour voir votre sélection.`
  return text
}

function buildCartText(cart: BotSession['cart']): string {
  let text = '🛒 *Votre panier*\n\n'
  const total = cart.reduce((sum, { item, quantity }) => {
    text += `${quantity}× ${item.name} — ${(Number(item.price) * quantity).toFixed(2)} €\n`
    return sum + Number(item.price) * quantity
  }, 0)

  text += `\n💰 *Total : ${total.toFixed(2)} €*\n\n`
  text += `Tapez *payer* pour finaliser votre commande.\nTapez *menu* pour continuer à commander.`
  return text
}
