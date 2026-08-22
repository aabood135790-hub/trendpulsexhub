import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Tag, Download, CheckCircle2, ShieldCheck, HelpCircle, Gift, Sparkles, Gamepad2, Flame, ExternalLink, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { Post } from '../types';
import { getPostBySlug, getPosts } from '../lib/mock-data';
import { CodeTable } from '../components/ui/CodeTable';
import { BonusCodeCta } from '../components/ui/BonusCodeCta';
import { CodeGameCard } from '../components/ui/CodeGameCard';
import { ReadingProgressBar } from '../components/ui/ReadingProgressBar';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { getGameRepresentativeImage, getGameIconUrl } from '../lib/gameImages';
import { usePageSEO, generateAutomatedPostSEO, generateStructuredData } from '../lib/seo';
import { useAds } from '../context/AdContext';
import { useRewardModal } from '../context/RewardModalContext';

export function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const { activeDirectLink } = useAds();
  const { triggerRewardFlow } = useRewardModal();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [trendingLeaks, setTrendingLeaks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic SEO Meta-Tag and JSON-LD Generation
  const postSeo = post ? (post.seo?.meta_title ? post.seo : { ...generateAutomatedPostSEO(post), ...post.seo }) : null;
  const structuredData = post ? generateStructuredData(post) : null;
  const seoGameName = post?.codes_data?.[0]?.game || post?.title?.split(' ')[0] || 'Game';
  const seoRepImage = post ? getGameRepresentativeImage(post.title || seoGameName, post.image_url) : '';

  usePageSEO({
    title: postSeo?.meta_title || post?.title || '',
    description: postSeo?.meta_description || '',
    keywords: postSeo?.meta_keywords || '',
    image: postSeo?.og_image || seoRepImage,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    type: 'article',
    noIndex: postSeo?.no_index || false,
    structuredData: structuredData,
  });

  useEffect(() => {
    async function load() {
      if (slug) {
        setLoading(true);
        const data = await getPostBySlug(slug);
        setPost(data || null);

        const allPosts = await getPosts();
        if (data) {
          const categoryFiltered = allPosts.filter(p => p.category === data.category && p.slug !== slug);
          setRelatedPosts(categoryFiltered.slice(0, 3));
        }
        // Grab trending news and leaks
        setTrendingLeaks(allPosts.filter(p => p.slug !== slug && (p.category === 'News' || p.title.toLowerCase().includes('leak') || p.title.toLowerCase().includes('secret'))).slice(0, 4));
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-indigo-950/10 rounded w-48" />
          <div className="h-14 bg-indigo-950/10 rounded-2xl w-3/4" />
          <div className="h-64 bg-indigo-950/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center min-h-[60vh]">
        <h1 className="text-4xl font-black text-indigo-950">404 - Post Not Found</h1>
        <p className="mt-4 text-indigo-900/60 font-medium">
          The gaming post, leak vault, or code list you are looking for has been moved or does not exist.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/codes" className="px-6 py-3 bg-sapphire-600 text-white font-bold rounded-xl hover:bg-sapphire-500 transition-colors shadow-md">
            Browse All Codes
          </Link>
          <Link to="/" className="px-6 py-3 bg-white border border-indigo-950/15 text-indigo-950 font-bold rounded-xl hover:bg-azure-50 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const activeCodes = (post.codes_data || []).filter(c => c.status === 'Active');
  const expiredCodes = (post.codes_data || []).filter(c => c.status === 'Expired');
  const gameName = post.codes_data?.[0]?.game || post.title.split(' ')[0] || 'Game';
  const representativeImage = getGameRepresentativeImage(post.title || gameName, post.image_url);
  const gameIcon = getGameIconUrl(post.title || gameName);

  return (
    <article className="w-full pb-28 md:pb-20 bg-azure-50/30 min-h-screen relative">
      {/* Scroll-Linked Top Reading Progress Bar */}
      <ReadingProgressBar articleTitle={post.title} />

      {/* Top Breadcrumbs */}
      <div className="border-b border-indigo-950/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs font-bold text-indigo-900/60 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-sapphire-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-indigo-900/30 shrink-0" />
          <Link 
            to={post.category === 'Codes' ? '/codes' : post.category === 'News' ? '/news' : '/mods'} 
            className="hover:text-sapphire-600 transition-colors"
          >
            {post.category}
          </Link>
          <ChevronRight size={14} className="text-indigo-900/30 shrink-0" />
          <span className="text-indigo-950 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* Main Post Header (H1 Title & Representative Artwork) */}
      <header className="bg-white border-b border-indigo-950/10 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1 rounded-lg bg-sapphire-600 px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-sm">
              <Gift size={13} /> {post.category}
            </span>
            
            {activeCodes.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={13} className="stroke-[3]" /> {activeCodes.length} Active {activeCodes.length === 1 ? 'Code' : 'Codes'}
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-lg bg-azure-100 px-3 py-1 text-xs font-bold text-sapphire-800">
              <ShieldCheck size={13} /> 100% Tested & Verified
            </span>

            {post.version && (
              <span className="inline-flex items-center rounded-lg bg-indigo-950 text-white px-2.5 py-1 text-xs font-bold">
                v{post.version}
              </span>
            )}
          </div>

          {/* Prominent Game H1 Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-950 tracking-tight leading-[1.15] mb-4">
            {post.title}
          </h1>

          {/* Published/Updated Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-indigo-900/60 mb-8">
            <div className="flex items-center gap-1.5">
              <Calendar size={15} className="text-sapphire-600" />
              <span>Updated: {format(new Date(post.updated_at || post.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <span>•</span>
            <span>By <strong className="text-indigo-950 font-bold">TrendPulseXhub.com Editorial Team</strong></span>
          </div>

          {/* Game Representative Banner Card */}
          <div className="relative rounded-2xl overflow-hidden border border-indigo-950/10 shadow-lg bg-indigo-950 aspect-[21/9] sm:aspect-[24/9] w-full">
            <img 
              src={representativeImage} 
              alt={`${gameName} official key artwork`} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = getGameRepresentativeImage(post.title || gameName);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/30 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center gap-3.5">
              <img 
                src={gameIcon} 
                alt={`${gameName} icon`} 
                referrerPolicy="no-referrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-white shadow-md shrink-0 bg-indigo-950" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const fallback = getGameIconUrl(post.title || gameName);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
              />
              <div className="min-w-0">
                <span className="text-xs font-black text-sky-300 uppercase tracking-wider block">Official Hub & Insights</span>
                <h2 className="text-lg sm:text-2xl font-black text-white truncate drop-shadow">{gameName}</h2>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Content Area (8 Cols) + Sidebar Ad & Trends Area (4 Cols) */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 8-Column Content Body */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Direct Link Bonus CTA */}
            <div>
              <BonusCodeCta url={post.ad_direct_link} />
            </div>

            {/* In-Article Top Universal Ad Placement */}
            <UniversalAdSlot slotId="in_article_top" />

            {/* 1. Dedicated Active Codes Table Directly Underneath Header */}
            {post.codes_data && post.codes_data.length > 0 && (
              <section aria-labelledby="active-codes-heading" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-sapphire-600" size={22} />
                    <h2 id="active-codes-heading" className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">
                      Active {gameName} Codes & Secret Rewards
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-indigo-900/50 hidden sm:inline-block">
                    Click "COPY" to claim
                  </span>
                </div>

                {/* Render ONLY this post's codes in table format */}
                <CodeTable 
                  codes={activeCodes} 
                  title={`${gameName} Working Promo Codes`}
                  game={gameName}
                />

                {/* Expired Codes Table */}
                {expiredCodes.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h3 className="text-base font-black text-indigo-900/60 uppercase tracking-wider">
                      Expired Codes (For Reference)
                    </h3>
                    <CodeTable 
                      codes={expiredCodes} 
                      title={`${gameName} Expired Codes`}
                    />
                  </div>
                )}
              </section>
            )}

            {/* In-Article Mid Universal Ad Placement */}
            <UniversalAdSlot slotId="in_article_mid" />

            {/* 2. Step-by-Step Redemption Guide */}
            {post.category === 'Codes' && (
              <section className="bg-white rounded-2xl border border-indigo-950/10 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                  <HelpCircle className="text-sapphire-600" size={22} />
                  How to Redeem Codes in {gameName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-azure-50/60 rounded-xl p-5 border border-indigo-950/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sapphire-600 text-white font-black text-sm mb-3">
                      1
                    </div>
                    <h3 className="font-black text-indigo-950 text-base mb-1">Launch Game</h3>
                    <p className="text-xs font-medium text-indigo-900/70 leading-relaxed">
                      Open {gameName} on your PC, console, or mobile device and log in.
                    </p>
                  </div>

                  <div className="bg-azure-50/60 rounded-xl p-5 border border-indigo-950/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sapphire-600 text-white font-black text-sm mb-3">
                      2
                    </div>
                    <h3 className="font-black text-indigo-950 text-base mb-1">Open Redemption Menu</h3>
                    <p className="text-xs font-medium text-indigo-900/70 leading-relaxed">
                      Navigate to Settings / Profile / Twitter bird icon and find the "Redeem Code" or "Promo" button.
                    </p>
                  </div>

                  <div className="bg-azure-50/60 rounded-xl p-5 border border-indigo-950/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sapphire-600 text-white font-black text-sm mb-3">
                      3
                    </div>
                    <h3 className="font-black text-indigo-950 text-base mb-1">Paste & Claim</h3>
                    <p className="text-xs font-medium text-indigo-900/70 leading-relaxed">
                      Paste the copied code from the table above and hit Confirm to receive rewards instantly!
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 3. Detailed Guide & Overview Content */}
            {post.content_text && (
              <section className="bg-white rounded-2xl border border-indigo-950/10 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-4">
                  About {post.title}
                </h2>
                <div 
                  className="prose prose-indigo max-w-none text-indigo-900/80 leading-relaxed font-medium text-sm md:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content_text }}
                />
              </section>
            )}

            {/* In-Article Bottom Universal Ad Placement */}
            <UniversalAdSlot slotId="in_article_bottom" />

            {/* YouTube Video Embed */}
            {post.youtube_url && (
              <section className="bg-white rounded-2xl border border-indigo-950/10 p-6 shadow-sm">
                <h2 className="text-lg font-black text-indigo-950 mb-4">Video Guide & Showcase</h2>
                <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                  <iframe
                    src={post.youtube_url.replace('watch?v=', 'embed/')}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={post.title}
                  />
                </div>
              </section>
            )}

            {/* Mod Download Section */}
            {post.download_url && (
              <section className="p-8 rounded-3xl bg-indigo-950 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-sapphire-500/30 blur-2xl pointer-events-none" />
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">Download & Play</h3>
                <p className="text-azure-100/70 font-medium mb-8 relative z-10">
                  Ensure you have the compatible base game installed before launching this mod.
                </p>
                <a 
                  href={post.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (activeDirectLink) {
                      try {
                        window.open(activeDirectLink, '_blank', 'noopener,noreferrer');
                      } catch (err) {
                        console.warn('Adsterra direct link trigger:', err);
                      }
                    }
                  }}
                  className="relative z-10 inline-flex items-center gap-3 bg-sapphire-600 hover:bg-sapphire-500 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-sapphire-600/30 cursor-pointer"
                >
                  <Download strokeWidth={2.5} />
                  DOWNLOAD MOD {post.version ? `(v${post.version})` : ''}
                </a>
              </section>
            )}
          </div>

          {/* Dedicated Sticky 4-Column Sidebar (Sidebar Ad + Viral Trends + Quick Links) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Primary High-Converting Sidebar Ad Slot */}
            <UniversalAdSlot slotId="sidebar_article" />

            {/* Viral Trends & Breaking Leaks Card */}
            {trendingLeaks.length > 0 && (
              <div className="bg-white rounded-2xl border border-indigo-950/10 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-indigo-950/5">
                  <Flame className="text-rose-500" size={18} />
                  <h3 className="font-black text-indigo-950 text-sm tracking-tight uppercase">
                    Viral Gaming Leaks & Rumors
                  </h3>
                </div>
                <div className="space-y-3">
                  {trendingLeaks.map((trend) => (
                    <Link
                      key={trend.id}
                      to={trend.category === 'Codes' ? `/codes/${trend.slug}` : `/news/${trend.slug}`}
                      className="group block p-2.5 rounded-xl hover:bg-azure-50/80 transition-colors border border-transparent hover:border-indigo-950/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={trend.image_url || getGameRepresentativeImage(trend.title)}
                          alt={trend.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-indigo-950/10"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-indigo-950 group-hover:text-sapphire-600 transition-colors line-clamp-2 leading-snug">
                            {trend.title}
                          </h4>
                          <span className="text-[10px] font-black text-indigo-900/40 uppercase mt-0.5 block">
                            {trend.version || 'Breaking Trend'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Community & Wallet Booster Widget */}
            <div className="bg-gradient-to-br from-sapphire-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-400" size={18} />
                  <span className="text-xs font-black uppercase tracking-wider text-sky-300">Gamer Rewards</span>
                </div>
                <h4 className="text-base font-black leading-tight">Need Free Wallet Credits?</h4>
                <p className="text-xs text-azure-100/70">
                  Claim the daily mystery gift box (+100 credits) or enter your secret promo code in the wallet modal.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-sapphire-500 hover:bg-sapphire-400 text-white text-xs font-black transition-colors"
                >
                  Visit Community Lounge →
                </Link>
              </div>
            </div>
          </aside>

        </div>

        {/* Related Game Codes for SEO Internal Linking */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 mt-12 border-t border-indigo-950/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-indigo-950 tracking-tight">
                More Gaming Codes & Updates You Might Like
              </h2>
              <Link to="/codes" className="text-xs font-black text-sapphire-600 hover:text-sapphire-700 uppercase">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <CodeGameCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  );
}


