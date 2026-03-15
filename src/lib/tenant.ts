import { createClient } from '@/lib/supabase/server'
import { TENANT_HEADER, TENANT_SLUG_HEADER } from '@/types/tenant'
import type { TenantContext } from '@/types/tenant'
import type { TenantConfig } from '@/types/database.types'
import { headers } from 'next/headers'

/**
 * Récupère le contexte tenant depuis les headers injectés par le middleware.
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  const headersList = await headers()
  const tenantId = headersList.get(TENANT_HEADER)
  const tenantSlug = headersList.get(TENANT_SLUG_HEADER)

  if (!tenantId || !tenantSlug) return null

  return getTenantById(tenantId)
}

async function getTenantById(tenantId: string): Promise<TenantContext | null> {
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()

  if (!tenant) return null

  const { data: config } = await supabase
    .from('tenant_config')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()

  return {
    tenant,
    config: (config ?? null) as TenantConfig | null,
  }
}

/**
 * Résout un tenant par son slug (pour les routes publiques).
 */
export async function getTenantBySlug(slug: string): Promise<TenantContext | null> {
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!tenant) return null

  const { data: config } = await supabase
    .from('tenant_config')
    .select('*')
    .eq('tenant_id', tenant.id)
    .single()

  return {
    tenant,
    config: (config ?? null) as TenantConfig | null,
  }
}
