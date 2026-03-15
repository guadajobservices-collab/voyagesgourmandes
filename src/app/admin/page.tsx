import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: totalTenants } = await supabase
    .from('tenants')
    .select('id', { count: 'exact', head: true })

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'picked_up')

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0

  const { count: activeRestaurants } = await supabase
    .from('tenants')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Admin — Club Créole</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-orange-400">{totalTenants ?? 0}</div>
          <div className="text-sm text-gray-400 mt-1">Restaurants total</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-teal-400">{activeRestaurants ?? 0}</div>
          <div className="text-sm text-gray-400 mt-1">Restaurants actifs</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">{totalOrders ?? 0}</div>
          <div className="text-sm text-gray-400 mt-1">Commandes totales</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">{totalRevenue.toFixed(0)} €</div>
          <div className="text-sm text-gray-400 mt-1">CA total (livrées)</div>
        </div>
      </div>
    </div>
  )
}
