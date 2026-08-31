export type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'total_volume'

export type SortDirection = 'asc' | 'desc'

export interface MarketTableFilters {
  searchQuery: string
  sortField: SortField
  sortDirection: SortDirection
}

export type TabType = 'dashboard' | 'market' | 'portfolio' | 'converter'

export type ChartType = 'area' | 'candlestick'
