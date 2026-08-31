// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Supported fiat currencies for price conversion. */
export type FiatCurrency = 'usd' | 'eur' | 'gbp'

/** Supported time frames for historical chart queries. */
export type TimeFrame = '24h' | '7d' | '30d' | '1y'

// ---------------------------------------------------------------------------
// CoinGecko — /coins/markets
// ---------------------------------------------------------------------------

/** Weekly sparkline price array returned by CoinGecko when sparkline=true. */
export interface CoinSparkline {
  price: number[]
}

/**
 * Single coin entry returned by the CoinGecko `/coins/markets` endpoint.
 * Optional fields are only present when the corresponding query params are set
 * (e.g. `price_change_percentage=7d`, `sparkline=true`).
 */
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

// ---------------------------------------------------------------------------
// CoinGecko — /coins/{id}/market_chart
// ---------------------------------------------------------------------------

/**
 * Raw time-series response from the CoinGecko `/coins/{id}/market_chart`
 * endpoint. Each inner tuple is `[unix_timestamp_ms, value]`.
 */
export interface MarketChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// ---------------------------------------------------------------------------
// Normalised — UI / Charts
// ---------------------------------------------------------------------------

/**
 * Normalised price point used by chart components.
 * Derived from `MarketChartData.prices` via a utility function.
 */
export interface PricePoint {
  timestamp: number
  price: number
}
