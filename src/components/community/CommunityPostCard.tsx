import { useState, FormEvent } from 'react';
import { Heart, MessageSquare, Share2, ZoomIn, Send, Check, Tag, Sparkles, User, Shield } from 'lucide-react';
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
  const { profile, isAuthenticated, openAuthModal } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
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

    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }

    setIsSubmittingComment(true);

    try {
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
    } finally {
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
      className="bg-white rounded-3xl border border-[#E5E2EC] shadow-sm overflow-hidden transition-all hover:border-[#C084FC]/70 hover:shadow-md"
    >
      {/* Post Author Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-[#E5E2EC]">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-purple-200 bg-[#F8F7FA] shrink-0">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt={post.username}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-purple-100 text-[#A855F7] font-black text-base">
                {post.display_name?.charAt(0) || post.username.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-[#090514] text-sm sm:text-base">
                {post.display_name || post.username}
              </span>
              <span className="text-xs font-medium text-[#A855F7] font-mono">
                @{post.username}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-0.5">
              <span>{formattedTime}</span>
              {post.game_tag && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-mono font-bold">{post.game_tag}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Tag */}
        {post.category && (
          <span className="px-3 py-1 rounded-full bg-purple-50 text-[#A855F7] border border-purple-200 text-[11px] font-black uppercase font-mono tracking-wider shrink-0">
            {post.category}
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4 sm:p-5 space-y-3">
        {post.title && (
          <h3 className="text-base sm:text-lg font-black text-[#090514] leading-snug">
            {post.title}
          </h3>
        )}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
          {post.content}
        </p>

        {/* Attached Image */}
        {post.image_url && (
          <div className="relative rounded-2xl overflow-hidden mt-3 border border-[#E5E2EC] bg-slate-50 group max-h-96">
            <img
              src={post.image_url}
              alt={post.title || 'Community Attachment'}
              className="w-full h-auto object-cover max-h-96 cursor-pointer group-hover:scale-101 transition-transform"
              onClick={() => onImageClick(post.image_url!, post.title)}
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => onImageClick(post.image_url!, post.title)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-[#090514]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-purple-400/40"
              title="Expand Image"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Interaction Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-[#E5E2EC] bg-[#F8F7FA] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Like Button */}
          <button
            type="button"
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              post.is_liked
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Heart size={15} className={post.is_liked ? 'fill-rose-500 text-rose-500' : ''} />
            <span>{post.likes_count}</span>
          </button>

          {/* Comments Button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            <MessageSquare size={15} />
            <span>{post.comments_count || post.comments?.length || 0}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#A855F7] hover:bg-slate-200/60 transition-all cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#E5E2EC] bg-[#F8F7FA] p-4 sm:p-5 space-y-4"
          >
            {/* New Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={isAuthenticated ? "Write a reply..." : "Sign in to reply..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white border border-[#E5E2EC] rounded-xl px-3.5 py-2 text-xs text-[#090514] placeholder:text-slate-400 focus:outline-none focus:border-[#A855F7]"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="px-4 py-2 bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3 pt-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E2EC] shadow-xs">
                    <div className="h-7 w-7 rounded-full overflow-hidden bg-purple-100 text-[#A855F7] flex items-center justify-center font-bold text-xs shrink-0">
                      {comment.avatar_url ? (
                        <img src={comment.avatar_url} alt={comment.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        comment.username.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#090514] leading-tight">@{comment.username}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No replies yet. Be the first to start the discussion!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
