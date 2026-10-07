/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketNavTabs } from './components/MarketNavTabs';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { HeatmapScreen } from './components/screens/HeatmapScreen';
import { ScreenerScreen } from './components/screens/ScreenerScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { SuperChartModal } from './components/modals/SuperChartModal';
import { WatchlistDrawer } from './components/drawers/WatchlistDrawer';
import { SearchModal } from './components/modals/SearchModal';
import { Footer } from './components/Footer';
import { Bell, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, activeNotification, dismissNotification } = useMarket();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'indices':
        return <IndicesScreen />;
      case 'stocks':
        return <StocksScreen />;
      case 'crypto':
        return <CryptoScreen />;
      case 'forex':
        return <ForexScreen />;
      case 'futures':
        return <FuturesScreen />;
      case 'bonds':
        return <BondsScreen />;
      case 'heatmaps':
        return <HeatmapScreen />;
      case 'screener':
        return <ScreenerScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'overview':
      default:
        return <OverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] text-[#d1d4dc] dark:text-[#d1d4dc] light:text-[#131722] transition-colors">
      {/* Toast Notification Alert */}
      {activeNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-3.5 px-4 rounded-xl bg-[#1e222d] border border-[#2962ff] shadow-2xl text-xs font-semibold text-white animate-slideUp">
          <Bell className="w-4 h-4 text-[#2962ff] shrink-0" />
          <span>{activeNotification}</span>
          <button
            onClick={dismissNotification}
            className="p-1 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Top Nav */}
      <Header />

      {/* Real-time Ticker Tape Marquee */}
      <TickerTape />

      {/* Market Category Tabs & Region Filter */}
      <MarketNavTabs />

      {/* Main Screen Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-6 pt-6">
        {renderActiveScreen()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Overlays */}
      <SuperChartModal />
      <WatchlistDrawer />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainContent />
    </MarketProvider>
  );
}
