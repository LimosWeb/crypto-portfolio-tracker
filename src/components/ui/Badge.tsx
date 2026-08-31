import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'success' | 'danger' | 'neutral' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  value?: number
  variant?: BadgeVariant
  showIcon?: boolean
  showSign?: boolean
  size?: BadgeSize
  children?: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  neutral: 'bg-slate-800 text-slate-400 border border-slate-700',
  info: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
}

const iconSize: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
}

function resolveVariant(value: number): BadgeVariant {
  if (value > 0) return 'success'
  if (value < 0) return 'danger'
  return 'neutral'
}

export function Badge({
  value,
  variant,
  showIcon = true,
  showSign = true,
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  const hasValue = value !== undefined

  const resolvedVariant: BadgeVariant = hasValue
    ? resolveVariant(value)
    : (variant ?? 'neutral')

  const Icon =
    hasValue && value > 0
      ? TrendingUp
      : hasValue && value < 0
        ? TrendingDown
        : Minus

  const formattedValue = hasValue
    ? `${showSign && value > 0 ? '+' : ''}${value.toFixed(2)}%`
    : null

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium leading-none',
        variantClasses[resolvedVariant],
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && hasValue && (
        <Icon size={iconSize[size]} className="shrink-0" />
      )}
      {formattedValue ?? children}
    </span>
  )
}
