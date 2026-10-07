export type AssetClass = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  category?: string; // e.g. "Mega Cap", "Semiconductors", "Major FX", "Energy"
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  volumeNum: number;
  marketCap?: string;
  marketCapNum?: number;
  peRatio?: number;
  dividendYield?: number;
  technicalRating: TechnicalRating;
  logoUrl?: string;
  country?: string;
  history: number[]; // mini sparkline points
  candles?: Candle[];
  lastUpdateDirection?: 'up' | 'down' | null;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: string;
  topStock: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  category: string;
  symbols: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  url?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  name: string;
  side: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}
