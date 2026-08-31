import React, { useState } from 'react'
import { PriceChart } from '@/features/chart/PriceChart'
import { MarketTable } from '@/features/market/MarketTable'
import { PortfolioAllocationChart } from '@/features/portfolio/PortfolioAllocationChart'
import { PortfolioSummaryCards } from '@/features/portfolio/PortfolioSummaryCards'
import { TransactionList } from '@/features/portfolio/TransactionList'

interface DashboardViewProps {
  onAddTransaction: () => void
}

export function DashboardView({ onAddTransaction }: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <PortfolioSummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PriceChart />
        </div>
        <div className="xl:col-span-1">
          <PortfolioAllocationChart />
        </div>
      </div>

      <TransactionList onAddTransaction={onAddTransaction} />
    </div>
  )
}
