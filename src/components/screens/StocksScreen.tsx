import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Check,
  Landmark,
  Sparkles,
  ArrowUpDown,
  Search,
} from 'lucide-react';

export const StocksScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'volumeNum' | 'marketCapNum'>('marketCapNum');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const allStocks = marketItems.filter((i) => i.assetClass === 'stocks');

  // Magnificent 7 filter symbols
  const mag7Symbols = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];

  const filteredStocks = allStocks
    .filter((stock) => {
      if (categoryFilter === 'Magnificent 7') {
        return mag7Symbols.includes(stock.symbol);
      }
      if (categoryFilter === 'Semiconductors') {
        return stock.category === 'Semiconductors';
      }
      if (categoryFilter === 'Mega Cap') {
        return (stock.marketCapNum || 0) > 200000000000;
      }
      return true;
    })
    .filter((stock) => {
      if (!searchFilter) return true;
      const q = searchFilter.toLowerCase();
      return stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const valA = (a[sortField] as number) || 0;
      const valB = (b[sortField] as number) || 0;
      return sortAsc ? valA - valB : valB - valA;
    });

  const toggleSort = (field: 'price' | 'changePercent' | 'volumeNum' | 'marketCapNum') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#2962ff]" />
            <span>US Stock Market</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            Live quotes, market capitalization, P/E valuations, and analyst technical ratings
          </p>
        </div>

        {/* Quick Search inside Stocks */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#787b86]" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
          />
        </div>
      </div>

      {/* Magnificent Seven Spotlight Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-white dark:text-white light:text-[#131722] uppercase tracking-wider">
            The Magnificent Seven
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {mag7Symbols.map((sym) => {
            const stock = allStocks.find((s) => s.symbol === sym);
            if (!stock) return null;
            const isUp = stock.change >= 0;
            return (
              <div
                key={stock.id}
                onClick={() => openSuperChart(stock.symbol)}
                className="p-3 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:border-[#2962ff] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <SymbolLogo symbol={stock.symbol} logoUrl={stock.logoUrl} size="sm" />
                  <span className="font-bold text-xs text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                    {stock.symbol}
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-white dark:text-white light:text-[#131722] tabular-nums">
                  ${stock.price.toFixed(2)}
                </div>
                <div
                  className={`text-[11px] font-semibold tabular-nums flex items-center gap-0.5 mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </div>
                <div className="text-[10px] text-[#787b86] mt-1 tabular-nums">
                  Cap: {stock.marketCap}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Magnificent 7', 'Mega Cap', 'Semiconductors'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#2962ff] text-white shadow-xs'
                : 'bg-[#1e222d] dark:bg-[#1e222d] light:bg-white text-[#787b86] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Stock Screener Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Symbol & Name</th>
                <th className="py-2.5 px-3 font-semibold">Sector</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('changePercent')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('volumeNum')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('marketCapNum')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold text-right hidden lg:table-cell">P/E Ratio</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden md:table-cell">Technical</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden xl:table-cell">Trend (7D)</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredStocks.map((stock) => {
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
                          <span className="text-[11px] text-[#787b86] block truncate max-w-[150px]">
                            {stock.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#787b86] font-medium">{stock.sector || stock.category}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {stock.volume}
                    </td>

                    <td className="py-3 px-3 text-right text-white dark:text-white light:text-[#131722] font-mono tabular-nums hidden md:table-cell">
                      {stock.marketCap}
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden lg:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
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

                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (inWatch) removeFromWatchlist(stock.symbol);
                          else addToWatchlist(stock.symbol);
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
