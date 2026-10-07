import React from 'react';
import {
  Search,
  Bookmark,
  Sun,
  Moon,
  Radio,
  TrendingUp,
  SlidersHorizontal,
  Bell,
  ChevronDown,
  Wallet,
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const Header: React.FC = () => {
  const {
    isLiveActive,
    toggleLiveActive,
    theme,
    toggleTheme,
    setIsSearchModalOpen,
    toggleWatchlistOpen,
    watchlist,
    cashBalance,
    positions,
    activeTab,
    setActiveTab,
  } = useMarket();

  // Calculate total portfolio value
  const totalPositionValue = positions.reduce((acc, p) => acc + p.currentPrice * p.shares, 0);
  const totalPortfolio = cashBalance + totalPositionValue;
  const totalPnL = positions.reduce((acc, p) => acc + p.pnl, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2e39] bg-[#131722]/95 backdrop-blur-md dark:border-[#2a2e39] dark:bg-[#131722]/95 light:border-[#e0e3eb] light:bg-[#ffffff]/95 transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: TradingView Brand & Global Category */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            aria-label="TradingView Markets Home"
          >
            {/* Authentic TradingView Logo Icon */}
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-6 bg-[#2962ff] rounded-xs transform -skew-x-6" />
              <div className="w-2.5 h-4 bg-[#089981] rounded-xs transform -skew-x-6 self-end" />
              <div className="w-2.5 h-5 bg-[#d1d4dc] dark:bg-white light:bg-[#131722] rounded-xs transform -skew-x-6 self-center" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white dark:text-white light:text-[#131722]">
                TradingView
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#2962ff]/15 text-[#2962ff] uppercase tracking-wider">
                Markets
              </span>
            </div>
          </button>

          {/* Primary Nav Menu (TradingView Style) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-[#787b86] dark:text-[#787b86] light:text-[#5d606b]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-white dark:hover:text-white light:hover:text-[#131722] transition-colors ${
                activeTab === 'overview' ? 'text-white dark:text-white font-semibold' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stocks')}
              className={`hover:text-white dark:hover:text-white light:hover:text-[#131722] transition-colors ${
                activeTab === 'stocks' ? 'text-white dark:text-white font-semibold' : ''
              }`}
            >
              SuperCharts
            </button>
            <button
              onClick={() => setActiveTab('screener')}
              className={`hover:text-white dark:hover:text-white light:hover:text-[#131722] transition-colors ${
                activeTab === 'screener' ? 'text-white dark:text-white font-semibold' : ''
              }`}
            >
              Screeners
            </button>
            <button
              onClick={() => setActiveTab('heatmaps')}
              className={`hover:text-white dark:hover:text-white light:hover:text-[#131722] transition-colors ${
                activeTab === 'heatmaps' ? 'text-white dark:text-white font-semibold' : ''
              }`}
            >
              Heatmaps
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`hover:text-white dark:hover:text-white light:hover:text-[#131722] transition-colors ${
                activeTab === 'calendar' ? 'text-white dark:text-white font-semibold' : ''
              }`}
            >
              Calendars
            </button>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white dark:hover:text-white light:hover:text-[#131722]">
              <span>Community</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </div>
          </nav>
        </div>

        {/* Zone 2: Universal Search Bar (Cmd+K) */}
        <div className="flex-1 max-w-xl mx-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full h-9 px-3.5 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] hover:border-[#2962ff] text-left text-xs text-[#787b86] flex items-center justify-between transition-colors group cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-3.5 h-3.5 text-[#787b86] group-hover:text-[#2962ff] transition-colors shrink-0" />
              <span className="truncate">Search markets, symbols, news (e.g. NVDA, BTC, S&P 500)...</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#131722] dark:bg-[#131722] light:bg-white text-[#787b86] rounded border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#d1d4dc]">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Zone 3: Market Status, Paper Trading & User Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Data Ticking Status Pill */}
          <button
            onClick={toggleLiveActive}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              isLiveActive
                ? 'bg-[#089981]/10 text-[#089981] border-[#089981]/30 hover:bg-[#089981]/15'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
            }`}
            title={isLiveActive ? 'Live streaming active (click to pause)' : 'Paused (click to resume)'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveActive ? 'bg-[#089981] animate-ping' : 'bg-neutral-500'
              }`}
            />
            <span className="whitespace-nowrap">{isLiveActive ? 'Live Streaming' : 'Paused'}</span>
          </button>

          {/* Paper Portfolio Mini Display */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-xs tabular-nums cursor-pointer"
            onClick={() => setActiveTab('stocks')}
            title="Simulated Paper Trading Account"
          >
            <Wallet className="w-3.5 h-3.5 text-[#2962ff]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[#787b86]">Paper:</span>
              <span className="font-semibold text-white dark:text-white light:text-[#131722]">
                ${totalPortfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {totalPnL !== 0 && (
                <span
                  className={`text-[11px] font-semibold ${
                    totalPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  ({totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)})
                </span>
              )}
            </div>
          </div>

          {/* Watchlist Toggle Button */}
          <button
            onClick={toggleWatchlistOpen}
            className="relative p-2 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#d1d4dc] dark:text-[#d1d4dc] light:text-[#131722] hover:text-[#2962ff] hover:border-[#2962ff] transition-colors cursor-pointer"
            title="Open Watchlist & Alerts Panel"
            aria-label="Toggle Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2962ff] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#d1d4dc] dark:text-[#d1d4dc] light:text-[#131722] hover:text-[#2962ff] hover:border-[#2962ff] transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2962ff] to-[#089981] flex items-center justify-center text-white font-semibold text-xs border border-white/20 shadow-sm cursor-pointer hover:opacity-90">
              TV
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
