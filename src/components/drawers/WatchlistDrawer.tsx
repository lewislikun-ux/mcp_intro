import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import {
  X,
  Plus,
  Trash2,
  Bookmark,
  Bell,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';

export const WatchlistDrawer: React.FC = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    marketItems,
    openSuperChart,
    removeFromWatchlist,
    addToWatchlist,
    priceAlerts,
    addPriceAlert,
    removePriceAlert,
    positions,
    cashBalance,
  } = useMarket();

  const [activeDrawerTab, setActiveDrawerTab] = useState<'watchlist' | 'alerts' | 'positions'>('watchlist');
  const [newSymbol, setNewSymbol] = useState<string>('');
  const [alertSymbol, setAlertSymbol] = useState<string>('BTCUSD');
  const [alertPrice, setAlertPrice] = useState<string>('65000');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  if (!isWatchlistOpen) return null;

  const watchlistItems = watchlist
    .map((sym) => marketItems.find((i) => i.symbol === sym))
    .filter(Boolean);

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    const exists = marketItems.find(
      (i) => i.symbol.toLowerCase() === newSymbol.trim().toLowerCase()
    );
    if (exists) {
      addToWatchlist(exists.symbol);
      setNewSymbol('');
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(alertPrice);
    if (!price || isNaN(price)) return;
    addPriceAlert(alertSymbol, price, alertCondition);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border-l border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] shadow-2xl flex flex-col animate-slideLeft">
      {/* Top Header of Dock */}
      <div className="px-4 py-3 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] flex items-center justify-between bg-[#131722]/80 dark:bg-[#131722]/80 light:bg-[#f8f9fd]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#2962ff]" />
          <span className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
            Trader Dock
          </span>
        </div>
        <button
          onClick={() => setIsWatchlistOpen(false)}
          className="p-1 rounded text-[#787b86] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-xs font-semibold bg-[#1e222d] dark:bg-[#1e222d] light:bg-white">
        <button
          onClick={() => setActiveDrawerTab('watchlist')}
          className={`py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
            activeDrawerTab === 'watchlist'
              ? 'text-[#2962ff] border-[#2962ff] bg-white/5'
              : 'text-[#787b86] border-transparent hover:text-white'
          }`}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          onClick={() => setActiveDrawerTab('alerts')}
          className={`py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
            activeDrawerTab === 'alerts'
              ? 'text-[#2962ff] border-[#2962ff] bg-white/5'
              : 'text-[#787b86] border-transparent hover:text-white'
          }`}
        >
          Alerts ({priceAlerts.length})
        </button>
        <button
          onClick={() => setActiveDrawerTab('positions')}
          className={`py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
            activeDrawerTab === 'positions'
              ? 'text-[#2962ff] border-[#2962ff] bg-white/5'
              : 'text-[#787b86] border-transparent hover:text-white'
          }`}
        >
          Portfolio ({positions.length})
        </button>
      </div>

      {/* Tab 1: Watchlist Content */}
      {activeDrawerTab === 'watchlist' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Quick add input */}
          <form onSubmit={handleAddSymbol} className="p-3 border-b border-[#2a2e39]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add symbol (e.g. TSLA, SOLUSD)..."
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="flex-1 h-8 px-3 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 h-8 bg-[#2962ff] text-white rounded-lg text-xs font-bold hover:bg-[#1e4bd8] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
            {watchlistItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#787b86]">
                Your watchlist is empty. Add symbols to track live ticks.
              </div>
            ) : (
              watchlistItems.map((item) => {
                if (!item) return null;
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => openSuperChart(item.symbol)}
                    className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <SymbolLogo symbol={item.symbol} logoUrl={item.logoUrl} size="sm" />
                      <div className="truncate">
                        <span className="font-bold text-xs text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] block">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] text-[#787b86] block truncate max-w-[110px]">
                          {item.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-white dark:text-white light:text-[#131722] tabular-nums">
                          ${item.price < 5 ? item.price.toFixed(4) : item.price.toFixed(2)}
                        </div>
                        <div
                          className={`text-[10px] font-semibold tabular-nums ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(item.symbol);
                        }}
                        className="p-1 text-neutral-500 hover:text-[#f23645] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Alerts Content */}
      {activeDrawerTab === 'alerts' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          {/* New Alert Form */}
          <form onSubmit={handleCreateAlert} className="p-3 rounded-xl bg-[#131722] border border-[#2a2e39] space-y-2.5">
            <span className="text-xs font-bold text-white block">Create Price Alert</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-[#787b86] block mb-1">Symbol</label>
                <select
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-[#1e222d] border border-[#2a2e39] text-white text-xs"
                >
                  {marketItems.slice(0, 15).map((i) => (
                    <option key={i.symbol} value={i.symbol}>
                      {i.symbol} (${i.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#787b86] block mb-1">Condition</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full h-8 px-2 rounded bg-[#1e222d] border border-[#2a2e39] text-white text-xs"
                >
                  <option value="above">Crosses Above</option>
                  <option value="below">Falls Below</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#787b86] block mb-1">Target Price ($)</label>
              <input
                type="number"
                step="any"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="w-full h-8 px-2.5 rounded bg-[#1e222d] border border-[#2a2e39] text-white font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 rounded-lg bg-[#2962ff] text-white font-bold text-xs hover:bg-[#1e4bd8] cursor-pointer"
            >
              Set Alert
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <span className="text-[11px] font-semibold text-[#787b86] block">
              Configured Alerts ({priceAlerts.length})
            </span>
            {priceAlerts.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#787b86]">No active alerts set.</div>
            ) : (
              priceAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-2.5 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>{alt.symbol}</span>
                      <span className="text-[10px] px-1 rounded bg-white/10 text-neutral-300">
                        {alt.condition}
                      </span>
                      <span className="font-mono text-[#089981]">${alt.targetPrice}</span>
                    </div>
                    {alt.triggered && (
                      <span className="text-[10px] text-[#089981] flex items-center gap-1 mt-0.5 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Triggered!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removePriceAlert(alt.id)}
                    className="text-neutral-500 hover:text-[#f23645] p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Positions / Portfolio */}
      {activeDrawerTab === 'positions' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          {/* Portfolio Cash Status */}
          <div className="p-3.5 rounded-xl bg-[#131722] border border-[#2a2e39]">
            <span className="text-[10px] text-[#787b86] block">Available Cash Balance</span>
            <span className="text-lg font-bold font-mono text-white">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <span className="text-[11px] font-semibold text-[#787b86] block">
              Open Positions ({positions.length})
            </span>
            {positions.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#787b86]">
                No active positions. Execute a trade in the SuperChart modal.
              </div>
            ) : (
              positions.map((pos) => {
                const isProfit = pos.pnl >= 0;
                return (
                  <div
                    key={pos.id}
                    onClick={() => openSuperChart(pos.symbol)}
                    className="p-3 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-between text-xs cursor-pointer hover:border-[#2962ff]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span
                          className={`text-[10px] px-1 rounded font-bold ${
                            pos.side === 'BUY'
                              ? 'bg-[#089981]/20 text-[#089981]'
                              : 'bg-[#f23645]/20 text-[#f23645]'
                          }`}
                        >
                          {pos.side}
                        </span>
                        <span>{pos.symbol}</span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          ({pos.shares} units)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#787b86] font-mono block mt-0.5">
                        Entry: ${pos.entryPrice.toFixed(2)} → Cur: ${pos.currentPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span
                        className={`font-bold block tabular-nums ${
                          isProfit ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${
                          isProfit ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        ({isProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
