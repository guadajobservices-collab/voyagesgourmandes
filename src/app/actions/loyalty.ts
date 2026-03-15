'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveLoyaltyConfig(formData: FormData) {
  const supabase = await createClient()
  const tenantId = formData.get('tenant_id') as string

  await supabase.from('loyalty_config').upsert({
    tenant_id: tenantId,
    points_per_euro: parseFloat(formData.get('points_per_euro') as string) || 1.0,
    min_points_redeem: parseInt(formData.get('min_points_redeem') as string) || 50,
    is_active: formData.get('is_active') === 'on',
  }, { onConflict: 'tenant_id' })

  revalidatePath('/dashboard/fidelite')
}

export async function createLoyaltyReward(formData: FormData) {
  const supabase = await createClient()

  await supabase.from('loyalty_rewards').insert({
    tenant_id: formData.get('tenant_id') as string,
    name: formData.get('name') as string,
    points_required: parseInt(formData.get('points_required') as string),
    reward_type: formData.get('reward_type') as 'discount_fixed' | 'discount_percent' | 'free_item',
    reward_value: parseFloat(formData.get('reward_value') as string),
    is_active: true,
  })

  revalidatePath('/dashboard/fidelite')
}

export async function deleteLoyaltyReward(id: string) {
  const supabase = await createClient()
  await supabase.from('loyalty_rewards').delete().eq('id', id)
  revalidatePath('/dashboard/fidelite')
}

export async function creditLoyaltyPoints(
  customerId: string,
  tenantId: string,
  orderId: string,
  totalAmount: number
) {
  const supabase = await createClient()

  // Récupérer la config
  const { data: config } = await supabase
    .from('loyalty_config')
    .select('points_per_euro, is_active')
    .eq('tenant_id', tenantId)
    .single()

  if (!config || !config.is_active) return 0

  const points = Math.floor(totalAmount * Number(config.points_per_euro))

  if (points > 0) {
    await supabase.from('loyalty_points').insert({
      tenant_id: tenantId,
      customer_id: customerId,
      order_id: orderId,
      points,
      type: 'earned',
      description: `Commande #${orderId.slice(0, 8)}`,
    })
  }

  return points
}
