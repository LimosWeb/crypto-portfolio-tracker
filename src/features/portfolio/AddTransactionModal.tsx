import { DollarSign, Hash, Calendar } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTopCoins } from '@/hooks/useCryptoQueries'
import { usePortfolioStore } from '@/store/portfolioStore'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  coinId: string
  amount: string
  buyPrice: string
  date: string
}

interface FormErrors {
  coinId?: string
  amount?: string
  buyPrice?: string
  date?: string
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.coinId) {
    errors.coinId = 'Seleziona una criptovaluta.'
  }

  const amount = parseFloat(form.amount)
  if (form.amount.trim() === '' || isNaN(amount) || amount <= 0) {
    errors.amount = 'La quantità deve essere un numero positivo.'
  }

  const price = parseFloat(form.buyPrice)
  if (form.buyPrice.trim() === '' || isNaN(price) || price < 0) {
    errors.buyPrice = 'Il prezzo di acquisto deve essere >= 0.'
  }

  if (!form.date) {
    errors.date = 'Inserisci una data valida.'
  } else {
    const chosen = new Date(form.date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (isNaN(chosen.getTime())) {
      errors.date = 'Data non valida.'
    } else if (chosen > today) {
      errors.date = 'La data non può essere futura.'
    }
  }

  return errors
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const addTransaction = usePortfolioStore((s) => s.addTransaction)
  const currency = usePortfolioStore((s) => s.currency)

  const { data: coins } = useTopCoins(currency)

  const [form, setForm] = useState<FormState>({
    coinId: '',
    amount: '',
    buyPrice: '',
    date: todayString(),
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const selectedCoin = useMemo(
    () => (coins ?? []).find((c) => c.id === form.coinId) ?? null,
    [coins, form.coinId],
  )

  useEffect(() => {
    if (selectedCoin) {
      setForm((prev) => ({ ...prev, buyPrice: selectedCoin.current_price.toString() }))
    }
  }, [selectedCoin])

  useEffect(() => {
    if (!isOpen) {
      setForm({ coinId: '', amount: '', buyPrice: '', date: todayString() })
      setErrors({})
      setSubmitted(false)
    }
  }, [isOpen])

  function handleChange(field: keyof FormState, value: string) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (submitted) {
      setErrors(validate(next))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const [year, month, day] = form.date.split('-').map(Number)
    const timestamp = new Date(year, month - 1, day).getTime()

    addTransaction({
      coinId: form.coinId,
      coinSymbol: selectedCoin?.symbol ?? form.coinId,
      amount: parseFloat(form.amount),
      buyPrice: parseFloat(form.buyPrice),
      timestamp,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aggiungi Operazione"
      description="Registra un acquisto nel tuo portafoglio simulato."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">Criptovaluta</label>
          <select
            value={form.coinId}
            onChange={(e) => handleChange('coinId', e.target.value)}
            className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-white/20 transition-colors duration-150 appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-slate-900">
              Seleziona una crypto...
            </option>
            {(coins ?? []).map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.name} ({c.symbol.toUpperCase()})
              </option>
            ))}
          </select>
          {errors.coinId && <p className="text-xs text-rose-400">{errors.coinId}</p>}
        </div>

        <Input
          label="Quantità acquistata"
          type="number"
          min="0"
          step="any"
          placeholder="es. 0.5"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
          icon={<Hash size={14} />}
        />

        <Input
          label="Prezzo di acquisto"
          type="number"
          min="0"
          step="any"
          placeholder="es. 42000"
          value={form.buyPrice}
          onChange={(e) => handleChange('buyPrice', e.target.value)}
          error={errors.buyPrice}
          icon={<DollarSign size={14} />}
        />

        <Input
          label="Data operazione"
          type="date"
          max={todayString()}
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
          icon={<Calendar size={14} />}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Aggiungi
          </Button>
        </div>
      </form>
    </Modal>
  )
}
