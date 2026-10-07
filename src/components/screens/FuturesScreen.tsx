import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { ArrowUpRight, ArrowDownRight, Flame, Plus, Check } from 'lucide-react';

export const FuturesScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const futures = marketItems.filter((i) => i.assetClass === 'futures');

  const filteredFutures =
    categoryFilter === 'All'
      ? futures
      : futures.filter((f) => f.category === categoryFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Commodities & Futures Contracts</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            Continuous futures quotes for energy products, industrial & precious metals, and agricultural goods
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
          {['All', 'Energy', 'Metals', 'Agriculture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Futures Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Commodity Contract</th>
                <th className="py-2.5 px-3 font-semibold">Class</th>
                <th className="py-2.5 px-3 font-semibold text-right">Last Price</th>
                <th className="py-2.5 px-3 font-semibold text-right">Net Change</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change %</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h High</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h Low</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden md:table-cell">Technical</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">7D Chart</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredFutures.map((item) => {
                const isUp = item.change >= 0;
                const inWatch = isInWatchlist(item.symbol);
                return (
                  <tr
                    key={item.id}
                    onClick={() => openSuperChart(item.symbol)}
                    className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={item.symbol} logoUrl={item.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">{item.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#787b86] font-medium">{item.category}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      ${item.price.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {item.change.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {item.high24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {item.low24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <RatingBadge rating={item.technicalRating} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <div className="w-20 mx-auto">
                        <Sparkline
                          data={item.history}
                          isPositive={isUp}
                          width={80}
                          height={22}
                          showArea={false}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (inWatch) removeFromWatchlist(item.symbol);
                          else addToWatchlist(item.symbol);
                        }}
                        className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                          inWatch
                            ? 'bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/30'
                            : 'bg-transparent text-[#787b86] border-[#2a2e39] hover:text-white'
                        }`}
                        title={inWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        {inWatch ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
