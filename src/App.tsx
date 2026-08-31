import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CurrencyConverter } from '@/features/converter/CurrencyConverter'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { MarketTable } from '@/features/market/MarketTable'
import { AddTransactionModal } from '@/features/portfolio/AddTransactionModal'
import { PortfolioAllocationChart } from '@/features/portfolio/PortfolioAllocationChart'
import { PortfolioSummaryCards } from '@/features/portfolio/PortfolioSummaryCards'
import { TransactionList } from '@/features/portfolio/TransactionList'
import { useUiStore } from '@/store/uiStore'

function PortfolioView({ onAddTransaction }: { onAddTransaction: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <PortfolioSummaryCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionList onAddTransaction={onAddTransaction} />
        </div>
        <div className="xl:col-span-1">
          <PortfolioAllocationChart />
        </div>
      </div>
    </div>
  )
}

function ConverterView() {
  return (
    <div className="py-6 flex justify-center">
      <CurrencyConverter />
    </div>
  )
}

function MarketView() {
  return <MarketTable />
}

export default function App() {
  const activeTab = useUiStore((s) => s.activeTab)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <DashboardLayout>
      {activeTab === 'dashboard' && <DashboardView onAddTransaction={openModal} />}
      {activeTab === 'market' && <MarketView />}
      {activeTab === 'portfolio' && <PortfolioView onAddTransaction={openModal} />}
      {activeTab === 'converter' && <ConverterView />}

      <AddTransactionModal isOpen={isModalOpen} onClose={closeModal} />
    </DashboardLayout>
  )
}
