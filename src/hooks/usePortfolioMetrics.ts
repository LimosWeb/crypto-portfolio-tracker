import { useMemo } from 'react'
import { useTopCoins } from '@/hooks/useCryptoQueries'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { CoinMarketData } from '@/types/crypto'
import type { AssetAllocation, PortfolioSummary } from '@/types/portfolio'
import {
  calculateAllocationPercentage,
  calculateCurrentValue,
  calculatePnL,
  calculateTotalCost,
} from '@/utils/calculations'

export function usePortfolioMetrics() {
  const transactions = usePortfolioStore((s) => s.transactions)
  const currency = usePortfolioStore((s) => s.currency)

  const { data: coins, isLoading, isError, error, isFetching } = useTopCoins(currency)

  const summary = useMemo<PortfolioSummary>(() => {
    const marketMap = new Map<string, CoinMarketData>(
      (coins ?? []).map((coin) => [coin.id, coin]),
    )

    const grouped = new Map<string, typeof transactions>()
    for (const tx of transactions) {
      const existing = grouped.get(tx.coinId) ?? []
      grouped.set(tx.coinId, [...existing, tx])
    }

    const assetsWithoutAllocation: Omit<AssetAllocation, 'allocationPercentage'>[] = []

    for (const [coinId, txs] of grouped.entries()) {
      const coin = marketMap.get(coinId)
      if (!coin) continue

      const totalAmount = txs.reduce((acc, t) => acc + t.amount, 0)
      const totalCost = calculateTotalCost(txs)
      const currentValue = calculateCurrentValue(totalAmount, coin.current_price)
      const { pnl, pnlPercentage } = calculatePnL(totalCost, currentValue)

      assetsWithoutAllocation.push({
        coinId,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        totalAmount,
        totalCost,
        currentValue,
        pnl,
        pnlPercentage,
      })
    }

    const totalCurrentValue = assetsWithoutAllocation.reduce((acc, a) => acc + a.currentValue, 0)
    const totalCost = assetsWithoutAllocation.reduce((acc, a) => acc + a.totalCost, 0)
    const { pnl: totalPnL, pnlPercentage: totalPnLPercentage } = calculatePnL(
      totalCost,
      totalCurrentValue,
    )

    const assets: AssetAllocation[] = assetsWithoutAllocation.map((a) => ({
      ...a,
      allocationPercentage: calculateAllocationPercentage(a.currentValue, totalCurrentValue),
    }))

    return {
      totalCost,
      currentValue: totalCurrentValue,
      totalPnL,
      totalPnLPercentage,
      assets,
    }
  }, [coins, transactions])

  return { summary, isLoading, isError, error, isFetching, currency }
}
