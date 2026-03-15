'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateRestaurantBranding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) throw new Error('Aucun restaurant associé')

  const tenantId = profile.tenant_id

  // Mettre à jour tenant
  await supabase
    .from('tenants')
    .update({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      phone: formData.get('phone') as string,
    })
    .eq('id', tenantId)

  // Upsert tenant_config
  const pickupSlotsRaw = formData.get('pickup_slots') as string
  let pickupSlots: string[] = []
  try {
    pickupSlots = JSON.parse(pickupSlotsRaw) as string[]
  } catch {
    pickupSlots = []
  }

  await supabase
    .from('tenant_config')
    .upsert({
      tenant_id: tenantId,
      primary_color: formData.get('primary_color') as string || '#FF6B35',
      secondary_color: formData.get('secondary_color') as string || '#2EC4B6',
      accent_color: formData.get('accent_color') as string || '#3D8B37',
      whatsapp_number: formData.get('whatsapp_number') as string || null,
      meta_description: formData.get('meta_description') as string || null,
      pickup_slots: pickupSlots,
    }, { onConflict: 'tenant_id' })

  revalidatePath('/dashboard/settings/branding')
  revalidatePath('/', 'layout')
}

export async function uploadLogo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) throw new Error('Aucun restaurant associé')

  const file = formData.get('logo') as File
  if (!file || file.size === 0) throw new Error('Fichier manquant')

  const ext = file.name.split('.').pop()
  const fileName = `${profile.tenant_id}/logo.${ext}`

  const { data: uploadData, error } = await supabase.storage
    .from('logos')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('logos')
    .getPublicUrl(uploadData.path)

  await supabase
    .from('tenant_config')
    .upsert({
      tenant_id: profile.tenant_id,
      logo_url: publicUrl,
    }, { onConflict: 'tenant_id' })

  revalidatePath('/dashboard/settings/branding')
  return publicUrl
}
