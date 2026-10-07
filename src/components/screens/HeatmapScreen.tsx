import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { LayoutGrid, Coins, Maximize2, Sparkles, Filter } from 'lucide-react';

export const HeatmapScreen: React.FC = () => {
  const { marketItems, openSuperChart } = useMarket();
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');

  const stockItems = marketItems.filter((i) => i.assetClass === 'stocks');
  const cryptoItems = marketItems.filter((i) => i.assetClass === 'crypto');

  const currentItems = heatmapType === 'stocks' ? stockItems : cryptoItems;

  // Function to return TradingView gradient block color
  const getBlockColor = (pct: number) => {
    if (pct >= 4.0) return 'bg-[#089981] text-white';
    if (pct >= 2.0) return 'bg-[#089981]/85 text-white';
    if (pct >= 0.5) return 'bg-[#089981]/60 text-white';
    if (pct >= 0.0) return 'bg-[#089981]/30 text-white';
    if (pct > -1.0) return 'bg-[#f23645]/30 text-white';
    if (pct > -3.0) return 'bg-[#f23645]/70 text-white';
    return 'bg-[#f23645] text-white';
  };

  // Group items by sector/category
  const grouped = currentItems.reduce<Record<string, typeof currentItems>>((acc, item) => {
    const key = item.sector || item.category || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#2962ff]" />
            <span>Interactive Market Heatmap</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            Visual treemap scaled by market capitalization and colored by relative performance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Heatmap Type Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            <button
              onClick={() => setHeatmapType('stocks')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                heatmapType === 'stocks'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              <span>S&P 500 Stocks</span>
            </button>
            <button
              onClick={() => setHeatmapType('crypto')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                heatmapType === 'crypto'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crypto 50</span>
            </button>
          </div>

          {/* Timeframe switch */}
          <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
            {(['1D', '1W', '1M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white/15 text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-xs">
        <span className="text-[#787b86] text-[11px]">Size: Market Cap</span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-[#f23645] font-bold">-3%</span>
          <div className="flex h-3.5 rounded overflow-hidden">
            <span className="w-6 bg-[#f23645]" />
            <span className="w-6 bg-[#f23645]/70" />
            <span className="w-6 bg-[#f23645]/30" />
            <span className="w-6 bg-neutral-600/40" />
            <span className="w-6 bg-[#089981]/30" />
            <span className="w-6 bg-[#089981]/70" />
            <span className="w-6 bg-[#089981]" />
          </div>
          <span className="text-[#089981] font-bold">+3%</span>
        </div>
        <span className="text-[#787b86] text-[11px]">Click block to launch SuperChart</span>
      </div>

      {/* The Treemap Visual Canvas */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([sectorName, items]) => (
          <div
            key={sectorName}
            className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-3"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-neutral-300 dark:text-neutral-300 light:text-neutral-700 tracking-wide">
                {sectorName}
              </span>
              <span className="text-[10px] text-[#787b86]">
                {items.length} {items.length === 1 ? 'component' : 'components'}
              </span>
            </div>

            {/* Treemap Block Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 min-h-[120px]">
              {items.map((item) => {
                const colorClass = getBlockColor(item.changePercent);
                const isMega = (item.marketCapNum || 0) > 1000000000000;

                return (
                  <div
                    key={item.id}
                    onClick={() => openSuperChart(item.symbol)}
                    className={`${colorClass} ${
                      isMega ? 'sm:col-span-2 sm:row-span-2 min-h-[140px]' : 'min-h-[90px]'
                    } rounded-lg p-3 flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-transform shadow-sm relative group overflow-hidden border border-black/15`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm sm:text-base tracking-tight font-mono">
                          {item.symbol}
                        </span>
                        <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] opacity-80 block truncate max-w-[120px]">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right mt-2">
                      <div className="text-base sm:text-lg font-black font-mono tracking-tight tabular-nums">
                        {item.changePercent >= 0 ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                      <div className="text-[11px] font-mono opacity-90 tabular-nums">
                        ${item.price < 5 ? item.price.toFixed(4) : item.price.toFixed(2)}
                      </div>
                      <div className="text-[10px] opacity-75 tabular-nums">
                        Cap: {item.marketCap}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
