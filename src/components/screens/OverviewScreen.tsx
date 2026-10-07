import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { sectorData, newsArticles, economicEvents } from '../../data/marketData';
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink,
  Plus,
  Check,
  TrendingUp,
  LayoutGrid,
  Newspaper,
  Calendar,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

export const OverviewScreen: React.FC = () => {
  const {
    marketItems,
    openSuperChart,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    setActiveTab,
  } = useMarket();

  const [moversTab, setMoversTab] = useState<'active' | 'gainers' | 'losers' | 'volatile'>('active');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Key hero symbols
  const heroSymbols = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'CL1!', 'US10Y'];
  const heroItems = heroSymbols
    .map((sym) => marketItems.find((i) => i.symbol === sym))
    .filter(Boolean);

  // Market movers categorization
  const stockItems = marketItems.filter((i) => i.assetClass === 'stocks');

  const getMovers = () => {
    switch (moversTab) {
      case 'gainers':
        return [...stockItems].sort((a, b) => b.changePercent - a.changePercent).slice(0, 8);
      case 'losers':
        return [...stockItems].sort((a, b) => a.changePercent - b.changePercent).slice(0, 8);
      case 'volatile':
        return [...stockItems]
          .sort((a, b) => (b.high24h - b.low24h) / b.low24h - (a.high24h - a.low24h) / a.low24h)
          .slice(0, 8);
      case 'active':
      default:
        return [...stockItems].sort((a, b) => b.volumeNum - a.volumeNum).slice(0, 8);
    }
  };

  const movers = getMovers();

  // World indices preview
  const worldIndices = marketItems.filter((i) => i.assetClass === 'indices');

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Market Status Bar & Global Trading Sessions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#089981] animate-ping" />
          <div>
            <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
              <span>Markets Today</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#089981]/15 text-[#089981]">
                Regular Trading Hours
              </span>
            </h1>
            <p className="text-xs text-[#787b86]">
              Real-time quotes, sector momentum, and cross-asset flow
            </p>
          </div>
        </div>

        {/* Global Market Sessions Clock */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#787b86] flex items-center gap-1 mr-1">
            <Clock className="w-3.5 h-3.5" /> Sessions:
          </span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="font-medium text-white dark:text-white light:text-[#131722]">New York</span>
            <span className="text-[10px] text-[#089981]">Open</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            <span className="font-medium text-[#787b86]">London</span>
            <span className="text-[10px] text-neutral-400">Closed</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            <span className="font-medium text-[#787b86]">Tokyo</span>
            <span className="text-[10px] text-neutral-400">Closed</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="font-medium text-white dark:text-white light:text-[#131722]">Sydney</span>
            <span className="text-[10px] text-[#089981]">Open</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Ticker Cards Grid (Key Benchmarks) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722] uppercase tracking-wider text-xs">
            Core Global Benchmarks
          </h2>
          <span className="text-xs text-[#787b86]">Click card to inspect interactive chart</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {heroItems.map((item) => {
            if (!item) return null;
            const isUp = item.change >= 0;
            const flashClass =
              item.lastUpdateDirection === 'up'
                ? 'flash-up'
                : item.lastUpdateDirection === 'down'
                ? 'flash-down'
                : '';

            return (
              <div
                key={item.id}
                onClick={() => openSuperChart(item.symbol)}
                className={`p-3.5 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:border-[#2962ff] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ${flashClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <SymbolLogo symbol={item.symbol} logoUrl={item.logoUrl} size="sm" />
                      <div className="truncate">
                        <span className="font-bold text-xs text-white dark:text-white light:text-[#131722] block truncate group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] text-[#787b86] truncate block">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-[#787b86] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>

                  {/* Price & Change */}
                  <div className="mt-1">
                    <div className="text-base font-bold font-mono text-white dark:text-white light:text-[#131722] tabular-nums">
                      {item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold tabular-nums mt-0.5 ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>
                        {isUp ? '+' : ''}
                        {item.change < 5 && item.change > -5 ? item.change.toFixed(3) : item.change.toFixed(2)}
                      </span>
                      <span>
                        ({isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sparkline & Range */}
                <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 dark:border-[#2a2e39]/60 light:border-[#e0e3eb]/60">
                  <div className="h-9 w-full flex items-center justify-center">
                    <Sparkline
                      data={item.history}
                      isPositive={isUp}
                      width={180}
                      height={34}
                      className="w-full"
                    />
                  </div>

                  {/* Day range bar */}
                  <div className="mt-2 text-[10px] text-[#787b86]">
                    <div className="flex justify-between items-center tabular-nums">
                      <span>L: {item.low24h.toFixed(2)}</span>
                      <span>H: {item.high24h.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              ((item.price - item.low24h) /
                                (item.high24h - item.low24h || 1)) *
                                100,
                              5
                            ),
                            95
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Market Movers Section (TradingView Style Tabs) & S&P 500 Heatmap Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Market Movers Table */}
        <div className="xl:col-span-2 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
                US Market Movers
              </h2>
              <p className="text-xs text-[#787b86]">
                Stocks experiencing extreme volume, price momentum, or active order flow
              </p>
            </div>

            {/* Movers Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <button
                onClick={() => setMoversTab('active')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  moversTab === 'active'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Most Active
              </button>
              <button
                onClick={() => setMoversTab('gainers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  moversTab === 'gainers'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoversTab('losers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  moversTab === 'losers'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoversTab('volatile')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  moversTab === 'volatile'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Most Volatile
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                  <th className="py-2.5 px-3 font-semibold">Symbol & Name</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Change %</th>
                  <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">Volume</th>
                  <th className="py-2.5 px-3 font-semibold text-right hidden md:table-cell">Market Cap</th>
                  <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">Technical</th>
                  <th className="py-2.5 px-3 font-semibold text-center hidden xl:table-cell">7D Trend</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
                {movers.map((stock) => {
                  const isUp = stock.change >= 0;
                  const inWatch = isInWatchlist(stock.symbol);
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => openSuperChart(stock.symbol)}
                      className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <SymbolLogo symbol={stock.symbol} logoUrl={stock.logoUrl} size="sm" />
                          <div>
                            <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                              {stock.symbol}
                            </span>
                            <span className="text-[11px] text-[#787b86] block truncate max-w-[140px]">
                              {stock.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-white dark:text-white light:text-[#131722]">
                        ${stock.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                            isUp
                              ? 'text-[#089981] bg-[#089981]/10'
                              : 'text-[#f23645] bg-[#f23645]/10'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                        {stock.volume}
                      </td>

                      <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden md:table-cell">
                        {stock.marketCap || '—'}
                      </td>

                      <td className="py-3 px-3 text-center hidden lg:table-cell">
                        <RatingBadge rating={stock.technicalRating} size="sm" />
                      </td>

                      <td className="py-3 px-3 text-center hidden xl:table-cell">
                        <div className="w-20 mx-auto">
                          <Sparkline
                            data={stock.history}
                            isPositive={isUp}
                            width={80}
                            height={22}
                            showArea={false}
                          />
                        </div>
                      </td>

                      <td
                        className="py-3 px-2 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            if (inWatch) removeFromWatchlist(stock.symbol);
                            else addToWatchlist(stock.symbol);
                          }}
                          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                            inWatch
                              ? 'bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/30'
                              : 'bg-transparent text-[#787b86] border-[#2a2e39] hover:text-white hover:border-white/30'
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

          <div className="mt-4 pt-3 border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] flex justify-between items-center text-xs">
            <span className="text-[#787b86]">Showing top movers by market volatility & liquidity</span>
            <button
              onClick={() => setActiveTab('stocks')}
              className="text-[#2962ff] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all stocks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Sector Performance Matrix & Treemap Preview */}
        <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-[#2962ff]" />
                  <span>S&P 500 Sector Heatmap</span>
                </h2>
                <p className="text-xs text-[#787b86]">Daily sector rotation & breadth</p>
              </div>
              <button
                onClick={() => setActiveTab('heatmaps')}
                className="text-xs text-[#2962ff] hover:underline font-semibold cursor-pointer"
              >
                Full Heatmap
              </button>
            </div>

            {/* Treemap mini preview tiles */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sectorData.slice(0, 6).map((sector) => {
                const isPos = sector.changePercent >= 0;
                return (
                  <div
                    key={sector.name}
                    onClick={() => setActiveTab('heatmaps')}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isPos
                        ? 'bg-[#089981]/10 border-[#089981]/25 hover:bg-[#089981]/20'
                        : 'bg-[#f23645]/10 border-[#f23645]/25 hover:bg-[#f23645]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-xs text-white dark:text-white light:text-[#131722] truncate">
                        {sector.name}
                      </span>
                      <span
                        className={`text-xs font-bold font-mono tabular-nums shrink-0 ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {sector.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#787b86] mt-1">
                      <span>Cap: {sector.marketCap}</span>
                      <span className="truncate max-w-[80px]">{sector.topStock}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sector Progress Bars */}
            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold text-[#787b86] block mb-2">
                All Sectors Performance
              </span>
              {sectorData.slice(0, 5).map((sec) => (
                <div key={sec.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                      {sec.name}
                    </span>
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        sec.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {sec.changePercent >= 0 ? '+' : ''}
                      {sec.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${
                        sec.changePercent >= 0 ? 'bg-[#089981]' : 'bg-[#f23645]'
                      }`}
                      style={{
                        width: `${Math.min(Math.abs(sec.changePercent) * 25, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <button
              onClick={() => setActiveTab('heatmaps')}
              className="w-full py-2 px-3 rounded-lg bg-[#2962ff]/10 text-[#2962ff] hover:bg-[#2962ff]/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Launch Interactive S&P 500 Heatmap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Global Market Indices Summary & News + Calendar Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Indices Table */}
        <div className="lg:col-span-2 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
                Global Indices Overview
              </h2>
              <p className="text-xs text-[#787b86]">
                Major benchmarks across Americas, Europe, and Asia-Pacific
              </p>
            </div>
            <button
              onClick={() => setActiveTab('indices')}
              className="text-xs text-[#2962ff] hover:underline font-semibold cursor-pointer"
            >
              View All Indices
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {worldIndices.map((idx) => {
              const isUp = idx.change >= 0;
              return (
                <div
                  key={idx.id}
                  onClick={() => openSuperChart(idx.symbol)}
                  className="p-3 rounded-lg bg-[#131722]/60 dark:bg-[#131722]/60 light:bg-[#f8f9fd] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:border-[#2962ff] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <SymbolLogo symbol={idx.symbol} logoUrl={idx.logoUrl} size="sm" />
                    <div>
                      <span className="font-bold text-xs text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                        {idx.symbol}
                      </span>
                      <span className="text-[11px] text-[#787b86] block">{idx.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-white dark:text-white light:text-[#131722] tabular-nums">
                      {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {idx.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Breaking News & Economic Events stream */}
        <div className="space-y-6">
          {/* Breaking News Card */}
          <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-[#2962ff]" />
                <span>Market Headlines</span>
              </h2>
              <span className="text-[11px] text-[#787b86]">Real-time wire</span>
            </div>

            <div className="space-y-3">
              {newsArticles.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  className="pb-3 border-b border-[#2a2e39]/60 dark:border-[#2a2e39]/60 light:border-[#e0e3eb]/60 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 text-[10px] text-[#787b86] mb-1">
                    <span className="font-medium text-[#2962ff]">{news.source}</span>
                    <span>·</span>
                    <span>{news.timeAgo}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-white dark:text-white light:text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer leading-snug">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {news.symbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => openSuperChart(sym)}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] text-neutral-300 hover:text-[#2962ff] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] cursor-pointer"
                      >
                        ${sym}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Calendar Snippet */}
          <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#089981]" />
                <span>Key Events Today</span>
              </h2>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-[#2962ff] hover:underline font-semibold cursor-pointer"
              >
                Full Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {economicEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#131722]/40 dark:bg-[#131722]/40 light:bg-[#f8f9fd] border border-[#2a2e39]/60 dark:border-[#2a2e39]/60 light:border-[#e0e3eb]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white dark:text-white light:text-[#131722]">
                      <span className="text-[10px] px-1 py-0.2 rounded bg-red-500/15 text-red-400 font-bold">
                        {evt.countryCode}
                      </span>
                      <span>{evt.event}</span>
                    </div>
                    <span className="text-[10px] text-[#787b86]">{evt.time}</span>
                  </div>

                  <div className="text-right text-xs font-mono">
                    <span className="font-bold text-white dark:text-white light:text-[#131722]">
                      {evt.actual}
                    </span>
                    <span className="text-[10px] text-[#787b86] block">
                      Exp: {evt.forecast}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
