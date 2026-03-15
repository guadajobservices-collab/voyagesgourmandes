'use client'

import { createContext, useContext, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { MenuItem } from '@/types/database.types'

interface CartContextType {
  addItem: (item: MenuItem) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default function CartProvider({
  children,
  tenantId,
  slug,
}: {
  children: React.ReactNode
  tenantId: string
  slug: string
}) {
  const { setTenant, clearCart, tenantId: storedTenantId, addItem } = useCartStore()

  useEffect(() => {
    // Clear cart if switching restaurant
    if (storedTenantId && storedTenantId !== tenantId) {
      clearCart()
    }
    setTenant(tenantId, slug)
  }, [tenantId, slug, storedTenantId, clearCart, setTenant])

  return (
    <CartContext.Provider value={{ addItem }}>
      {children}
    </CartContext.Provider>
  )
}
