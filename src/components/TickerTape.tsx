import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { marketItems, openSuperChart } = useMarket();

  // Select top tickers for the tape
  const tapeSymbols = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'CL1!', 'GC1!', 'EURUSD', 'US10Y', 'NVDA', 'AAPL', 'TSLA'];
  const items = tapeSymbols
    .map((sym) => marketItems.find((i) => i.symbol === sym))
    .filter(Boolean);

  // Duplicate items for continuous seamless scroll
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#ffffff] border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] overflow-hidden py-1.5 select-none relative z-30">
      <div className="animate-marquee flex items-center gap-6">
        {duplicatedItems.map((item, idx) => {
          if (!item) return null;
          const isUp = item.change >= 0;
          const flashClass =
            item.lastUpdateDirection === 'up'
              ? 'flash-up'
              : item.lastUpdateDirection === 'down'
              ? 'flash-down'
              : '';

          return (
            <button
              key={`${item.symbol}-${idx}`}
              onClick={() => openSuperChart(item.symbol)}
              className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-white/5 whitespace-nowrap text-xs tabular-nums group ${flashClass}`}
            >
              <span className="font-semibold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                {item.symbol}
              </span>
              <span className="text-[#d1d4dc] dark:text-[#d1d4dc] light:text-[#434651] font-mono">
                {item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div
                className={`flex items-center gap-0.5 font-medium ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 shrink-0" />
                )}
                <span>
                  {isUp ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
