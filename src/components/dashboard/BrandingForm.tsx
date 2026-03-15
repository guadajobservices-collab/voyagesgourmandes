'use client'

import { useState } from 'react'
import { updateRestaurantBranding } from '@/app/actions/branding'
import type { Tenant, TenantConfig } from '@/types/database.types'

interface BrandingFormProps {
  tenant: Tenant | null
  config: TenantConfig | null
}

export default function BrandingForm({ tenant, config }: BrandingFormProps) {
  const [primaryColor, setPrimaryColor] = useState(config?.primary_color ?? '#FF6B35')
  const [secondaryColor, setSecondaryColor] = useState(config?.secondary_color ?? '#2EC4B6')
  const [accentColor, setAccentColor] = useState(config?.accent_color ?? '#3D8B37')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('primary_color', primaryColor)
    formData.set('secondary_color', secondaryColor)
    formData.set('accent_color', accentColor)

    await updateRestaurantBranding(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Informations restaurant</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du restaurant</label>
              <input
                name="name"
                defaultValue={tenant?.name ?? ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={tenant?.description ?? ''}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                name="phone"
                defaultValue={tenant?.phone ?? ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business</label>
              <input
                name="whatsapp_number"
                defaultValue={config?.whatsapp_number ?? ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="+590 690 00 00 00"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Couleurs de marque</h2>
          <div className="space-y-4">
            {[
              { label: 'Couleur principale', value: primaryColor, setter: setPrimaryColor },
              { label: 'Couleur secondaire', value: secondaryColor, setter: setSecondaryColor },
              { label: 'Couleur accent', value: accentColor, setter: setAccentColor },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full"
          style={{ backgroundColor: primaryColor }}
        >
          {saving ? 'Sauvegarde...' : saved ? '✅ Sauvegardé !' : 'Sauvegarder'}
        </button>
      </form>

      {/* Preview */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Prévisualisation</h2>
        <div
          className="rounded-xl overflow-hidden shadow-lg"
          style={{
            '--tenant-primary': primaryColor,
            '--tenant-secondary': secondaryColor,
            '--tenant-accent': accentColor,
          } as React.CSSProperties}
        >
          <div style={{ backgroundColor: primaryColor }} className="p-4 text-white">
            <h3 className="text-lg font-bold">{tenant?.name ?? 'Mon Restaurant'}</h3>
            <p className="text-sm opacity-80">{tenant?.description ?? 'La saveur antillaise'}</p>
          </div>
          <div className="bg-white p-4">
            <div className="flex gap-2 mb-3">
              {['Entrées', 'Plats', 'Desserts'].map(cat => (
                <span
                  key={cat}
                  className="text-xs px-3 py-1 rounded-full font-medium text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Accras de morue</p>
                <p className="text-xs text-gray-400">Beignets croustillants</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm" style={{ color: primaryColor }}>8,50 €</span>
                <button
                  className="text-white text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
