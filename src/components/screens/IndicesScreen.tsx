import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { ArrowUpRight, ArrowDownRight, Plus, Check, TrendingUp, BarChart2 } from 'lucide-react';

export const IndicesScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const [regionFilter, setRegionFilter] = useState<'All' | 'Americas' | 'Europe' | 'Asia-Pacific'>(
    'All'
  );

  const indices = marketItems.filter((i) => i.assetClass === 'indices');

  const filteredIndices =
    regionFilter === 'All'
      ? indices
      : indices.filter((i) => i.category === regionFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#2962ff]" />
            <span>World Stock Indices</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            Benchmark indices tracking the performance of major global stock exchanges
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
          {(['All', 'Americas', 'Europe', 'Asia-Pacific'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                regionFilter === r
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Global Performance Leaderboard Bar */}
      <div className="p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <h2 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-3">
          Daily Performance Ranking
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[...indices]
            .sort((a, b) => b.changePercent - a.changePercent)
            .map((idx) => {
              const isUp = idx.changePercent >= 0;
              return (
                <div
                  key={idx.symbol}
                  onClick={() => openSuperChart(idx.symbol)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    isUp
                      ? 'bg-[#089981]/10 border-[#089981]/20 hover:bg-[#089981]/20'
                      : 'bg-[#f23645]/10 border-[#f23645]/20 hover:bg-[#f23645]/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white dark:text-white light:text-[#131722] block truncate">
                    {idx.symbol}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* High Density Indices Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Index Name</th>
                <th className="py-2.5 px-3 font-semibold">Region</th>
                <th className="py-2.5 px-3 font-semibold text-right">Last Value</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change %</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h High</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h Low</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden md:table-cell">Technical</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">Trend (7D)</th>
                <th className="py-2.5 px-2 text-right">Watchlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredIndices.map((idx) => {
                const isUp = idx.change >= 0;
                const inWatch = isInWatchlist(idx.symbol);
                return (
                  <tr
                    key={idx.id}
                    onClick={() => openSuperChart(idx.symbol)}
                    className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={idx.symbol} logoUrl={idx.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {idx.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">{idx.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#787b86] font-medium">{idx.category}</td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3.5 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {idx.change.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp
                            ? 'text-[#089981] bg-[#089981]/10'
                            : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}
                        {idx.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {idx.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {idx.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-3 text-center hidden md:table-cell">
                      <RatingBadge rating={idx.technicalRating} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                      <div className="w-24 mx-auto">
                        <Sparkline
                          data={idx.history}
                          isPositive={isUp}
                          width={90}
                          height={26}
                          showArea={false}
                        />
                      </div>
                    </td>

                    <td
                      className="py-3.5 px-2 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          if (inWatch) removeFromWatchlist(idx.symbol);
                          else addToWatchlist(idx.symbol);
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
