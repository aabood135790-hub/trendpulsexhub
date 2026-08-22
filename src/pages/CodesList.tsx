import { useEffect, useState, useMemo } from 'react';
import { Post } from '../types';
import { getPosts } from '../lib/mock-data';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { Sparkles, Search, CheckCircle2, Gamepad2 } from 'lucide-react';
import { usePageSEO } from '../lib/seo';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';

const ROBLOX_FILTER_TABS = [
  { id: 'all', label: 'All Roblox Games', query: '' },
  { id: 'blox-fruits', label: 'Blox Fruits', query: 'Blox Fruits' },
  { id: 'fisch', label: 'Fisch', query: 'Fisch' },
  { id: 'blade-ball', label: 'Blade Ball', query: 'Blade Ball' },
  { id: 'anime-vanguards', label: 'Anime Vanguards', query: 'Anime Vanguards' },
  { id: 'anime-defenders', label: 'Anime Defenders', query: 'Anime Defenders' },
  { id: 'king-legacy', label: 'King Legacy', query: 'King Legacy' },
  { id: 'pet-sim-99', label: 'Pet Simulator 99', query: 'Pet Simulator 99' },
  { id: 'astd', label: 'All Star Tower Defense', query: 'All Star' },
];

export function CodesList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  usePageSEO({
    title: 'Roblox Working Promo Codes & Free Rewards Directory',
    description: 'Explore the complete directory of verified working Roblox promo codes for Blox Fruits, Fisch, Blade Ball, Anime Defenders, and King Legacy.',
    keywords: 'roblox promo codes, working game codes, free rewards 2026, blox fruits, fisch, blade ball',
  });

  useEffect(() => {
    async function load() {
      const data = await getPosts('Codes');
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Apply Tab filter
    if (selectedTab !== 'all') {
      const tabObj = ROBLOX_FILTER_TABS.find(t => t.id === selectedTab);
      if (tabObj && tabObj.query) {
        const q = tabObj.query.toLowerCase();
        result = result.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.codes_data?.some(c => c.game.toLowerCase().includes(q))
        );
      }
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.codes_data?.some(c => c.game.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.reward.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, selectedTab, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full pb-28 md:pb-16 space-y-8">
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sapphire-600/20 bg-sapphire-50 px-4 py-1 mb-4 text-xs font-black uppercase tracking-wider text-sapphire-700">
          <Sparkles size={14} className="text-sapphire-600" />
          Verified Roblox Promo Codes Vault
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
          Roblox Promo Codes
        </h1>
        <p className="mt-3 text-base md:text-lg font-medium text-indigo-900/60 max-w-2xl mx-auto">
          Select your Roblox experience to view 100% verified working codes, stat resets, 2x EXP boosts, and instant rewards.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-900/40" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Roblox game (e.g. Blox Fruits, Fisch, Blade Ball)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-indigo-950/15 rounded-2xl text-sm font-semibold text-indigo-950 placeholder-indigo-900/40 focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 shadow-sm transition-all"
          />
        </div>

        {/* Roblox Game Filter Tabs */}
        <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ROBLOX_FILTER_TABS.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/25 scale-105'
                    : 'bg-white text-indigo-950/70 border border-indigo-950/10 hover:bg-azure-50 hover:text-sapphire-600'
                }`}
              >
                {tab.id === 'all' && <Gamepad2 size={13} className="inline mr-1.5 -mt-0.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Direct Link Bonus Reward Card */}
      <BonusCodeCta 
        title="Claim Roblox Bonus Codes & Free Gift Drops" 
        subtitle="Click to claim +100 Credits added directly to your wallet & access direct code redemptions!" 
      />

      {/* Codes Directory Dedicated Universal Ad Banner */}
      <UniversalAdSlot slotId="codes_directory_top" />

      {/* Stats Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-950/10 pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-950">
          <span>Active Roblox Hubs:</span>
          <span className="rounded-md bg-sapphire-600 text-white px-2 py-0.5 text-xs font-black">
            {filteredPosts.length} Experiences
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 size={13} className="stroke-[3]" />
          <span>All Roblox codes tested today</span>
        </div>
      </div>

      {/* Game Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-indigo-950/10" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <CodeGameCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-indigo-950/10 p-8">
          <p className="text-indigo-950 font-black text-lg">No Roblox games found matching "{searchQuery}"</p>
          <p className="text-sm font-medium text-indigo-900/60 mt-1">Try searching for a different game name or reset filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
            className="mt-4 px-4 py-2 bg-sapphire-600 text-white rounded-xl text-xs font-bold hover:bg-sapphire-500 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
