import React from 'react'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="flex-1 flex flex-col pb-16">
          <Navbar />
          <div className="flex-1">{children}</div>
        </main>
      </div>

      <footer className="border-t border-white/5 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>
            © {new Date().getFullYear()} CryptoPulse — Progetto dimostrativo
          </span>
          <span>
            Dati di mercato forniti da{' '}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 transition-colors duration-150"
            >
              CoinGecko API
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
