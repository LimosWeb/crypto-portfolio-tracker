import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCoinMarketChart } from '@/hooks/useCryptoQueries'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useUiStore } from '@/store/uiStore'
import { formatCurrency } from '@/utils/formatters'
import { calculateTrend, normalizeChartData } from '@/features/chart/chartUtils'
import { TimeframeSelector } from '@/features/chart/TimeframeSelector'

const PAD = { top: 16, right: 12, bottom: 16, left: 12 }

interface DataPoint {
  time: number
  value: number
}

function toSvgCoords(
  data: DataPoint[],
  minV: number,
  maxV: number,
  w: number,
  h: number,
): { x: number; y: number }[] {
  const rangeV = maxV - minV || 1
  const drawW = w - PAD.left - PAD.right
  const drawH = h - PAD.top - PAD.bottom
  return data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * drawW,
    y: PAD.top + drawH - ((d.value - minV) / rangeV) * drawH,
  }))
}

function buildLinePath(coords: { x: number; y: number }[]): string {
  return coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(' ')
}

export function PriceChart() {
  const selectedCoinId = useUiStore((s) => s.selectedCoinId)
  const chartTimeframe = useUiStore((s) => s.chartTimeframe)
  const currency = usePortfolioStore((s) => s.currency)

  const { data: chartData, isLoading, isError } = useCoinMarketChart(
    selectedCoinId,
    currency,
    chartTimeframe,
  )

  const normalized = useMemo<DataPoint[]>(
    () => normalizeChartData(chartData?.prices),
    [chartData],
  )
  const trend = useMemo(() => calculateTrend(normalized), [normalized])

  const { minV, maxV } = useMemo(() => {
    if (normalized.length === 0) return { minV: 0, maxV: 0 }
    const vals = normalized.map((d) => d.value)
    return { minV: Math.min(...vals), maxV: Math.max(...vals) }
  }, [normalized])

  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      if (e) setDims({ width: e.contentRect.width, height: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { width, height } = dims

  const coords = useMemo(
    () =>
      width > 0 && height > 0 && normalized.length >= 2
        ? toSvgCoords(normalized, minV, maxV, width, height)
        : [],
    [normalized, minV, maxV, width, height],
  )

  const linePath = useMemo(() => buildLinePath(coords), [coords])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || normalized.length < 2) return
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const drawW = width - PAD.left - PAD.right
      const ratio = Math.max(0, Math.min(1, (mouseX - PAD.left) / drawW))
      setHoverIndex(Math.round(ratio * (normalized.length - 1)))
    },
    [width, normalized],
  )

  const handleMouseLeave = useCallback(() => setHoverIndex(null), [])

  const strokeColor = trend === 'bullish' ? '#10b981' : '#f43f5e'
  const firstPrice = normalized[0]?.value ?? null
  const activePoint = hoverIndex !== null ? normalized[hoverIndex] : null
  const displayPrice = activePoint?.value ?? normalized[normalized.length - 1]?.value ?? null
  const periodPct =
    displayPrice !== null && firstPrice !== null && firstPrice !== 0
      ? ((displayPrice - firstPrice) / firstPrice) * 100
      : null

  const hoverCoord = hoverIndex !== null ? coords[hoverIndex] : null

  if (isLoading) {
    return (
      <div className="w-full rounded-xl overflow-hidden">
        <Skeleton className="w-full h-72" />
      </div>
    )
  }

  if (isError || normalized.length < 2) {
    return (
      <div className="w-full h-72 flex items-center justify-center rounded-xl border border-white/5 bg-slate-900/40">
        <p className="text-sm text-slate-400">Dati grafici non disponibili.</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-white/5 bg-slate-900/40 overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          {displayPrice !== null && (
            <span className="text-2xl font-bold font-mono text-white tabular-nums leading-none">
              {formatCurrency(displayPrice, currency)}
            </span>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {periodPct !== null && (
              <span
                className={
                  periodPct >= 0
                    ? 'text-sm font-semibold text-emerald-400'
                    : 'text-sm font-semibold text-rose-400'
                }
              >
                {periodPct >= 0 ? '+' : ''}
                {periodPct.toFixed(2)}%
              </span>
            )}
            {activePoint && (
              <span className="text-xs text-slate-500">
                {new Date(activePoint.time).toLocaleString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        </div>
        <TimeframeSelector />
      </div>

      <div
        ref={containerRef}
        className="w-full h-52 relative cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {width > 0 && height > 0 && linePath && (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            className="absolute inset-0"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`grad-${selectedCoinId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d={`${linePath} L ${coords[coords.length - 1].x.toFixed(2)} ${(height - PAD.bottom).toFixed(2)} L ${PAD.left.toFixed(2)} ${(height - PAD.bottom).toFixed(2)} Z`}
              fill={`url(#grad-${selectedCoinId})`}
            />
            <path
              d={linePath}
              stroke={strokeColor}
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {hoverCoord && (
              <>
                <line
                  x1={hoverCoord.x}
                  y1={PAD.top}
                  x2={hoverCoord.x}
                  y2={height - PAD.bottom}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle
                  cx={hoverCoord.x}
                  cy={hoverCoord.y}
                  r={4.5}
                  fill={strokeColor}
                  stroke="#0f172a"
                  strokeWidth={2}
                />
              </>
            )}
          </svg>
        )}
      </div>
    </div>
  )
}
