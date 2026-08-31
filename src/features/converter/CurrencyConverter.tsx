import { AlertTriangle, ArrowDownUp, Coins } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter'
import type { FiatCurrency } from '@/types/crypto'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const FIAT_OPTIONS: { value: FiatCurrency; label: string }[] = [
  { value: 'usd', label: 'USD — Dollaro USA' },
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'gbp', label: 'GBP — Sterlina GB' },
]

const FIAT_SYMBOLS: Record<FiatCurrency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
}

export function CurrencyConverter() {
  const {
    coins,
    selectedCoin,
    selectedCoinId,
    targetCurrency,
    cryptoAmount,
    fiatAmount,
    currentPrice,
    isLoading,
    isError,
    handleCryptoAmountChange,
    handleFiatAmountChange,
    handleCoinChange,
    handleCurrencyChange,
    handleInvert,
  } = useCurrencyConverter()

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[500px] flex flex-col gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-12 w-12 rounded-full self-center" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[500px] flex flex-col gap-4">
      <div className="rounded-2xl border border-white/5 bg-slate-900/60 px-5 py-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Convertitore Istantaneo</h2>
        </div>
        <p className="text-xs text-slate-400">
          Converti qualsiasi importo crypto in valuta fiat in tempo reale.
        </p>
        {currentPrice > 0 && selectedCoin && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400">
              1 {selectedCoin.symbol.toUpperCase()} = {formatCurrency(currentPrice, targetCurrency)}
            </span>
          </div>
        )}
      </div>

      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle size={15} className="shrink-0" />
          <p className="text-xs">Impossibile caricare i prezzi live. I dati potrebbero non essere aggiornati.</p>
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col gap-3">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Importo Crypto
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={cryptoAmount === 0 ? '' : cryptoAmount}
            onChange={(e) => handleCryptoAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={cn(
              'flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-mono',
              'px-4 placeholder:text-slate-600 tabular-nums',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
              'hover:border-white/20 transition-colors duration-150',
            )}
          />
          <select
            value={selectedCoinId}
            onChange={(e) => handleCoinChange(e.target.value)}
            className={cn(
              'h-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm',
              'px-3 appearance-none cursor-pointer max-w-[160px]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
              'hover:border-white/20 transition-colors duration-150',
            )}
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.symbol.toUpperCase()} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center -my-1">
        <button
          onClick={handleInvert}
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center',
            'bg-slate-800 border border-white/10',
            'text-slate-400 hover:text-white hover:bg-slate-700 hover:border-white/20',
            'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
          )}
          aria-label="Inverti conversione"
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col gap-3">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Controvalore Fiat
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={fiatAmount === 0 ? '' : fiatAmount.toFixed(2)}
            onChange={(e) => handleFiatAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={cn(
              'flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-mono',
              'px-4 placeholder:text-slate-600 tabular-nums',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
              'hover:border-white/20 transition-colors duration-150',
            )}
          />
          <select
            value={targetCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value as FiatCurrency)}
            className={cn(
              'h-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm',
              'px-3 appearance-none cursor-pointer max-w-[160px]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
              'hover:border-white/20 transition-colors duration-150',
            )}
          >
            {FIAT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-slate-900">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPrice > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[100, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleFiatAmountChange(amount)}
              className={cn(
                'py-2 rounded-xl text-xs font-semibold text-slate-400',
                'bg-slate-800/60 border border-white/5',
                'hover:text-white hover:bg-slate-700/60 hover:border-white/10',
                'transition-all duration-150',
              )}
            >
              {FIAT_SYMBOLS[targetCurrency]}{amount}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
