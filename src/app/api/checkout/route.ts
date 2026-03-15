import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

interface CheckoutItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CheckoutBody {
  tenantId: string
  slug: string
  items: CheckoutItem[]
  customerName: string
  customerEmail: string
  customerPhone?: string
  pickupSlot?: string
  notes?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CheckoutBody
    const {
      tenantId,
      slug,
      items,
      customerName,
      customerEmail,
      customerPhone,
      pickupSlot,
      notes,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Récupérer le tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (!tenant) {
      return NextResponse.json({ error: 'Restaurant introuvable' }, { status: 404 })
    }

    // Calculer le total
    const totalAmount = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

    // Créer la commande en DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        tenant_id: tenantId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone ?? null,
        status: 'pending' as const,
        total_amount: totalAmount,
        notes: notes ?? null,
        pickup_slot: pickupSlot ?? null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Erreur création commande' }, { status: 500 })
    }

    // Créer les order_items
    const orderItems = items.map(item => ({
      order_id: order.id,
      tenant_id: tenantId,
      menu_item_id: item.menuItemId,
      name: item.name,
      unit_price: Number(item.price),
      quantity: item.quantity,
      subtotal: Number(item.price) * item.quantity,
      notes: item.notes ?? null,
    }))

    await supabase.from('order_items').insert(orderItems)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get('host')}`

    // Construire les params Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: formatAmountForStripe(Number(item.price)),
      },
      quantity: item.quantity,
    }))

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${baseUrl}/${slug}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/${slug}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        tenant_id: tenantId,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          tenant_id: tenantId,
        },
      },
    }

    // Stripe Connect si compte disponible
    if (tenant.stripe_account_id) {
      sessionParams.payment_intent_data = {
        ...sessionParams.payment_intent_data,
        application_fee_amount: formatAmountForStripe(totalAmount * 0.05),
        transfer_data: {
          destination: tenant.stripe_account_id,
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Stocker le session_id
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
