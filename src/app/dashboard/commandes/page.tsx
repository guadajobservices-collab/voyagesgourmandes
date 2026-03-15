import { createClient } from '@/lib/supabase/server'
import OrdersRealtimeClient from '@/components/dashboard/OrdersRealtimeClient'

export default async function CommandesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user!.id)
    .single()

  const tenantId = profile?.tenant_id ?? ''

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Commandes en temps réel</h1>
      <OrdersRealtimeClient initialOrders={orders ?? []} tenantId={tenantId} />
    </div>
  )
}
