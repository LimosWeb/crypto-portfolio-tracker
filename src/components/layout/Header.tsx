import { useIsFetching } from '@tanstack/react-query'
import { Activity, Coins } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { FiatCurrency } from '@/types/crypto'
import { cn } from '@/utils/cn'

const currencies: { value: FiatCurrency; label: string }[] = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'gbp', label: 'GBP' },
]

export function Header() {
  const currency = usePortfolioStore((s) => s.currency)
  const setCurrency = usePortfolioStore((s) => s.setCurrency)
  const isFetching = useIsFetching()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 shrink-0">
            <Coins size={18} className="text-indigo-400" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-tight">CryptoPulse</span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
              <Activity size={10} />
              Live Market
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span
              className={cn(
                'h-2 w-2 rounded-full shrink-0',
                isFetching > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500',
              )}
            />
            <span className="text-xs font-medium text-slate-300 hidden sm:block">
              {isFetching > 0 ? 'Aggiornamento...' : 'Live Feed'}
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
            {currencies.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCurrency(value)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150',
                  currency === value
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

