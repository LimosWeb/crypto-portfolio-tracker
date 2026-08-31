import { Loader2 } from 'lucide-react'
import React from 'react'
import { cn } from '@/utils/cn'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-800/70', className)}
      {...props}
    />
  )
}

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const spinnerSizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 36,
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      size={spinnerSizeMap[size]}
      className={cn('animate-spin text-emerald-400', className)}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl bg-slate-900 border border-white/5 p-4 flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-20 ml-auto" />
      </div>
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-3 flex-1" />
        <Skeleton className="h-3 flex-1" />
        <Skeleton className="h-3 flex-1" />
      </div>
    </div>
  )
}
