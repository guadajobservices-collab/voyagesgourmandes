import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MenuItem } from '@/types/database.types'

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

interface CartState {
  items: CartItem[]
  tenantId: string | null
  slug: string | null
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateNotes: (itemId: string, notes: string) => void
  clearCart: () => void
  setTenant: (tenantId: string, slug: string) => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tenantId: null,
      slug: null,

      setTenant: (tenantId, slug) => set({ tenantId, slug }),

      addItem: (menuItem) => {
        set(state => {
          const existing = state.items.find(i => i.menuItem.id === menuItem.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.menuItem.id === menuItem.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { menuItem, quantity: 1 }] }
        })
      },

      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(i => i.menuItem.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.menuItem.id === itemId ? { ...i, quantity } : i
          ),
        }))
      },

      updateNotes: (itemId, notes) => {
        set(state => ({
          items: state.items.map(i =>
            i.menuItem.id === itemId ? { ...i, notes } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + Number(i.menuItem.price) * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'vge-cart',
      // Clear cart if switching tenant
      partialize: (state) => ({
        items: state.items,
        tenantId: state.tenantId,
        slug: state.slug,
      }),
    }
  )
)
