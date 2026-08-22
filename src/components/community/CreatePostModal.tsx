import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { X, Image as ImageIcon, Send, Sparkles, Loader2, Trash2, Tag, ShieldAlert, Coins, Gift, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CommunityCategory, CommunityPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
}

const GAME_TAGS = [
  'Blox Fruits',
  'Genshin Impact',
  'King Legacy',
  'Anime Defenders',
  'Honkai: Star Rail',
  'Monopoly GO',
  'COD Mobile',
  'Pokemon GO',
  'General Gaming'
];

const CATEGORIES: CommunityCategory[] = ['Code Drops', 'Discussions', 'Screenshots', 'Guides'];

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { profile, credits, deductCredits, openWalletModal } = useAuth();
  
  const [content, setContent] = useState('');
  const [gameTag, setGameTag] = useState(profile?.favorite_game?.split(' ')[0] ? profile.favorite_game : 'Blox Fruits');
  const [category, setCategory] = useState<CommunityCategory>('Discussions');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic cost calculation: 20 Credits for text, 50 Credits for post with photo
  const requiredCredits = (selectedFile || imagePreview) ? 50 : 20;
  const hasSufficientCredits = credits >= requiredCredits;

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: PHOTO ONLY (no video files allowed)
    if (!file.type.startsWith('image/')) {
      setError('Only photos/images (JPEG, PNG, WebP, GIF) are allowed. Video uploads are strictly disabled.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB.');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter some text for your post.');
      return;
    }

    if (!hasSufficientCredits) {
      setError(`Insufficient Credits. You need ${requiredCredits} Credits to post (Current Balance: ${credits} Credits).`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Deduct credits with backend verification
      const actionType = (selectedFile || imagePreview) ? 'post_image_create' : 'post_create';
      const deductRes = await deductCredits(
        requiredCredits,
        actionType,
        `Community post (${category} in ${gameTag})`
      );

      if (!deductRes.success) {
        setError(deductRes.error || `Could not deduct ${requiredCredits} credits.`);
        setIsSubmitting(false);
        return;
      }

      let finalImageUrl: string | null = imagePreview;

      // Upload image to Supabase Storage bucket 'community_images' if file present
      if (selectedFile) {
        try {
          const fileExt = selectedFile.name.split('.').pop() || 'png';
          const fileName = `${profile?.id || 'post'}-${Date.now()}.${fileExt}`;
          const filePath = `posts/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('community_images')
            .upload(filePath, selectedFile, { upsert: true, contentType: selectedFile.type });

          if (!uploadErr) {
            const { data } = supabase.storage.from('community_images').getPublicUrl(filePath);
            if (data?.publicUrl) {
              finalImageUrl = data.publicUrl;
            }
          }
        } catch {
          // Fallback to local imagePreview
        }
      }

      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        user_id: profile?.id || 'usr_anon',
        username: profile?.username || 'Gamer',
        display_name: profile?.display_name || 'TrendPulse Gamer',
        avatar_url: profile?.avatar_url || null,
        game_tag: gameTag,
        category,
        content: content.trim(),
        image_url: finalImageUrl,
        likes_count: 1,
        comments_count: 0,
        is_liked: true,
        comments: [],
        created_at: new Date().toISOString(),
      };

      // Try inserting into Supabase if connected
      try {
        await supabase
          .from('community_posts')
          .insert({
            id: newPost.id,
            user_id: newPost.user_id,
            username: newPost.username,
            avatar_url: newPost.avatar_url,
            game_tag: newPost.game_tag,
            category: newPost.category,
            content: newPost.content,
            image_url: newPost.image_url,
            likes_count: 1,
            comments_count: 0,
            created_at: newPost.created_at,
          });
      } catch {
        // Fallback to client state
      }

      onPostCreated(newPost);
      
      // Reset form
      setContent('');
      setSelectedFile(null);
      setImagePreview(null);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit post.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-950/10 overflow-hidden z-10 my-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-950/10 bg-azure-50/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-indigo-950">Create Community Post</h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900/60">
                  <span>Photo Only uploads</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-mono text-sapphire-700 font-bold">
                    <Coins size={11} className="stroke-[3]" /> Balance: {credits}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-indigo-900/60 hover:text-indigo-950 hover:bg-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Insufficient Credits Warning & Refill Action */}
            {!hasSufficientCredits && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center shrink-0">
                    <Coins size={16} className="stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-950">Need {requiredCredits} Credits to publish</p>
                    <p className="text-[11px] text-amber-900/70 font-medium">Your balance is {credits} Credits. Claim 100 free credits below.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    openWalletModal();
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gift size={13} />
                  <span>Claim +100</span>
                </button>
              </div>
            )}

            {/* User Info Preview & Cost Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-indigo-950/15 bg-sapphire-50 shrink-0">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-sapphire-700">
                      {profile?.display_name?.charAt(0) || 'G'}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm font-black text-indigo-950 block leading-tight">
                    {profile?.display_name || 'TrendPulse Gamer'}
                  </span>
                  <span className="text-xs font-bold text-sapphire-600">
                    @{profile?.username || 'gamer'}
                  </span>
                </div>
              </div>

              {/* Cost Indicator Badge */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-indigo-900/50 uppercase tracking-wider">Post Cost</span>
                <span className={`inline-flex items-center gap-1 font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${
                  (selectedFile || imagePreview) 
                    ? 'bg-sky-50 text-sky-800 border-sky-200' 
                    : 'bg-azure-100 text-sapphire-800 border-sapphire-200'
                }`}>
                  <Coins size={12} className="stroke-[3]" />
                  {requiredCredits} Credits {(selectedFile || imagePreview) ? '(Photo)' : '(Text)'}
                </span>
              </div>
            </div>

            {/* Game & Category Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-black text-indigo-900/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag size={12} className="text-sapphire-600" /> Game Tag
                </label>
                <select
                  value={gameTag}
                  onChange={(e) => setGameTag(e.target.value)}
                  className="w-full px-3 py-2 bg-azure-50 border border-indigo-950/15 rounded-xl font-bold text-xs text-indigo-950 focus:border-sapphire-600"
                >
                  {GAME_TAGS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-indigo-900/70 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                  className="w-full px-3 py-2 bg-azure-50 border border-indigo-950/15 rounded-xl font-bold text-xs text-indigo-950 focus:border-sapphire-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Post Content Text Area */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="What's happening in your game? Share a new code, boss victory, or drop a question..."
                className="w-full p-4 bg-azure-50/60 border border-indigo-950/15 rounded-2xl font-medium text-sm text-indigo-950 focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20 resize-none leading-relaxed"
                required
              />
            </div>

            {/* Photo Attachment (PHOTO ONLY) */}
            <div>
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-indigo-950/15 group bg-black/5">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="p-2 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-white">
                    📷 Photo Attached
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-950/15 hover:border-sapphire-600 bg-azure-50/40 hover:bg-azure-50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-sapphire-600 group-hover:scale-105 transition-transform">
                    <ImageIcon size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-indigo-950">Add Photo from Gallery</p>
                    <p className="text-[11px] text-indigo-900/50 font-medium">JPEG, PNG, WebP or GIF (Photos Only)</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-indigo-950/10">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-sapphire-700 hover:bg-azure-100 transition-colors cursor-pointer"
              >
                <ImageIcon size={16} />
                <span>{imagePreview ? 'Change Photo' : 'Attach Photo'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-indigo-950/15 text-indigo-950 text-xs font-bold hover:bg-azure-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white text-xs font-black shadow-md shadow-sapphire-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Posting...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Post ({requiredCredits} Credits)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
