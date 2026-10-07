import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { RatingBadge } from '../common/RatingBadge';
import {
  X,
  Maximize2,
  TrendingUp,
  BarChart2,
  Check,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  Activity,
  Layers,
} from 'lucide-react';

export const SuperChartModal: React.FC = () => {
  const {
    selectedSymbol,
    closeSuperChart,
    marketItems,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    executeOrder,
    cashBalance,
  } = useMarket();

  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '1Y'>('1D');
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showEMA50, setShowEMA50] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [orderShares, setOrderShares] = useState<number>(10);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!selectedSymbol) return null;

  const item = marketItems.find((i) => i.symbol === selectedSymbol);
  if (!item) return null;

  const isUp = item.change >= 0;
  const inWatch = isInWatchlist(item.symbol);
  const candles = item.candles || [];

  // Active hovered candle or latest candle
  const activeCandle =
    hoveredIndex !== null && candles[hoveredIndex]
      ? candles[hoveredIndex]
      : candles[candles.length - 1] || {
          open: item.price,
          high: item.high24h,
          low: item.low24h,
          close: item.price,
          volume: item.volumeNum,
          time: 'Latest',
        };

  // Dimensions
  const svgWidth = 860;
  const svgHeight = 360;
  const chartPaddingTop = 20;
  const chartPaddingBottom = showRSI ? 85 : 40;
  const chartPaddingLeft = 20;
  const chartPaddingRight = 65;

  const candleAreaHeight = svgHeight - chartPaddingTop - chartPaddingBottom;
  const candleAreaWidth = svgWidth - chartPaddingLeft - chartPaddingRight;

  // Compute price bounds
  const prices = candles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  // Coordinate functions
  const getY = (val: number) => {
    return (
      chartPaddingTop +
      candleAreaHeight -
      ((val - minPrice) / priceRange) * candleAreaHeight
    );
  };

  const getX = (index: number) => {
    return chartPaddingLeft + (index / (candles.length - 1 || 1)) * candleAreaWidth;
  };

  // Compute Moving Averages for candles
  const ma20Points = candles.map((_, idx) => {
    const start = Math.max(0, idx - 19);
    const subset = candles.slice(start, idx + 1);
    const avg = subset.reduce((acc, c) => acc + c.close, 0) / subset.length;
    return { x: getX(idx), y: getY(avg) };
  });

  const ma50Points = candles.map((_, idx) => {
    const start = Math.max(0, idx - 49);
    const subset = candles.slice(start, idx + 1);
    const avg = subset.reduce((acc, c) => acc + c.close, 0) / subset.length;
    return { x: getX(idx), y: getY(avg) };
  });

  const ma20Path = ma20Points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const ma50Path = ma50Points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  // Area chart path
  const areaLinePoints = candles.map((c, i) => ({ x: getX(i), y: getY(c.close) }));
  const areaLinePath = areaLinePoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const areaFillPath = `${areaLinePath} L ${
    areaLinePoints[areaLinePoints.length - 1]?.x || 0
  } ${chartPaddingTop + candleAreaHeight} L ${areaLinePoints[0]?.x || 0} ${
    chartPaddingTop + candleAreaHeight
  } Z`;

  // Maximum volume for bar scaling
  const maxVol = Math.max(...candles.map((c) => c.volume)) || 1;

  // Handle Paper Trading Order Submission
  const handleOrder = () => {
    if (orderShares <= 0) return;
    executeOrder(item.symbol, orderSide, orderShares);
  };

  const estimatedOrderCost = (item.price * orderShares).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-7xl max-h-[96vh] bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header of SuperChart */}
        <div className="px-5 py-3 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] flex flex-wrap items-center justify-between gap-3 bg-[#131722]/80 dark:bg-[#131722]/80 light:bg-[#f8f9fd]">
          {/* Symbol info */}
          <div className="flex items-center gap-3">
            <SymbolLogo symbol={item.symbol} logoUrl={item.logoUrl} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white dark:text-white light:text-[#131722] font-mono">
                  {item.symbol}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2962ff]/15 text-[#2962ff] font-semibold uppercase">
                  {item.assetClass}
                </span>
                <RatingBadge rating={item.technicalRating} size="sm" />
              </div>
              <span className="text-xs text-[#787b86]">{item.name}</span>
            </div>
          </div>

          {/* Live Price info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-white dark:text-white light:text-[#131722] tabular-nums">
                ${item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-1 ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isUp ? '+' : ''}{item.change.toFixed(2)}</span>
                <span>({isUp ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            {/* Watchlist toggle button */}
            <button
              onClick={() => {
                if (inWatch) removeFromWatchlist(item.symbol);
                else addToWatchlist(item.symbol);
              }}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                inWatch
                  ? 'bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/40'
                  : 'bg-[#1e222d] text-[#787b86] border-[#2a2e39] hover:text-white'
              }`}
              title={inWatch ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatch ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Close modal */}
            <button
              onClick={closeSuperChart}
              className="p-2 rounded-lg text-[#787b86] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#2a2e39] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe & Indicators */}
        <div className="px-5 py-2 border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] flex flex-wrap items-center justify-between gap-3 text-xs bg-[#1e222d] dark:bg-[#1e222d] light:bg-white">
          {/* Timeframes */}
          <div className="flex items-center gap-1">
            {(['1D', '5D', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Mode */}
          <div className="flex items-center gap-1 border-x border-[#2a2e39] px-3">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                chartType === 'candles'
                  ? 'bg-white/10 text-white'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Candles 🕯️
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white/10 text-white'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Area 📈
            </button>
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#787b86] hover:text-white">
              <input
                type="checkbox"
                checked={showMA20}
                onChange={(e) => setShowMA20(e.target.checked)}
                className="rounded accent-[#2962ff]"
              />
              <span className="text-blue-400 font-mono text-[11px]">MA(20)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#787b86] hover:text-white">
              <input
                type="checkbox"
                checked={showEMA50}
                onChange={(e) => setShowEMA50(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <span className="text-amber-400 font-mono text-[11px]">EMA(50)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#787b86] hover:text-white">
              <input
                type="checkbox"
                checked={showRSI}
                onChange={(e) => setShowRSI(e.target.checked)}
                className="rounded accent-purple-500"
              />
              <span className="text-purple-400 font-mono text-[11px]">RSI(14)</span>
            </label>
          </div>

          {/* HUD OHLC display */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-[#787b86]">
            <span>O: <strong className="text-white dark:text-white light:text-[#131722]">{activeCandle.open}</strong></span>
            <span>H: <strong className="text-[#089981]">{activeCandle.high}</strong></span>
            <span>L: <strong className="text-[#f23645]">{activeCandle.low}</strong></span>
            <span>C: <strong className="text-white dark:text-white light:text-[#131722]">{activeCandle.close}</strong></span>
          </div>
        </div>

        {/* Main Body: Interactive SVG Chart (Left) + Right Utility Sidebar */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 overflow-y-auto min-h-[460px]">
          {/* Left 3 cols: Chart canvas */}
          <div className="xl:col-span-3 p-4 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] relative select-none">
            {/* SVG Interactive Canvas */}
            <div className="relative w-full h-full min-h-[360px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (mouseX - chartPaddingLeft) / candleAreaWidth));
                  const idx = Math.round(ratio * (candles.length - 1));
                  setHoveredIndex(idx);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Horizontal price grid lines */}
                {[0.1, 0.35, 0.6, 0.85].map((pct, idx) => {
                  const pVal = minPrice + (maxPrice - minPrice) * pct;
                  const y = getY(pVal);
                  return (
                    <g key={idx}>
                      <line
                        x1={chartPaddingLeft}
                        y1={y}
                        x2={svgWidth - chartPaddingRight}
                        y2={y}
                        stroke="#2a2e39"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={svgWidth - chartPaddingRight + 6}
                        y={y + 3}
                        className="text-[10px] font-mono fill-[#787b86]"
                      >
                        {pVal < 5 ? pVal.toFixed(4) : pVal.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume histogram bars */}
                {candles.map((c, i) => {
                  const x = getX(i);
                  const volHeight = (c.volume / maxVol) * 45;
                  const y = chartPaddingTop + candleAreaHeight - volHeight;
                  const isCandleUp = c.close >= c.open;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 3}
                      y={y}
                      width={6}
                      height={volHeight}
                      fill={isCandleUp ? '#089981' : '#f23645'}
                      opacity={0.35}
                    />
                  );
                })}

                {/* Area chart */}
                {chartType === 'area' && (
                  <>
                    <path d={areaFillPath} fill="url(#chartAreaGrad)" />
                    <path d={areaLinePath} fill="none" stroke="#2962ff" strokeWidth="2.5" />
                  </>
                )}

                {/* Candlestick chart */}
                {chartType === 'candles' &&
                  candles.map((c, i) => {
                    const x = getX(i);
                    const yHigh = getY(c.high);
                    const yLow = getY(c.low);
                    const yOpen = getY(c.open);
                    const yClose = getY(c.close);
                    const isCandleUp = c.close >= c.open;
                    const candleColor = isCandleUp ? '#089981' : '#f23645';

                    const bodyTop = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

                    return (
                      <g key={`candle-${i}`}>
                        {/* Wick */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.2"
                        />
                        {/* Real Body */}
                        <rect
                          x={x - 4}
                          y={bodyTop}
                          width={8}
                          height={bodyHeight}
                          fill={candleColor}
                          stroke={candleColor}
                          strokeWidth="0.5"
                          rx={1}
                        />
                      </g>
                    );
                  })}

                {/* Moving Average lines */}
                {showMA20 && (
                  <path d={ma20Path} fill="none" stroke="#3b82f6" strokeWidth="1.75" />
                )}
                {showEMA50 && (
                  <path d={ma50Path} fill="none" stroke="#f59e0b" strokeWidth="1.75" />
                )}

                {/* Crosshair when hovered */}
                {hoveredIndex !== null && (
                  <g>
                    <line
                      x1={getX(hoveredIndex)}
                      y1={chartPaddingTop}
                      x2={getX(hoveredIndex)}
                      y2={svgHeight - 10}
                      stroke="#787b86"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={chartPaddingLeft}
                      y1={getY(candles[hoveredIndex].close)}
                      x2={svgWidth - chartPaddingRight}
                      y2={getY(candles[hoveredIndex].close)}
                      stroke="#787b86"
                      strokeDasharray="3 3"
                    />
                  </g>
                )}

                {/* RSI Subpanel */}
                {showRSI && (
                  <g>
                    <line
                      x1={chartPaddingLeft}
                      y1={svgHeight - 60}
                      x2={svgWidth - chartPaddingRight}
                      y2={svgHeight - 60}
                      stroke="#2a2e39"
                    />
                    <text
                      x={chartPaddingLeft}
                      y={svgHeight - 65}
                      className="text-[10px] font-mono fill-purple-400 font-bold"
                    >
                      RSI (14): 58.4
                    </text>
                    <line
                      x1={chartPaddingLeft}
                      y1={svgHeight - 45}
                      x2={svgWidth - chartPaddingRight}
                      y2={svgHeight - 45}
                      stroke="#f23645"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                    <line
                      x1={chartPaddingLeft}
                      y1={svgHeight - 20}
                      x2={svgWidth - chartPaddingRight}
                      y2={svgHeight - 20}
                      stroke="#089981"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                    <text
                      x={svgWidth - chartPaddingRight + 4}
                      y={svgHeight - 42}
                      className="text-[9px] font-mono fill-neutral-500"
                    >
                      70
                    </text>
                    <text
                      x={svgWidth - chartPaddingRight + 4}
                      y={svgHeight - 17}
                      className="text-[9px] font-mono fill-neutral-500"
                    >
                      30
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Right 1 col: Technical Gauge & Simulated Trading Desk */}
          <div className="p-4 space-y-5 bg-[#131722]/50 dark:bg-[#131722]/50 light:bg-[#f8f9fd]">
            {/* 1. Technical Analysis Speedometer Meter */}
            <div className="p-3.5 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white dark:text-white light:text-[#131722]">
                  Technical Summary
                </span>
                <span className="text-[10px] text-[#787b86]">Multi-Indicator</span>
              </div>

              {/* Speedometer Gauge Visual */}
              <div className="flex flex-col items-center py-2">
                <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                  <div className="w-36 h-36 rounded-full border-8 border-transparent border-t-[#089981] border-l-[#f23645] border-r-[#089981] transform -rotate-45" />
                  {/* Gauge Needle */}
                  <div
                    className="absolute bottom-0 w-1 h-16 bg-white dark:bg-white light:bg-neutral-900 rounded-full origin-bottom transition-transform duration-500"
                    style={{
                      transform: `rotate(${
                        item.technicalRating === 'Strong Buy'
                          ? 45
                          : item.technicalRating === 'Buy'
                          ? 25
                          : item.technicalRating === 'Neutral'
                          ? 0
                          : -35
                      }deg)`,
                    }}
                  />
                  <div className="absolute bottom-0 w-3 h-3 rounded-full bg-white dark:bg-white light:bg-neutral-900" />
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`text-xs font-black tracking-wide uppercase ${
                      item.technicalRating.includes('Buy')
                        ? 'text-[#089981]'
                        : item.technicalRating.includes('Sell')
                        ? 'text-[#f23645]'
                        : 'text-neutral-400'
                    }`}
                  >
                    {item.technicalRating}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#2a2e39] text-center text-[10px]">
                <div>
                  <span className="text-[#f23645] block font-bold">2</span>
                  <span className="text-[#787b86]">Sell</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-bold">8</span>
                  <span className="text-[#787b86]">Neutral</span>
                </div>
                <div>
                  <span className="text-[#089981] block font-bold">16</span>
                  <span className="text-[#787b86]">Buy</span>
                </div>
              </div>
            </div>

            {/* 2. Paper Trading Execution Panel */}
            <div className="p-3.5 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#2962ff]" />
                  <span>Paper Trading</span>
                </span>
                <span className="text-[10px] text-[#787b86] font-mono tabular-nums">
                  Cash: ${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button
                  onClick={() => setOrderSide('BUY')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderSide === 'BUY'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'bg-[#131722] text-[#787b86] border border-[#2a2e39]'
                  }`}
                >
                  Buy / Long
                </button>
                <button
                  onClick={() => setOrderSide('SELL')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderSide === 'SELL'
                      ? 'bg-[#f23645] text-white shadow-xs'
                      : 'bg-[#131722] text-[#787b86] border border-[#2a2e39]'
                  }`}
                >
                  Sell / Short
                </button>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1 mb-3">
                <label className="text-[10px] text-[#787b86] flex justify-between">
                  <span>Units / Shares</span>
                  <span className="font-mono">${item.price.toFixed(2)} / unit</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={orderShares}
                    onChange={(e) => setOrderShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] text-xs font-mono font-bold text-white dark:text-white light:text-[#131722] focus:border-[#2962ff] focus:outline-none"
                  />
                  <div className="flex gap-1">
                    {[10, 50, 100].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setOrderShares(qty)}
                        className="px-2 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-neutral-300 border border-[#2a2e39] cursor-pointer"
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Summary & Submit */}
              <div className="pt-2 border-t border-[#2a2e39] mb-3 flex justify-between text-xs font-mono">
                <span className="text-[#787b86]">Total Value:</span>
                <span className="font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                  ${estimatedOrderCost}
                </span>
              </div>

              <button
                onClick={handleOrder}
                className={`w-full py-2 rounded-lg font-bold text-xs text-white transition-all cursor-pointer shadow-md ${
                  orderSide === 'BUY'
                    ? 'bg-[#089981] hover:bg-[#067a67]'
                    : 'bg-[#f23645] hover:bg-[#d02534]'
                }`}
              >
                Execute {orderSide} Order
              </button>
            </div>

            {/* 3. Fundamental Statistics */}
            <div className="p-3.5 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-xs">
              <span className="text-xs font-bold text-white dark:text-white light:text-[#131722] block mb-2">
                Instrument Details
              </span>
              <div className="space-y-1.5 text-[11px] tabular-nums font-mono">
                <div className="flex justify-between">
                  <span className="text-[#787b86]">24h High:</span>
                  <span className="text-neutral-200">{item.high24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787b86]">24h Low:</span>
                  <span className="text-neutral-200">{item.low24h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787b86]">Volume:</span>
                  <span className="text-neutral-200">{item.volume}</span>
                </div>
                {item.marketCap && (
                  <div className="flex justify-between">
                    <span className="text-[#787b86]">Market Cap:</span>
                    <span className="text-neutral-200">{item.marketCap}</span>
                  </div>
                )}
                {item.peRatio && (
                  <div className="flex justify-between">
                    <span className="text-[#787b86]">P/E Ratio:</span>
                    <span className="text-neutral-200">{item.peRatio.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
