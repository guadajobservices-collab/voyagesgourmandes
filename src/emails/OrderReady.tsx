import * as React from 'react'
import type { OrderWithItems } from '@/types/database.types'

interface OrderReadyEmailProps {
  order: OrderWithItems
}

export function OrderReadyEmail({ order }: OrderReadyEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      <div style={{ backgroundColor: '#2EC4B6', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          🌴 Voyage Gourmand Express
        </h1>
      </div>

      <div style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#1A1A2E', fontSize: '24px' }}>
          Votre commande est prête !
        </h2>
        <p style={{ color: '#4B5563', fontSize: '16px' }}>
          Bonjour {order.customer_name}, vous pouvez venir récupérer votre commande.
        </p>

        {order.pickup_slot && (
          <div style={{ backgroundColor: '#D1FAE5', borderRadius: '8px', padding: '16px', margin: '24px 0' }}>
            <p style={{ margin: 0, color: '#065F46', fontWeight: 'bold', fontSize: '18px' }}>
              🕐 Créneau réservé : {order.pickup_slot}
            </p>
          </div>
        )}

        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Référence : #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div style={{ backgroundColor: '#F3F4F6', padding: '16px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '12px' }}>
          Voyage Gourmand Express · La saveur antillaise connectée
        </p>
      </div>
    </div>
  )
}
