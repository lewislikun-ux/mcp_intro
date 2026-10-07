import React, { useState } from 'react';
import { economicEvents } from '../../data/marketData';
import { CalendarDays, AlertCircle, Clock, Filter } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');

  const filteredEvents = economicEvents.filter((evt) => {
    if (impactFilter !== 'All' && evt.impact !== impactFilter) return false;
    if (countryFilter !== 'All' && evt.countryCode !== countryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb]">
        <div>
          <h1 className="text-base font-bold text-white dark:text-white light:text-[#131722] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#2962ff]" />
            <span>Economic Calendar</span>
          </h1>
          <p className="text-xs text-[#787b86]">
            Global macro announcements, central bank interest rate meetings, and economic indicators
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Impact Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39]">
            {(['All', 'High', 'Medium'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setImpactFilter(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  impactFilter === lvl
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {lvl === 'High' ? '🔴 High Impact' : lvl}
              </button>
            ))}
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#131722] dark:bg-[#131722] light:bg-[#f0f3fa] rounded-lg border border-[#2a2e39]">
            {['All', 'US', 'DE'].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  countryFilter === c
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {c === 'DE' ? 'Germany' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl bg-[#1e222d] dark:bg-[#1e222d] light:bg-white border border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] p-4 lg:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-[#e0e3eb] text-[#787b86] pb-2">
                <th className="py-2.5 px-3 font-semibold">Time & Date</th>
                <th className="py-2.5 px-3 font-semibold">Country</th>
                <th className="py-2.5 px-3 font-semibold">Indicator / Release</th>
                <th className="py-2.5 px-3 font-semibold text-center">Impact</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actual</th>
                <th className="py-2.5 px-3 font-semibold text-right">Forecast</th>
                <th className="py-2.5 px-3 font-semibold text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 dark:divide-[#2a2e39]/60 light:divide-[#e0e3eb]/60">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-[#131722]/50 dark:hover:bg-[#131722]/50 light:hover:bg-[#f0f3fa] transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#787b86]" />
                      <div>
                        <span className="font-bold text-white dark:text-white light:text-[#131722]">
                          {evt.time}
                        </span>
                        <span className="text-[10px] text-[#787b86] block">{evt.date}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-bold">
                        {evt.countryCode}
                      </span>
                      <span>{evt.country}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-white dark:text-white light:text-[#131722]">
                    {evt.event}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        evt.impact === 'High'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          evt.impact === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                      {evt.impact}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-white dark:text-white light:text-[#131722] tabular-nums">
                    {evt.actual}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-[#787b86] tabular-nums">
                    {evt.forecast}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-[#787b86] tabular-nums">
                    {evt.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
