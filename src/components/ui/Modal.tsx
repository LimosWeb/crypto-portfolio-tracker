import { X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const maxWidthClasses: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative z-10 w-full rounded-2xl',
          'bg-slate-900 border border-white/10',
          'shadow-2xl shadow-black/50',
          'animate-in fade-in zoom-in-95 duration-200',
          maxWidthClasses[maxWidth],
          className,
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 id="modal-title" className="text-base font-semibold text-white leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-white/50">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Chiudi modale"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {!(title || description) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Chiudi modale"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
