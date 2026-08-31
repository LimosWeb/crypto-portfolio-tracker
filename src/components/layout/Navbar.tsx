import { ArrowLeftRight, LayoutDashboard, TrendingUp, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import type { TabType } from '@/types/ui'
import { cn } from '@/utils/cn'

interface TabConfig {
  id: TabType
  label: string
  icon: LucideIcon
}

const tabs: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'market', label: 'Mercato', icon: TrendingUp },
  { id: 'portfolio', label: 'Portafoglio', icon: Wallet },
  { id: 'converter', label: 'Convertitore', icon: ArrowLeftRight },
]

export function Navbar() {
  const activeTab = useUiStore((s) => s.activeTab)
  const setActiveTab = useUiStore((s) => s.setActiveTab)

  return (
    <nav className="w-full px-4 sm:px-6 py-3">
      <div className="mx-auto max-w-screen-2xl">
        <div className="inline-flex w-full items-center gap-1 rounded-xl bg-slate-900/60 border border-slate-800 p-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                  'transition-all duration-150',
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent',
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="hidden sm:block">{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
