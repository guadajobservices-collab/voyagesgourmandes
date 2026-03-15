import { createClient } from '@/lib/supabase/server'
import BrandingForm from '@/components/dashboard/BrandingForm'
import type { Tenant, TenantConfig } from '@/types/database.types'

export default async function BrandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user!.id)
    .single()

  const tenantId = profile?.tenant_id ?? ''

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()

  const { data: config } = await supabase
    .from('tenant_config')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🎨 Branding & Configuration</h1>
      <BrandingForm
        tenant={(tenant ?? null) as Tenant | null}
        config={(config ?? null) as TenantConfig | null}
      />
    </div>
  )
}
