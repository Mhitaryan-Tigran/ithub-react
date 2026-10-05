import { create } from 'zustand'
import { errorMessage, fetchProducts } from '../api/client'
import type { Category, ProductPage, ProductQuery } from '../types/product'
import type { RequestState } from '../types/request'

interface ProductStore {
  category: Category | null
  request: RequestState<ProductPage>
  setCategory: (category: Category | null) => void
  load: (extra?: ProductQuery) => Promise<void>
}

export const useProductStore = create<ProductStore>((set, get) => ({
  category: null,
  request: { status: 'idle' },
  setCategory: (category) => {
    set({ category })
    void get().load()
  },
  load: async (extra = {}) => {
    set({ request: { status: 'loading' } })
    try {
      const category = get().category ?? undefined
      const data = await fetchProducts({ category, ...extra })
      set({ request: { status: 'success', data } })
    } catch (error) {
      set({ request: { status: 'error', error: errorMessage(error) } })
    }
  },
}))
