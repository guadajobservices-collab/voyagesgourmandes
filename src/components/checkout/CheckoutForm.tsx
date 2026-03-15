'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  slug: string
  tenantId: string
  pickupSlots: string[]
}

export default function CheckoutForm({ slug, tenantId, pickupSlots }: CheckoutFormProps) {
  const router = useRouter()
  const items = useCartStore(s => s.items)
  const total = useCartStore(s => s.total())
  const clearCart = useCartStore(s => s.clearCart)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [pickupSlot, setPickupSlot] = useState(pickupSlots[0] ?? '')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    router.push(`/${slug}`)
    return null
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          slug,
          items: items.map(i => ({
            menuItemId: i.menuItem.id,
            name: i.menuItem.name,
            price: i.menuItem.price,
            quantity: i.quantity,
            notes: i.notes,
          })),
          customerName,
          customerEmail,
          customerPhone,
          pickupSlot,
          notes,
        }),
      })

      const data = await response.json() as { url?: string; error?: string }

      if (!response.ok || data.error) {
        setError(data.error ?? 'Erreur lors de la création de la commande')
        setLoading(false)
        return
      }

      if (data.url) {
        clearCart()
        window.location.href = data.url
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Récapitulatif */}
      <div className="card">
        <h2 className="font-semibold mb-3">Récapitulatif</h2>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.menuItem.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}× {item.menuItem.name}
              </span>
              <span className="font-medium">
                {(Number(item.menuItem.price) * item.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg" style={{ color: 'var(--tenant-primary)' }}>
              {total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="card space-y-3">
        <h2 className="font-semibold">Vos coordonnées</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Marie Dupont"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="marie@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="+590 690 00 00 00"
          />
        </div>

        {pickupSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Créneau de retrait *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {pickupSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPickupSlot(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                    pickupSlot === slot
                      ? 'text-white border-transparent'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                  style={pickupSlot === slot ? { backgroundColor: 'var(--tenant-primary)' } : {}}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none"
            placeholder="Allergies, instructions particulières..."
          />
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || !customerName || !customerEmail}
        className="btn-primary w-full text-base py-4 disabled:opacity-50"
        style={{ backgroundColor: 'var(--tenant-primary)' }}
      >
        {loading ? '⏳ Redirection vers le paiement...' : `🔒 Payer ${total.toFixed(2)} €`}
      </button>

      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par Stripe · 3D Secure · Données chiffrées
      </p>
    </div>
  )
}
