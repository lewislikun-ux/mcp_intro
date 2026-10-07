import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Search, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, marketItems, openSuperChart } = useMarket();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const results = query.trim()
    ? marketItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.symbol.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.assetClass.toLowerCase().includes(q)
        );
      })
    : marketItems.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input box */}
        <div className="p-3.5 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] flex items-center gap-3 bg-[#131722]/80">
          <Search className="w-4 h-4 text-[#2962ff]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by symbol, company, or asset class (e.g. NVDA, Bitcoin, Oil, S&P 500)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm font-medium text-white dark:text-white light:text-[#131722] placeholder-[#787b86] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded text-[#787b86] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
          <div className="px-4 py-2 text-[11px] font-semibold text-[#787b86] bg-black/10">
            {query.trim() ? `Search Results (${results.length})` : 'Popular & Trending Instruments'}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787b86]">
              No instruments found matching "{query}".
            </div>
          ) : (
            results.map((item) => {
              const isUp = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    openSuperChart(item.symbol);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-3 px-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <SymbolLogo symbol={item.symbol} logoUrl={item.logoUrl} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                          {item.assetClass}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#787b86] block truncate max-w-xs">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-white dark:text-white light:text-[#131722] tabular-nums">
                      ${item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[10px] font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{isUp ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 px-4 bg-[#131722] border-t border-[#2a2e39] text-[10px] text-[#787b86] flex justify-between items-center">
          <span>Press ESC to close</span>
          <span>Click any symbol to open SuperChart</span>
        </div>
      </div>
    </div>
  );
};
