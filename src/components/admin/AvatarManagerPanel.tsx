import { useState, useEffect, ChangeEvent } from 'react';
import { 
  User, Image as ImageIcon, Upload, CheckCircle2, Sparkles, RefreshCw, 
  Check, Globe, Shield, Gamepad2, Info, AlertCircle, Trash2, ArrowRight
} from 'lucide-react';
import { 
  getActiveDefaultAvatar, 
  setActiveDefaultAvatar, 
  syncDefaultAvatarToServer, 
  GAMING_AVATAR_PRESETS, 
  GamingAvatarPreset,
  DEFAULT_FALLBACK_AVATAR 
} from '../../lib/avatarConfig';
import { uploadSupabasePhoto, isSupabaseConfigured } from '../../lib/supabase';

export function AvatarManagerPanel() {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(getActiveDefaultAvatar());
  const [inputUrl, setInputUrl] = useState<string>(getActiveDefaultAvatar());
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [previewCategory, setPreviewCategory] = useState<'All' | 'Cyberpunk' | 'Anime' | 'Roblox' | 'Pixel' | 'Fantasy'>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveDefaultAvatar();
    setCurrentAvatarUrl(active);
    setInputUrl(active);
  }, []);

  const handleSelectPreset = (preset: GamingAvatarPreset) => {
    setSelectedPresetId(preset.id);
    setInputUrl(preset.url);
    setErrorMessage(null);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured) {
        try {
          const publicUrl = await uploadSupabasePhoto('avatars', file, `default_avatar_${Date.now()}`);
          setInputUrl(publicUrl);
          setSelectedPresetId(null);
          setSuccessMessage('✓ Image uploaded successfully to Supabase Storage!');
          setTimeout(() => setSuccessMessage(null), 4000);
          setIsUploading(false);
          return;
        } catch (supabaseErr) {
          console.warn('Supabase upload fallback to base64:', supabaseErr);
        }
      }

      // Fallback: Convert to Base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setInputUrl(base64);
        setSelectedPresetId(null);
        setSuccessMessage('✓ Image uploaded and loaded as default avatar preview!');
        setTimeout(() => setSuccessMessage(null), 4000);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read uploaded image file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing uploaded file.');
      setIsUploading(false);
    }
  };

  const handleSaveDefaultAvatar = async () => {
    if (!inputUrl || (!inputUrl.startsWith('http') && !inputUrl.startsWith('data:image/'))) {
      setErrorMessage('Please provide a valid image URL or choose a preset.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      // 1. Update local storage & broadcast event
      setActiveDefaultAvatar(inputUrl);
      setCurrentAvatarUrl(inputUrl);

      // 2. Sync to backend API
      await syncDefaultAvatarToServer(inputUrl);

      setSuccessMessage('✓ Default user profile picture updated successfully! All new user registrations and default placeholders will now use this avatar.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage('Failed to save default avatar settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToSystemDefault = () => {
    setInputUrl(DEFAULT_FALLBACK_AVATAR);
    setSelectedPresetId(null);
    setActiveDefaultAvatar(DEFAULT_FALLBACK_AVATAR);
    setCurrentAvatarUrl(DEFAULT_FALLBACK_AVATAR);
    syncDefaultAvatarToServer(DEFAULT_FALLBACK_AVATAR);
    setSuccessMessage('✓ Reset to system default avatar.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const filteredPresets = GAMING_AVATAR_PRESETS.filter(
    preset => previewCategory === 'All' || preset.category === previewCategory
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire-50 border border-sapphire-200 text-sapphire-700 text-xs font-black uppercase tracking-wider mb-2">
            <User size={13} /> Global User Persona Management
          </div>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950">Default Profile Picture (Avatar) Manager</h2>
          <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
            Customize the official default avatar assigned to new registered users, unauthenticated visitors, and default community discussion threads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToSystemDefault}
            className="px-3.5 py-2 rounded-xl border border-indigo-950/15 text-xs font-bold text-indigo-900/70 hover:bg-azure-50 transition-colors cursor-pointer"
          >
            Reset Default
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <AlertCircle size={16} className="text-rose-600 shrink-0" /> {errorMessage}
        </div>
      )}

      {/* Main Avatar Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-950 via-sapphire-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sapphire-400/25 relative overflow-hidden space-y-6 text-center">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-sky-300">
              <span className="flex items-center gap-1.5"><Sparkles size={14} /> Live Avatar Preview</span>
              <span className="text-[10px] font-mono bg-sky-400/20 px-2 py-0.5 rounded text-sky-200">Active</span>
            </div>

            {/* Circular Preview Main */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-sky-400/80 shadow-2xl shadow-sky-500/30 bg-slate-900 transition-transform group-hover:scale-105">
                  <img
                    src={inputUrl || currentAvatarUrl}
                    alt="Default Avatar Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_AVATAR;
                    }}
                  />
                </div>
                <div className="absolute bottom-1 right-2 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-slate-950 shadow-md">
                  <Shield size={14} className="stroke-[2.5]" />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="font-black text-white text-lg">TrendPulse Gamer</h3>
                <p className="text-xs text-sky-300 font-mono font-medium">@gamer_trendpulse_default</p>
                <p className="text-[11px] text-azure-100/70 max-w-xs mx-auto mt-2">
                  "Hunting the rarest codes, awakenings & speedruns across Roblox & Genshin 🎮"
                </p>
              </div>
            </div>

            {/* Scale Comparison Previews */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-azure-200/60 block">
                Preview Across Platform Components:
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center space-y-1">
                  <img 
                    src={inputUrl || currentAvatarUrl} 
                    alt="Navbar" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-sky-400 object-cover mx-auto bg-slate-800" 
                  />
                  <span className="text-[9px] text-slate-400 font-mono">Navbar (32px)</span>
                </div>
                <div className="text-center space-y-1">
                  <img 
                    src={inputUrl || currentAvatarUrl} 
                    alt="Comment" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-sky-400 object-cover mx-auto bg-slate-800" 
                  />
                  <span className="text-[9px] text-slate-400 font-mono">Comment (40px)</span>
                </div>
                <div className="text-center space-y-1">
                  <img 
                    src={inputUrl || currentAvatarUrl} 
                    alt="Profile Card" 
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full border-2 border-sky-400 object-cover mx-auto bg-slate-800" 
                  />
                  <span className="text-[9px] text-slate-400 font-mono">Profile (56px)</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveDefaultAvatar}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-azure-300 hover:from-sky-300 hover:to-azure-200 text-indigo-950 py-3.5 px-4 rounded-2xl font-black text-xs shadow-lg shadow-sky-400/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving Default Avatar...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={3} />
                  <span>Set as Global Default Avatar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Custom URL, File Upload, & Presets */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Method 1: Image URL Input & File Upload */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <ImageIcon size={18} className="text-sapphire-600" />
              Custom Avatar Image Source
            </h3>

            {/* Direct URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center justify-between">
                <span>Avatar Image Web URL (HTTPS)</span>
                <span className="text-[10px] text-sapphire-600 font-bold font-mono">Unsplash / Cloudinary / CDN</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setSelectedPresetId(null);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-950 focus:outline-none focus:border-sapphire-600"
                />
                <button
                  onClick={() => setInputUrl(DEFAULT_FALLBACK_AVATAR)}
                  className="px-3 py-2 bg-azure-100 hover:bg-azure-200 text-indigo-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Clear & use default URL"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block">
                Or Upload Image File from Device
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sapphire-300 hover:border-sapphire-500 rounded-2xl bg-azure-50/50 hover:bg-azure-100/50 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sapphire-600 text-white rounded-xl shadow-sm">
                    {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Upload size={20} />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-indigo-950">
                      {isUploading ? 'Uploading file...' : 'Click to select or drop image'}
                    </p>
                    <p className="text-[11px] text-indigo-900/50">PNG, JPG, WebP or GIF (Up to 5MB)</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Method 2: Curated Gaming Avatar Presets */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                  <Gamepad2 size={18} className="text-emerald-600" />
                  Curated Gaming Persona Presets
                </h3>
                <p className="text-xs text-indigo-900/60 font-medium">
                  Click any high-resolution gaming avatar to preview and apply.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-azure-50 p-1 rounded-xl border border-indigo-950/5 overflow-x-auto scrollbar-none">
                {(['All', 'Cyberpunk', 'Anime', 'Roblox', 'Pixel', 'Fantasy'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPreviewCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      previewCategory === cat
                        ? 'bg-sapphire-600 text-white shadow-xs'
                        : 'text-indigo-900/60 hover:text-indigo-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {filteredPresets.map((preset) => {
                const isSelected = inputUrl === preset.url || selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative p-3 rounded-2xl border text-left transition-all group cursor-pointer flex flex-col items-center text-center space-y-2 ${
                      isSelected
                        ? 'border-sapphire-600 bg-sapphire-50/80 ring-2 ring-sapphire-500/20 shadow-md'
                        : 'border-indigo-950/10 bg-azure-50/40 hover:bg-azure-50 hover:border-sapphire-300'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-950/10 group-hover:scale-105 transition-transform bg-slate-900 shadow-xs">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-sapphire-600/30 flex items-center justify-center">
                          <Check size={18} className="text-white drop-shadow-md stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 w-full">
                      <p className="font-black text-indigo-950 text-xs truncate">{preset.name}</p>
                      <span className="text-[10px] font-bold text-sapphire-600 uppercase font-mono">
                        {preset.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
