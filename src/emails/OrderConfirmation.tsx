import * as React from 'react'
import type { OrderWithItems } from '@/types/database.types'

interface OrderConfirmationEmailProps {
  order: OrderWithItems
}

export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FF6B35', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          🌴 Voyage Gourmand Express
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '32px 24px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: '20px' }}>
          ✅ Votre commande est confirmée !
        </h2>

        <p style={{ color: '#4B5563' }}>
          Bonjour {order.customer_name},
        </p>
        <p style={{ color: '#4B5563' }}>
          Votre paiement a été accepté. Voici le récapitulatif de votre commande :
        </p>

        {/* Order items */}
        <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
          {order.order_items?.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #E5E7EB' }}>
              <span style={{ color: '#374151' }}>{item.quantity}× {item.name}</span>
              <span style={{ color: '#374151', fontWeight: 'bold' }}>{Number(item.subtotal).toFixed(2)} €</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', fontWeight: 'bold', fontSize: '16px' }}>
            <span>Total</span>
            <span style={{ color: '#FF6B35' }}>{Number(order.total_amount).toFixed(2)} €</span>
          </div>
        </div>

        {order.pickup_slot && (
          <div style={{ backgroundColor: '#FFF7ED', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
            <p style={{ margin: 0, color: '#9A3412', fontWeight: 'bold' }}>
              🕐 Créneau de retrait : {order.pickup_slot}
            </p>
          </div>
        )}

        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Référence : #{order.id.slice(0, 8).toUpperCase()}
        </p>

        <p style={{ color: '#6B7280' }}>
          Vous recevrez un email dès que votre commande sera prête à être récupérée.
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#F3F4F6', padding: '16px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '12px' }}>
          Voyage Gourmand Express · La saveur antillaise connectée
        </p>
      </div>
    </div>
  )
}
