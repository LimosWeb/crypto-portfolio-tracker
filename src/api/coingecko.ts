import type { CoinMarketData, FiatCurrency, MarketChartData } from '@/types/crypto'

const BASE_URL = 'https://api.coingecko.com/api/v3'

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (response.status === 429) {
    throw new Error('Rate limit CoinGecko superato. Riprova tra poco.')
  }

  if (!response.ok) {
    throw new Error(`Errore API CoinGecko: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export async function fetchTopCoins(
  currency: FiatCurrency = 'usd',
  perPage = 100,
): Promise<CoinMarketData[]> {
  return apiFetch<CoinMarketData[]>(
    `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d`,
  )
}

export async function fetchCoinMarketChart(
  coinId: string,
  currency: FiatCurrency = 'usd',
  days = '7',
): Promise<MarketChartData> {
  return apiFetch<MarketChartData>(
    `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
  )
}

export async function fetchCoinDetails(coinId: string): Promise<unknown> {
  return apiFetch<unknown>(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  )
}
