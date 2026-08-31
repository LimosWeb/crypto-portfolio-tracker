export function calculateTotalCost(
  transactions: Array<{ amount: number; buyPrice: number }>,
): number {
  return transactions.reduce((acc, t) => acc + t.amount * t.buyPrice, 0)
}

export function calculateAverageBuyPrice(
  transactions: Array<{ amount: number; buyPrice: number }>,
): number {
  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0)
  if (totalAmount === 0) return 0
  const totalCost = calculateTotalCost(transactions)
  return totalCost / totalAmount
}

export function calculateCurrentValue(totalAmount: number, currentPrice: number): number {
  return totalAmount * currentPrice
}

export function calculatePnL(
  totalCost: number,
  currentValue: number,
): { pnl: number; pnlPercentage: number } {
  const pnl = currentValue - totalCost
  const pnlPercentage = totalCost === 0 ? 0 : (pnl / totalCost) * 100
  return { pnl, pnlPercentage }
}

export function calculateAllocationPercentage(
  assetValue: number,
  totalPortfolioValue: number,
): number {
  if (totalPortfolioValue === 0) return 0
  return (assetValue / totalPortfolioValue) * 100
}
