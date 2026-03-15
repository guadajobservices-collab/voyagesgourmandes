import { createClient } from '@/lib/supabase/server'
import MenuDashboard from '@/components/dashboard/MenuDashboard'

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user!.id)
    .single()

  const tenantId = profile?.tenant_id ?? ''

  const { data: menus } = await supabase
    .from('menus')
    .select('*, menu_items(*)')
    .eq('tenant_id', tenantId)
    .order('sort_order')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 Gestion du menu</h1>
      <MenuDashboard menus={menus ?? []} tenantId={tenantId} />
    </div>
  )
}
