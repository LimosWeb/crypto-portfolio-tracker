import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useUiStore } from '@/store/uiStore'
import type { SortField } from '@/types/ui'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFilteredCoins } from '@/hooks/useFilteredCoins'
import { useTopCoins } from '@/hooks/useCryptoQueries'
import { MarketFilters } from '@/features/market/MarketFilters'
import { MarketTableRow } from '@/features/market/MarketTableRow'
import { cn } from '@/utils/cn'

interface ColumnDef {
  key: SortField | null
  label: string
  align: 'left' | 'right'
  hiddenBelow?: 'md' | 'lg' | 'sm'
}

const columns: ColumnDef[] = [
  { key: 'market_cap_rank', label: '#', align: 'right' },
  { key: null, label: 'Asset', align: 'left' },
  { key: 'current_price', label: 'Prezzo', align: 'right' },
  { key: 'price_change_percentage_24h', label: '24h', align: 'right' },
  { key: null, label: '7d', align: 'right', hiddenBelow: 'md' },
  { key: 'total_volume', label: 'Volume', align: 'right', hiddenBelow: 'lg' },
  { key: null, label: 'Market Cap', align: 'right', hiddenBelow: 'lg' },
  { key: null, label: '7d Chart', align: 'left', hiddenBelow: 'sm' },
]

const hiddenClass: Record<NonNullable<ColumnDef['hiddenBelow']>, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
}

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: SortField
  activeField: SortField
  direction: 'asc' | 'desc'
}) {
  if (field !== activeField) return <ArrowUpDown size={13} className="text-slate-600" />
  const Icon: LucideIcon = direction === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={13} className="text-indigo-400" />
}

const SKELETON_ROWS = 10

export function MarketTable() {
  const currency = usePortfolioStore((s) => s.currency)
  const searchQuery = useUiStore((s) => s.searchQuery)
  const sortField = useUiStore((s) => s.sortField)
  const sortDirection = useUiStore((s) => s.sortDirection)
  const setSorting = useUiStore((s) => s.setSorting)

  const { data: coins, isLoading, isError, refetch } = useTopCoins(currency)

  const { filteredCoins } = useFilteredCoins({ coins, searchQuery, sortField, sortDirection })

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 overflow-hidden">
      <MarketFilters />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => {
                const isSortable = col.key !== null
                const isActive = isSortable && col.key === sortField
                return (
                  <th
                    key={col.label}
                    onClick={() => isSortable && setSorting(col.key as SortField)}
                    className={cn(
                      'py-2.5 px-3 text-xs font-medium text-slate-400 whitespace-nowrap select-none',
                      col.align === 'right' ? 'text-right' : 'text-left',
                      col.label === '#' && 'pl-4 w-10',
                      col.label === '7d Chart' && 'pr-4',
                      isSortable && 'cursor-pointer hover:text-white transition-colors duration-150',
                      isActive && 'text-white',
                      col.hiddenBelow && hiddenClass[col.hiddenBelow],
                    )}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      {col.align === 'right' && isSortable && (
                        <SortIcon
                          field={col.key as SortField}
                          activeField={sortField}
                          direction={sortDirection}
                        />
                      )}
                      {col.label}
                      {col.align === 'left' && isSortable && (
                        <SortIcon
                          field={col.key as SortField}
                          activeField={sortField}
                          direction={sortDirection}
                        />
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 pl-4 pr-2">
                    <Skeleton className="h-3 w-5 ml-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-2.5 w-10" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-20 ml-auto" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-5 w-14 rounded-full ml-auto" /></td>
                  <td className="py-3 px-3 hidden md:table-cell"><Skeleton className="h-5 w-14 rounded-full ml-auto" /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><Skeleton className="h-3.5 w-16 ml-auto" /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><Skeleton className="h-3.5 w-20 ml-auto" /></td>
                  <td className="py-3 pl-3 pr-4 hidden sm:table-cell"><Skeleton className="h-8 w-20" /></td>
                </tr>
              ))}

            {isError && (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-400">Errore nel caricamento dei dati di mercato.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                    >
                      <RefreshCw size={14} />
                      Riprova
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !isError && filteredCoins.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <p className="text-sm text-slate-400">Nessuna crypto trovata per &quot;{searchQuery}&quot;.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              filteredCoins.map((coin) => (
                <MarketTableRow
                  key={coin.id}
                  coin={coin}
                  currency={currency}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
