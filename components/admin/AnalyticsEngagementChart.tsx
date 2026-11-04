"use client";

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Swords, 
  Sparkles, 
  CalendarPlus,
  Flame,
  LineChart as LineChartIcon
} from 'lucide-react';

export interface DailyTrendItem {
  date: string;
  displayDate: string;
  total: number;
  calendarSyncs: number;
  contestClicks: number;
  pdfDownloads: number;
  uniqueUsers: number;
}

export interface PlatformShare {
  platform: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  dailyTrends: DailyTrendItem[];
  platformDistribution: PlatformShare[];
  summary: {
    totalActions30d: number;
    activeUsers30d: number;
    peakDay: { date: string; count: number };
    avgDailyActions: number;
  };
}

interface AnalyticsEngagementChartProps {
  data: AnalyticsData;
  isLoading?: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  Codeforces: 'bg-emerald-500 border-emerald-400 text-emerald-400',
  LeetCode: 'bg-amber-500 border-amber-400 text-amber-400',
  CodeChef: 'bg-orange-500 border-orange-400 text-orange-400',
  AtCoder: 'bg-cyan-500 border-cyan-400 text-cyan-400',
  'naukri_com/code360': 'bg-blue-500 border-blue-400 text-blue-400',
  ctftime_org: 'bg-rose-500 border-rose-400 text-rose-400',
  default: 'bg-zinc-500 border-zinc-400 text-zinc-400'
};

export default function AnalyticsEngagementChart({ data, isLoading }: AnalyticsEngagementChartProps) {
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('14');
  const [activeMetric, setActiveMetric] = useState<'all' | 'calendarSyncs' | 'contestClicks' | 'uniqueUsers'>('all');
  const [chartType, setChartType] = useState<'bar' | 'curve'>('bar');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Slice daily trends based on selected timeframe
  const filteredTrends = useMemo(() => {
    if (!data?.dailyTrends || data.dailyTrends.length === 0) return [];
    const days = parseInt(timeRange, 10);
    return data.dailyTrends.slice(-days);
  }, [data?.dailyTrends, timeRange]);

  // Compute stats for current window
  const windowStats = useMemo(() => {
    if (filteredTrends.length === 0) {
      return { total: 0, peak: { date: 'None', count: 0 }, avg: 0, users: 0 };
    }
    let total = 0;
    let max = 0;
    let peakDate = '';
    const userCountSum = new Set<string>();

    filteredTrends.forEach((item) => {
      let val = item.total;
      if (activeMetric === 'calendarSyncs') val = item.calendarSyncs;
      else if (activeMetric === 'contestClicks') val = item.contestClicks;
      else if (activeMetric === 'uniqueUsers') val = item.uniqueUsers;

      total += val;
      if (val > max) {
        max = val;
        peakDate = item.displayDate;
      }
    });

    const daysCount = filteredTrends.length || 1;
    return {
      total,
      peak: { date: peakDate || 'None', count: max },
      avg: Math.round((total / daysCount) * 10) / 10,
      users: filteredTrends.reduce((acc, curr) => acc + curr.uniqueUsers, 0)
    };
  }, [filteredTrends, activeMetric]);

  // Max value for chart Y-axis scale (with a minimum baseline of 5 to avoid flat rendering)
  const maxValue = useMemo(() => {
    if (filteredTrends.length === 0) return 5;
    const maxVal = Math.max(
      ...filteredTrends.map((d) => {
        if (activeMetric === 'calendarSyncs') return d.calendarSyncs;
        if (activeMetric === 'contestClicks') return d.contestClicks;
        if (activeMetric === 'uniqueUsers') return d.uniqueUsers;
        return d.total;
      })
    );
    return maxVal > 0 ? Math.ceil(maxVal * 1.25) : 5;
  }, [filteredTrends, activeMetric]);

  if (isLoading) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/[0.02] border border-white/10 p-6 flex items-center justify-center animate-pulse">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading telemetry insights...</span>
        </div>
      </div>
    );
  }

  // Active color theme
  const getMetricColor = () => {
    switch (activeMetric) {
      case 'calendarSyncs':
        return { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.15)', bar: 'bg-cyan-500', text: 'text-cyan-400' };
      case 'contestClicks':
        return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', bar: 'bg-emerald-500', text: 'text-emerald-400' };
      case 'uniqueUsers':
        return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', bar: 'bg-amber-500', text: 'text-amber-400' };
      default:
        return { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)', bar: 'bg-purple-500', text: 'text-purple-400' };
    }
  };

  const theme = getMetricColor();

  // SVG Coordinates calculation for curve mode
  const svgWidth = 800;
  const svgHeight = 180;
  const paddingX = 30;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = filteredTrends.map((d, i) => {
    const x = paddingX + (i / Math.max(filteredTrends.length - 1, 1)) * graphWidth;
    let val = d.total;
    if (activeMetric === 'calendarSyncs') val = d.calendarSyncs;
    else if (activeMetric === 'contestClicks') val = d.contestClicks;
    else if (activeMetric === 'uniqueUsers') val = d.uniqueUsers;

    const y = svgHeight - paddingY - (val / maxValue) * graphHeight;
    return { x, y, val, d };
  });

  // Generate smooth cubic bezier SVG path
  const curvePath = points.length > 1
    ? points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = arr[i - 1];
        const cpX1 = prev.x + (point.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (point.x - prev.x) / 2;
        const cpY2 = point.y;
        return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${point.x},${point.y}`;
      }, '')
    : '';

  const areaPath = points.length > 1
    ? `${curvePath} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`
    : '';

  return (
    <section className="w-full rounded-2xl bg-white/[0.02] border border-white/10 p-5 md:p-6 mb-8 text-white">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Engagement & Activity Trends
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Daily breakdown of competitive programming contest joins, Google Calendar syncs, and active user volume.
          </p>
        </div>

        {/* View Switches & Timeframe */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart Mode */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'bar' ? 'bg-white/15 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Bar Chart View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('curve')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'curve' ? 'bg-white/15 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Smooth Line View"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/5 text-xs">
            {(['7', '14', '30'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  timeRange === r
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Total Actions ({timeRange}d)</span>
          </div>
          <div className="text-xl font-black text-white">{windowStats.total}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Interactions</span>
          </div>
          <div className="text-xl font-black text-white">{windowStats.users}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Peak Activity Day</span>
          </div>
          <div className="text-xl font-black text-white truncate">
            {windowStats.peak.count > 0 ? `${windowStats.peak.date} (${windowStats.peak.count})` : '—'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily Average</span>
          </div>
          <div className="text-xl font-black text-white">{windowStats.avg}/day</div>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveMetric('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeMetric === 'all'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Events</span>
        </button>

        <button
          onClick={() => setActiveMetric('contestClicks')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeMetric === 'contestClicks'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Contest Joins</span>
        </button>

        <button
          onClick={() => setActiveMetric('calendarSyncs')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeMetric === 'calendarSyncs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Calendar Syncs</span>
        </button>

        <button
          onClick={() => setActiveMetric('uniqueUsers')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeMetric === 'uniqueUsers'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Active Users</span>
        </button>
      </div>

      {/* CHART RENDERING CANVAS */}
      <div className="relative bg-black/50 border border-white/5 rounded-2xl p-4 pt-6 overflow-hidden">
        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && filteredTrends[hoveredIndex] && (
          <div className="absolute top-3 left-4 z-20 flex items-center gap-3 bg-zinc-900/90 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-xl animate-in fade-in-50 duration-150">
            <span className="font-semibold text-white">{filteredTrends[hoveredIndex].displayDate}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-emerald-400 font-medium">
              ⚔️ {filteredTrends[hoveredIndex].contestClicks} Joins
            </span>
            <span className="text-cyan-400 font-medium">
              📅 {filteredTrends[hoveredIndex].calendarSyncs} Syncs
            </span>
            <span className="text-amber-400 font-medium">
              👥 {filteredTrends[hoveredIndex].uniqueUsers} Users
            </span>
            <span className="text-zinc-500">•</span>
            <span className="font-bold text-white">
              Total: {filteredTrends[hoveredIndex].total}
            </span>
          </div>
        )}

        {/* Y-Axis Reference Guides */}
        <div className="absolute inset-0 px-6 py-6 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-white border-dashed w-full"></div>
          <div className="border-b border-white border-dashed w-full"></div>
          <div className="border-b border-white w-full"></div>
        </div>

        {/* SVG Curve Mode */}
        {chartType === 'curve' ? (
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={theme.stroke} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Under Curve */}
              {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

              {/* Main Stroke Path */}
              {curvePath && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke={theme.stroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Interactive Dots */}
              {points.map((pt, idx) => (
                <g key={pt.d.date}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIndex === idx ? 6 : pt.val > 0 ? 3.5 : 2}
                    fill={hoveredIndex === idx ? '#ffffff' : theme.stroke}
                    stroke="#09090b"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              ))}
            </svg>
          </div>
        ) : (
          /* Bar Chart Mode */
          <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 px-1 pt-6">
            {filteredTrends.map((d, idx) => {
              let val = d.total;
              if (activeMetric === 'calendarSyncs') val = d.calendarSyncs;
              else if (activeMetric === 'contestClicks') val = d.contestClicks;
              else if (activeMetric === 'uniqueUsers') val = d.uniqueUsers;

              const heightPct = maxValue > 0 ? Math.max((val / maxValue) * 100, val > 0 ? 8 : 2) : 2;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Bar Value on hover */}
                  <div
                    className={`text-[10px] font-mono mb-1 transition-all ${
                      isHovered ? 'opacity-100 text-white font-bold scale-110' : 'opacity-0'
                    }`}
                  >
                    {val}
                  </div>

                  {/* Stacked or Solid Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 relative ${
                      isHovered ? 'brightness-125 shadow-lg' : 'opacity-85'
                    } ${
                      activeMetric === 'all'
                        ? 'bg-gradient-to-t from-purple-600 via-emerald-500 to-cyan-400'
                        : theme.bar
                    }`}
                  >
                    {isHovered && (
                      <div className="absolute inset-0 rounded-t-md bg-white/30 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* X-Axis Dates Labels */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[10px] text-zinc-500 font-mono">
          {filteredTrends.map((d, i) => {
            // Show fewer labels on small screens or large date ranges to avoid overlapping
            const interval = timeRange === '30' ? 5 : timeRange === '14' ? 2 : 1;
            const shouldShow = i % interval === 0 || i === filteredTrends.length - 1;
            return (
              <span
                key={d.date}
                className={`transition-colors ${
                  hoveredIndex === i ? 'text-white font-semibold' : ''
                } ${shouldShow ? 'inline' : 'hidden sm:inline opacity-30'}`}
              >
                {d.displayDate}
              </span>
            );
          })}
        </div>
      </div>

      {/* Platform Market Share Breakdown */}
      {data?.platformDistribution && data.platformDistribution.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Top Engagement Platforms
            </span>
            <span className="text-[11px] text-zinc-500">
              Distribution of all recorded clicks & syncs
            </span>
          </div>

          {/* Segmented Color Bar */}
          <div className="w-full h-3 rounded-full bg-white/5 flex overflow-hidden p-0.5 gap-0.5 mb-3">
            {data.platformDistribution.slice(0, 6).map((item) => {
              const colorClass = PLATFORM_COLORS[item.platform]?.split(' ')[0] || PLATFORM_COLORS.default.split(' ')[0];
              return (
                <div
                  key={item.platform}
                  style={{ width: `${Math.max(item.percentage, 3)}%` }}
                  className={`h-full rounded-sm transition-all hover:brightness-125 ${colorClass}`}
                  title={`${item.platform}: ${item.count} (${item.percentage}%)`}
                />
              );
            })}
          </div>

          {/* Platform Pills */}
          <div className="flex flex-wrap gap-2">
            {data.platformDistribution.slice(0, 6).map((item) => {
              const borderText = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.default;
              return (
                <div
                  key={item.platform}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-xs"
                >
                  <span className={`w-2 h-2 rounded-full ${borderText.split(' ')[0]}`} />
                  <span className="font-medium text-zinc-300">{item.platform}</span>
                  <span className="text-zinc-500 text-[11px]">
                    {item.count} <span className="text-zinc-600">({item.percentage}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

