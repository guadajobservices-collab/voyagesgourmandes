'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/actions/orders'
import type { OrderWithItems } from '@/types/database.types'

const STATUS_FLOW: Record<string, { next: string; label: string; color: string } | null> = {
  pending: null,
  paid: { next: 'preparing', label: '👨‍🍳 Commencer préparation', color: '#FF6B35' },
  preparing: { next: 'ready', label: '✅ Marquer prête', color: '#2EC4B6' },
  ready: { next: 'picked_up', label: '📦 Commande récupérée', color: '#3D8B37' },
  picked_up: null,
  cancelled: null,
}

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_LABELS_FR: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  preparing: 'En préparation',
  ready: 'Prête',
  picked_up: 'Récupérée',
  cancelled: 'Annulée',
}

export default function OrderCard({ order }: { order: OrderWithItems }) {
  const [loading, setLoading] = useState(false)
  const nextStatus = STATUS_FLOW[order.status]
  const time = new Date(order.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  async function handleStatusUpdate() {
    if (!nextStatus) return
    setLoading(true)
    await updateOrderStatus(order.id, nextStatus.next as OrderWithItems['status'])
    setLoading(false)
  }

  return (
    <div className={`card border-l-4 ${order.status === 'paid' ? 'border-l-orange-400 shadow-md' : 'border-l-gray-200'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900">{order.customer_name}</span>
            <span className={`badge text-xs ${STATUS_BADGES[order.status] ?? ''}`}>
              {STATUS_LABELS_FR[order.status]}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
            <span>🕐 {time}</span>
            {order.pickup_slot && <span>📍 Retrait : {order.pickup_slot}</span>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-lg text-orange-600">{Number(order.total_amount).toFixed(2)} €</div>
          <div className="text-xs text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {order.order_items?.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.quantity}× {item.name}</span>
            <span className="text-gray-500">{Number(item.subtotal).toFixed(2)} €</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="bg-yellow-50 text-yellow-800 text-xs rounded-lg p-2 mb-3">
          📝 {order.notes}
        </div>
      )}

      {/* Action button */}
      {nextStatus && (
        <button
          onClick={handleStatusUpdate}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: nextStatus.color }}
        >
          {loading ? '...' : nextStatus.label}
        </button>
      )}
    </div>
  )
}
