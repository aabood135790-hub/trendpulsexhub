import { useEffect, useState, useMemo } from 'react';
import { Post, CodeEntry } from '../types';
import { getPosts } from '../lib/mock-data';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { CopyButton } from '../components/ui/CopyButton';
import { 
  Sparkles, Search, CheckCircle2, Gamepad2, Flame, Clock, 
  ShieldCheck, Filter, Layers, Zap, Gift, Check 
} from 'lucide-react';
import { usePageSEO } from '../lib/seo';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';

type CategoryFilter = 'All' | 'Popular' | 'Newest' | 'Verified';

const CATEGORY_TABS: Array<{ id: CategoryFilter; label: string; icon: any; description: string }> = [
  { id: 'All', label: 'All Codes', icon: Layers, description: 'Complete repository of gaming codes' },
  { id: 'Popular', label: 'Popular & Trending', icon: Flame, description: 'Top viral Roblox experiences with most active players' },
  { id: 'Newest', label: 'Newest Drops', icon: Clock, description: 'Freshly added & recently updated code batches' },
  { id: 'Verified', label: '100% Verified Working', icon: ShieldCheck, description: 'Tested and confirmed working by editorial team today' },
];

const ROBLOX_FILTER_TABS = [
  { id: 'all', label: 'All Games', query: '' },
  { id: 'blox-fruits', label: 'Blox Fruits', query: 'Blox Fruits' },
  { id: 'fisch', label: 'Fisch', query: 'Fisch' },
  { id: 'blade-ball', label: 'Blade Ball', query: 'Blade Ball' },
  { id: 'anime-vanguards', label: 'Anime Vanguards', query: 'Anime Vanguards' },
  { id: 'anime-defenders', label: 'Anime Defenders', query: 'Anime Defenders' },
  { id: 'king-legacy', label: 'King Legacy', query: 'King Legacy' },
  { id: 'pet-sim-99', label: 'Pet Simulator 99', query: 'Pet Simulator 99' },
  { id: 'astd', label: 'All Star Tower Defense', query: 'All Star' },
];

const POPULAR_GAME_KEYWORDS = ['blox fruits', 'fisch', 'blade ball', 'anime vanguards', 'pet simulator', 'king legacy'];

export function CodesList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [selectedGameTab, setSelectedGameTab] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'direct_codes'>('cards');

  usePageSEO({
    title: 'Roblox Working Promo Codes & Free Rewards Directory',
    description: 'Explore the complete directory of verified working Roblox promo codes for Blox Fruits, Fisch, Blade Ball, Anime Defenders, and King Legacy.',
    keywords: 'roblox promo codes, working game codes, free rewards 2026, blox fruits, fisch, blade ball, popular codes, verified codes',
  });

  useEffect(() => {
    async function load() {
      const data = await getPosts('Codes');
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filter posts based on Category, Game Pill, and Search Query
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 1. Category Filter ('All' | 'Popular' | 'Newest' | 'Verified')
    if (categoryFilter === 'Popular') {
      result = result.filter(p => {
        const titleLower = p.title.toLowerCase();
        const isPopularGame = POPULAR_GAME_KEYWORDS.some(k => titleLower.includes(k));
        const hasHighCodeCount = (p.codes_data || []).filter(c => c.status === 'Active').length >= 3;
        return isPopularGame || hasHighCodeCount;
      });
    } else if (categoryFilter === 'Newest') {
      // Sort by updated_at or created_at descending
      result.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA;
      });
    } else if (categoryFilter === 'Verified') {
      // Must have active, verified working codes
      result = result.filter(p => (p.codes_data || []).some(c => c.status === 'Active'));
    }

    // 2. Game Pill Tab Filter
    if (selectedGameTab !== 'all') {
      const tabObj = ROBLOX_FILTER_TABS.find(t => t.id === selectedGameTab);
      if (tabObj && tabObj.query) {
        const q = tabObj.query.toLowerCase();
        result = result.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.codes_data?.some(c => c.game.toLowerCase().includes(q))
        );
      }
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.codes_data?.some(c => 
          c.game.toLowerCase().includes(q) || 
          c.code.toLowerCase().includes(q) || 
          c.reward.toLowerCase().includes(q)
        )
      );
    }

    return result;
  }, [posts, categoryFilter, selectedGameTab, searchQuery]);

  // Aggregate all individual active codes from filtered posts for Direct Codes view
  const allFilteredCodes = useMemo(() => {
    const list: Array<{ codeItem: CodeEntry; postTitle: string; postSlug: string }> = [];
    filteredPosts.forEach(post => {
      (post.codes_data || []).forEach(c => {
        if (categoryFilter === 'Verified' ? c.status === 'Active' : true) {
          list.push({
            codeItem: c,
            postTitle: post.title,
            postSlug: post.slug,
          });
        }
      });
    });
    return list;
  }, [filteredPosts, categoryFilter]);

  const totalActiveCodesCount = useMemo(() => {
    return filteredPosts.reduce((acc, p) => acc + (p.codes_data || []).filter(c => c.status === 'Active').length, 0);
  }, [filteredPosts]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full pb-28 md:pb-16 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sapphire-600/20 bg-sapphire-50 px-4 py-1 text-xs font-black uppercase tracking-wider text-sapphire-700">
          <Sparkles size={14} className="text-sapphire-600 animate-pulse" />
          Verified Gaming Promo Codes Vault
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
          Roblox Promo Codes Directory
        </h1>
        <p className="text-sm md:text-base font-medium text-indigo-900/60 max-w-2xl mx-auto">
          Filter by popularity, latest drops, or verified working status. Copy any code with a single click to claim free boosts, spins, and stat resets instantly.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-900/40" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search game, code or reward (e.g. Blox Fruits, EXP, Reset)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-indigo-950/15 rounded-2xl text-sm font-semibold text-indigo-950 placeholder-indigo-900/40 focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 shadow-sm transition-all"
          />
        </div>

        {/* Primary Category Filters Tabs ('All', 'Popular', 'Newest', 'Verified') */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-sapphire-600 to-indigo-700 text-white shadow-md shadow-sapphire-600/25 scale-105 ring-2 ring-sky-400/40'
                    : 'bg-white text-indigo-950/70 border border-indigo-950/10 hover:bg-azure-50 hover:text-sapphire-700'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-sky-300' : 'text-indigo-900/40'} />
                <span>{cat.label}</span>
                {cat.id === 'Verified' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    100%
                  </span>
                )}
                {cat.id === 'Popular' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    Hot
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-Filter: Quick Game Selection Pills */}
        <div className="pt-2 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto">
          {ROBLOX_FILTER_TABS.map((tab) => {
            const isActive = selectedGameTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedGameTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-950 text-white shadow-sm'
                    : 'bg-white/80 text-indigo-950/60 border border-indigo-950/10 hover:bg-azure-50 hover:text-indigo-950'
                }`}
              >
                {tab.id === 'all' && <Gamepad2 size={12} className="inline mr-1 -mt-0.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Direct Link Bonus Reward Card */}
      <BonusCodeCta 
        title="Claim Roblox Bonus Codes & Secret Drops" 
        subtitle="Click to claim +100 Credits added directly to your wallet & access direct code redemptions!" 
      />

      {/* Codes Directory Dedicated Universal Ad Banner */}
      <UniversalAdSlot slotId="codes_directory_top" />

      {/* Filter Stats & Display Mode Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-950/10 pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-950">
          <span className="text-indigo-900/60">Showing:</span>
          <span className="rounded-lg bg-sapphire-600 text-white px-2.5 py-0.5 text-xs font-black">
            {filteredPosts.length} Experiences
          </span>
          <span className="rounded-lg bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black">
            {totalActiveCodesCount} Active Codes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between Game Hub Cards and Direct Codes Quick-Copy View */}
          <div className="bg-white p-1 rounded-xl border border-indigo-950/10 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-indigo-950 text-white shadow-2xs' : 'text-indigo-950/60 hover:text-indigo-950'
              }`}
            >
              Game Cards
            </button>
            <button
              onClick={() => setViewMode('direct_codes')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'direct_codes' ? 'bg-indigo-950 text-white shadow-2xs' : 'text-indigo-950/60 hover:text-indigo-950'
              }`}
            >
              <Zap size={12} className="text-amber-400" />
              Direct Codes Quick-Copy
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 size={13} className="stroke-[3]" />
            <span>1-Click Copy Enabled</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Cards or Direct Codes Quick-Copy Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-indigo-950/10" />
          ))}
        </div>
      ) : viewMode === 'direct_codes' ? (
        /* Direct Promo Codes Quick-Copy Table View */
        <div className="bg-white rounded-3xl border border-indigo-950/10 overflow-hidden shadow-sm">
          <div className="p-5 bg-azure-50/70 border-b border-indigo-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                All Active Promo Codes ({allFilteredCodes.length})
              </h3>
              <p className="text-xs text-indigo-900/60 font-medium">
                One-click instant copy with live "Copied!" feedback and automatic reward bonuses.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Category: {categoryFilter}
            </span>
          </div>

          <div className="divide-y divide-indigo-950/5">
            {allFilteredCodes.length === 0 ? (
              <div className="p-12 text-center text-indigo-900/60 font-medium text-sm">
                No promo codes match the selected filter. Try choosing "All Codes".
              </div>
            ) : (
              allFilteredCodes.map(({ codeItem, postTitle, postSlug }) => {
                const isActive = codeItem.status === 'Active';
                return (
                  <div 
                    key={codeItem.id || `${postSlug}_${codeItem.code}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-azure-50/50 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-base font-black text-indigo-950 select-all">
                          {codeItem.code}
                        </span>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 border border-emerald-200">
                            <Check size={10} strokeWidth={3} /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Expired
                          </span>
                        )}
                        <span className="text-xs font-bold text-sapphire-700 bg-sapphire-50 px-2 py-0.5 rounded-md border border-sapphire-200/50">
                          {codeItem.game}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-900/70 font-medium truncate">
                        🎁 {codeItem.reward}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <CopyButton 
                        text={codeItem.code} 
                        variant="default"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : filteredPosts.length > 0 ? (
        /* Game Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <CodeGameCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-indigo-950/10 bg-white p-12 text-center shadow-xs">
          <Gamepad2 size={40} className="mx-auto text-indigo-900/30 mb-3" />
          <h3 className="text-lg font-black text-indigo-950">No Games Found</h3>
          <p className="mt-1 text-xs text-indigo-900/60 font-medium">
            Try adjusting your search query or reset the category filter tab to 'All'.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGameTab('all');
              setCategoryFilter('All');
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sapphire-600 px-4 py-2 text-xs font-bold text-white hover:bg-sapphire-500 shadow-sm cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
