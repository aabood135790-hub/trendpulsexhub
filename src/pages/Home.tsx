import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Sparkles, Users } from 'lucide-react';
import { Post } from '../types';
import { getPosts } from '../lib/mock-data';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { ArticleCard } from '../components/ui/ArticleCard';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { usePageSEO } from '../lib/seo';

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGameFilter, setSelectedGameFilter] = useState('All');

  usePageSEO({
    title: 'Working Game Codes, Free Rewards & Gaming News',
    description: 'Discover daily verified working promo codes, free rewards, and breaking update leaks for Roblox Blox Fruits, Fisch, Blade Ball, and more at TrendPulseXhub.com.',
    keywords: 'roblox codes, blox fruits codes, fisch codes, blade ball codes, working promo codes 2026, free rewards',
  });

  useEffect(() => {
    async function load() {
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  const allCodePosts = posts.filter(p => p.category === 'Codes');
  const filteredCodePosts = selectedGameFilter === 'All'
    ? allCodePosts.slice(0, 8)
    : allCodePosts.filter(p => p.title.toLowerCase().includes(selectedGameFilter.toLowerCase()) || p.codes_data?.some(c => c.game.toLowerCase().includes(selectedGameFilter.toLowerCase()))).slice(0, 8);

  const newsPosts = posts.filter(p => p.category === 'News').slice(0, 3);
  const modPosts = posts.filter(p => p.category === 'Mods').slice(0, 2);

  const ROBLOX_POPULAR_GAMES = [
    'All',
    'Blox Fruits',
    'Fisch',
    'Blade Ball',
    'Anime Vanguards',
    'Anime Defenders',
    'King Legacy',
    'Pet Simulator 99',
    'All Star Tower Defense',
  ];

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-indigo-950 pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sapphire-600/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-sky-500/20 to-transparent blur-3xl" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 mb-6 backdrop-blur-md"
          >
            <Flame size={16} className="text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Daily Verified Rewards</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg max-w-4xl"
          >
            Unlock More. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-azure-100 via-sky-300 to-sapphire-400">Play Smarter.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl font-medium text-azure-50/85 max-w-2xl"
          >
            Discover the latest gaming promo codes, active rewards, breaking news, and curated mods — hand-curated and updated daily.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/codes" className="flex h-14 items-center justify-center rounded-xl bg-sapphire-600 px-8 text-base font-black text-white transition-all hover:scale-105 hover:bg-sapphire-500 shadow-[0_0_25px_rgba(0,71,171,0.5)] border border-sky-400/30">
              Explore Promo Codes Hub
            </Link>
            <Link to="/news" className="flex h-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-8 text-base font-bold text-white transition-all hover:bg-white/20">
              Read Gaming News
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 md:space-y-28">
        {/* Trending Roblox Game Codes Cards Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-sapphire-600" size={20} />
                <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Trending Roblox Codes</h2>
              </div>
              <p className="text-sm font-semibold text-indigo-900/50 mt-1">Select an experience below to view verified active codes & rewards</p>
            </div>
            <Link to="/codes" className="hidden sm:flex items-center text-sm font-bold text-sapphire-600 hover:text-sapphire-500 transition-colors gap-1">
              View All Roblox Games <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Roblox Filter Chips */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ROBLOX_POPULAR_GAMES.map((gameName) => {
              const isActive = selectedGameFilter === gameName;
              return (
                <button
                  key={gameName}
                  onClick={() => setSelectedGameFilter(gameName)}
                  className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/25 scale-105'
                      : 'bg-white text-indigo-950/70 border border-indigo-950/10 hover:bg-azure-50 hover:text-sapphire-600'
                  }`}
                >
                  {gameName === 'All' ? 'All Roblox' : gameName}
                </button>
              );
            })}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-indigo-950/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCodePosts.map((post) => (
                <CodeGameCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <Link to="/codes" className="flex h-12 w-full items-center justify-center rounded-xl bg-azure-100 text-sm font-bold text-sapphire-700 hover:bg-azure-200 transition-colors">
              View All Roblox Codes Vault →
            </Link>
          </div>
        </section>

        {/* Community Feed Spotlight */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-azure-100/70 via-white to-azure-50 p-6 sm:p-10 border border-sapphire-600/20 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sapphire-600/10 text-sapphire-700 text-xs font-black uppercase tracking-wider">
                <Users size={13} /> The Community Hub
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                Connect, Share Codes & Post In-Game Photos
              </h2>
              <p className="text-sm font-medium text-indigo-900/70 leading-relaxed">
                Join thousands of gamers sharing instant code redemption screenshots, raid loadouts, and secret game drops in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/community"
                className="flex items-center gap-2 bg-sapphire-600 hover:bg-sapphire-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-md shadow-sapphire-600/25 transition-all hover:scale-105"
              >
                <Users size={16} /> Enter Community Feed <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Adsterra / Sponsor Bonus Reward CTA */}
        <section className="space-y-6">
          <BonusCodeCta />
          <UniversalAdSlot slotId="home_feed_banner" />
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Latest Intel</h2>
            <Link to="/news" className="hidden sm:flex items-center text-sm font-bold text-sapphire-600 hover:text-sapphire-500 transition-colors gap-1">
              All News <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-indigo-950/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsPosts.map((post, i) => (
                <ArticleCard key={post.id} post={post} featured={i === 0} />
              ))}
            </div>
          )}
        </section>

        {/* Mods Preview */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Featured Mods</h2>
            <Link to="/mods" className="hidden sm:flex items-center text-sm font-bold text-sapphire-600 hover:text-sapphire-500 transition-colors gap-1">
              Browse Mods <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modPosts.map(post => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

