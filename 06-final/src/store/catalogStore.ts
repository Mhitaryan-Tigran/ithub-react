import { create } from 'zustand'
import { errorMessage, shopApi } from '../api/endpoints'
import type { Category, ProductPage } from '../types/api'
import type { RequestState } from '../types/request'

interface CatalogStore {
  category: Category | null
  search: string
  request: RequestState<ProductPage>
  setCategory: (category: Category | null) => void
  setSearch: (search: string) => void
  load: () => Promise<void>
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  category: null,
  search: '',
  request: { status: 'idle' },
  setCategory: (category) => {
    set({ category })
    void get().load()
  },
  setSearch: (search) => set({ search }),
  load: async () => {
    set({ request: { status: 'loading' } })
    try {
      const { category, search } = get()
      const data = await shopApi.products({ category: category ?? undefined, search: search.trim() || undefined })
      set({ request: { status: 'success', data } })
    } catch (error) {
      set({ request: { status: 'error', error: errorMessage(error) } })
    }
  },
}))
