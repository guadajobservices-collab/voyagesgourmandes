import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('id', user!.id)
    .single()

  const tenantId = profile?.tenant_id

  // Stats commandes
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId ?? '')

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId ?? '')
    .order('created_at', { ascending: false })
    .limit(5)

  const todayOrders = recentOrders?.filter(o => {
    const today = new Date().toDateString()
    return new Date(o.created_at).toDateString() === today
  }) ?? []

  const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const pendingOrders = recentOrders?.filter(o =>
    ['paid', 'preparing'].includes(o.status)
  ).length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600">{todayOrders.length}</div>
          <div className="text-sm text-gray-500 mt-1">Commandes aujourd&apos;hui</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-teal-600">{todayRevenue.toFixed(2)} €</div>
          <div className="text-sm text-gray-500 mt-1">CA du jour</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600">{pendingOrders}</div>
          <div className="text-sm text-gray-500 mt-1">En attente</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Dernières commandes</h2>
        {(recentOrders?.length ?? 0) === 0 ? (
          <p className="text-gray-400 text-sm">Aucune commande pour l&apos;instant.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders?.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <span className="font-medium text-sm">{order.customer_name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge status-${order.status}`}>{order.status}</span>
                  <span className="font-semibold text-sm">{Number(order.total_amount).toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Total commandes : {totalOrders ?? 0}
      </p>
    </div>
  )
}
