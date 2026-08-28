import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { X, Upload, Check, Camera, User, Gamepad2, Sparkles, Loader2, LogIn, LogOut, ShieldCheck, Coins, Gift, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
];

const GAME_SUGGESTIONS = [
  'Roblox Blox Fruits',
  'Genshin Impact',
  'Roblox King Legacy',
  'Honkai: Star Rail',
  'Anime Defenders',
  'Monopoly GO',
  'Call of Duty: Mobile',
  'Pokemon GO',
  'GTA 6'
];

export function EditProfileModal() {
  const { 
    profile, 
    user, 
    credits, 
    avatarChangesCount, 
    isSupabaseLive, 
    isEditProfileOpen, 
    closeEditProfile, 
    updateProfile, 
    uploadAvatar, 
    deductCredits, 
    recordAvatarChange, 
    openWalletModal, 
    signInWithGoogle, 
    openAuthModal,
    logout 
  } = useAuth();

  const [username, setUsername] = useState(profile?.username || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [favoriteGame, setFavoriteGame] = useState(profile?.favorite_game || '');
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if the user is changing their profile photo
  const isChangingAvatar = (selectedFile !== null) || (avatarPreview !== profile?.avatar_url);
  const avatarCost = !isChangingAvatar ? 0 : (avatarChangesCount === 0 ? 0 : 50);
  const hasEnoughForAvatar = credits >= avatarCost;

  // Sync state when modal opens
  const handleOpen = () => {
    if (profile) {
      setUsername(profile.username);
      setDisplayName(profile.display_name);
      setBio(profile.bio || '');
      setFavoriteGame(profile.favorite_game || '');
      setAvatarPreview(profile.avatar_url || '');
      setSelectedFile(null);
      setError('');
      setSuccess(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strictly validate photo only
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPEG, PNG, WebP, GIF) are allowed. Videos are not supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const selectPresetAvatar = (url: string) => {
    setSelectedFile(null);
    setAvatarPreview(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    // Check credits rule for subsequent avatar changes
    if (isChangingAvatar && avatarCost > 0 && !hasEnoughForAvatar) {
      setError(`Insufficient Credits. Changing your avatar costs 50 Credits (Current balance: ${credits}). First change was free. Claim 100 free credits at the Reward Box!`);
      return;
    }

    setIsSaving(true);

    try {
      // 1. If avatar changed and costs credits, deduct first with server validation
      if (isChangingAvatar && avatarCost > 0) {
        const deductRes = await deductCredits(50, 'avatar_change', 'Updated profile picture');
        if (!deductRes.success) {
          setError(deductRes.error || 'Failed to deduct 50 credits for avatar change.');
          setIsSaving(false);
          return;
        }
      }

      let finalAvatarUrl = avatarPreview;

      // If a new local file was selected from device gallery, upload it
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile);
      }

      await updateProfile({
        username: cleanUsername,
        display_name: displayName.trim() || cleanUsername,
        bio: bio.trim(),
        favorite_game: favoriteGame.trim(),
        avatar_url: finalAvatarUrl,
      });

      // Increment avatar changes count if an avatar change occurred
      if (isChangingAvatar) {
        await recordAvatarChange();
      }

      setSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        closeEditProfile();
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile changes.');
      setIsSaving(false);
    }
  };

  if (!isEditProfileOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditProfile}
          className="fixed inset-0 bg-[#090514]/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onAnimationStart={handleOpen}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E2EC] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E2EC] bg-[#F8F7FA]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A855F7] text-white shadow-sm">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#090514]">Player Profile & Avatar</h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-500">Manage your identity on TrendPulseX</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isSupabaseLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#F1EFF5] text-[#A855F7]'
                  }`}>
                    <ShieldCheck size={11} /> {isSupabaseLive ? 'Supabase Live' : 'Local Mode'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={closeEditProfile}
              className="p-2 rounded-xl text-slate-400 hover:text-[#090514] hover:bg-white border border-transparent hover:border-[#E5E2EC] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Google Auth Quick Action */}
          <div className="px-6 pt-4">
            <div className="p-3.5 rounded-2xl bg-[#F8F7FA] border border-[#E5E2EC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-xs font-black text-[#090514] block">
                  {user?.email && user.email !== 'gamer@trendpulsex.com' ? `Signed in as ${user.email}` : 'Sync with Google Account'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {user?.email && user.email !== 'gamer@trendpulsex.com' ? 'Your cloud profile is linked' : 'Auto-sync avatar & save game stats'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                {user?.email && user.email !== 'gamer@trendpulsex.com' ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F1EFF5] text-[#090514] border border-[#E5E2EC] text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        closeEditProfile();
                        openAuthModal('signup');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <LogIn size={13} /> Sign Up / Log In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
                <Check size={16} /> Profile updated successfully!
              </div>
            )}

            {/* Avatar Upload Section (PHOTO ONLY) */}
            <div className="p-4 rounded-2xl bg-[#F8F7FA] border border-[#E5E2EC] space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#A855F7] shadow-md bg-white">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-purple-100 text-[#A855F7] font-black text-xl">
                        {displayName.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#A855F7] text-white shadow-md hover:bg-[#9333EA] transition-colors cursor-pointer"
                    title="Upload photo from device"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-[#090514] uppercase tracking-wider block">
                      Profile Picture (Photo Only)
                    </span>
                    {/* Dynamic Cost Rule Badge */}
                    <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                      avatarChangesCount === 0 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-purple-50 text-[#A855F7] border-purple-200'
                    }`}>
                      <Coins size={11} className="stroke-[2.5]" />
                      {avatarChangesCount === 0 ? '1st Change: FREE' : 'Update: 50 Credits'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {avatarChangesCount === 0 
                      ? 'Your first avatar change is completely free! Future updates will cost 50 credits.' 
                      : `Subsequent avatar changes cost 50 Credits. (Your Wallet: ${credits} Credits)`}
                  </p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload size={13} /> Choose Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {avatarCost > 0 && !hasEnoughForAvatar && (
                      <button
                        type="button"
                        onClick={openWalletModal}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Gift size={12} /> Claim +100 Cr
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                Or Choose an Instant Avatar Preset:
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPresetAvatar(preset)}
                    className={`h-11 w-11 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      avatarPreview === preset ? 'border-[#A855F7] scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Username & Display Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#090514] uppercase tracking-wider mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '_'))}
                    placeholder=""
                    maxLength={20}
                    className="w-full pl-7 pr-3 py-2.5 bg-[#F8F7FA] border border-[#E5E2EC] rounded-xl font-bold text-[#090514] text-sm focus:border-[#A855F7] focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Letters, numbers, and underscores</span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#090514] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder=""
                  maxLength={30}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7FA] border border-[#E5E2EC] rounded-xl font-bold text-[#090514] text-sm focus:border-[#A855F7] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Favorite Game Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-[#090514] uppercase tracking-wider">
                  Favorite Game / Specialization
                </label>
                <Gamepad2 size={14} className="text-[#A855F7]" />
              </div>
              <input
                type="text"
                value={favoriteGame}
                onChange={(e) => setFavoriteGame(e.target.value)}
                placeholder="e.g. Roblox Blox Fruits, Genshin Impact"
                className="w-full px-3.5 py-2.5 bg-[#F8F7FA] border border-[#E5E2EC] rounded-xl font-medium text-[#090514] text-sm focus:border-[#A855F7] focus:bg-white focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {GAME_SUGGESTIONS.slice(0, 5).map((game) => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => setFavoriteGame(game)}
                    className="px-2 py-0.5 rounded-md bg-[#F1EFF5] hover:bg-purple-100 text-[#090514] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    + {game}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-[#090514] uppercase tracking-wider">
                  Player Bio
                </label>
                <span className="text-[11px] font-semibold text-slate-400">{bio.length}/160</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Share your favorite gaming builds, guild name, or community thoughts..."
                className="w-full px-3.5 py-2.5 bg-[#F8F7FA] border border-[#E5E2EC] rounded-xl font-medium text-[#090514] text-sm focus:border-[#A855F7] focus:bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2EC]">
              <button
                type="button"
                onClick={closeEditProfile}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl border border-[#E5E2EC] text-[#090514] text-xs font-bold hover:bg-[#F8F7FA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs font-black shadow-md shadow-[#A855F7]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>
                      {avatarCost > 0 ? `Save (50 Credits)` : 'Save Changes'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
