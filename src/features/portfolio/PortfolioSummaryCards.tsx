import { DollarSign, PieChart, TrendingUp, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

interface CardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  children: React.ReactNode
}

function SummaryCard({ icon: Icon, iconColor, iconBg, label, children }: CardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
          <Icon size={16} className={iconColor} />
        </div>
      </div>
      <div className="flex items-end gap-2">{children}</div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-32" />
    </div>
  )
}

export function PortfolioSummaryCards() {
  const { summary, isLoading, currency } = usePortfolioMetrics()
  const { currentValue, totalCost, totalPnL, totalPnLPercentage } = summary

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        icon={Wallet}
        label="Valore di Mercato"
        iconBg="bg-indigo-500/10"
        iconColor="text-indigo-400"
      >
        <span className="text-xl font-bold font-mono text-white tabular-nums leading-none">
          {formatCurrency(currentValue, currency)}
        </span>
      </SummaryCard>

      <SummaryCard
        icon={DollarSign}
        label="Totale Investito"
        iconBg="bg-slate-700/60"
        iconColor="text-slate-300"
      >
        <span className="text-xl font-bold font-mono text-white tabular-nums leading-none">
          {formatCurrency(totalCost, currency)}
        </span>
      </SummaryCard>

      <SummaryCard
        icon={TrendingUp}
        label="PnL Netto"
        iconBg={totalPnL >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
        iconColor={totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}
      >
        <span
          className={cn(
            'text-xl font-bold font-mono tabular-nums leading-none',
            totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400',
          )}
        >
          {totalPnL >= 0 ? '+' : ''}
          {formatCurrency(totalPnL, currency)}
        </span>
      </SummaryCard>

      <SummaryCard
        icon={PieChart}
        label="Rendimento Totale"
        iconBg={totalPnLPercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
        iconColor={totalPnLPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}
      >
        <Badge value={totalPnLPercentage} size="md" />
      </SummaryCard>
    </div>
  )
}
