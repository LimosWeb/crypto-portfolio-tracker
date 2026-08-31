import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FiatCurrency } from '@/types/crypto'
import type { Transaction } from '@/types/portfolio'

interface PortfolioState {
  transactions: Transaction[]
  currency: FiatCurrency
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  removeTransaction: (id: string) => void
  setCurrency: (currency: FiatCurrency) => void
  clearPortfolio: () => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      transactions: [],
      currency: 'usd',

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: crypto.randomUUID(),
            },
          ],
        })),

      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setCurrency: (currency) => set({ currency }),

      clearPortfolio: () => set({ transactions: [] }),
    }),
    {
      name: 'crypto-portfolio-storage',
    },
  ),
)
