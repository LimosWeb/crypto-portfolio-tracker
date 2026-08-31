export interface Transaction {
  id: string
  coinId: string
  coinSymbol: string
  amount: number
  buyPrice: number
  timestamp: number
}

export interface AssetAllocation {
  coinId: string
  symbol: string
  name: string
  image: string
  totalAmount: number
  totalCost: number
  currentValue: number
  pnl: number
  pnlPercentage: number
  allocationPercentage: number
}

export interface PortfolioSummary {
  totalCost: number
  currentValue: number
  totalPnL: number
  totalPnLPercentage: number
  assets: AssetAllocation[]
}
