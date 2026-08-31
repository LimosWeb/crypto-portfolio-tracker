import { PieChart, PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics'
import { formatCurrency } from '@/utils/formatters'

const PALETTE = [
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#8b5cf6',
  '#f59e0b',
  '#f43f5e',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
]

const R = 56
const r = 36
const CX = 70
const CY = 70
const SIZE = 140

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

function describeArc(startDeg: number, endDeg: number): string {
  const clampedEnd = Math.min(endDeg, startDeg + 359.999)
  const outerStart = polar(CX, CY, R, startDeg)
  const outerEnd = polar(CX, CY, R, clampedEnd)
  const innerStart = polar(CX, CY, r, startDeg)
  const innerEnd = polar(CX, CY, r, clampedEnd)
  const large = clampedEnd - startDeg > 180 ? 1 : 0

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${R} ${R} 0 ${large} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${r} ${r} 0 ${large} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

interface Segment {
  coinId: string
  symbol: string
  name: string
  image: string
  allocationPercentage: number
  currentValue: number
  color: string
  startDeg: number
  endDeg: number
  path: string
}

export function PortfolioAllocationChart() {
  const { summary, isLoading, isEmpty, currency } = usePortfolioMetrics()
  const { assets, currentValue } = summary

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const segments = useMemo<Segment[]>(() => {
    let cursor = 0
    return assets.map((asset, i) => {
      const deg = (asset.allocationPercentage / 100) * 360
      const startDeg = cursor
      const endDeg = cursor + deg
      cursor = endDeg
      return {
        coinId: asset.coinId,
        symbol: asset.symbol,
        name: asset.name,
        image: asset.image,
        allocationPercentage: asset.allocationPercentage,
        currentValue: asset.currentValue,
        color: PALETTE[i % PALETTE.length],
        startDeg,
        endDeg,
        path: describeArc(startDeg, endDeg),
      }
    })
  }, [assets])

  const hoveredSegment = hoveredId ? segments.find((s) => s.coinId === hoveredId) ?? null : null

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-4">
        <Skeleton className="h-4 w-36" />
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-[140px] w-[140px] rounded-full shrink-0" />
          <div className="flex flex-col gap-3 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isEmpty || currentValue === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
          <PlusCircle size={22} className="text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-300">Nessun asset nel portafoglio</p>
        <p className="text-xs text-slate-500 max-w-[240px]">
          Aggiungi la tua prima operazione per visualizzare la ripartizione degli asset.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart size={15} className="text-slate-400" />
          <span className="text-sm font-semibold text-white">Ripartizione Asset</span>
        </div>
        <span className="text-sm font-mono font-bold text-white tabular-nums">
          {formatCurrency(currentValue, currency)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative shrink-0">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="overflow-visible"
          >
            {segments.map((seg) => (
              <path
                key={seg.coinId}
                d={seg.path}
                fill={seg.color}
                opacity={hoveredId === null || hoveredId === seg.coinId ? 1 : 0.3}
                stroke="#0f172a"
                strokeWidth={2}
                style={{ transition: 'opacity 150ms ease' }}
                onMouseEnter={() => setHoveredId(seg.coinId)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer"
              />
            ))}

            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-bold"
              fontSize="13"
            >
              {hoveredSegment
                ? `${hoveredSegment.allocationPercentage.toFixed(1)}%`
                : `${assets.length}`}
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400"
              fontSize="10"
            >
              {hoveredSegment ? hoveredSegment.symbol.toUpperCase() : 'asset'}
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {segments.map((seg) => (
            <div
              key={seg.coinId}
              className="flex items-center justify-between gap-2 text-xs w-full cursor-pointer group"
              onMouseEnter={() => setHoveredId(seg.coinId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-150 group-hover:scale-125"
                  style={{ backgroundColor: seg.color }}
                />
                <div className="flex items-center gap-1.5 min-w-0">
                  {seg.image && (
                    <img
                      src={seg.image}
                      alt={seg.name}
                      width={16}
                      height={16}
                      className="rounded-full shrink-0"
                      loading="lazy"
                    />
                  )}
                  <span className="text-slate-300 truncate">{seg.name}</span>
                  <span className="text-slate-500 font-mono uppercase shrink-0">
                    {seg.symbol}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-slate-300 tabular-nums">
                  {formatCurrency(seg.currentValue, currency, true)}
                </span>
                <span className="font-semibold tabular-nums w-10 text-right" style={{ color: seg.color }}>
                  {seg.allocationPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
