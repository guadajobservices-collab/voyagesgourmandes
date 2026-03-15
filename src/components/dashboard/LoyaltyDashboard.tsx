'use client'

import { useState } from 'react'
import { saveLoyaltyConfig, createLoyaltyReward, deleteLoyaltyReward } from '@/app/actions/loyalty'
import type { LoyaltyConfig, LoyaltyReward } from '@/types/database.types'

interface LoyaltyDashboardProps {
  config: LoyaltyConfig | null
  rewards: LoyaltyReward[]
  tenantId: string
}

export default function LoyaltyDashboard({ config, rewards, tenantId }: LoyaltyDashboardProps) {
  const [showRewardForm, setShowRewardForm] = useState(false)
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Configuration</h2>
        <form
          action={async (fd) => {
            setSaving(true)
            fd.set('tenant_id', tenantId)
            await saveLoyaltyConfig(fd)
            setSaving(false)
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points par euro dépensé
              </label>
              <input
                name="points_per_euro"
                type="number"
                step="0.1"
                min="0"
                defaultValue={config?.points_per_euro ?? 1}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum points pour échanger
              </label>
              <input
                name="min_points_redeem"
                type="number"
                min="1"
                defaultValue={config?.min_points_redeem ?? 50}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="is_active"
              type="checkbox"
              id="is_active"
              defaultChecked={config?.is_active ?? true}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Programme fidélité actif
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ backgroundColor: 'var(--color-coral)' }}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Récompenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Récompenses</h2>
          <button
            onClick={() => setShowRewardForm(!showRewardForm)}
            className="text-sm px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            {showRewardForm ? 'Annuler' : '+ Nouvelle récompense'}
          </button>
        </div>

        {showRewardForm && (
          <form
            action={async (fd) => {
              fd.set('tenant_id', tenantId)
              await createLoyaltyReward(fd)
              setShowRewardForm(false)
            }}
            className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                <input name="name" required placeholder="Réduction 5€" className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Points requis</label>
                <input name="points_required" type="number" min="1" required className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select name="reward_type" className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm">
                  <option value="discount_fixed">Réduction fixe (€)</option>
                  <option value="discount_percent">Réduction % </option>
                  <option value="free_item">Article gratuit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Valeur</label>
                <input name="reward_value" type="number" step="0.01" min="0" required className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
              </div>
            </div>
            <button type="submit" className="btn-primary text-sm py-2 px-4" style={{ backgroundColor: 'var(--color-coral)' }}>
              Créer la récompense
            </button>
          </form>
        )}

        {rewards.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune récompense configurée.</p>
        ) : (
          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-sm">{reward.name}</p>
                  <p className="text-xs text-gray-400">{reward.points_required} points</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${reward.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    {reward.reward_type === 'discount_fixed'
                      ? `-${Number(reward.reward_value).toFixed(2)} €`
                      : reward.reward_type === 'discount_percent'
                      ? `-${reward.reward_value}%`
                      : '🎁'}
                  </span>
                  <form action={async () => deleteLoyaltyReward(reward.id)}>
                    <button type="submit" className="text-gray-400 hover:text-red-500 text-sm">🗑️</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
