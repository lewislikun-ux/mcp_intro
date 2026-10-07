import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import {
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Check,
  Flame,
  Activity,
  Zap,
} from 'lucide-react';

export const CryptoScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const [cryptoCategory, setCryptoCategory] = useState<string>('All');

  const cryptoItems = marketItems.filter((i) => i.assetClass === 'crypto');

  const filteredCrypto =
    cryptoCategory === 'All'
      ? cryptoItems
      : cryptoItems.filter((c) => c.category === cryptoCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Bar with Global Crypto Metrics */}
      <div className="p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Cryptocurrency Market</span>
            </h1>
            <p className="text-xs text-[#787b86]">
              Real-time prices, market caps, dominance ratios, and decentralized protocol metrics
            </p>
          </div>

          {/* Global Crypto Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs w-full lg:w-auto">
            <div className="p-2 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <span className="text-[10px] text-[#787b86] block">Total Market Cap</span>
              <span className="font-bold font-mono text-white dark:text-white light:text-[#131722]">
                $2.78 Trillion
              </span>
              <span className="text-[10px] text-[#089981] ml-1 font-semibold">+2.4%</span>
            </div>

            <div className="p-2 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <span className="text-[10px] text-[#787b86] block">BTC Dominance</span>
              <span className="font-bold font-mono text-amber-400">58.6%</span>
              <span className="text-[10px] text-[#787b86] ml-1">ETH 13.8%</span>
            </div>

            <div className="p-2 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <span className="text-[10px] text-[#787b86] block">Fear & Greed</span>
              <span className="font-bold text-[#089981] flex items-center gap-1">
                <Flame className="w-3 h-3" /> 74 (Greed)
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <span className="text-[10px] text-[#787b86] block">ETH Gas Tracker</span>
              <span className="font-bold font-mono text-white dark:text-white light:text-[#131722] flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> 14 Gwei
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Layer 1', 'Smart Contracts', 'Payments', 'Meme', 'Oracles / DeFi'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCryptoCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              cryptoCategory === cat
                ? 'bg-[#2962ff] text-white shadow-xs'
                : 'bg-[#1e222d] dark:bg-[#1e222d] light:bg-white text-[#787b86] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Crypto Assets Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Asset</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-right">Price (USD)</th>
                <th className="py-2.5 px-3 font-semibold text-right">24h Change</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h Volume</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden md:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">Technical</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden xl:table-cell">7D Chart</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredCrypto.map((coin) => {
                const isUp = coin.change >= 0;
                const inWatch = isInWatchlist(coin.symbol);
                return (
                  <tr
                    key={coin.id}
                    onClick={() => openSuperChart(coin.symbol)}
                    className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={coin.symbol} logoUrl={coin.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {coin.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">{coin.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#787b86] font-medium">{coin.category}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}
                        {coin.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {coin.volume}
                    </td>

                    <td className="py-3 px-3 text-right text-white dark:text-white light:text-[#131722] font-mono tabular-nums hidden md:table-cell">
                      {coin.marketCap}
                    </td>

                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <RatingBadge rating={coin.technicalRating} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-center hidden xl:table-cell">
                      <div className="w-20 mx-auto">
                        <Sparkline
                          data={coin.history}
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
                          if (inWatch) removeFromWatchlist(coin.symbol);
                          else addToWatchlist(coin.symbol);
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
