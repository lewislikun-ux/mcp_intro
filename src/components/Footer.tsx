import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Globe, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useMarket();

  return (
    <footer className="w-full border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] bg-[#131722] dark:bg-[#131722] light:bg-[#f8f9fd] text-[#787b86] pt-12 pb-8 mt-12">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-6 bg-[#2962ff] rounded-xs transform -skew-x-6" />
                <div className="w-2.5 h-4 bg-[#089981] rounded-xs transform -skew-x-6 self-end" />
                <div className="w-2.5 h-5 bg-[#d1d4dc] dark:bg-white light:bg-[#131722] rounded-xs transform -skew-x-6 self-center" />
              </div>
              <span className="text-base font-bold text-white dark:text-white light:text-[#131722]">
                TradingView
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Look first / Then leap. A super-charting platform and global social network for traders and investors. Real-time market data across stocks, crypto, forex, futures, and sovereign bonds.
            </p>
          </div>

          {/* Markets Col */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white dark:text-white light:text-[#131722] mb-3">
              Markets
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('indices')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  World Indices
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stocks')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  US Stocks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('crypto')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Crypto Prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('forex')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Forex Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('futures')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Commodities & Futures
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bonds')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Treasury Yields
                </button>
              </li>
            </ul>
          </div>

          {/* Tools Col */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white dark:text-white light:text-[#131722] mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('heatmaps')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Stock Heatmaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('screener')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Stock Screener
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Economic Calendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stocks')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Paper Trading Simulation
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Policies Col */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white dark:text-white light:text-[#131722] mb-3">
              Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white cursor-pointer">Terms of Use</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Market Data Disclaimer</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Security Tips</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-[#2a2e39] text-[11px] leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="max-w-3xl">
            Select market data provided by institutional exchanges. Quotes are updated in real-time. Trading in financial markets involves substantial risk and is not suitable for every investor.
          </p>
          <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#089981]" />
            <span>TradingView Markets Applet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
