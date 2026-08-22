import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getGameRepresentativeImage } from '../../lib/gameImages';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
  key?: string | number;
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const displayImage = getGameRepresentativeImage(post.title, post.image_url);

  return (
    <Link 
      to={`/post/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-indigo-950/10 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-sapphire-600/30",
        featured ? "md:flex-row md:col-span-2 lg:col-span-3" : ""
      )}
    >
      <div className={cn(
        "relative overflow-hidden bg-indigo-950",
        featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-[16/10]"
      )}>
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={`${post.title} cover`} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getGameRepresentativeImage(post.title);
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sapphire-600 to-indigo-900" />
        )}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-black tracking-wide text-indigo-950 shadow-sm uppercase">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className={cn(
        "flex flex-1 flex-col justify-between p-5 md:p-6",
        featured ? "md:w-1/2 md:p-8 md:justify-center" : ""
      )}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900/50 mb-3">
            <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
            {post.version && (
              <>
                <span>•</span>
                <span className="text-sapphire-600 bg-sapphire-50 px-1.5 py-0.5 rounded">v{post.version}</span>
              </>
            )}
          </div>
          <h3 className={cn(
            "font-black text-indigo-950 group-hover:text-sapphire-600 transition-colors leading-tight line-clamp-3",
            featured ? "text-2xl md:text-3xl mb-4" : "text-xl mb-3"
          )}>
            {post.title}
          </h3>
          {post.content_text && !featured && (
            <p className="text-sm font-medium text-indigo-900/70 line-clamp-2 leading-relaxed">
              {post.content_text.replace(/<[^>]*>?/gm, '')}
            </p>
          )}
          {post.content_text && featured && (
            <p className="text-base font-medium text-indigo-900/70 line-clamp-3 leading-relaxed">
              {post.content_text.replace(/<[^>]*>?/gm, '')}
            </p>
          )}
        </div>
        
        <div className="mt-6 flex items-center text-sm font-bold text-sapphire-600 transition-colors group-hover:text-sapphire-500">
          <span>Read Full {post.category === 'Mods' ? 'Details' : 'Article'}</span>
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
