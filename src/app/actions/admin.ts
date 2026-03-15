'use server'

import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

export async function createTenant(formData: FormData) {
  const supabase = await createServiceClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const description = formData.get('description') as string

  if (!name || !slug || !email) {
    throw new Error('Champs requis manquants')
  }

  // Créer le tenant
  const { data: tenant, error } = await supabase
    .from('tenants')
    .insert({
      name,
      slug,
      email,
      phone: phone || null,
      description: description || null,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw new Error(`Erreur création tenant : ${error.message}`)

  // Créer la config par défaut
  await supabase.from('tenant_config').insert({
    tenant_id: tenant.id,
    primary_color: '#FF6B35',
    secondary_color: '#2EC4B6',
    accent_color: '#3D8B37',
    opening_hours: {},
    pickup_slots: ['12:00', '12:30', '13:00', '13:30'],
  })

  // Créer la config fidélité par défaut
  await supabase.from('loyalty_config').insert({
    tenant_id: tenant.id,
    points_per_euro: 1.0,
    min_points_redeem: 50,
    is_active: true,
  })

  redirect('/admin/restaurants')
}

export async function getTenantStats(tenantId: string) {
  const supabase = await createServiceClient()

  const [ordersResult, revenueResult] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('orders')
      .select('total_amount')
      .eq('tenant_id', tenantId)
      .eq('status', 'picked_up'),
  ])

  const revenue = revenueResult.data?.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  ) ?? 0

  return {
    totalOrders: ordersResult.count ?? 0,
    totalRevenue: revenue,
  }
}
