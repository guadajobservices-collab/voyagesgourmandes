import { createClient } from '@/lib/supabase/server'
import LoyaltyDashboard from '@/components/dashboard/LoyaltyDashboard'

export default async function DashboardFidelitePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user!.id)
    .single()

  const tenantId = profile?.tenant_id ?? ''

  const { data: config } = await supabase
    .from('loyalty_config')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()

  const { data: rewards } = await supabase
    .from('loyalty_rewards')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('points_required')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">⭐ Programme fidélité</h1>
      <LoyaltyDashboard config={config ?? null} rewards={rewards ?? []} tenantId={tenantId} />
    </div>
  )
}
