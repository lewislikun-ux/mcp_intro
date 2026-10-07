import React from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Globe,
  TrendingUp,
  BarChart3,
  Coins,
  ArrowLeftRight,
  Flame,
  Landmark,
  LayoutGrid,
  Filter,
  CalendarDays,
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const MarketNavTabs: React.FC = () => {
  const { activeTab, setActiveTab, activeRegion, setActiveRegion } = useMarket();

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'indices', label: 'Indices', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'stocks', label: 'Stocks', icon: <Landmark className="w-4 h-4" /> },
    { id: 'crypto', label: 'Crypto', icon: <Coins className="w-4 h-4" /> },
    { id: 'forex', label: 'Forex', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'futures', label: 'Futures', icon: <Flame className="w-4 h-4" /> },
    { id: 'bonds', label: 'Bonds', icon: <Globe className="w-4 h-4" /> },
    { id: 'heatmaps', label: 'Heatmaps', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const regions = ['Global', 'US', 'Europe', 'Asia'];

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] light:bg-[#f8f9fd] border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 pb-2">
        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth pb-1 md:pb-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'text-[#787b86] dark:text-[#787b86] light:text-[#5d606b] hover:text-white dark:hover:text-white light:hover:text-[#131722] hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-white' : 'opacity-70'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Region Segmented Selector */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#ffffff] p-1 rounded-lg border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] shrink-0">
          <span className="text-[11px] font-medium text-[#787b86] px-2 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Region:
          </span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeRegion === region
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white dark:hover:text-white light:hover:text-[#131722]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
