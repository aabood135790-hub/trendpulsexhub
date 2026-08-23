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
import { motion } from 'motion/react';

const CATEGORIES: CommunityCategory[] = ['All', 'Trending', 'Code Drops', 'Discussions', 'Screenshots', 'Guides'];

const GAME_FILTERS = [
  'All',
  'Blox Fruits',
  'Genshin Impact',
  'King Legacy',
  'Anime Defenders',
  'Honkai: Star Rail',
  'Monopoly GO',
];

export function Community() {
  const { profile, user, isAuthenticated, openEditProfile, openAuthModal } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>('All');
  const [selectedGame, setSelectedGame] = useState<string>('All');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt?: string } | null>(null);

  // Load feed from Supabase / local cache
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getLiveCommunityPosts(
        selectedCategory === 'All' ? undefined : selectedCategory,
        selectedGame === 'All' ? undefined : selectedGame
      );
      if (data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Could not fetch community posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, selectedGame]);

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
      (selectedCategory === 'Trending' ? post.likes_count >= 40 : post.category === selectedCategory);
    
    const matchesGame =
      selectedGame === 'All' || post.game_tag.toLowerCase().includes(selectedGame.toLowerCase());

    return matchesCategory && matchesGame;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sapphire-900 via-indigo-950 to-sapphire-950 p-6 sm:p-8 text-white shadow-xl mb-8 border border-sapphire-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
              <Users size={13} /> The TrendPulseXhub Community
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Gamer Hub & Code Drops
            </h1>
            <p className="text-sm font-medium text-azure-100/80 leading-relaxed">
              Connect with fellow players, share freshly verified redemption codes, showcase your lucky gacha pulls, and post in-game screenshots with photo attachments.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-sapphire-600 to-sky-500 hover:from-sapphire-500 hover:to-sky-400 text-white px-5 py-3 rounded-2xl font-black shadow-lg shadow-sapphire-600/30 transition-all active:scale-95 cursor-pointer text-sm"
            >
              <Plus size={18} strokeWidth={3} /> Create Post
            </button>
            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-2xl font-bold transition-all text-sm cursor-pointer"
            >
              <ShieldCheck size={16} className="text-sky-300" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed Column (3 cols on large screen) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Quick Create Post Box */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-indigo-950/10 shadow-sm flex items-center gap-3 sm:gap-4">
            <div 
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="h-11 w-11 rounded-full overflow-hidden border-2 border-azure-200 bg-sapphire-50 shrink-0 cursor-pointer hover:border-sapphire-600 transition-colors"
              title="Click to edit profile"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-sapphire-700">
                  {profile?.display_name?.charAt(0) || 'G'}
                </div>
              )}
            </div>

            <div
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 bg-azure-50/70 hover:bg-azure-100/60 border border-indigo-950/10 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-indigo-900/60 cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>Share a new code, boss drop, or screenshot...</span>
              <div className="flex items-center gap-2 text-sapphire-600 font-bold text-xs">
                <ImageIcon size={16} />
                <span className="hidden sm:inline">Photo</span>
              </div>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-10 px-4 rounded-2xl bg-sapphire-600 hover:bg-sapphire-500 text-white font-black text-xs shadow-md shadow-sapphire-600/20 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
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
                      ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/25'
                      : 'bg-white hover:bg-azure-50 text-indigo-900/70 border border-indigo-950/10'
                  }`}
                >
                  {cat === 'Trending' && <Flame size={12} className="inline mr-1 text-sky-300" />}
                  {cat === 'Code Drops' && <Sparkles size={12} className="inline mr-1 text-sky-400" />}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Game Tag Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-indigo-900/50 font-bold flex items-center gap-1 shrink-0">
              <Filter size={12} /> Game:
            </span>
            <div className="flex items-center gap-1.5">
              {GAME_FILTERS.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGame === game
                      ? 'bg-indigo-950 text-white shadow-xs'
                      : 'bg-azure-50/80 hover:bg-azure-100 text-indigo-900/70 border border-indigo-950/10'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-5">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl h-64 border border-indigo-950/10" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <div key={post.id} className="space-y-5">
                  <CommunityPostCard
                    post={post}
                    onImageClick={(url, alt) => setLightboxImage({ url, alt })}
                    onLikeToggle={handleLikeToggle}
                    onAddComment={handleAddComment}
                  />
                  {/* Insert in-feed ad after 2nd post */}
                  {idx === 1 && (
                    <UniversalAdSlot slotId="in_article_mid" />
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-indigo-950/10 p-12 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-azure-100 text-sapphire-600 mx-auto">
                  <MessageSquare size={26} />
                </div>
                <div>
                  <h3 className="text-base font-black text-indigo-950">No community posts found</h3>
                  <p className="text-xs font-semibold text-indigo-900/50 mt-1">
                    Be the first player to create a post in this category!
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sapphire-600 text-white font-bold text-xs shadow-md"
                >
                  <Plus size={16} /> Create First Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (Desktop) */}
        <div className="hidden lg:block space-y-6">
          {/* Universal Sidebar Ad Slot */}
          <UniversalAdSlot slotId="sidebar_community" />

          {/* User Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-sapphire-600 shadow-md mx-auto bg-azure-50">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-2xl text-sapphire-700">
                    {profile?.display_name?.charAt(0) || 'G'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-indigo-950 leading-tight">
                {profile?.display_name || 'TrendPulse Gamer'}
              </h3>
              <p className="text-xs font-bold text-sapphire-600 mt-0.5">
                @{profile?.username || 'gamer'}
              </p>
              {profile?.favorite_game && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 rounded-full bg-azure-100 text-sapphire-800 text-[10px] font-black">
                  <Tag size={10} /> {profile.favorite_game}
                </div>
              )}
            </div>

            {profile?.bio && (
              <p className="text-xs text-indigo-900/70 font-medium leading-relaxed italic">
                "{profile.bio}"
              </p>
            )}

            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="w-full py-2.5 rounded-xl bg-azure-50 hover:bg-azure-100 text-sapphire-700 font-bold text-xs border border-indigo-950/10 transition-colors"
            >
              Edit Gamer Profile
            </button>
          </div>

          {/* Code Drops Leaderboard */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-sky-500" />
              <h3 className="text-sm font-black text-indigo-950">Top Code Hunters</h3>
            </div>

            <div className="space-y-3">
              {[
                { name: 'BloxMaster', drops: '48 verified codes', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ec4899"><path d="M19.08 4.93l-1.41-1.42c-.39-.39-1.02-.39-1.41 0L4.93 14.85c-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l11.33-11.33c.39-.39.39-1.03 0-1.41zM6.34 14.85l1.41-1.41 1.41 1.41-1.41 1.41-1.41-1.41z"/></svg>' },
                { name: 'Vortex_Gamer99', drops: '31 verified codes', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><path d="M21.58 16.09l-1.09-7.66C20.18 6.27 18.4 5 16.32 5H7.68C5.6 5 3.82 6.27 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>' },
                { name: 'GenshinMaster', drops: '24 verified codes', avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230ea5e9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/></svg>' },
              ].map((hunter, index) => (
                <div key={hunter.name} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-indigo-900/40 w-4">{index + 1}</span>
                    <img src={hunter.avatar} alt={hunter.name} className="h-8 w-8 rounded-full object-cover border border-azure-200" referrerPolicy="no-referrer" />
                    <div>
                      <span className="font-bold text-indigo-950 block leading-tight">{hunter.name}</span>
                      <span className="text-[10px] text-sapphire-600 font-semibold">{hunter.drops}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines Card */}
          <div className="bg-azure-50/80 p-5 rounded-3xl border border-indigo-950/10 space-y-2 text-xs">
            <h4 className="font-black text-indigo-950 uppercase tracking-wider text-[11px]">Photo Upload Rules</h4>
            <p className="text-indigo-900/60 leading-relaxed">
              Attach in-game screenshots and reward claim screens (PNG, JPG, WebP up to 10MB). Video uploads are disabled for fast mobile loading.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Create Post Button for Mobile */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateOpen(true)}
        className="md:hidden fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sapphire-600 text-white shadow-xl shadow-sapphire-600/40 border border-sky-400/40 cursor-pointer"
        aria-label="Create Post"
      >
        <Plus size={28} strokeWidth={2.5} />
      </motion.button>

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
