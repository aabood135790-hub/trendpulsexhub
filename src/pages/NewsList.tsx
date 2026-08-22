import { useEffect, useState } from 'react';
import { Post } from '../types';
import { getPosts } from '../lib/mock-data';
import { ArticleCard } from '../components/ui/ArticleCard';
import { usePageSEO } from '../lib/seo';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';

export function NewsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSEO({
    title: 'Gaming News, Secret Leaks & Event Updates',
    description: 'Get the latest breaking gaming news, secret code drops, and update leaks for top Roblox games.',
    keywords: 'gaming news, roblox leaks, secret codes, update events',
  });

  useEffect(() => {
    async function load() {
      const data = await getPosts('News');
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full pb-24 md:pb-16 space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Gaming News & Viral Leaks</h1>
        <p className="mt-4 text-base md:text-lg font-medium text-indigo-900/60 max-w-2xl">
          Stay updated with breaking gaming intel, update leaks, and secret reward drops.
        </p>
      </div>

      {/* Direct Link Bonus Reward Box */}
      <BonusCodeCta 
        title="Gamer Rewards & News Drop Box" 
        subtitle="Claim +100 Credits added directly to your wallet & unlock trending game rewards!" 
      />

      {/* Dedicated News Feed Header Banner */}
      <UniversalAdSlot slotId="news_feed_banner" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse bg-white/50 rounded-2xl h-80 border border-indigo-950/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <ArticleCard key={post.id} post={post} featured={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
