import { AlertTriangle, ArrowDownUp, Clock, Coins } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter'
import type { FiatCurrency } from '@/types/crypto'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const FIAT_OPTIONS: { value: FiatCurrency; label: string }[] = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'gbp', label: 'GBP' },
]

const FIAT_SYMBOLS: Record<FiatCurrency, string> = { usd: '$', eur: '€', gbp: '£' }
const CRYPTO_PRESETS = [0.1, 0.5, 1, 5, 10]
const FIAT_PRESETS = [100, 500, 1000]

function formatCryptoDisplay(value: number): string {
  if (value === 0) return ''
  if (value < 0.000001) return value.toFixed(10).replace(/\.?0+$/, '')
  if (value < 0.0001) return value.toFixed(8)
  if (value < 0.01) return value.toFixed(6)
  if (value < 1) return value.toFixed(4)
  if (Number.isInteger(value)) return value.toString()
  return value.toPrecision(8).replace(/\.?0+$/, '')
}

function formatFiatDisplay(value: number): string {
  if (value === 0) return ''
  return value.toFixed(2)
}

const selectClass = cn(
  'h-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm',
  'px-3 appearance-none cursor-pointer w-[110px] shrink-0',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
  'hover:border-white/20 transition-colors duration-150',
)

const numericInputClass = cn(
  'flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-mono',
  'px-4 placeholder:text-slate-600 tabular-nums',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
  'hover:border-white/20 transition-colors duration-150',
)

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

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (currentPrice > 0) setLastUpdated(new Date())
  }, [currentPrice, selectedCoinId, targetCurrency])

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[520px] flex flex-col gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-10 w-10 rounded-full self-center" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    )
  }

  const inverseRate = currentPrice > 0 ? 1 / currentPrice : null
  const symbolUpper = selectedCoin?.symbol.toUpperCase() ?? ''

  return (
    <div className="mx-auto w-full max-w-[520px] flex flex-col gap-4">
      <div className="rounded-2xl border border-white/5 bg-slate-900/60 px-5 py-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Coins size={15} className="text-indigo-400 shrink-0" />
            <h2 className="text-sm font-bold text-white">Convertitore Istantaneo</h2>
          </div>
          {currentPrice > 0 && selectedCoin && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs font-mono text-emerald-400">
                1 {symbolUpper} = {formatCurrency(currentPrice, targetCurrency)}
              </span>
            </div>
          )}
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock size={11} />
            <span className="text-[10px]">
              Tasso aggiornato live via CoinGecko —{' '}
              {lastUpdated.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle size={14} className="shrink-0" />
          <p className="text-xs">Impossibile caricare i prezzi live. I dati potrebbero non essere aggiornati.</p>
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col gap-3">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Importo Crypto
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={formatCryptoDisplay(cryptoAmount)}
            onChange={(e) => handleCryptoAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0.0000"
            className={numericInputClass}
          />
          <select
            value={selectedCoinId}
            onChange={(e) => handleCoinChange(e.target.value)}
            className={selectClass}
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.symbol.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CRYPTO_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleCryptoAmountChange(preset)}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 bg-slate-800/60 border border-white/5 hover:text-white hover:bg-slate-700/60 hover:border-white/10 transition-all duration-150"
            >
              {preset}
            </button>
          ))}
          {symbolUpper && (
            <span className="px-2 py-1 text-xs text-slate-600 self-center">{symbolUpper}</span>
          )}
        </div>
      </div>

      <div className="flex justify-center -my-1.5">
        <button
          onClick={handleInvert}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-white/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
          aria-label="Inverti conversione"
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col gap-3">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Controvalore Fiat
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={formatFiatDisplay(fiatAmount)}
            onChange={(e) => handleFiatAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={numericInputClass}
          />
          <select
            value={targetCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value as FiatCurrency)}
            className={selectClass}
          >
            {FIAT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-slate-900">
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FIAT_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleFiatAmountChange(preset)}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 bg-slate-800/60 border border-white/5 hover:text-white hover:bg-slate-700/60 hover:border-white/10 transition-all duration-150"
            >
              {FIAT_SYMBOLS[targetCurrency]}{preset}
            </button>
          ))}
        </div>
      </div>

      {inverseRate !== null && symbolUpper && (
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Formula Inversa</span>
            <span className="text-xs font-mono text-slate-300">
              1 {FIAT_SYMBOLS[targetCurrency]} ={' '}
              <span className="text-white font-semibold">
                {formatCryptoDisplay(inverseRate)} {symbolUpper}
              </span>
            </span>
          </div>
          <div className="text-[10px] text-slate-500 text-right hidden sm:block">
            {currentPrice > 0 && (
              <>
                <div>1 {symbolUpper} = {formatCurrency(currentPrice, targetCurrency)}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
