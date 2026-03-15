'use client'

import Image from 'next/image'
import type { MenuItem } from '@/types/database.types'
import { useCart } from '@/components/cart/CartProvider'

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart()

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-4 flex gap-4 transition-shadow hover:shadow-md ${
        !item.is_available ? 'opacity-50' : ''
      }`}
    >
      {item.photo_url && (
        <div className="flex-shrink-0">
          <Image
            src={item.photo_url}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg object-cover w-20 h-20"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
            {item.description && (
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-base" style={{ color: 'var(--tenant-primary)' }}>
            {Number(item.price).toFixed(2)} €
          </span>

          {item.is_available ? (
            <button
              onClick={() => addItem(item)}
              className="flex items-center gap-1 text-sm font-semibold text-white px-3 py-1.5 rounded-lg transition active:scale-95"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
              aria-label={`Ajouter ${item.name} au panier`}
            >
              + Ajouter
            </button>
          ) : (
            <span className="text-xs text-gray-400 italic">Indisponible</span>
          )}
        </div>
      </div>
    </div>
  )
}
