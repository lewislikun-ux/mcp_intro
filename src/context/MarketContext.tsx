import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarketItem, AssetClass, PriceAlert, PaperPosition } from '../types/market';
import { initialMarketItems } from '../data/marketData';

interface MarketContextType {
  marketItems: MarketItem[];
  isLiveActive: boolean;
  toggleLiveActive: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRegion: string;
  setActiveRegion: (region: string) => void;
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;
  openSuperChart: (symbol: string) => void;
  closeSuperChart: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: (open: boolean) => void;
  toggleWatchlistOpen: () => void;
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  priceAlerts: PriceAlert[];
  addPriceAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  removePriceAlert: (id: string) => void;
  activeNotification: string | null;
  dismissNotification: () => void;
  // Paper trading simulated account
  cashBalance: number;
  positions: PaperPosition[];
  executeOrder: (symbol: string, side: 'BUY' | 'SELL', shares: number) => { success: boolean; message: string };
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const DEFAULT_WATCHLIST = ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSD', 'EURUSD', 'CL1!'];

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>(initialMarketItems);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tv_theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeRegion, setActiveRegion] = useState<string>('Global');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Watchlist persisted
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  // Price alerts persisted
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('tv_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Paper trading state
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_cash');
      return saved ? Number(saved) : 100000;
    } catch {
      return 100000;
    }
  });

  const [positions, setPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_positions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tv_theme', theme);
  }, [theme]);

  // Save watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Save alerts
  useEffect(() => {
    localStorage.setItem('tv_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  // Save cash & positions
  useEffect(() => {
    localStorage.setItem('tv_cash', cashBalance.toString());
    localStorage.setItem('tv_positions', JSON.stringify(positions));
  }, [cashBalance, positions]);

  // Global keyboard shortcuts (Cmd+K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        if (selectedSymbol) setSelectedSymbol(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSymbol]);

  // Real-time market tick simulation
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setMarketItems((prevItems) => {
        // Pick 2 to 4 random symbols to update
        const indicesToUpdate = new Set<number>();
        const updateCount = Math.floor(Math.random() * 3) + 2;
        while (indicesToUpdate.size < updateCount) {
          indicesToUpdate.add(Math.floor(Math.random() * prevItems.length));
        }

        const newItems = prevItems.map((item, index) => {
          if (!indicesToUpdate.has(index)) {
            // Clear direction flash after timeout
            if (item.lastUpdateDirection) {
              return { ...item, lastUpdateDirection: null };
            }
            return item;
          }

          // Generate delta (-0.2% to +0.2%)
          const pctDelta = (Math.random() - 0.49) * 0.0035;
          const oldPrice = item.price;
          const newPrice = Number((oldPrice * (1 + pctDelta)).toFixed(item.price < 5 ? 4 : 2));
          const direction: 'up' | 'down' = newPrice >= oldPrice ? 'up' : 'down';
          const newChange = Number((item.change + (newPrice - oldPrice)).toFixed(item.price < 5 ? 4 : 2));
          const newChangePercent = Number((((newPrice - (item.price - item.change)) / (item.price - item.change)) * 100).toFixed(2));
          const newHigh = Math.max(item.high24h, newPrice);
          const newLow = Math.min(item.low24h, newPrice);

          // Update history sparkline
          const newHistory = [...item.history.slice(-8), newPrice];

          // Check if any price alert triggers
          priceAlerts.forEach((alert) => {
            if (!alert.triggered && alert.symbol === item.symbol) {
              if (alert.condition === 'above' && newPrice >= alert.targetPrice) {
                alert.triggered = true;
                setActiveNotification(`🔔 Alert triggered: ${item.symbol} crossed above $${alert.targetPrice}!`);
              } else if (alert.condition === 'below' && newPrice <= alert.targetPrice) {
                alert.triggered = true;
                setActiveNotification(`🔔 Alert triggered: ${item.symbol} fell below $${alert.targetPrice}!`);
              }
            }
          });

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high24h: newHigh,
            low24h: newLow,
            history: newHistory,
            lastUpdateDirection: direction,
          };
        });

        // Update active positions PnL
        setPositions((prevPositions) =>
          prevPositions.map((pos) => {
            const currentItem = newItems.find((i) => i.symbol === pos.symbol);
            if (!currentItem) return pos;
            const currentPrice = currentItem.price;
            const multiplier = pos.side === 'BUY' ? 1 : -1;
            const pnl = (currentPrice - pos.entryPrice) * pos.shares * multiplier;
            const pnlPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100 * multiplier;
            return {
              ...pos,
              currentPrice,
              pnl: Number(pnl.toFixed(2)),
              pnlPercent: Number(pnlPercent.toFixed(2)),
            };
          })
        );

        return newItems;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveActive, priceAlerts]);

  const toggleLiveActive = () => setIsLiveActive((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const openSuperChart = (symbol: string) => setSelectedSymbol(symbol);
  const closeSuperChart = () => setSelectedSymbol(null);

  const toggleWatchlistOpen = () => setIsWatchlistOpen((prev) => !prev);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
      setActiveNotification(`Added ${symbol} to Watchlist`);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
    setActiveNotification(`Removed ${symbol} from Watchlist`);
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  const addPriceAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: Date.now(),
      triggered: false,
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
    setActiveNotification(`Alert set for ${symbol} when price is ${condition} $${targetPrice}`);
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const dismissNotification = () => setActiveNotification(null);

  // Paper trading simulated execution
  const executeOrder = (symbol: string, side: 'BUY' | 'SELL', shares: number) => {
    const item = marketItems.find((i) => i.symbol === symbol);
    if (!item) return { success: false, message: 'Symbol not found' };

    const totalCost = item.price * shares;

    if (side === 'BUY') {
      if (totalCost > cashBalance) {
        return { success: false, message: `Insufficient cash ($${cashBalance.toFixed(2)} available)` };
      }
      setCashBalance((prev) => prev - totalCost);
      const newPos: PaperPosition = {
        id: `pos-${Date.now()}`,
        symbol: item.symbol,
        name: item.name,
        side: 'BUY',
        shares,
        entryPrice: item.price,
        currentPrice: item.price,
        pnl: 0,
        pnlPercent: 0,
        timestamp: Date.now(),
      };
      setPositions((prev) => [newPos, ...prev]);
      setActiveNotification(`Bought ${shares} shares of ${symbol} at $${item.price.toFixed(2)}`);
      return { success: true, message: `Order filled: Bought ${shares} ${symbol}` };
    } else {
      // SELL / SHORT
      setCashBalance((prev) => prev + totalCost);
      const newPos: PaperPosition = {
        id: `pos-${Date.now()}`,
        symbol: item.symbol,
        name: item.name,
        side: 'SELL',
        shares,
        entryPrice: item.price,
        currentPrice: item.price,
        pnl: 0,
        pnlPercent: 0,
        timestamp: Date.now(),
      };
      setPositions((prev) => [newPos, ...prev]);
      setActiveNotification(`Sold ${shares} shares of ${symbol} at $${item.price.toFixed(2)}`);
      return { success: true, message: `Order filled: Sold ${shares} ${symbol}` };
    }
  };

  return (
    <MarketContext.Provider
      value={{
        marketItems,
        isLiveActive,
        toggleLiveActive,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        activeRegion,
        setActiveRegion,
        selectedSymbol,
        setSelectedSymbol,
        openSuperChart,
        closeSuperChart,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isWatchlistOpen,
        setIsWatchlistOpen,
        toggleWatchlistOpen,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        activeNotification,
        dismissNotification,
        cashBalance,
        positions,
        executeOrder,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
