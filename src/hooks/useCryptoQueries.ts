import { useQuery } from '@tanstack/react-query'
import { fetchCoinMarketChart, fetchTopCoins } from '@/api/coingecko'
import type { FiatCurrency, TimeFrame } from '@/types/crypto'

const timeframeToDays: Record<TimeFrame, string> = {
  '24h': '1',
  '7d': '7',
  '30d': '30',
  '1y': '365',
}

export function useTopCoins(currency: FiatCurrency = 'usd', perPage = 100) {
  return useQuery({
    queryKey: ['topCoins', currency, perPage],
    queryFn: () => fetchTopCoins(currency, perPage),
    refetchInterval: 30000,
    staleTime: 25000,
  })
}

export function useCoinMarketChart(
  coinId: string,
  currency: FiatCurrency = 'usd',
  timeframe: TimeFrame = '7d',
) {
  const days = timeframeToDays[timeframe]

  return useQuery({
    queryKey: ['marketChart', coinId, currency, timeframe],
    queryFn: () => fetchCoinMarketChart(coinId, currency, days),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(coinId),
  })
}
