import { useState, useEffect } from 'react';
import { 
  Users, Eye, TrendingUp, Sparkles, RefreshCw, Globe, ShieldCheck, 
  Mail, Calendar, ArrowUpRight, BarChart3, Clock, CheckCircle2, 
  Activity, UserCheck, Flame, Zap, Database
} from 'lucide-react';
import { fetchAnalyticsStats, AnalyticsSummary } from '../../lib/analytics';
import { formatDistanceToNow, format } from 'date-fns';

export function AdminAnalyticsPanel() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadStats = async () => {
    const data = await fetchAnalyticsStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000); // 10s live pulse
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleResetCalibration = async () => {
    if (!confirm('Recalibrate analytics counters? This will update the baseline.')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/analytics/reset', { method: 'POST' });
      if (res.ok) {
        setStatusMessage('Analytics counters calibrated successfully.');
        await loadStats();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch {
      setStatusMessage('Error calibrating analytics.');
    } finally {
      setResetting(false);
    }
  };

  const metrics = stats?.metrics || {
    totalPageViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    registeredUsersCount: 0,
    newsletterSubscribersCount: 0,
    activeSessionsEstimate: 0,
    totalGamesMonitored: 0,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire-50 border border-sapphire-600/20 text-sapphire-700 text-xs font-black uppercase tracking-wider font-mono">
            <Activity size={13} className="text-sapphire-600 animate-pulse" /> Live Pulse Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
            Traffic & User Registration Metrics
          </h2>
          <p className="text-xs sm:text-sm text-indigo-900/60 font-medium max-w-xl">
            Real-time analytics engine tracking page views, unique visitor sessions, Supabase registered accounts, and newsletter conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Live Refresh'}</span>
          </button>
          
          <button
            onClick={handleResetCalibration}
            disabled={resetting}
            className="inline-flex items-center gap-2 bg-white hover:bg-azure-50 text-indigo-950/70 border border-indigo-950/15 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            title="Recalibrate Counters"
          >
            <Database size={13} className="text-indigo-900/40" />
            <span>Calibrate</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 4 Primary Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Site Visits / Page Views */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-sky-500/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-sky-300 font-mono">
              Total Page Views
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-sky-400">
              <Eye size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
            {metrics.totalPageViews.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300/80 font-medium pt-2 border-t border-white/10">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <TrendingUp size={13} /> +{metrics.todayViews} today
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Persistent</span>
          </div>
        </div>

        {/* Metric 2: Total Registered User Count (Supabase Auth / Profiles) */}
        <div className="bg-gradient-to-br from-sapphire-900 via-indigo-950 to-sapphire-950 rounded-3xl p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-sapphire-400/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-sapphire-300 font-mono">
              Registered Gamers
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-sapphire-400">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
            {metrics.registeredUsersCount.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300/80 font-medium pt-2 border-t border-white/10">
            <span className="flex items-center gap-1 text-sky-300 font-bold">
              <UserCheck size={13} /> Supabase Auth Connected
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Profiles</span>
          </div>
        </div>

        {/* Metric 3: Estimated Unique Visitors */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-mono">
              Unique Visitors
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
              <Globe size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
            {metrics.uniqueVisitors.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300/80 font-medium pt-2 border-t border-white/10">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <Sparkles size={13} /> ~{metrics.activeSessionsEstimate} Live Now
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Global</span>
          </div>
        </div>

        {/* Metric 4: Newsletter Subscribers */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 rounded-3xl p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
              Newsletter VIPs
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-amber-400">
              <Mail size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
            {metrics.newsletterSubscribersCount.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300/80 font-medium pt-2 border-t border-white/10">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Zap size={13} /> Daily Code Alerts
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Subscribers</span>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Top Viewed Pages & Real-time Live Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Top Pages Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-indigo-950/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-950/5 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-sapphire-600" size={20} />
              <h3 className="text-lg font-black text-indigo-950">Top Visited Hubs & Routes</h3>
            </div>
            <span className="text-xs font-bold text-indigo-900/50">By Total Views</span>
          </div>

          <div className="space-y-4">
            {(stats?.topPages || []).map((item, idx) => {
              const maxViews = stats?.topPages?.[0]?.views || Math.max(1, item.views);
              const percentage = Math.round((item.views / maxViews) * 100);

              return (
                <div key={item.path} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                    <span className="font-mono text-sapphire-700">{item.path}</span>
                    <span className="text-indigo-900/60 font-mono">{item.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2.5 w-full bg-azure-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sapphire-600 to-sky-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!stats?.topPages || stats.topPages.length === 0) && (
              <div className="text-center py-6 text-sm text-indigo-900/40 font-medium">
                No active traffic yet.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-indigo-950/5 flex items-center justify-between text-xs text-indigo-900/60 font-medium">
            <span>Tracking active URL routing and direct links</span>
            <span className="text-sapphire-600 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Right 5 Cols: Live Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-indigo-950/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-950/5 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-600 animate-pulse" size={20} />
              <h3 className="text-lg font-black text-indigo-950">Live Activity Feed</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              Real-time
            </span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {(stats?.recentEvents || []).map((evt) => (
              <div 
                key={evt.id} 
                className="p-3 rounded-2xl bg-azure-50/50 border border-indigo-950/5 flex items-start gap-3 text-xs"
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  evt.type === 'signup' 
                    ? 'bg-purple-100 text-purple-700' 
                    : evt.type === 'code_copy' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : evt.type === 'newsletter_sub'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-sky-100 text-sky-700'
                }`}>
                  {evt.type === 'signup' && <UserCheck size={14} />}
                  {evt.type === 'code_copy' && <Zap size={14} />}
                  {evt.type === 'newsletter_sub' && <Mail size={14} />}
                  {evt.type === 'pageview' && <Eye size={14} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-indigo-950 truncate">
                    {evt.detail || evt.path}
                  </div>
                  <div className="text-[10px] text-indigo-900/50 font-mono mt-0.5 flex items-center justify-between">
                    <span>{evt.type.toUpperCase()}</span>
                    <span>{formatDistanceToNow(new Date(evt.timestamp))} ago</span>
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentEvents || stats.recentEvents.length === 0) && (
              <div className="text-center py-8 text-sm text-indigo-900/40 font-medium">
                No recent activity events yet.
              </div>
            )}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-indigo-900/40 font-mono">
              Events stream automatically on user interactions
            </span>
          </div>
        </div>

      </div>

      {/* Supabase Registered Accounts Directory Preview */}
      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-950/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-950/5 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-sapphire-600" size={20} />
              <h3 className="text-lg font-black text-indigo-950">Recent Registered Gamer Accounts</h3>
            </div>
            <span className="text-xs font-bold text-sapphire-600">
              {metrics.registeredUsersCount} Total Profiles in Database
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.recentUsers.map((u) => (
              <div 
                key={u.id}
                className="p-4 rounded-2xl bg-azure-50/40 border border-indigo-950/5 flex items-center gap-3"
              >
                <img 
                  src={u.avatar_url || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200'} 
                  alt="" 
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-950/10 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-indigo-950 truncate">{u.display_name || u.username}</h4>
                  <p className="text-[11px] text-indigo-900/50 font-mono truncate">@{u.username}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                    <span className="text-sapphire-700 bg-sapphire-100 px-1.5 py-0.2 rounded font-mono">{u.credits} Credits</span>
                    <span className="text-indigo-900/40">{format(new Date(u.created_at || Date.now()), 'MMM d')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
