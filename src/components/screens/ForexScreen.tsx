import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Plus, Check, Gauge } from 'lucide-react';

export const ForexScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const forexPairs = marketItems.filter((i) => i.assetClass === 'forex');

  // Forex Cross Rates Matrix symbols
  const matrixCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];

  // Base exchange rates relative to USD
  const usdRates: Record<string, number> = {
    USD: 1.0,
    EUR: 1.0965,
    GBP: 1.3075,
    JPY: 0.006738, // 1 USD = 148.42 JPY
    AUD: 0.6735,
    CAD: 0.7328, // 1 USD = 1.3645 CAD
    CHF: 1.1655, // 1 USD = 0.8580 CHF
  };

  // Currency strength index
  const currencyStrength = [
    { currency: 'USD', strength: 78, bias: 'Bullish' },
    { currency: 'JPY', strength: 71, bias: 'Bullish' },
    { currency: 'CHF', strength: 65, bias: 'Moderate' },
    { currency: 'EUR', strength: 48, bias: 'Neutral' },
    { currency: 'GBP', strength: 44, bias: 'Neutral' },
    { currency: 'CAD', strength: 38, bias: 'Bearish' },
    { currency: 'AUD', strength: 29, bias: 'Bearish' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#2962ff]" />
            <span>Forex Market</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            24-hour foreign currency exchange rates, cross-rate matrix, and currency strength meters
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#787b86]">Market:</span>
          <span className="px-2.5 py-1 rounded-md bg-[#089981]/15 text-[#089981] font-bold">
            24/5 Active Global Trading
          </span>
        </div>
      </div>

      {/* 2. Currency Strength Bar & Interactive Cross-Rates Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Forex Cross-Rates Matrix */}
        <div className="lg:col-span-2 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
                Forex Cross Rates Matrix
              </h2>
              <p className="text-xs text-[#787b86]">
                Instant cross rates: row currency divided by column currency
              </p>
            </div>
            <span className="text-[10px] text-[#787b86]">Live Institutional Spreads</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86]">
                  <th className="p-2 text-left font-bold text-white dark:text-white light:text-[#131722]">
                    Base \ Quote
                  </th>
                  {matrixCurrencies.map((c) => (
                    <th key={c} className="p-2 font-bold text-white dark:text-white light:text-[#131722]">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/50 dark:divide-[#2a2e39]/50 light:divide-[#e0e3eb]">
                {matrixCurrencies.map((base) => (
                  <tr key={base} className="hover:bg-white/5 transition-colors">
                    <td className="p-2 text-left font-bold text-white dark:text-white light:text-[#131722] bg-[#131722]/40 dark:bg-[#131722]/40 light:bg-[#f0f3fa]">
                      {base}
                    </td>
                    {matrixCurrencies.map((quote) => {
                      if (base === quote) {
                        return (
                          <td key={quote} className="p-2 font-mono text-[#787b86] bg-black/10">
                            1.0000
                          </td>
                        );
                      }
                      const rate = usdRates[base] / usdRates[quote];
                      const formatted = rate > 50 ? rate.toFixed(2) : rate.toFixed(4);
                      const isHigh = rate > 1;

                      return (
                        <td
                          key={quote}
                          onClick={() => {
                            const pair = `${base}${quote}`;
                            openSuperChart(pair);
                          }}
                          className={`p-2 font-mono font-medium tabular-nums cursor-pointer hover:bg-[#2962ff]/20 transition-colors ${
                            isHigh ? 'text-[#089981]' : 'text-neutral-300 dark:text-neutral-300 light:text-neutral-700'
                          }`}
                          title={`Inspect ${base}/${quote}`}
                        >
                          {formatted}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Currency Strength Index */}
        <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#2962ff]" />
                  <span>Currency Strength Meter</span>
                </h2>
                <p className="text-xs text-[#787b86]">Relative purchasing momentum</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {currencyStrength.map((item) => (
                <div key={item.currency} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white dark:text-white light:text-[#131722]">
                      {item.currency}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold ${
                          item.strength > 60
                            ? 'text-[#089981]'
                            : item.strength < 40
                            ? 'text-[#f23645]'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.bias}
                      </span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {item.strength}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.strength > 60
                          ? 'bg-[#089981]'
                          : item.strength < 40
                          ? 'bg-[#f23645]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.strength}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[11px] text-[#787b86]">
            Aggregated across multi-timeframe moving averages & relative RSI oscillators.
          </div>
        </div>
      </div>

      {/* 3. Major Forex Pairs Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
            Major & Cross Currency Quotes
          </h2>
          <span className="text-xs text-[#787b86]">Quotes in standard pip decimals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Pair & Name</th>
                <th className="py-2.5 px-3 font-semibold text-right">Bid / Rate</th>
                <th className="py-2.5 px-3 font-semibold text-right">Pip Change</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change %</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h High</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h Low</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden md:table-cell">Technical</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">7D Chart</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {forexPairs.map((fx) => {
                const isUp = fx.change >= 0;
                const inWatch = isInWatchlist(fx.symbol);
                return (
                  <tr
                    key={fx.id}
                    onClick={() => openSuperChart(fx.symbol)}
                    className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={fx.symbol} logoUrl={fx.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {fx.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">{fx.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      {fx.price.toFixed(4)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {fx.change.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}
                        {fx.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {fx.high24h.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {fx.low24h.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <RatingBadge rating={fx.technicalRating} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <div className="w-20 mx-auto">
                        <Sparkline
                          data={fx.history}
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
                          if (inWatch) removeFromWatchlist(fx.symbol);
                          else addToWatchlist(fx.symbol);
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
