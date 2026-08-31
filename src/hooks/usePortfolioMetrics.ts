import { useMemo } from 'react'
import { useTopCoins } from '@/hooks/useCryptoQueries'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { CoinMarketData } from '@/types/crypto'
import type { AssetAllocation, PortfolioSummary } from '@/types/portfolio'
import {
  calculateAllocationPercentage,
  calculateAverageBuyPrice,
  calculateCurrentValue,
  calculatePnL,
  calculateTotalCost,
} from '@/utils/calculations'

const EMPTY_SUMMARY: PortfolioSummary = {
  totalCost: 0,
  currentValue: 0,
  totalPnL: 0,
  totalPnLPercentage: 0,
  assets: [],
}

export function usePortfolioMetrics() {
  const transactions = usePortfolioStore((s) => s.transactions)
  const currency = usePortfolioStore((s) => s.currency)

  const { data: coins, isLoading, isError, error, isFetching } = useTopCoins(currency)

  const isEmpty = transactions.length === 0

  const { summary, hasMissingMarketData } = useMemo<{
    summary: PortfolioSummary
    hasMissingMarketData: boolean
  }>(() => {
    if (isEmpty) return { summary: EMPTY_SUMMARY, hasMissingMarketData: false }

    const marketMap = new Map<string, CoinMarketData>(
      (coins ?? []).map((coin) => [coin.id, coin]),
    )

    const grouped = new Map<string, typeof transactions>()
    for (const tx of transactions) {
      if (tx.amount <= 0 || tx.buyPrice < 0 || !isFinite(tx.amount) || !isFinite(tx.buyPrice)) {
        continue
      }
      const existing = grouped.get(tx.coinId) ?? []
      grouped.set(tx.coinId, [...existing, tx])
    }

    let hasMissing = false
    const assetsWithoutAllocation: Omit<AssetAllocation, 'allocationPercentage'>[] = []

    for (const [coinId, txs] of grouped.entries()) {
      if (txs.length === 0) continue

      const coin = marketMap.get(coinId)
      const isLiveMissing = !coin

      if (isLiveMissing) hasMissing = true

      const totalAmount = txs.reduce((acc, t) => acc + t.amount, 0)
      if (totalAmount <= 0) continue

      const totalCost = calculateTotalCost(txs)
      const fallbackPrice = calculateAverageBuyPrice(txs)
      const livePrice = coin?.current_price ?? fallbackPrice

      const currentValue = calculateCurrentValue(totalAmount, livePrice)
      const { pnl, pnlPercentage } = isLiveMissing
        ? { pnl: 0, pnlPercentage: 0 }
        : calculatePnL(totalCost, currentValue)

      assetsWithoutAllocation.push({
        coinId,
        symbol: coin?.symbol ?? txs[0].coinSymbol,
        name: coin?.name ?? txs[0].coinSymbol,
        image: coin?.image ?? '',
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

    const assets: AssetAllocation[] = assetsWithoutAllocation
      .map((a) => ({
        ...a,
        allocationPercentage: calculateAllocationPercentage(a.currentValue, totalCurrentValue),
      }))
      .sort((a, b) => b.currentValue - a.currentValue)

    return {
      summary: { totalCost, currentValue: totalCurrentValue, totalPnL, totalPnLPercentage, assets },
      hasMissingMarketData: hasMissing,
    }
  }, [coins, transactions, isEmpty])

  return { summary, isLoading, isError, error, isFetching, currency, isEmpty, hasMissingMarketData }
}

