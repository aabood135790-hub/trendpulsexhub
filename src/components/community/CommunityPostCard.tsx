import { useState, FormEvent } from 'react';
import { Heart, MessageSquare, Share2, ZoomIn, Send, Check, Tag, Coins, Gift } from 'lucide-react';
import { CommunityPost, CommunityComment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityPostCardProps {
  key?: string;
  post: CommunityPost;
  onImageClick: (imageUrl: string, altText?: string) => void;
  onLikeToggle: (postId: string) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
}

export function CommunityPostCard({ post, onImageClick, onLikeToggle, onAddComment }: CommunityPostCardProps) {
  const { profile, credits, deductCredits, openWalletModal } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const formattedTime = (() => {
    try {
      return formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  })();

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    if (credits < 10) {
      setCommentError(`Insufficient Credits (10 required, balance: ${credits}). Claim free credits at the Reward Box!`);
      return;
    }

    setIsSubmittingComment(true);
    setCommentError('');

    try {
      const deductRes = await deductCredits(10, 'comment_create', `Comment on post by @${post.username}`);
      if (!deductRes.success) {
        setCommentError(deductRes.error || 'Failed to deduct 10 credits.');
        setIsSubmittingComment(false);
        return;
      }

      const newComment: CommunityComment = {
        id: `comm_${Date.now()}`,
        post_id: post.id,
        user_id: profile?.id || 'usr_anon',
        username: profile?.username || 'Gamer',
        avatar_url: profile?.avatar_url || null,
        content: commentText.trim(),
        created_at: new Date().toISOString(),
      };

      onAddComment(post.id, newComment);
      setCommentText('');
      setIsSubmittingComment(false);
    } catch (err: any) {
      setCommentError(err?.message || 'Error publishing comment.');
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/community#${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article 
      id={post.id} 
      className="bg-white rounded-3xl border border-indigo-950/10 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-sapphire-600/30"
    >
      {/* Post Author Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-azure-200 bg-sapphire-50 shrink-0">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt={post.username}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-sapphire-100 text-sapphire-700 font-black text-base">
                {post.display_name?.charAt(0) || post.username.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm text-indigo-950 leading-tight">
                {post.display_name || post.username}
              </span>
              <span className="text-xs font-bold text-sapphire-600">
                @{post.username}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-semibold text-indigo-900/50">
              <span>{formattedTime}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-sapphire-700 font-bold bg-azure-100/70 px-2 py-0.5 rounded-md">
                <Tag size={10} /> {post.game_tag}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <span className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-azure-100 text-sapphire-800 border border-sapphire-600/10">
          {post.category}
        </span>
      </div>

      {/* Post Text Body */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-sm font-medium text-indigo-950 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Post Photo (PHOTO ONLY - Click for Lightbox) */}
      {post.image_url && (
        <div className="px-4 sm:px-5 pb-4">
          <div
            onClick={() => onImageClick(post.image_url!, `${post.display_name}'s Photo`)}
            className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-indigo-950/10 bg-slate-900 max-h-[420px] flex items-center justify-center"
          >
            <img
              src={post.image_url}
              alt="Community Upload"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ZoomIn size={14} className="text-sky-300" /> Click to enlarge
              </span>
              <span className="text-[11px] font-semibold text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                PHOTO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Post Action Footer (Like, Comments, Share) */}
      <div className="px-4 sm:px-5 py-3 border-t border-indigo-950/10 bg-azure-50/30 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              post.is_liked
                ? 'text-red-500 hover:text-red-600'
                : 'text-indigo-900/60 hover:text-indigo-950'
            }`}
          >
            <Heart
              size={18}
              className={`transition-transform active:scale-125 ${
                post.is_liked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            <span>{post.likes_count}</span>
          </button>

          {/* Comments Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-900/60 hover:text-sapphire-600 transition-colors cursor-pointer"
          >
            <MessageSquare size={17} />
            <span>{post.comments?.length || post.comments_count || 0}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-900/60 hover:text-sapphire-600 transition-colors cursor-pointer"
          title="Copy link to post"
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-600" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-indigo-950/10 bg-azure-50/50 p-4 sm:p-5 space-y-4"
          >
            {/* Existing Comments List */}
            <div className="space-y-3">
              {(post.comments || []).length > 0 ? (
                post.comments?.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-indigo-950/10 shadow-2xs">
                    <div className="h-7 w-7 rounded-full overflow-hidden bg-sapphire-100 text-sapphire-700 shrink-0 font-bold text-xs flex items-center justify-center">
                      {comment.avatar_url ? (
                        <img src={comment.avatar_url} alt={comment.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        comment.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-950">@{comment.username}</span>
                        <span className="text-[10px] text-indigo-900/40 font-medium">Just now</span>
                      </div>
                      <p className="text-xs text-indigo-900/80 font-medium mt-0.5 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-indigo-900/50 font-medium italic text-center py-2">
                  No comments yet. Be the first to reply!
                </p>
              )}
            </div>

            {/* Comment Error & Claim Prompt */}
            {commentError && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 flex items-center justify-between gap-2">
                <span>{commentError}</span>
                <button
                  type="button"
                  onClick={openWalletModal}
                  className="px-2.5 py-1 rounded-lg bg-sapphire-600 hover:bg-sapphire-500 text-white text-[11px] font-black shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Gift size={11} />
                  <span>Claim +100</span>
                </button>
              </div>
            )}

            {/* Add Comment Input Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-sapphire-50 shrink-0 border border-indigo-950/10">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-xs text-sapphire-700">
                      {profile?.username?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Reply as @${profile?.username || 'gamer'}...`}
                  className="flex-1 px-3.5 py-2 bg-white border border-indigo-950/15 rounded-xl text-xs font-medium text-indigo-950 focus:border-sapphire-600 focus:ring-1 focus:ring-sapphire-600"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="px-3.5 py-2 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white shadow-xs disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Send comment (10 Credits)"
                >
                  <Send size={13} />
                  <span className="hidden xs:inline">10 Cr</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-indigo-900/50">
                <span className="flex items-center gap-1">
                  <Coins size={10} className="stroke-[2.5]" /> Cost: 10 Credits
                </span>
                <span>Your Wallet: {credits} Credits</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
