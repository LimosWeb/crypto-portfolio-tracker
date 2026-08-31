import { useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type { CoinMarketData } from '@/types/crypto'
import type { SortDirection, SortField } from '@/types/ui'

interface UseFilteredCoinsParams {
  coins: CoinMarketData[] | undefined
  searchQuery: string
  sortField: SortField
  sortDirection: SortDirection
}

export function useFilteredCoins({
  coins,
  searchQuery,
  sortField,
  sortDirection,
}: UseFilteredCoinsParams) {
  const debouncedQuery = useDebounce(searchQuery, 250)

  const filteredCoins = useMemo<CoinMarketData[]>(() => {
    if (!coins) return []

    const query = debouncedQuery.toLowerCase().trim()

    const filtered = query
      ? coins.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.symbol.toLowerCase().includes(query),
        )
      : coins

    return [...filtered].sort((a, b) => {
      const aVal = a[sortField] ?? null
      const bVal = b[sortField] ?? null

      if (aVal === null && bVal === null) return 0
      if (aVal === null) return 1
      if (bVal === null) return -1

      const result = (aVal as number) < (bVal as number) ? -1 : (aVal as number) > (bVal as number) ? 1 : 0
      return sortDirection === 'asc' ? result : -result
    })
  }, [coins, debouncedQuery, sortField, sortDirection])

  return { filteredCoins, debouncedQuery }
}
