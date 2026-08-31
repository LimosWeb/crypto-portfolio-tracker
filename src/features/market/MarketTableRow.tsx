import React from 'react'
import { Badge } from '@/components/ui/Badge'
import type { CoinMarketData, FiatCurrency } from '@/types/crypto'
import { formatCurrency } from '@/utils/formatters'
import { Sparkline } from '@/features/market/Sparkline'

interface MarketTableRowProps {
  coin: CoinMarketData
  currency: FiatCurrency
  onSelect?: (coinId: string) => void
}

const MarketTableRow = React.memo(function MarketTableRow({
  coin,
  currency,
  onSelect,
}: MarketTableRowProps) {
  return (
    <tr
      onClick={() => onSelect?.(coin.id)}
      className="border-b border-white/5 hover:bg-slate-900/60 cursor-pointer transition-colors duration-150"
    >
      <td className="py-3 pl-4 pr-2 text-xs font-mono text-slate-400 w-10 text-right">
        {coin.market_cap_rank}
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={coin.image}
            alt={coin.name}
            width={28}
            height={28}
            loading="lazy"
            className="rounded-full shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate leading-snug">
              {coin.name}
            </span>
            <span className="text-xs text-slate-400 uppercase font-mono leading-snug">
              {coin.symbol}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 px-3 text-right">
        <span className="text-sm font-mono text-white tabular-nums">
          {formatCurrency(coin.current_price, currency)}
        </span>
      </td>

      <td className="py-3 px-3 text-right">
        <Badge value={coin.price_change_percentage_24h} />
      </td>

      <td className="py-3 px-3 text-right hidden md:table-cell">
        <Badge value={coin.price_change_percentage_7d_in_currency} />
      </td>

      <td className="py-3 px-3 text-right hidden lg:table-cell">
        <span className="text-sm font-mono text-slate-300 tabular-nums">
          {formatCurrency(coin.total_volume, currency, true)}
        </span>
      </td>

      <td className="py-3 px-3 text-right hidden lg:table-cell">
        <span className="text-sm font-mono text-slate-300 tabular-nums">
          {formatCurrency(coin.market_cap, currency, true)}
        </span>
      </td>

      <td className="py-3 pl-3 pr-4 hidden sm:table-cell">
        <Sparkline
          data={coin.sparkline_in_7d?.price}
          isPositive={(coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h) >= 0}
          width={80}
          height={32}
        />
      </td>
    </tr>
  )
})

MarketTableRow.displayName = 'MarketTableRow'

export { MarketTableRow }
