import { useState, useEffect } from 'react';
import { Plus, Sparkles, Image as ImageIcon, Flame, Filter, Users, MessageSquare, Trophy, Tag, ShieldCheck, RefreshCw } from 'lucide-react';
import { CommunityCategory, CommunityPost, CommunityComment } from '../types';
import { getLiveCommunityPosts, supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockCommunityPosts } from '../lib/mock-community';
import { CommunityPostCard } from '../components/community/CommunityPostCard';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { ImageLightbox } from '../components/community/ImageLightbox';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { useAuth } from '../context/AuthContext';
import { usePageSEO } from '../lib/seo';

const CATEGORIES: CommunityCategory[] = ['All', 'Trending', 'Discussions', 'Guides', 'Screenshots'];

const RACE_FILTERS = [
  'All',
  'Dragonkin',
  'Starborne',
  'Shadowveil',
  'Frostborn',
];

export function Community() {
  const { profile, user, isAuthenticated, openEditProfile, openAuthModal } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>('All');
  const [selectedRace, setSelectedRace] = useState<string>('All');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt?: string } | null>(null);

  usePageSEO({
    title: 'TrendPulseX | Player Community - Guides, Builds & Clan Discussions',
    description: 'Join the TrendPulseX player community. Share 2D gameplay strategies, elemental race builds, clan recruitment, and screenshots.',
    keywords: 'trendpulsex community, gamer feed, dragonkin builds, starborne guides, multiplayer community',
  });

  // Load feed from Supabase / local cache
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getLiveCommunityPosts(
        selectedCategory === 'All' ? undefined : selectedCategory,
        selectedRace === 'All' ? undefined : selectedRace
      );
      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(mockCommunityPosts);
      }
    } catch (err) {
      console.warn('Could not fetch community posts:', err);
      setPosts(mockCommunityPosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, selectedRace]);

  // Handle Like Toggle
  const handleLikeToggle = async (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.is_liked;
          return {
            ...p,
            is_liked: isLiked,
            likes_count: isLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1),
          };
        }
        return p;
      })
    );

    // Sync to Supabase if live
    if (isSupabaseConfigured && user?.id) {
      try {
        const post = posts.find(p => p.id === postId);
        if (post?.is_liked) {
          await supabase
            .from('community_likes')
            .delete()
            .match({ post_id: postId, user_id: user.id });
        } else {
          await supabase
            .from('community_likes')
            .upsert({ post_id: postId, user_id: user.id });
        }
      } catch (err) {
        console.warn('Like sync warning:', err);
      }
    }
  };

  // Handle Add Comment
  const handleAddComment = async (postId: string, comment: CommunityComment) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentComments = p.comments || [];
          return {
            ...p,
            comments: [comment, ...currentComments],
            comments_count: (p.comments_count || 0) + 1,
          };
        }
        return p;
      })
    );

    // Sync to Supabase if live
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('community_comments')
          .insert({
            id: comment.id,
            post_id: postId,
            user_id: comment.user_id,
            username: comment.username,
            avatar_url: comment.avatar_url,
            content: comment.content,
            created_at: comment.created_at,
          });
      } catch (err) {
        console.warn('Comment sync warning:', err);
      }
    }
  };

  // Handle Post Creation
  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Client Filtering
  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Trending' ? post.likes_count >= 30 : post.category === selectedCategory);
    
    const matchesRace =
      selectedRace === 'All' || post.game_tag.toLowerCase().includes(selectedRace.toLowerCase());

    return matchesCategory && matchesRace;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 text-[#090514]">
      
      {/* Top Banner / Hero (Deep Dark Purple Focal Element) */}
      <div className="relative rounded-3xl overflow-hidden bg-[#090514] p-6 sm:p-8 text-white shadow-2xl mb-8 border border-[#160B2E]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160B2E] border border-[#A855F7]/40 text-[#C084FC] text-xs font-bold font-mono uppercase tracking-wider">
              <Users size={13} className="text-[#C084FC]" /> TrendPulseX Community
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Player Community & Chronicles
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
              Connect with fellow players, share race builds, discover wilderness secrets, recruit for your clan, and post in-game screenshots.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-[#A855F7] hover:bg-[#9333EA] text-white px-5 py-3 rounded-2xl font-black shadow-lg shadow-[#A855F7]/30 transition-all active:scale-95 cursor-pointer text-sm border border-[#C084FC]/30"
            >
              <Plus size={18} strokeWidth={3} /> Create Post
            </button>
            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="flex items-center gap-2 bg-[#160B2E] hover:bg-[#1F0F3D] text-[#C084FC] hover:text-white border border-[#A855F7]/30 px-4 py-3 rounded-2xl font-bold transition-all text-sm cursor-pointer"
            >
              <ShieldCheck size={16} className="text-[#FBBF24]" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Feed Column (3 cols on large screen) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Quick Create Post Box */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E5E2EC] shadow-sm flex items-center gap-3 sm:gap-4">
            <div 
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="h-11 w-11 rounded-full overflow-hidden border-2 border-purple-200 bg-[#F8F7FA] shrink-0 cursor-pointer hover:border-[#A855F7] transition-colors"
              title="Click to edit profile"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-[#A855F7] bg-purple-100">
                  {profile?.display_name?.charAt(0) || 'G'}
                </div>
              )}
            </div>

            <div
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 bg-[#F8F7FA] hover:bg-[#F1EFF5] border border-[#E5E2EC] rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-slate-500 cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>Share strategy, recruit clan members, or screenshot...</span>
              <div className="flex items-center gap-2 text-[#A855F7] font-bold text-xs">
                <ImageIcon size={16} />
                <span className="hidden sm:inline">Photo</span>
              </div>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-10 px-4 rounded-2xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs shadow-md shadow-[#A855F7]/25 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border border-[#C084FC]/30"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Post</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#A855F7] text-white shadow-md shadow-[#A855F7]/30 border border-[#C084FC]/40'
                      : 'bg-white hover:bg-[#F1EFF5] text-slate-600 border border-[#E5E2EC]'
                  }`}
                >
                  {cat === 'Trending' && <Flame size={12} className="inline mr-1 text-[#FBBF24]" />}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Race Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-slate-600 font-bold flex items-center gap-1 shrink-0 font-mono">
              <Filter size={12} className="text-[#A855F7]" /> Race / Tag:
            </span>
            <div className="flex items-center gap-1.5">
              {RACE_FILTERS.map((race) => (
                <button
                  key={race}
                  onClick={() => setSelectedRace(race)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedRace === race
                      ? 'bg-purple-100 text-purple-800 border border-purple-300 shadow-xs'
                      : 'bg-white hover:bg-[#F1EFF5] text-slate-600 border border-[#E5E2EC]'
                  }`}
                >
                  {race}
                </button>
              ))}
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-5">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl h-56 border border-[#E5E2EC]" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onImageClick={(url, alt) => setLightboxImage({ url, alt })}
                  onLikeToggle={handleLikeToggle}
                  onAddComment={handleAddComment}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-[#E5E2EC] p-12 text-center space-y-4 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#A855F7] mx-auto border border-purple-200">
                  <MessageSquare size={26} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#090514]">No community posts found</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Be the first player to start a discussion or guide in this topic!
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-xs shadow-md"
                >
                  <Plus size={16} /> Create First Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (Desktop) */}
        <div className="hidden lg:block space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E2EC] shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-purple-300 shadow-sm mx-auto bg-purple-50">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-2xl text-[#A855F7]">
                    {profile?.display_name?.charAt(0) || 'G'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-[#090514] leading-tight">
                {profile?.display_name || 'TrendPulse Player'}
              </h3>
              <p className="text-xs font-bold text-[#A855F7] mt-0.5 font-mono">
                @{profile?.username || 'player'}
              </p>
              {profile?.favorite_game && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black font-mono">
                  <Tag size={10} /> {profile.favorite_game}
                </div>
              )}
            </div>

            {profile?.bio && (
              <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                "{profile.bio}"
              </p>
            )}

            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="w-full py-2.5 rounded-xl bg-[#F8F7FA] hover:bg-[#F1EFF5] text-[#090514] font-bold text-xs border border-[#E5E2EC] transition-colors cursor-pointer"
            >
              {isAuthenticated ? 'Edit Player Profile' : 'Sign In with Google'}
            </button>
          </div>

          {/* Top Active Champions Leaderboard */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E2EC] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[#FBBF24]" />
              <h3 className="text-sm font-black text-[#090514]">Top Active Champions</h3>
            </div>

            <div className="space-y-3">
              {[
                { name: 'IgnisPrime', race: 'Dragonkin • Rank 8', rank: '1' },
                { name: 'Astraea', race: 'Starborne • Rank 7', rank: '2' },
                { name: 'VanguardGlacier', race: 'Frostborn • Rank 6', rank: '3' },
              ].map((champion) => (
                <div key={champion.name} className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl bg-[#F8F7FA] border border-[#E5E2EC]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-[#FBBF24] w-4">{champion.rank}</span>
                    <div>
                      <span className="font-bold text-[#090514] block leading-tight">{champion.name}</span>
                      <span className="text-[10px] text-[#A855F7] font-mono">{champion.race}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Rules Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5E2EC] shadow-sm space-y-2 text-xs">
            <h4 className="font-black text-[#A855F7] uppercase tracking-wider text-[11px] font-mono">English Interface</h4>
            <p className="text-slate-600 leading-relaxed">
              TrendPulseX interface is English-only. Keep discussions respectful and share constructive 2D multiplayer strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Create Post Button for Mobile */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="md:hidden fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl shadow-purple-600/40 border border-purple-300/40 cursor-pointer active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Image Lightbox Modal */}
      <ImageLightbox
        imageUrl={lightboxImage?.url || null}
        altText={lightboxImage?.alt}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
