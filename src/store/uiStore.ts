import { create } from 'zustand'
import type { ChartType, SortDirection, SortField, TabType } from '@/types/ui'

const defaultSortDirection: Record<SortField, SortDirection> = {
  market_cap_rank: 'asc',
  current_price: 'desc',
  price_change_percentage_24h: 'desc',
  total_volume: 'desc',
}

interface UiState {
  activeTab: TabType
  searchQuery: string
  sortField: SortField
  sortDirection: SortDirection
  chartType: ChartType
  setActiveTab: (tab: TabType) => void
  setSearchQuery: (query: string) => void
  setSorting: (field: SortField) => void
  setChartType: (type: ChartType) => void
  resetFilters: () => void
}

export const useUiStore = create<UiState>()((set, get) => ({
  activeTab: 'dashboard',
  searchQuery: '',
  sortField: 'market_cap_rank',
  sortDirection: 'asc',
  chartType: 'area',

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSorting: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection:
        state.sortField === field
          ? state.sortDirection === 'asc'
            ? 'desc'
            : 'asc'
          : defaultSortDirection[field],
    })),

  setChartType: (type) => set({ chartType: type }),

  resetFilters: () =>
    set({
      searchQuery: '',
      sortField: 'market_cap_rank',
      sortDirection: defaultSortDirection[get().sortField],
    }),
}))
