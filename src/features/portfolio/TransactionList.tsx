import { ArrowUpRight, Calendar, Plus, Trash2 } from 'lucide-react'
import React, { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { usePortfolioStore } from '@/store/portfolioStore'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface TransactionListProps {
  onAddTransaction: () => void
}

function formatTxDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function TransactionList({ onAddTransaction }: TransactionListProps) {
  const transactions = usePortfolioStore((s) => s.transactions)
  const removeTransaction = usePortfolioStore((s) => s.removeTransaction)
  const currency = usePortfolioStore((s) => s.currency)

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.timestamp - a.timestamp),
    [transactions],
  )

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between gap-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ArrowUpRight size={15} className="text-slate-400" />
          <span className="text-sm font-semibold text-white">Storico Operazioni</span>
          {transactions.length > 0 && (
            <span className="text-xs text-slate-500 font-mono">({transactions.length})</span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={onAddTransaction}>
          <Plus size={14} />
          Aggiungi
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
            <Calendar size={20} className="text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-300">Nessuna operazione registrata</p>
          <p className="text-xs text-slate-500 max-w-[260px]">
            Aggiungi il tuo primo acquisto per iniziare a tracciare il portafoglio.
          </p>
          <Button size="sm" variant="primary" onClick={onAddTransaction}>
            <Plus size={14} />
            Prima operazione
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-2.5 px-4 text-left text-xs font-medium text-slate-400">Data</th>
                <th className="py-2.5 px-4 text-left text-xs font-medium text-slate-400">Asset</th>
                <th className="py-2.5 px-4 text-right text-xs font-medium text-slate-400">Quantità</th>
                <th className="py-2.5 px-4 text-right text-xs font-medium text-slate-400 hidden sm:table-cell">
                  Prezzo Acquisto
                </th>
                <th className="py-2.5 px-4 text-right text-xs font-medium text-slate-400">Totale</th>
                <th className="py-2.5 px-4 text-right text-xs font-medium text-slate-400 w-10" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-100 group"
                >
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-400 font-mono">
                      {formatTxDate(tx.timestamp)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-white uppercase font-mono">
                        {tx.coinSymbol}
                      </span>
                      <span className="text-xs text-slate-500 truncate max-w-[120px]">
                        {tx.coinId}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-mono text-white tabular-nums">
                      {formatNumber(tx.amount, 6)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className="text-sm font-mono text-slate-300 tabular-nums">
                      {formatCurrency(tx.buyPrice, currency)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-mono font-semibold text-white tabular-nums">
                      {formatCurrency(tx.amount * tx.buyPrice, currency)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                      aria-label="Elimina operazione"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
