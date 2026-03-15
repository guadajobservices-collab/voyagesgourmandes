'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendOrderReady } from '@/lib/email'
import type { Order, OrderWithItems } from '@/types/database.types'

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Profil introuvable')

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .eq('tenant_id', profile.tenant_id ?? '')
    .select('*, order_items(*)')
    .single()

  if (error || !order) throw new Error('Impossible de mettre à jour la commande')

  if (status === 'ready') {
    await sendOrderReady(order as OrderWithItems)
  }

  revalidatePath('/dashboard/commandes')
  return order
}

export async function cancelOrder(orderId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  await supabase
    .from('orders')
    .update({
      status: 'cancelled' as const,
      notes: `Annulation : ${reason}`,
    })
    .eq('id', orderId)
    .eq('tenant_id', profile?.tenant_id ?? '')

  revalidatePath('/dashboard/commandes')
}
