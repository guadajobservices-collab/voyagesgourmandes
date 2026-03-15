'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function CartButton({ slug }: { slug: string }) {
  const router = useRouter()
  const count = useCartStore(s => s.count())
  const total = useCartStore(s => s.total())

  if (count === 0) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-2xl mx-auto">
      <button
        onClick={() => router.push(`/${slug}/checkout`)}
        className="w-full flex items-center justify-between text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold transition active:scale-[0.98]"
        style={{ backgroundColor: 'var(--tenant-primary)' }}
      >
        <span className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
          {count}
        </span>
        <span>Voir mon panier</span>
        <span>{total.toFixed(2)} €</span>
      </button>
    </div>
  )
}
