import React, { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface SparklineProps {
  data?: number[]
  width?: number
  height?: number
  isPositive?: boolean
  className?: string
}

const PADDING = 3

const Sparkline = React.memo(function Sparkline({
  data,
  width = 120,
  height = 36,
  isPositive,
  className,
}: SparklineProps) {
  const { path, positive } = useMemo(() => {
    if (!data || data.length < 2) {
      const mid = height / 2
      return {
        path: `M 0 ${mid} L ${width} ${mid}`,
        positive: true,
      }
    }

    const autoPositive = isPositive ?? data[data.length - 1] >= data[0]

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const drawHeight = height - PADDING * 2
    const drawWidth = width

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * drawWidth
      const y = PADDING + drawHeight - ((val - min) / range) * drawHeight
      return `${x.toFixed(2)} ${y.toFixed(2)}`
    })

    return {
      path: `M ${points.join(' L ')}`,
      positive: autoPositive,
    }
  }, [data, width, height, isPositive])

  const stroke = positive ? '#10b981' : '#f43f5e'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {(!data || data.length < 2) ? (
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#475569"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : (
        <path
          d={path}
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  )
})

Sparkline.displayName = 'Sparkline'

export { Sparkline }
