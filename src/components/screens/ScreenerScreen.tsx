import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { AssetClass, TechnicalRating } from '../../types/market';
import {
  Filter,
  Download,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Check,
  Search,
  RotateCcw,
} from 'lucide-react';

export const ScreenerScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  // Filters
  const [assetFilter, setAssetFilter] = useState<string>('all');
  const [perfFilter, setPerfFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'volumeNum'>('changePercent');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredItems = marketItems
    .filter((item) => {
      if (assetFilter !== 'all' && item.assetClass !== assetFilter) return false;
      if (ratingFilter !== 'all' && item.technicalRating !== ratingFilter) return false;
      if (perfFilter === 'gainers' && item.changePercent <= 1.0) return false;
      if (perfFilter === 'extremeGainers' && item.changePercent <= 3.5) return false;
      if (perfFilter === 'losers' && item.changePercent >= -0.5) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.symbol.toLowerCase().includes(q) && !item.name.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const valA = (a[sortField] as number) || 0;
      const valB = (b[sortField] as number) || 0;
      return sortAsc ? valA - valB : valB - valA;
    });

  const toggleSort = (field: 'price' | 'changePercent' | 'volumeNum') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const resetFilters = () => {
    setAssetFilter('all');
    setPerfFilter('all');
    setRatingFilter('all');
    setSearchQuery('');
  };

  // Export filtered items to CSV
  const exportToCSV = () => {
    const headers = ['Symbol', 'Name', 'Asset Class', 'Price', 'Change %', 'Volume', 'Rating'];
    const rows = filteredItems.map((i) => [
      i.symbol,
      `"${i.name}"`,
      i.assetClass,
      i.price,
      i.changePercent,
      i.volume,
      i.technicalRating,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradingview_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Screener Header & Filter Toolbar */}
      <div className="p-4 lg:p-5 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#2962ff]" />
              <span>Multi-Asset Market Screener</span>
            </h1>
            <p className="text-xs text-[#787b86]">
              Filter global instruments by performance thresholds, technical ratings, and trading activity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg bg-[#2962ff] text-white hover:bg-[#1e4bd8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] text-[#787b86] hover:text-white border border-[#2a2e39] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
          {/* Asset Class Filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#787b86] block mb-1">Asset Class</label>
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
            >
              <option value="all">All Asset Classes</option>
              <option value="stocks">Stocks</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="forex">Forex</option>
              <option value="futures">Futures</option>
              <option value="indices">Indices</option>
              <option value="bonds">Bonds</option>
            </select>
          </div>

          {/* Performance Filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#787b86] block mb-1">Performance %</label>
            <select
              value={perfFilter}
              onChange={(e) => setPerfFilter(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
            >
              <option value="all">Any Performance</option>
              <option value="gainers">Gainers (&gt; +1.0%)</option>
              <option value="extremeGainers">Extreme Gainers (&gt; +3.5%)</option>
              <option value="losers">Decliners (&lt; -0.5%)</option>
            </select>
          </div>

          {/* Technical Rating Filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#787b86] block mb-1">Technical Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Neutral">Neutral</option>
              <option value="Sell">Sell</option>
              <option value="Strong Sell">Strong Sell</option>
            </select>
          </div>

          {/* Text Search */}
          <div>
            <label className="text-[11px] font-semibold text-[#787b86] block mb-1">Symbol Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#787b86]" />
              <input
                type="text"
                placeholder="e.g. NVDA, BTC, Gold..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Results Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-[#787b86]">
            Showing <strong className="text-white dark:text-white light:text-[#131722]">{filteredItems.length}</strong> matching instruments
          </span>
          <span className="text-[#787b86]">Sorted by {sortField} ({sortAsc ? 'Ascending' : 'Descending'})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Instrument</th>
                <th className="py-2.5 px-3 font-semibold">Asset Class</th>
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
                <th className="py-2.5 px-3 font-semibold text-right hidden md:table-cell">24h High</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden md:table-cell">24h Low</th>
                <th className="py-2.5 px-3 font-semibold text-center">Rating</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden lg:table-cell">7D Chart</th>
                <th className="py-2.5 px-2 text-right">Watchlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredItems.map((item) => {
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
                          <span className="text-[11px] text-[#787b86] block truncate max-w-[150px]">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-neutral-800 text-neutral-300">
                        {item.assetClass}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      ${item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      {item.volume}
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden md:table-cell">
                      {item.high24h < 5 ? item.high24h.toFixed(4) : item.high24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right text-[#787b86] font-mono tabular-nums hidden md:table-cell">
                      {item.low24h < 5 ? item.low24h.toFixed(4) : item.low24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
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
