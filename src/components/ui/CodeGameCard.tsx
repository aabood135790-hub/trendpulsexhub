import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { getGameRepresentativeImage, getGameIconUrl, getGameMetadata } from '../../lib/gameImages';

interface CodeGameCardProps {
  post: Post;
  key?: string | number;
}

export function CodeGameCard({ post }: CodeGameCardProps) {
  const activeCodes = (post.codes_data || []).filter(c => c.status === 'Active');
  const gameName = post.codes_data?.[0]?.game || post.title.split(' ')[0] || 'Game';
  const displayImage = getGameRepresentativeImage(post.title || gameName, post.image_url);
  const iconImage = getGameIconUrl(post.title || gameName);
  const metadata = getGameMetadata(post.title || gameName);
  
  // Top 2 rewards preview
  const rewardPreviews = activeCodes
    .map(c => c.reward)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Link 
      to={`/post/${post.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-950/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sapphire-600/30 hover:shadow-xl"
    >
      <div>
        {/* Card Header & Official Cover Artwork */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-indigo-950">
          <img 
            src={displayImage} 
            alt={`${post.title} official artwork`} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getGameRepresentativeImage(post.title || gameName);
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/20 to-transparent" />

          {/* Game Badge & Logo Thumbnail */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-indigo-950/90 backdrop-blur-md px-2.5 py-1 text-xs font-black tracking-wide text-white border border-white/15 shadow-sm">
              <img 
                src={iconImage} 
                alt="" 
                className="w-4 h-4 rounded-md object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span>{gameName}</span>
            </div>
            {metadata.badgeTag && (
              <span className="hidden sm:inline-flex items-center rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {metadata.badgeTag}
              </span>
            )}
          </div>

          {/* Active Codes Counter Badge */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
              <CheckCircle2 size={12} className="stroke-[3]" />
              {activeCodes.length} Working {activeCodes.length === 1 ? 'Code' : 'Codes'}
            </span>

            {post.version && (
              <span className="inline-flex items-center rounded-md bg-white/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-indigo-950 shadow-sm">
                v{post.version}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-900/50 mb-2">
            <Clock size={12} />
            <span>Updated {formatDistanceToNow(new Date(post.updated_at || post.created_at))} ago</span>
          </div>

          <h2 className="text-lg font-black text-indigo-950 group-hover:text-sapphire-600 transition-colors line-clamp-2 leading-snug mb-3">
            {post.title}
          </h2>

          {/* Reward Badges Preview */}
          {rewardPreviews.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {rewardPreviews.map((reward, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center rounded-lg bg-azure-50 px-2 py-1 text-[11px] font-bold text-sapphire-800 border border-sapphire-600/10 line-clamp-1"
                >
                  🎁 {reward}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / CTA */}
      <div className="border-t border-indigo-950/5 bg-azure-50/40 px-5 py-3.5 flex items-center justify-between group-hover:bg-azure-100/50 transition-colors">
        <span className="text-xs font-black text-sapphire-700 uppercase tracking-wider">
          View Active Codes
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sapphire-600 text-white transition-transform group-hover:translate-x-1 shadow-sm">
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
