'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import OrderCard from './OrderCard'
import type { OrderWithItems } from '@/types/database.types'

const STATUS_LABELS: Record<string, string> = {
  all: 'Toutes',
  paid: '💳 Payées',
  preparing: '👨‍🍳 En préparation',
  ready: '✅ Prêtes',
  picked_up: '📦 Récupérées',
  cancelled: '❌ Annulées',
}

interface OrdersRealtimeClientProps {
  initialOrders: OrderWithItems[]
  tenantId: string
}

export default function OrdersRealtimeClient({
  initialOrders,
  tenantId,
}: OrdersRealtimeClientProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders)
  const [filter, setFilter] = useState<string>('all')
  const [audioEnabled, setAudioEnabled] = useState(false)

  const playNotification = useCallback(() => {
    if (!audioEnabled) return
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {
      // Web Audio not available
    }
  }, [audioEnabled])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`orders:${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `tenant_id=eq.${tenantId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch complete order with items
            const { data: newOrder } = await supabase
              .from('orders')
              .select('*, order_items(*)')
              .eq('id', (payload.new as { id: string }).id)
              .single()

            if (newOrder) {
              setOrders(prev => [newOrder as OrderWithItems, ...prev])
              playNotification()
            }
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev =>
              prev.map(o =>
                o.id === (payload.new as { id: string }).id
                  ? { ...o, ...(payload.new as Partial<OrderWithItems>) }
                  : o
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== (payload.old as { id: string }).id))
          }
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [tenantId, playNotification])

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      {/* Filtres + options */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              filter === status
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
            style={filter === status ? { backgroundColor: 'var(--color-coral)' } : {}}
          >
            {label}
            {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`ml-auto px-3 py-1.5 rounded-full text-sm border transition ${
            audioEnabled ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-200 text-gray-500'
          }`}
        >
          {audioEnabled ? '🔔 Son ON' : '🔕 Son OFF'}
        </button>
      </div>

      {/* Nombre commandes actives */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Temps réel · {filteredOrders.length} commande(s)
      </div>

      {/* Liste commandes */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🌴</div>
          <p className="text-gray-400">Aucune commande pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
