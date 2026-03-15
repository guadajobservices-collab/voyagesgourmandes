'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getTenantId(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) throw new Error('Aucun restaurant associé')
  return profile.tenant_id
}

// ---- CATÉGORIES ----

export async function createCategory(formData: FormData) {
  const tenantId = await getTenantId()
  const supabase = await createClient()

  await supabase.from('menus').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  })

  revalidatePath('/dashboard/menu')
}

export async function updateCategory(formData: FormData) {
  const tenantId = await getTenantId()
  const supabase = await createClient()
  const id = formData.get('id') as string

  await supabase.from('menus').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id).eq('tenant_id', tenantId)

  revalidatePath('/dashboard/menu')
}

export async function deleteCategory(id: string) {
  const tenantId = await getTenantId()
  const supabase = await createClient()

  await supabase.from('menus').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/menu')
}

// ---- PLATS ----

export async function createMenuItem(formData: FormData) {
  const tenantId = await getTenantId()
  const supabase = await createClient()

  let photoUrl: string | null = null
  const photo = formData.get('photo') as File
  if (photo && photo.size > 0) {
    const ext = photo.name.split('.').pop()
    const fileName = `${tenantId}/${Date.now()}.${ext}`
    const { data: upload, error } = await supabase.storage
      .from('menu-photos')
      .upload(fileName, photo, { upsert: true })

    if (!error && upload) {
      const { data: { publicUrl } } = supabase.storage.from('menu-photos').getPublicUrl(upload.path)
      photoUrl = publicUrl
    }
  }

  await supabase.from('menu_items').insert({
    tenant_id: tenantId,
    menu_id: formData.get('menu_id') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    price: parseFloat(formData.get('price') as string),
    photo_url: photoUrl,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_available: true,
  })

  revalidatePath('/dashboard/menu')
}

export async function updateMenuItem(formData: FormData) {
  const tenantId = await getTenantId()
  const supabase = await createClient()
  const id = formData.get('id') as string

  const updates: Record<string, unknown> = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    price: parseFloat(formData.get('price') as string),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }

  // Upload nouvelle photo si présente
  const photo = formData.get('photo') as File
  if (photo && photo.size > 0) {
    const ext = photo.name.split('.').pop()
    const fileName = `${tenantId}/${id}.${ext}`
    const { data: upload, error } = await supabase.storage
      .from('menu-photos')
      .upload(fileName, photo, { upsert: true })

    if (!error && upload) {
      const { data: { publicUrl } } = supabase.storage.from('menu-photos').getPublicUrl(upload.path)
      updates.photo_url = publicUrl
    }
  }

  await supabase.from('menu_items').update(updates).eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/menu')
}

export async function deleteMenuItem(id: string) {
  const tenantId = await getTenantId()
  const supabase = await createClient()

  await supabase.from('menu_items').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/menu')
}

export async function toggleAvailability(id: string, isAvailable: boolean) {
  const tenantId = await getTenantId()
  const supabase = await createClient()

  await supabase.from('menu_items')
    .update({ is_available: isAvailable })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  revalidatePath('/dashboard/menu')
  revalidatePath('/', 'layout')
}
