import { useCallback, useMemo, useState } from 'react'
import { useTopCoins } from '@/hooks/useCryptoQueries'
import type { FiatCurrency } from '@/types/crypto'

type LastEdited = 'crypto' | 'fiat'

export function useCurrencyConverter() {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin')
  const [targetCurrency, setTargetCurrency] = useState<FiatCurrency>('usd')
  const [cryptoAmount, setCryptoAmount] = useState<number>(1)
  const [fiatAmount, setFiatAmount] = useState<number>(0)
  const [lastEdited, setLastEdited] = useState<LastEdited>('crypto')

  const { data: coins, isLoading, isError } = useTopCoins(targetCurrency)

  const selectedCoin = useMemo(
    () => (coins ?? []).find((c) => c.id === selectedCoinId) ?? null,
    [coins, selectedCoinId],
  )

  const currentPrice = selectedCoin?.current_price ?? 0

  const convertedFiat = useMemo(
    () => (lastEdited === 'crypto' ? cryptoAmount * currentPrice : fiatAmount),
    [lastEdited, cryptoAmount, fiatAmount, currentPrice],
  )

  const convertedCrypto = useMemo(
    () =>
      lastEdited === 'fiat' ? (currentPrice > 0 ? fiatAmount / currentPrice : 0) : cryptoAmount,
    [lastEdited, cryptoAmount, fiatAmount, currentPrice],
  )

  const handleCryptoAmountChange = useCallback((value: number) => {
    setCryptoAmount(value)
    setLastEdited('crypto')
  }, [])

  const handleFiatAmountChange = useCallback((value: number) => {
    setFiatAmount(value)
    setLastEdited('fiat')
  }, [])

  const handleCoinChange = useCallback((coinId: string) => {
    setSelectedCoinId(coinId)
  }, [])

  const handleCurrencyChange = useCallback((currency: FiatCurrency) => {
    setTargetCurrency(currency)
  }, [])

  const handleInvert = useCallback(() => {
    if (lastEdited === 'crypto') {
      setFiatAmount(convertedFiat)
      setLastEdited('fiat')
    } else {
      setCryptoAmount(convertedCrypto)
      setLastEdited('crypto')
    }
  }, [lastEdited, convertedFiat, convertedCrypto])

  return {
    selectedCoinId,
    targetCurrency,
    cryptoAmount: convertedCrypto,
    fiatAmount: convertedFiat,
    lastEdited,
    currentPrice,
    selectedCoin,
    coins: coins ?? [],
    isLoading,
    isError,
    handleCryptoAmountChange,
    handleFiatAmountChange,
    handleCoinChange,
    handleCurrencyChange,
    handleInvert,
  }
}
