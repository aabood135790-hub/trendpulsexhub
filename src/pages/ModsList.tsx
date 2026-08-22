import { useEffect, useState } from 'react';
import { Post } from '../types';
import { getPosts } from '../lib/mock-data';
import { ArticleCard } from '../components/ui/ArticleCard';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';
import { usePageSEO } from '../lib/seo';

export function ModsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSEO({
    title: 'Verified Game Mods & Enhancements',
    description: 'Download verified, tested game mods, scripts, and expansions with zero malware guarantee.',
    keywords: 'game mods, verified mod downloads, roblox scripts, gaming addons',
  });

  useEffect(() => {
    async function load() {
      const data = await getPosts('Mods');
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full pb-24 md:pb-16 space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Game Mods & Scripts</h1>
        <p className="mt-4 text-base md:text-lg font-medium text-indigo-900/60 max-w-2xl">
          Enhance your gameplay with our curated selection of verified mods and expansions.
        </p>
      </div>

      {/* Direct Link Bonus Box */}
      <BonusCodeCta 
        title="Modder Perk Box & Bonus Claim" 
        subtitle="Claim +100 Credits added directly to your wallet & access direct verified downloads!" 
      />

      {/* Category Sidebar/Banner Ad Slot */}
      <UniversalAdSlot slotId="sidebar_category" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => (
            <div key={i} className="animate-pulse bg-white/50 rounded-2xl h-80 border border-indigo-950/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
