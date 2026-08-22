import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Tags, Newspaper, Download, Edit, Trash2, Plus, ExternalLink, 
  Bot, RefreshCw, CheckCircle2, Clock, Zap, Database, Megaphone, Flame, 
  Code, Image as ImageIcon, Check, Sliders, AlertCircle, Play, Cpu, Key, 
  Mail, MessageSquare, User, Globe, Link2, Copy, Sparkles, ShieldCheck
} from 'lucide-react';
import { Post } from '../../types';
import { getPosts, clearLocalStorageAndReseed } from '../../lib/mock-data';
import { formatDistanceToNow, format } from 'date-fns';
import { getGameIconUrl, getGameRepresentativeImage } from '../../lib/gameImages';
import { useAds } from '../../context/AdContext';
import { AdSlotId, AdSlotConfig } from '../../lib/adConfig';
import { AISettingsPanel } from '../../components/admin/AISettingsPanel';
import { SEOMetaTagsPanel } from '../../components/admin/SEOMetaTagsPanel';

type AdminTab = 'posts' | 'ads' | 'seo' | 'viral-trends' | 'ai-settings' | 'inquiries';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [viralGenerating, setViralGenerating] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Ad & Direct Link Management from AdContext
  const { 
    adSettings, 
    activeDirectLink, 
    updateSlotConfig, 
    updateGlobalSettings, 
    resetToDefaults, 
    applyPreset 
  } = useAds();

  const [adSuccessMsg, setAdSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [slotFilter, setSlotFilter] = useState<'all' | 'article' | 'sidebar' | 'directory'>('all');

  // Local form inputs for direct links to provide instant typing reactivity
  const [adsterraDirectLink, setAdsterraDirectLink] = useState(adSettings.adsterra_direct_link || '');
  const [viteAdsterraDirectLink, setViteAdsterraDirectLink] = useState(adSettings.vite_adsterra_direct_link || '');

  useEffect(() => {
    setAdsterraDirectLink(adSettings.adsterra_direct_link || '');
    setViteAdsterraDirectLink(adSettings.vite_adsterra_direct_link || '');
  }, [adSettings.adsterra_direct_link, adSettings.vite_adsterra_direct_link]);

  const loadDashboard = async () => {
    const data = await getPosts();
    setPosts(data);
    setLoading(false);

    try {
      const res = await fetch('/api/admin/auto-sync-status');
      if (res.ok) {
        const json = await res.json();
        setSyncStatus(json);
      }
    } catch {}
  };

  const loadContactMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/admin/contact-messages');
      if (res.ok) {
        const data = await res.json();
        setContactMessages(data.messages || []);
      }
    } catch (err) {
      console.warn('Failed to load contact inquiries:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      loadContactMessages();
    }
  }, [activeTab]);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage('Triggering 12-Hour AI Multi-Game Code Scraper & Viral Engine...');
    try {
      const res = await fetch('/api/admin/auto-sync', { method: 'POST' });
      if (res.ok) {
        setSyncMessage('Sync cycle started in background! Updating codes & trend articles...');
        setTimeout(async () => {
          await loadDashboard();
          setSyncing(false);
          setSyncMessage('✓ Codes and viral trends refreshed and synced successfully!');
          setTimeout(() => setSyncMessage(null), 4000);
        }, 2500);
      } else {
        setSyncing(false);
        setSyncMessage('Failed to trigger sync.');
      }
    } catch {
      setSyncing(false);
      setSyncMessage('Network error triggering sync.');
    }
  };

  const handleGenerateViralTrends = async () => {
    setViralGenerating(true);
    setSyncMessage('Generating Viral Gaming Trends & Leaks with Gemini AI (3.7 Flash)...');
    try {
      const res = await fetch('/api/admin/generate-viral-trends', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadDashboard();
        setSyncMessage(`✓ Successfully generated ${data.articles?.length || 4} new Viral Trend articles!`);
        setTimeout(() => setSyncMessage(null), 5000);
      } else {
        setSyncMessage(`Notice: ${data.error || 'Failed to generate viral trends'}`);
      }
    } catch (err: any) {
      setSyncMessage('Network error generating viral trends.');
    } finally {
      setViralGenerating(false);
    }
  };

  const handleReseedDatabase = () => {
    const seeded = clearLocalStorageAndReseed();
    setPosts(seeded);
    setSyncMessage('✓ Local Storage cleared & Database re-seeded with official covers and active game codes!');
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleSaveDirectLinks = () => {
    updateGlobalSettings({
      adsterra_direct_link: adsterraDirectLink.trim(),
      vite_adsterra_direct_link: viteAdsterraDirectLink.trim(),
    });
    setAdSuccessMsg('✓ Adsterra Direct Links saved and dynamically activated across all buttons & claim CTAs!');
    setTimeout(() => setAdSuccessMsg(null), 4500);
  };

  const handleCopyDirectLink = () => {
    if (activeDirectLink) {
      navigator.clipboard.writeText(activeDirectLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSlotChange = (slotId: AdSlotId, partial: Partial<AdSlotConfig>) => {
    updateSlotConfig(slotId, partial);
    setAdSuccessMsg(`✓ Updated configuration for ${adSettings.slots[slotId]?.name || slotId}`);
    setTimeout(() => setAdSuccessMsg(null), 3000);
  };

  const activeSlotKeys = (Object.keys(adSettings.slots) as AdSlotId[]).filter((key) => {
    if (slotFilter === 'article') {
      return key.startsWith('in_article');
    }
    if (slotFilter === 'sidebar') {
      return key.startsWith('sidebar');
    }
    if (slotFilter === 'directory') {
      return ['codes_directory_top', 'news_feed_banner', 'search_page_banner', 'home_feed_banner', 'header_banner', 'footer_banner'].includes(key);
    }
    return true;
  });

  const stats = [
    { label: 'Total Posts', value: posts.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Codes Vault', value: posts.filter(p => p.category === 'Codes').length, icon: Tags, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'News & Leaks', value: posts.filter(p => p.category === 'News').length, icon: Newspaper, color: 'text-sapphire-600', bg: 'bg-sapphire-100' },
    { label: 'Active Ad Slots', value: (Object.values(adSettings.slots) as AdSlotConfig[]).filter(s => s.enabled).length, icon: Megaphone, color: 'text-sky-600', bg: 'bg-sky-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-indigo-950">Admin Control Center</h1>
          <p className="text-sm font-semibold text-indigo-900/60 mt-1">
            Manage codes, viral trends generator, universal ad space, and automated 12-hour sync
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleReseedDatabase}
            title="Clears local storage and re-seeds with official game artwork & codes"
            className="inline-flex items-center justify-center gap-2 bg-indigo-900/10 hover:bg-indigo-900/20 text-indigo-950 border border-indigo-900/20 px-3.5 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Database size={15} />
            <span>Reset & Re-seed</span>
          </button>
          <button
            onClick={handleGenerateViralTrends}
            disabled={viralGenerating}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
          >
            <Flame size={15} className={viralGenerating ? 'animate-bounce' : ''} />
            <span>{viralGenerating ? 'Generating Leaks...' : 'Generate Viral Trends'}</span>
          </button>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-700 to-indigo-900 hover:from-sapphire-600 hover:to-indigo-800 text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-sapphire-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : '12H AI Sync'}</span>
          </button>
          <Link to="/admin/new" className="inline-flex items-center justify-center gap-2 bg-sapphire-600 hover:bg-sapphire-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-sapphire-600/20 transition-colors text-xs sm:text-sm">
            <Plus size={16} strokeWidth={2.5} /> Create Post
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-indigo-950/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('posts')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'posts'
              ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <FileText size={15} /> All Posts ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-gradient-to-r from-sapphire-600 to-sky-600 text-white shadow-md shadow-sapphire-600/25 ring-2 ring-sky-400/40'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <Megaphone size={15} /> Adsterra Ads & Direct Links ({Object.keys(adSettings.slots).length} Slots)
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'seo'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <Globe size={15} className="text-emerald-400" /> SEO & Meta-Tags
        </button>

        <button
          onClick={() => setActiveTab('viral-trends')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'viral-trends'
              ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <Flame size={15} className="text-rose-400" /> Viral Trends Engine
        </button>

        <button
          onClick={() => setActiveTab('ai-settings')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ai-settings'
              ? 'bg-gradient-to-r from-sapphire-600 to-indigo-700 text-white shadow-md shadow-sapphire-600/25 ring-2 ring-sky-400/40'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <Bot size={15} className="text-sky-500" /> AI Service & API Keys
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
              : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
          }`}
        >
          <Mail size={15} className="text-emerald-400" /> Contact Inquiries
          {contactMessages.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
              {contactMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* Automated Background 12-Hour Sync Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-sapphire-900 to-indigo-950 p-6 text-white shadow-xl border border-sapphire-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Bot size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-black text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  12-HOUR AUTONOMOUS CRON ACTIVE
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-azure-500/20 border border-azure-400/30 px-2.5 py-0.5 text-[11px] font-bold text-azure-200">
                  <Zap size={11} /> Gemini 3.7 Flash
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-800/80 border border-indigo-600/40 px-2.5 py-0.5 text-[11px] font-bold text-azure-100">
                  <Database size={11} /> {syncStatus?.supabaseConnected ? 'Supabase Connected' : 'Local Fallback'}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">Automated Code Sync & Viral Trends Engine</h2>
              <p className="text-xs font-medium text-azure-100/70 mt-1 max-w-2xl">
                Background timer executes automatically every 12 hours. It extracts verified promo codes for games and publishes high-impact viral gaming trend articles to keep traffic high.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-left">
              <div className="text-[11px] font-bold text-azure-200/60 uppercase">Last Execution</div>
              <div className="text-sm font-black text-white flex items-center gap-1 mt-0.5">
                <Clock size={13} className="text-sky-400" />
                {syncStatus?.syncState?.lastSyncTime
                  ? formatDistanceToNow(new Date(syncStatus.syncState.lastSyncTime)) + ' ago'
                  : 'Running on startup...'}
              </div>
              {syncStatus?.syncState?.nextSyncTime && (
                <div className="text-[10px] font-semibold text-azure-200/50 mt-0.5">
                  Next: {format(new Date(syncStatus.syncState.nextSyncTime), 'MMM d, h:mm a')}
                </div>
              )}
            </div>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-4 p-3 rounded-xl bg-sky-500/20 border border-sky-400/30 text-xs font-bold text-sky-200 flex items-center gap-2 animate-pulse">
            <CheckCircle2 size={15} /> {syncMessage}
          </div>
        )}
      </div>

      {/* TAB 1: ALL POSTS */}
      {activeTab === 'posts' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white p-5 rounded-2xl border border-indigo-950/5 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-indigo-950">{s.value}</p>
                    <p className="text-xs font-bold text-indigo-900/50 uppercase tracking-wide">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-2xl border border-indigo-950/10 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-indigo-950/5 flex items-center justify-between">
              <h2 className="font-black text-indigo-950 text-base md:text-lg">Recent Content & Code Posts</h2>
              <span className="text-xs font-bold text-indigo-900/40 uppercase">{posts.length} Items</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-azure-50/70 text-xs font-black text-indigo-950/60 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4">Title & Slug</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/5 text-sm">
                  {posts.map(post => {
                    const gameName = post.codes_data?.[0]?.game || post.title.split(' ')[0] || 'Game';
                    const iconUrl = post.image_url || getGameRepresentativeImage(post.title || gameName);

                    return (
                      <tr key={post.id} className="hover:bg-azure-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={iconUrl} 
                              alt={post.title} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover border border-indigo-950/10 shrink-0 bg-slate-900 shadow-2xs" 
                            />
                            <div>
                              <div className="font-bold text-indigo-950 line-clamp-1">{post.title}</div>
                              <div className="text-xs font-medium text-indigo-900/50 font-mono">/{post.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide bg-azure-100 text-sapphire-700 border border-sapphire-200">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-900/70">
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/post/${post.slug}`} target="_blank" className="p-2 text-indigo-900/50 hover:text-indigo-950 hover:bg-azure-100 rounded-lg transition-colors" title="View Live">
                              <ExternalLink size={16} />
                            </Link>
                            <Link to={`/admin/edit/${post.id}`} className="p-2 text-sapphire-600 hover:bg-sapphire-50 rounded-lg transition-colors" title="Edit Post & Cover Image">
                              <Edit size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List View */}
            <div className="md:hidden divide-y divide-indigo-950/5">
              {posts.map(post => (
                <div key={post.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase bg-azure-100 text-sapphire-700 border border-sapphire-200">
                        {post.category}
                      </span>
                      <h3 className="font-bold text-indigo-950 text-base leading-snug">{post.title}</h3>
                      <p className="text-xs text-indigo-900/50 font-mono">/{post.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-indigo-900/60">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link to={`/post/${post.slug}`} className="p-2 text-indigo-900/60 hover:bg-azure-100 rounded-lg" title="View">
                        <ExternalLink size={16} />
                      </Link>
                      <Link to={`/admin/edit/${post.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-sapphire-600 text-white rounded-lg text-xs font-bold shadow-sm">
                        <Edit size={14} /> Edit Cover
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: DYNAMIC ADSTERRA DIRECT LINK & BANNER AD MANAGER */}
      {activeTab === 'ads' && (
        <div className="space-y-8">
          {/* Header Action Bar */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire-50 border border-sapphire-200 text-sapphire-700 text-xs font-black uppercase tracking-wider mb-2">
                <Megaphone size={13} /> Dynamic Adsterra Monetization Hub
              </div>
              <h2 className="text-xl md:text-2xl font-black text-indigo-950">Adsterra Direct Links & Banner Manager</h2>
              <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
                Configure primary Adsterra Direct Link URLs and dynamic Banner scripts. Changes persist to Supabase backend and update instantly across all code buttons, claim rewards, and page banner slots without requiring rebuilds.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={resetToDefaults}
                className="px-3.5 py-2 rounded-xl border border-indigo-950/15 text-xs font-bold text-indigo-900/70 hover:bg-azure-50 transition-colors cursor-pointer"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => updateGlobalSettings({ global_ads_enabled: !adSettings.global_ads_enabled })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  adSettings.global_ads_enabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                }`}
              >
                {adSettings.global_ads_enabled ? '✓ Monetization Active' : '✕ Ads Disabled'}
              </button>
            </div>
          </div>

          {adSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600" /> {adSuccessMsg}
            </div>
          )}

          {/* 1. DEDICATED ADSTERRA DIRECT LINK CONTROL SUITE */}
          <div className="bg-gradient-to-br from-indigo-950 via-sapphire-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sapphire-400/25 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-wider">
                  <Link2 size={16} /> High-CPM Direct Link Engine
                </div>
                <h3 className="text-lg md:text-xl font-black text-white mt-1">
                  Dynamic Adsterra Direct Link URLs
                </h3>
                <p className="text-xs text-azure-100/70 font-medium mt-0.5">
                  These URLs power every single "Copy Code", "Claim Bonus Box", and "Get Rewards" trigger site-wide.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <ExternalLink size={13} /> Test Direct Link
                </a>
                <button
                  onClick={handleCopyDirectLink}
                  className="inline-flex items-center gap-1.5 bg-sky-400 hover:bg-sky-300 text-indigo-950 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
            </div>

            {/* Inputs for ADSTERRA_DIRECT_LINK and VITE_ADSTERRA_DIRECT_LINK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center justify-between">
                  <span>Primary Direct Link (ADSTERRA_DIRECT_LINK)</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Highest Priority</span>
                </label>
                <input
                  type="text"
                  value={adsterraDirectLink}
                  onChange={(e) => setAdsterraDirectLink(e.target.value)}
                  placeholder="https://www.profitablecpmrate.com/d0b9y9a3e?key=..."
                  className="w-full bg-slate-900/90 border border-sky-400/30 rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-inner"
                />
                <p className="text-[11px] text-azure-100/60 font-medium">
                  Primary Adsterra smartlink for background tab redirects upon gamer code copies.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-azure-200 flex items-center justify-between">
                  <span>Client Fallback Link (VITE_ADSTERRA_DIRECT_LINK)</span>
                  <span className="text-[10px] font-mono text-sky-300 font-bold">Client Fallback</span>
                </label>
                <input
                  type="text"
                  value={viteAdsterraDirectLink}
                  onChange={(e) => setViteAdsterraDirectLink(e.target.value)}
                  placeholder="https://www.profitablecpmrate.com/..."
                  className="w-full bg-slate-900/90 border border-white/20 rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-inner"
                />
                <p className="text-[11px] text-azure-100/60 font-medium">
                  Secondary fallback URL if no primary link is returned by backend config.
                </p>
              </div>
            </div>

            {/* Currently Active Live URL Indicator & Save Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 bg-black/20 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-azure-200 shrink-0">Live Active Link:</span>
                <span className="text-xs font-mono text-emerald-300 truncate font-semibold">
                  {activeDirectLink}
                </span>
              </div>

              <button
                onClick={handleSaveDirectLinks}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-azure-300 hover:from-sky-300 hover:to-azure-200 text-indigo-950 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-sky-400/25 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Check size={15} strokeWidth={3} />
                <span>Save & Activate Direct Links</span>
              </button>
            </div>

            {/* Monetization Preset Quick Buttons */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-azure-200/80">Monetization Presets:</span>
              <button
                onClick={() => applyPreset('adsterra_high_cpm')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                ⚡ Adsterra Max CPM (All 12 Slots Active)
              </button>
              <button
                onClick={() => applyPreset('adsterra_native_banners')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                🖼️ Native Gamers Banner Preset
              </button>
              <button
                onClick={() => applyPreset('clean_monetization')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                ✨ Clean Balanced Layout (5 Slots)
              </button>
            </div>
          </div>

          {/* 2. DYNAMIC ADSTERRA BANNER AD SLOTS MANAGEMENT */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                  <Megaphone size={18} className="text-sapphire-600" />
                  Dynamic Banner Ad Placements ({activeSlotKeys.length} Showing)
                </h3>
                <p className="text-xs text-indigo-900/60 font-medium mt-0.5">
                  Insert Adsterra Banner Javascript tags (`&lt;script&gt;` / `&lt;iframe&gt;`) or custom creatives for each responsive placement.
                </p>
              </div>

              {/* Slot Category Filters */}
              <div className="flex items-center gap-1.5 bg-azure-50 p-1 rounded-2xl border border-indigo-950/5">
                <button
                  onClick={() => setSlotFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    slotFilter === 'all' ? 'bg-sapphire-600 text-white shadow-xs' : 'text-indigo-950/70 hover:text-indigo-950'
                  }`}
                >
                  All ({Object.keys(adSettings.slots).length})
                </button>
                <button
                  onClick={() => setSlotFilter('article')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    slotFilter === 'article' ? 'bg-sapphire-600 text-white shadow-xs' : 'text-indigo-950/70 hover:text-indigo-950'
                  }`}
                >
                  In-Article
                </button>
                <button
                  onClick={() => setSlotFilter('sidebar')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    slotFilter === 'sidebar' ? 'bg-sapphire-600 text-white shadow-xs' : 'text-indigo-950/70 hover:text-indigo-950'
                  }`}
                >
                  Sidebars
                </button>
                <button
                  onClick={() => setSlotFilter('directory')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    slotFilter === 'directory' ? 'bg-sapphire-600 text-white shadow-xs' : 'text-indigo-950/70 hover:text-indigo-950'
                  }`}
                >
                  Directories & Headers
                </button>
              </div>
            </div>

            {/* Render Slot Cards */}
            <div className="space-y-6">
              {activeSlotKeys.map((slotKey) => {
                const slot = adSettings.slots[slotKey];
                if (!slot) return null;

                return (
                  <div 
                    key={slotKey} 
                    className={`bg-white rounded-3xl border transition-all p-6 shadow-sm space-y-5 ${
                      slot.enabled ? 'border-indigo-950/10' : 'border-slate-200 opacity-70 bg-slate-50/50'
                    }`}
                  >
                    {/* Slot Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950/5">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${slot.enabled ? 'bg-sapphire-100 text-sapphire-700' : 'bg-slate-200 text-slate-500'}`}>
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-indigo-950 text-base">{slot.name}</h4>
                            <span className="font-mono text-[10px] bg-azure-100 text-sapphire-800 px-2 py-0.5 rounded-md font-bold">
                              {slotKey}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-indigo-900/50 mt-0.5">{slot.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold bg-azure-50 px-3 py-1.5 rounded-xl border border-indigo-950/5 text-indigo-950">
                          {slot.size_label}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={(e) => handleSlotChange(slotKey, { enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          <span className="ml-2 text-xs font-bold text-indigo-950">
                            {slot.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Slot Configuration Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block mb-1.5">
                          Ad Network / Mode
                        </label>
                        <select
                          value={slot.network_type}
                          onChange={(e) => handleSlotChange(slotKey, { network_type: e.target.value as any })}
                          className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600"
                        >
                          <option value="Adsterra">Adsterra (JS Script / iframe Tag)</option>
                          <option value="DirectLink">Direct Link Native CTA Card</option>
                          <option value="BannerImage">Custom Image Banner + Target Link</option>
                          <option value="Custom">Custom HTML / JS Code</option>
                        </select>
                        <p className="text-[11px] text-indigo-900/50 font-medium mt-1">
                          Select Adsterra to run ad tags or DirectLink for native high-CTR triggers.
                        </p>
                      </div>

                      {/* Script Input for Adsterra / Custom */}
                      {(slot.network_type === 'Adsterra' || slot.network_type === 'Custom') && (
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center justify-between">
                            <span>Adsterra Banner Script / Tag Code</span>
                            <span className="text-[10px] font-mono text-sapphire-600 font-bold">Supports &lt;script&gt; & &lt;iframe&gt;</span>
                          </label>
                          <textarea
                            rows={3}
                            value={slot.html_script || ''}
                            onChange={(e) => handleSlotChange(slotKey, { html_script: e.target.value })}
                            placeholder={`<script type="text/javascript">\n\tatOptions = {\n\t\t'key' : '95a4358f27806f1d8c1c4e7825b448f8',\n\t\t'format' : 'iframe',\n\t\t'height' : 90,\n\t\t'width' : 728,\n\t\t'params' : {}\n\t};\n</script>\n<script type="text/javascript" src="//www.topcreativeformat.com/..."></script>`}
                            className="w-full bg-slate-900 border border-indigo-950/15 rounded-2xl p-3 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-sapphire-600"
                          />
                          <p className="text-[11px] text-indigo-900/50 font-medium">
                            Paste your Adsterra Banner HTML/JS snippet directly. It executes inside an isolated container.
                          </p>
                        </div>
                      )}

                      {/* Image Banner Fields */}
                      {slot.network_type === 'BannerImage' && (
                        <>
                          <div>
                            <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block mb-1.5">
                              Banner Creative Image URL
                            </label>
                            <input
                              type="text"
                              value={slot.banner_image_url || ''}
                              onChange={(e) => handleSlotChange(slotKey, { banner_image_url: e.target.value })}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block mb-1.5">
                              Destination Link (Defaults to Direct Link)
                            </label>
                            <input
                              type="text"
                              value={slot.target_url || ''}
                              onChange={(e) => handleSlotChange(slotKey, { target_url: e.target.value })}
                              placeholder={activeDirectLink}
                              className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
                            />
                          </div>
                        </>
                      )}

                      {/* Custom Title / Alt text */}
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block mb-1.5">
                          Banner Headline / Alt Label
                        </label>
                        <input
                          type="text"
                          value={slot.alt_text || ''}
                          onChange={(e) => handleSlotChange(slotKey, { alt_text: e.target.value })}
                          placeholder="Unlock Exclusive Roblox Bonus Pack & Gift Codes"
                          className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIRAL TRENDS & LEAKS ENGINE */}
      {activeTab === 'viral-trends' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="text-rose-500" size={22} />
                <h2 className="text-xl font-black text-indigo-950">Automated Viral Trends Engine (12-Hour Schedule)</h2>
              </div>
              <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
                Uses Gemini AI to generate click-worthy, viral gaming trend articles, secret update leaks, and active code releases every 12 hours.
              </p>
            </div>
            <button
              onClick={handleGenerateViralTrends}
              disabled={viralGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play size={16} fill="white" />
              {viralGenerating ? 'Generating Trends with Gemini...' : 'Generate New Trend Batch Now'}
            </button>
          </div>

          {/* Telemetry & Cron Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-indigo-950/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-indigo-900/50 uppercase">Sync Interval</span>
              <p className="text-xl font-black text-indigo-950">Every 12 Hours</p>
              <span className="text-xs text-emerald-600 font-bold">Autonomous Cron Active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-indigo-950/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-indigo-900/50 uppercase">AI Intelligence Engine</span>
              <p className="text-xl font-black text-indigo-950">Gemini 3.7 Flash</p>
              <span className="text-xs text-sky-600 font-bold">High-Impact Clickworthy Titles</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-indigo-950/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-indigo-900/50 uppercase">Monitored Gaming Topics</span>
              <p className="text-xl font-black text-indigo-950">Blox Fruits, Fortnite, Fisch</p>
              <span className="text-xs text-indigo-900/60 font-semibold">Anime Defenders, Genshin</span>
            </div>
          </div>

          {/* Sync Engine Log Feed */}
          {syncStatus?.syncState?.logs && (
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sky-400 flex items-center gap-2">
                  <Code size={16} /> Background Engine Live Logs
                </span>
                <span className="text-[10px] text-slate-400">Showing latest events</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {syncStatus.syncState.logs.map((log: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-500 text-[10px] shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warn' ? 'text-amber-400' :
                      log.type === 'error' ? 'text-rose-400' : 'text-slate-300'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SEO & META-TAGS SUITE */}
      {activeTab === 'seo' && (
        <SEOMetaTagsPanel
          posts={posts}
          onPostUpdate={(updated) => {
            setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
        />
      )}

      {/* TAB 5: AI SERVICE & API KEYS MANAGEMENT */}
      {activeTab === 'ai-settings' && (
        <AISettingsPanel />
      )}

      {/* TAB 6: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                <Mail size={20} className="text-sapphire-600" />
                Contact Form Inquiries ({contactMessages.length})
              </h2>
              <p className="text-xs text-indigo-900/60 font-medium mt-1">
                Messages submitted by users via the on-site /contact form.
              </p>
            </div>
            <button
              onClick={loadContactMessages}
              disabled={loadingMessages}
              className="inline-flex items-center gap-2 bg-azure-50 hover:bg-azure-100 text-indigo-950 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-950/10 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loadingMessages ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingMessages ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-indigo-950/10 shadow-sm">
              <RefreshCw size={24} className="animate-spin text-sapphire-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-indigo-950">Loading inquiries...</p>
            </div>
          ) : contactMessages.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-indigo-950/10 shadow-sm space-y-2">
              <MessageSquare size={32} className="text-indigo-900/30 mx-auto" />
              <h3 className="font-bold text-sm text-indigo-950">No Contact Inquiries Yet</h3>
              <p className="text-xs text-indigo-900/60 max-w-sm mx-auto">
                Messages sent through the /contact page will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactMessages.map((msg: any) => (
                <div key={msg.id} className="bg-white rounded-3xl p-6 border border-indigo-950/10 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-950/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sapphire-50 text-sapphire-700 flex items-center justify-center font-bold text-xs">
                        {msg.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-indigo-950">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-xs text-sapphire-600 hover:underline font-mono">
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-azure-100 text-azure-800">
                        {msg.subject || 'Inquiry'}
                      </span>
                      <span className="text-[11px] text-indigo-900/40 font-medium">
                        {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : 'Recently'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-950/80 leading-relaxed whitespace-pre-wrap bg-azure-50/40 p-4 rounded-2xl border border-indigo-950/5">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
