import { useUiStore } from '@/store/uiStore'
import type { TimeFrame } from '@/types/crypto'
import { cn } from '@/utils/cn'

const timeframes: { value: TimeFrame; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
]

export function TimeframeSelector() {
  const chartTimeframe = useUiStore((s) => s.chartTimeframe)
  const setChartTimeframe = useUiStore((s) => s.setChartTimeframe)

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800/60 border border-white/5 shrink-0">
      {timeframes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setChartTimeframe(value)}
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150',
            chartTimeframe === value
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
