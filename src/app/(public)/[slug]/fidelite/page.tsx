import { notFound, redirect } from 'next/navigation'
import { getTenantBySlug } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import type { LoyaltyPoint, LoyaltyReward } from '@/types/database.types'

export default async function FidelitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)
  if (!ctx) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/connexion?next=/${slug}/fidelite`)

  const { data: points } = await supabase
    .from('loyalty_points')
    .select('*')
    .eq('tenant_id', ctx.tenant.id)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  const loyaltyPoints = (points ?? []) as LoyaltyPoint[]

  const balance = loyaltyPoints.reduce((sum, p) => {
    return p.type === 'earned' || p.type === 'bonus' ? sum + p.points : sum - p.points
  }, 0)

  const { data: rewardsData } = await supabase
    .from('loyalty_rewards')
    .select('*')
    .eq('tenant_id', ctx.tenant.id)
    .eq('is_active', true)
    .order('points_required')

  const rewards = (rewardsData ?? []) as LoyaltyReward[]

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="text-white px-4 py-6"
        style={{ backgroundColor: ctx.config?.primary_color ?? '#FF6B35' }}
      >
        <a href={`/${slug}`} className="text-white/80 hover:text-white text-sm mb-3 inline-block">← Retour au menu</a>
        <h1 className="text-2xl font-bold">⭐ Programme fidélité</h1>
        <p className="text-white/80 text-sm mt-1">{ctx.tenant.name}</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Solde */}
        <div className="card text-center">
          <div
            className="text-5xl font-bold mb-1"
            style={{ color: ctx.config?.primary_color ?? '#FF6B35' }}
          >
            {balance}
          </div>
          <p className="text-gray-500">points disponibles</p>
        </div>

        {/* Récompenses */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Récompenses disponibles</h2>
          {rewards.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune récompense pour l&apos;instant.</p>
          ) : (
            <div className="space-y-3">
              {rewards.map(reward => {
                const canRedeem = balance >= reward.points_required
                return (
                  <div
                    key={reward.id}
                    className={`card flex justify-between items-center ${!canRedeem ? 'opacity-60' : ''}`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      {reward.description && (
                        <p className="text-sm text-gray-500">{reward.description}</p>
                      )}
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: ctx.config?.secondary_color ?? '#2EC4B6' }}
                      >
                        {reward.points_required} points
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {reward.reward_type === 'discount_fixed'
                          ? `-${Number(reward.reward_value).toFixed(2)} €`
                          : reward.reward_type === 'discount_percent'
                          ? `-${reward.reward_value}%`
                          : '🎁 Gratuit'}
                      </div>
                      {canRedeem && (
                        <span className="text-xs text-green-600 font-medium">✓ Disponible</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Historique */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Historique</h2>
          {loyaltyPoints.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune transaction de points.</p>
          ) : (
            <div className="space-y-2">
              {loyaltyPoints.slice(0, 10).map(p => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm text-gray-700">{p.description ?? p.type}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      p.type === 'earned' || p.type === 'bonus' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {p.type === 'earned' || p.type === 'bonus' ? '+' : '-'}{p.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
