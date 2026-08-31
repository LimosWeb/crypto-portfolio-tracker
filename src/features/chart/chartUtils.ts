export function normalizeChartData(
  prices: [number, number][] | undefined,
): { time: number; value: number }[] {
  if (!Array.isArray(prices) || prices.length === 0) return []

  const seen = new Set<number>()
  let lastTime = -Infinity

  return prices.reduce<{ time: number; value: number }[]>((acc, pair) => {
    if (!Array.isArray(pair) || pair.length < 2) return acc
    const [timestamp, price] = pair
    if (!isFinite(timestamp) || !isFinite(price)) return acc
    if (timestamp <= lastTime) return acc
    if (seen.has(timestamp)) return acc

    seen.add(timestamp)
    lastTime = timestamp
    acc.push({ time: timestamp, value: price })
    return acc
  }, [])
}

export function calculateTrend(
  data: { value: number }[],
): 'bullish' | 'bearish' {
  if (data.length < 2) return 'bullish'
  return data[data.length - 1].value >= data[0].value ? 'bullish' : 'bearish'
}
