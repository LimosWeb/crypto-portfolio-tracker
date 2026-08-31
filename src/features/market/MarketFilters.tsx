import { Search, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/utils/cn'

export function MarketFilters() {
  const searchQuery = useUiStore((s) => s.searchQuery)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca per nome o simbolo..."
          className={cn(
            'w-full h-9 rounded-lg bg-slate-800/60 border border-white/10',
            'pl-9 pr-9 text-sm text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
            'transition-colors duration-150',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-white transition-colors duration-150"
            aria-label="Cancella ricerca"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
