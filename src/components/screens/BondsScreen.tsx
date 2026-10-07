import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../common/SymbolLogo';
import { Sparkline } from '../common/Sparkline';
import { RatingBadge } from '../common/RatingBadge';
import { yieldCurveData } from '../../data/marketData';
import { ArrowUpRight, ArrowDownRight, Globe, Plus, Check, Info } from 'lucide-react';

export const BondsScreen: React.FC = () => {
  const { marketItems, openSuperChart, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useMarket();

  const [curveMode, setCurveMode] = useState<'current' | 'comparison'>('comparison');

  const bonds = marketItems.filter((i) => i.assetClass === 'bonds');

  // Compute 10Y - 2Y Spread
  const us10Y = bonds.find((b) => b.symbol === 'US10Y')?.price || 4.024;
  const us02Y = bonds.find((b) => b.symbol === 'US02Y')?.price || 3.985;
  const spread10_2 = Number((us10Y - us02Y).toFixed(3));
  const isInverted = spread10_2 < 0;

  // Render SVG Yield Curve
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minYield = 3.5;
  const maxYield = 5.6;
  const rangeY = maxYield - minYield;

  const getPoints = (key: 'current' | 'monthAgo' | 'yearAgo') => {
    return yieldCurveData.map((d, idx) => {
      const x = paddingX + (idx / (yieldCurveData.length - 1)) * (chartWidth - paddingX * 2);
      const val = d[key];
      const y = chartHeight - paddingY - ((val - minYield) / rangeY) * (chartHeight - paddingY * 2);
      return { x, y, val, maturity: d.maturity };
    });
  };

  const currentPoints = getPoints('current');
  const monthAgoPoints = getPoints('monthAgo');
  const yearAgoPoints = getPoints('yearAgo');

  const makePath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2962ff]" />
            <span>Government Bonds & Sovereign Yields</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            US Treasury curve dynamics, global sovereign benchmarks, and yield spread term structures
          </p>
        </div>

        {/* 10Y - 2Y Spread Barometer */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-xs">
          <Info className="w-4 h-4 text-[#2962ff]" />
          <div>
            <span className="text-[#787b86] block text-[10px]">10Y - 2Y Yield Spread</span>
            <span
              className={`font-mono font-bold ${
                isInverted ? 'text-[#f23645]' : 'text-[#089981]'
              }`}
            >
              {spread10_2 > 0 ? '+' : ''}
              {spread10_2}% ({isInverted ? 'Inverted' : 'Normal Curve'})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive US Treasury Yield Curve Chart */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
              US Treasury Yield Curve (Term Structure)
            </h2>
            <p className="text-xs text-[#787b86]">
              Benchmark rate expectations from 1-month paper through 30-year long bonds
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#2962ff] rounded-full" />
              <span className="text-white dark:text-white light:text-[#131722] font-semibold">
                Current
              </span>
            </div>
            {curveMode === 'comparison' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#089981] rounded-full" />
                  <span className="text-[#787b86]">1 Mo Ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-500 rounded-full" />
                  <span className="text-[#787b86]">1 Yr Ago</span>
                </div>
              </>
            )}
            <button
              onClick={() =>
                setCurveMode((m) => (m === 'current' ? 'comparison' : 'current'))
              }
              className="px-2.5 py-1 text-xs rounded border border-[#2a2e39] text-[#787b86] hover:text-white hover:border-[#2962ff] cursor-pointer"
            >
              {curveMode === 'current' ? 'Show Historical' : 'Hide Historical'}
            </button>
          </div>
        </div>

        {/* SVG Chart Canvas */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[600px] overflow-visible"
          >
            {/* Grid Lines */}
            {[4.0, 4.5, 5.0, 5.5].map((yVal) => {
              const y =
                chartHeight - paddingY - ((yVal - minYield) / rangeY) * (chartHeight - paddingY * 2);
              return (
                <g key={yVal}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-neutral-700/40"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-neutral-400 font-mono"
                  >
                    {yVal.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Historical Lines */}
            {curveMode === 'comparison' && (
              <>
                <path
                  d={makePath(yearAgoPoints)}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <path
                  d={makePath(monthAgoPoints)}
                  fill="none"
                  stroke="#089981"
                  strokeWidth="2"
                  opacity="0.85"
                />
              </>
            )}

            {/* Current Curve Line */}
            <path
              d={makePath(currentPoints)}
              fill="none"
              stroke="#2962ff"
              strokeWidth="3"
            />

            {/* Points & Labels */}
            {currentPoints.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-[#2962ff] stroke-white stroke-1 hover:r-6 cursor-pointer"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-white dark:fill-white light:fill-neutral-900 font-mono font-bold"
                >
                  {pt.val}%
                </text>
                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="text-[11px] fill-neutral-400 font-medium"
                >
                  {pt.maturity}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3. Sovereign 10Y Yields Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-[#131722]">
            Global Sovereign 10-Year Bond Yields
          </h2>
          <span className="text-xs text-[#787b86]">Standardized 10Y maturity benchmarks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Sovereign Benchmark</th>
                <th className="py-2.5 px-3 font-semibold">Country</th>
                <th className="py-2.5 px-3 font-semibold text-right">Yield (%)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Basis Pt Change</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change %</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h High</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">24h Low</th>
                <th className="py-2.5 px-3 font-semibold text-center hidden md:table-cell">Trend (7D)</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {bonds.map((bond) => {
                const isUp = bond.change >= 0;
                const inWatch = isInWatchlist(bond.symbol);
                return (
                  <tr
                    key={bond.id}
                    onClick={() => openSuperChart(bond.symbol)}
                    className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={bond.symbol} logoUrl={bond.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white dark:text-white light:text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {bond.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">{bond.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#787b86] font-medium">{bond.country}</td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                      {bond.price.toFixed(3)}%
                    </td>

                    <td
                      className={`py-3.5 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {(bond.change * 100).toFixed(1)} bps
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          isUp ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}
                        {bond.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {bond.high24h.toFixed(3)}%
                    </td>

                    <td className="py-3.5 px-3 text-right text-[#787b86] font-mono tabular-nums hidden sm:table-cell">
                      {bond.low24h.toFixed(3)}%
                    </td>

                    <td className="py-3.5 px-3 text-center hidden md:table-cell">
                      <div className="w-20 mx-auto">
                        <Sparkline
                          data={bond.history}
                          isPositive={isUp}
                          width={80}
                          height={22}
                          showArea={false}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (inWatch) removeFromWatchlist(bond.symbol);
                          else addToWatchlist(bond.symbol);
                        }}
                        className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                          inWatch
                            ? 'bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/30'
                            : 'bg-transparent text-[#787b86] border-[#2a2e39] hover:text-white'
                        }`}
                        title={inWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        {inWatch ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
