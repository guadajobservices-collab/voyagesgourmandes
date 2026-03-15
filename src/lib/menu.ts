import { createClient } from '@/lib/supabase/server'
import type { MenuWithItems, MenuItem } from '@/types/database.types'

export async function getMenuByTenantId(tenantId: string): Promise<MenuWithItems[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('menus')
    .select('*, menu_items(*)')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('sort_order')

  if (error || !data) return []

  return data.map(menu => {
    const items = (menu.menu_items as MenuItem[] ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
    return {
      id: menu.id,
      tenant_id: menu.tenant_id,
      name: menu.name,
      description: menu.description,
      sort_order: menu.sort_order,
      is_active: menu.is_active,
      created_at: menu.created_at,
      updated_at: menu.updated_at,
      menu_items: items,
    } as MenuWithItems
  })
}
