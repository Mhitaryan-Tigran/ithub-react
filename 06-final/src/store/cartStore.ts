import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types/api'

export interface CartLine {
  product: Product
  quantity: number
}

interface CartStore {
  lines: CartLine[]
  add: (product: Product) => void
  setQuantity: (productId: number, quantity: number) => void
  remove: (productId: number) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      add: (product) =>
        set((state) => {
          const existing = state.lines.find((line) => line.product.id === product.id)
          if (existing) return { lines: state.lines.map((line) => (line.product.id === product.id ? { ...line, quantity: Math.min(line.quantity + 1, 20) } : line)) }
          return { lines: [...state.lines, { product, quantity: 1 }] }
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({ lines: state.lines.map((line) => (line.product.id === productId ? { ...line, quantity: Math.max(1, Math.min(quantity, 20)) } : line)) })),
      remove: (productId) => set((state) => ({ lines: state.lines.filter((line) => line.product.id !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'cart' },
  ),
)

export const cartCount = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.quantity, 0)
export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0)
