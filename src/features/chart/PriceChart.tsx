import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCoinMarketChart } from '@/hooks/useCryptoQueries'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useUiStore } from '@/store/uiStore'
import { formatCurrency } from '@/utils/formatters'
import { calculateTrend, normalizeChartData } from '@/features/chart/chartUtils'

const PADDING = { top: 16, right: 8, bottom: 32, left: 8 }

function buildPath(
  data: { time: number; value: number }[],
  w: number,
  h: number,
): string {
  if (data.length < 2) return ''
  const minV = Math.min(...data.map((d) => d.value))
  const maxV = Math.max(...data.map((d) => d.value))
  const rangeV = maxV - minV || 1
  const drawW = w - PADDING.left - PADDING.right
  const drawH = h - PADDING.top - PADDING.bottom

  return data
    .map((d, i) => {
      const x = PADDING.left + (i / (data.length - 1)) * drawW
      const y = PADDING.top + drawH - ((d.value - minV) / rangeV) * drawH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function buildAreaPath(
  linePath: string,
  w: number,
  h: number,
): string {
  if (!linePath) return ''
  const bottomLeft = `L ${PADDING.left.toFixed(2)} ${(h - PADDING.bottom).toFixed(2)}`
  const bottomRight = `L ${(w - PADDING.right).toFixed(2)} ${(h - PADDING.bottom).toFixed(2)}`
  const lastX = w - PADDING.right
  const lastYApprox = h - PADDING.bottom
  return `${linePath} ${bottomRight} ${bottomLeft} Z`
    .replace(/L [0-9.]+ [0-9.]+$/, `L ${lastX.toFixed(2)} ${lastYApprox.toFixed(2)} Z`)
}

export function PriceChart() {
  const selectedCoinId = useUiStore((s) => s.selectedCoinId)
  const chartTimeframe = useUiStore((s) => s.chartTimeframe)
  const currency = usePortfolioStore((s) => s.currency)

  const { data, isLoading, isError } = useCoinMarketChart(selectedCoinId, currency, chartTimeframe)

  const normalized = useMemo(() => normalizeChartData(data?.prices), [data])
  const trend = useMemo(() => calculateTrend(normalized), [normalized])

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { width, height } = dimensions
  const linePath = useMemo(
    () => (width > 0 && height > 0 ? buildPath(normalized, width, height) : ''),
    [normalized, width, height],
  )

  const strokeColor = trend === 'bullish' ? '#10b981' : '#f43f5e'
  const gradientId = `chart-gradient-${selectedCoinId}`

  const latestPrice = normalized.length > 0 ? normalized[normalized.length - 1].value : null
  const firstPrice = normalized.length > 0 ? normalized[0].value : null
  const priceDelta = latestPrice !== null && firstPrice !== null ? latestPrice - firstPrice : null

  if (isLoading) {
    return (
      <div className="w-full rounded-xl overflow-hidden">
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || normalized.length < 2) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-xl border border-white/5 bg-slate-900/40">
        <p className="text-sm text-slate-400">Dati grafici non disponibili.</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-white/5 bg-slate-900/40 overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-end justify-between gap-4">
        {latestPrice !== null && (
          <span className="text-xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(latestPrice, currency)}
          </span>
        )}
        {priceDelta !== null && firstPrice !== null && (
          <span
            className={
              priceDelta >= 0 ? 'text-sm text-emerald-400 font-medium' : 'text-sm text-rose-400 font-medium'
            }
          >
            {priceDelta >= 0 ? '+' : ''}
            {formatCurrency(priceDelta, currency)}
          </span>
        )}
      </div>

      <div ref={containerRef} className="w-full h-48">
        {width > 0 && height > 0 && linePath && (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${linePath} L ${(width - PADDING.right).toFixed(2)} ${(height - PADDING.bottom).toFixed(2)} L ${PADDING.left.toFixed(2)} ${(height - PADDING.bottom).toFixed(2)} Z`}
              fill={`url(#${gradientId})`}
            />
            <path
              d={linePath}
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  )
}
