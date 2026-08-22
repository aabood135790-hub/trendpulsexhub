import { useEffect, useState } from 'react';
import { Search as SearchIcon, Flame } from 'lucide-react';
import { Post } from '../types';
import { getPosts } from '../lib/mock-data';
import { ArticleCard } from '../components/ui/ArticleCard';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';

const QUICK_ROBLOX_GAMES = [
  'Blox Fruits',
  'Fisch',
  'Blade Ball',
  'Anime Vanguards',
  'Anime Defenders',
  'King Legacy',
  'Pet Simulator 99',
  'All Star Tower Defense',
];

export function Search() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    (p.content_text && p.content_text.toLowerCase().includes(query.toLowerCase())) ||
    (p.codes_data && p.codes_data.some(c => c.game.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full min-h-[70vh] pb-28 md:pb-16 space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-sapphire-600" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 md:py-5 border-2 border-indigo-950/10 rounded-2xl text-lg font-bold text-indigo-950 placeholder-indigo-900/30 focus:outline-none focus:ring-0 focus:border-sapphire-600 transition-colors bg-white shadow-sm"
          placeholder="Search Roblox experiences (e.g. Blox Fruits, Fisch, Blade Ball)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-indigo-900/50 inline-flex items-center gap-1">
          <Flame size={12} className="text-amber-500" /> Popular:
        </span>
        {QUICK_ROBLOX_GAMES.map((gameName) => (
          <button
            key={gameName}
            onClick={() => setQuery(gameName)}
            className="rounded-xl bg-white border border-indigo-950/10 px-3 py-1.5 text-xs font-bold text-indigo-950 hover:border-sapphire-600 hover:text-sapphire-600 transition-colors cursor-pointer"
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

      {!query ? (
        <div className="text-center py-16 opacity-60">
          <SearchIcon className="mx-auto h-12 w-12 text-indigo-900 mb-3" />
          <p className="text-base font-bold text-indigo-950">Type a Roblox experience name to search promo codes & guides</p>
          <p className="text-xs font-semibold text-indigo-900/60 mt-1">Or click one of the popular tags above to quickly filter</p>
        </div>
      ) : loading ? (
        <div className="text-center py-20 font-bold text-sapphire-600">Searching verified databases...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-indigo-950/10 p-8">
          <p className="text-xl font-bold text-indigo-950 mb-2">No results found for "{query}"</p>
          <p className="text-indigo-900/60 font-medium">Try searching for a different Roblox title.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-indigo-950">Search Results ({filteredPosts.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => {
              if (post.category === 'Codes') {
                return (
                  <CodeGameCard key={post.id} post={post} />
                );
              }
              return (
                <ArticleCard key={post.id} post={post} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
