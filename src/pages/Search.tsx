import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Flame, Sparkles, Gamepad2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Post } from '../types';
import { getLivePosts } from '../lib/supabase';
import { ArticleCard } from '../components/ui/ArticleCard';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';
import { SearchAutocomplete } from '../components/search/SearchAutocomplete';

const QUICK_ROBLOX_GAMES = [
  'Blox Fruits',
  'Fisch',
  'Blade Ball',
  'Anime Vanguards',
  'Anime Defenders',
  'King Legacy',
  'Pet Simulator 99',
  'Genshin Impact',
];

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Codes' | 'News' | 'Mods'>('All');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getLivePosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Sync state if URL search param changes
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleQueryUpdate = (newQ: string) => {
    setQuery(newQ);
    if (newQ.trim()) {
      setSearchParams({ q: newQ.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredPosts = posts.filter(p => {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    const titleMatch = p.title.toLowerCase().includes(q);
    const contentMatch = p.content_text && p.content_text.toLowerCase().includes(q);
    const codesMatch = p.codes_data && p.codes_data.some(c => 
      c.game.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) || 
      (c.reward && c.reward.toLowerCase().includes(q))
    );

    return titleMatch || contentMatch || codesMatch;
  }).filter(p => {
    if (activeTab === 'All') return true;
    return p.category === activeTab;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-14 w-full min-h-[75vh] pb-28 md:pb-16 space-y-6">
      
      {/* Header Banner */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sapphire-50 border border-sapphire-600/20 text-sapphire-700 text-xs font-black uppercase tracking-wider font-mono">
          <Sparkles size={13} className="text-sapphire-600" /> Real-Time Search Engine
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-950 tracking-tight">
          Find Active Game Codes, Guides & Meta Leaks
        </h1>
        <p className="text-xs sm:text-sm text-indigo-900/60 font-medium">
          Instant autocomplete suggestions across 100+ verified Roblox experiences and gaming drops.
        </p>
      </div>

      {/* Dynamic Search Autocomplete Component */}
      <SearchAutocomplete
        initialQuery={query}
        onQueryChange={handleQueryUpdate}
        variant="page"
        placeholder="Type game name, promo code, or reward (e.g. Blox Fruits, Fisch, Stat Reset)..."
      />

      {/* Quick Suggestions Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-black uppercase tracking-wider text-indigo-900/50 inline-flex items-center gap-1 font-mono">
          <Flame size={13} className="text-amber-500" /> Hot Suggestions:
        </span>
        {QUICK_ROBLOX_GAMES.map((gameName) => (
          <button
            key={gameName}
            onClick={() => handleQueryUpdate(gameName)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
              query.toLowerCase() === gameName.toLowerCase()
                ? 'bg-sapphire-600 text-white border-sapphire-600 shadow-xs'
                : 'bg-white border-indigo-950/10 text-indigo-950 hover:border-sapphire-600 hover:text-sapphire-600'
            }`}
          >
            {gameName}
          </button>
        ))}
      </div>

      {/* Search Page Dedicated Direct Link Bonus CTA */}
      <BonusCodeCta 
        title="Search Bonus Rewards & Credit Claim" 
        subtitle="Claim +100 wallet credits and access secret promotional drops for your favorite games!" 
      />

      {/* Search Page Dedicated Ad Slot */}
      <UniversalAdSlot slotId="search_page_banner" />

      {/* Results Filter Tabs (when query is present or browsing) */}
      <div className="flex items-center justify-between border-b border-indigo-950/10 pb-4 pt-2">
        <div className="flex items-center gap-2">
          {(['All', 'Codes', 'News', 'Mods'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'bg-azure-50 text-indigo-900/70 hover:bg-azure-100 hover:text-indigo-950'
              }`}
            >
              {tab === 'All' ? 'All Results' : tab}
            </button>
          ))}
        </div>

        {query && (
          <span className="text-xs font-bold text-indigo-900/50">
            Found <strong className="text-sapphire-700 font-mono">{filteredPosts.length}</strong> items
          </span>
        )}
      </div>

      {/* Results Content */}
      {!query ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <Gamepad2 size={18} className="text-sapphire-600" /> Featured Active Games
            </h2>
            <Link to="/codes" className="text-xs font-bold text-sapphire-600 hover:underline">
              View All Codes →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              post.category === 'Codes' ? (
                <CodeGameCard key={post.id} post={post} />
              ) : (
                <ArticleCard key={post.id} post={post} />
              )
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-20 font-bold text-sapphire-600 animate-pulse">
          Searching verified databases & live drops...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-indigo-950/10 p-8 shadow-xs space-y-3">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <SearchIcon size={24} />
          </div>
          <h3 className="text-lg font-bold text-indigo-950">No matches found for "{query}"</h3>
          <p className="text-xs text-indigo-900/60 max-w-sm mx-auto">
            Try searching for another game title like <strong>Blox Fruits</strong>, <strong>Blade Ball</strong>, or browse the complete codes vault.
          </p>
          <div className="pt-2">
            <Link
              to="/codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white text-xs font-black transition-colors"
            >
              Browse All Active Codes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-indigo-950">
            Search Results for "{query}" ({filteredPosts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => {
              if (post.category === 'Codes') {
                return <CodeGameCard key={post.id} post={post} />;
              }
              return <ArticleCard key={post.id} post={post} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
