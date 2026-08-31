import React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 flex items-center text-white/40 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg bg-white/5 border text-white text-sm',
              'px-3 py-2.5 h-10',
              'placeholder:text-white/30',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              icon ? 'pl-10' : 'pl-3',
              error
                ? 'border-rose-500/70 focus:ring-rose-500/50'
                : 'border-white/10 focus:ring-indigo-500/50 hover:border-white/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-400">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
