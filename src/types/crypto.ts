export type FiatCurrency = 'usd' | 'eur' | 'gbp'

export type TimeFrame = '24h' | '7d' | '30d' | '1y'

export interface CoinSparkline {
  price: number[]
}

export interface CoinMarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  sparkline_in_7d?: CoinSparkline
  last_updated: string
}

export interface MarketChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface PricePoint {
  timestamp: number
  price: number
}

