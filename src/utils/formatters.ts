import type { FiatCurrency } from '@/types/crypto'

const currencyCodeMap: Record<FiatCurrency, string> = {
  usd: 'USD',
  eur: 'EUR',
  gbp: 'GBP',
}

export function formatCurrency(
  value: number,
  currency: FiatCurrency = 'usd',
  compact = false,
): string {
  const code = currencyCodeMap[currency]

  if (Math.abs(value) < 0.01) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: code,
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 6,
    }).format(value)
  }

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: code,
    ...(compact ? { notation: 'compact', maximumFractionDigits: 2 } : {}),
  }).format(value)
}

export function formatPercentage(value: number | undefined | null): string {
  const num = value ?? 0
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDate(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
