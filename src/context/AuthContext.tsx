import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured, uploadSupabasePhoto } from '../lib/supabase';

export const PROMO_CODES_REGISTRY: Record<string, { credits: number; title: string; description: string }> = {
  'SPECIAL10K': {
    credits: 10000,
    title: 'Special 10,000 Credits Mega Boost',
    description: 'Single-use VIP creator grant of 10,000 Credits for premium community posting and personalization.'
  },
  'BONUS300': {
    credits: 300,
    title: 'Starter 300 Credits Bonus',
    description: 'Single-use booster grant of 300 Credits for instant avatar customization and game discussions.'
  }
};

const DAILY_GIFT_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 Hours (43,200,000 ms)

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  credits: number;
  avatarChangesCount: number;
  redeemedCodes: string[];
  lastDailyClaimAt: string | null;
  isDailyGiftAvailable: boolean;
  remainingDailyClaimMs: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  isEditProfileOpen: boolean;
  isWalletOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signup' | 'signin';
  openEditProfile: () => void;
  closeEditProfile: () => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openAuthModal: (mode?: 'signup' | 'signin') => void;
  closeAuthModal: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  claimCredits: (amount?: number, source?: string) => Promise<{ success: boolean; newBalance: number; error?: string }>;
  redeemPromoCode: (code: string) => Promise<{ success: boolean; creditsAdded: number; message: string; newBalance: number; error?: string }>;
  recordDailyClaim: () => Promise<void>;
  deductCredits: (cost: number, actionType: string, description?: string) => Promise<{ success: boolean; newBalance: number; error?: string }>;
  hasEnoughCredits: (cost: number) => boolean;
  recordAvatarChange: () => Promise<number>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, username: string, displayName: string, agreedToTerms: boolean) => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email?: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_gamer_trendpulse_default',
  username: 'ApexRaider_X',
  display_name: 'Apex Raider',
  avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300',
  bio: 'Hunting the rarest codes, awakenings & speedruns across Roblox & Genshin 🎮',
  favorite_game: 'Roblox Blox Fruits',
  role: 'admin',
  credits: 0, // Every new user starts with 0 Credits
  avatar_changes_count: 0,
  redeemed_codes: [],
  last_daily_claim_at: null,
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');

  const credits = profile?.credits ?? 0;
  const avatarChangesCount = profile?.avatar_changes_count ?? 0;
  const redeemedCodes = profile?.redeemed_codes ?? [];
  const lastDailyClaimAt = profile?.last_daily_claim_at ?? null;

  // Real-time 12-hour cooldown ticker
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lastClaimTimeMs = lastDailyClaimAt ? new Date(lastDailyClaimAt).getTime() : 0;
  const timeSinceLastClaimMs = nowTimestamp - lastClaimTimeMs;
  const isDailyGiftAvailable = !lastDailyClaimAt || timeSinceLastClaimMs >= DAILY_GIFT_COOLDOWN_MS;
  const remainingDailyClaimMs = isDailyGiftAvailable
    ? 0
    : Math.max(0, DAILY_GIFT_COOLDOWN_MS - timeSinceLastClaimMs);

  // Helper: Synchronize or auto-create Supabase Profile on Google sign-in
  const syncSupabaseProfile = async (authUser: any) => {
    if (!authUser || !isSupabaseConfigured) return;

    try {
      // 1. Try to fetch existing profile
      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfile && !fetchErr) {
        const fullProfile: UserProfile = {
          ...existingProfile,
          credits: existingProfile.credits ?? 0,
          avatar_changes_count: existingProfile.avatar_changes_count ?? 0,
          redeemed_codes: Array.isArray(existingProfile.redeemed_codes) ? existingProfile.redeemed_codes : [],
          last_daily_claim_at: existingProfile.last_daily_claim_at || null,
        };
        setProfile(fullProfile);
        localStorage.setItem('trendpulse_user_profile', JSON.stringify(fullProfile));
        return;
      }

      // 2. If no profile exists, create one from Google / OAuth metadata
      const meta = authUser.user_metadata || {};
      const rawName = meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Gamer';
      const cleanUsername = `${rawName.replace(/[^a-zA-Z0-9_]/g, '')}_${Math.floor(100 + Math.random() * 900)}`;
      const googleAvatar = meta.avatar_url || meta.picture || DEFAULT_PROFILE.avatar_url;

      const newProfileData: UserProfile = {
        id: authUser.id,
        username: cleanUsername,
        display_name: rawName,
        avatar_url: googleAvatar,
        bio: 'Gaming enthusiast & promo code hunter on TrendPulseX 🚀',
        favorite_game: 'Roblox Blox Fruits',
        role: 'user',
        credits: 0, // Every new user starts with 0 Credits
        avatar_changes_count: 0,
        redeemed_codes: [],
        last_daily_claim_at: null,
        created_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .upsert(newProfileData)
        .select()
        .single();

      if (!insertErr && inserted) {
        setProfile(inserted as UserProfile);
        localStorage.setItem('trendpulse_user_profile', JSON.stringify(inserted));
      } else {
        // Fallback to local profile object
        setProfile(newProfileData);
        localStorage.setItem('trendpulse_user_profile', JSON.stringify(newProfileData));
      }
    } catch (err) {
      console.warn('Profile sync warning:', err);
    }
  };

  useEffect(() => {
    // 1. Initialize from local storage cache for instant UI response
    const cachedProfile = localStorage.getItem('trendpulse_user_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        const normalized: UserProfile = {
          ...parsed,
          credits: parsed.credits ?? 0,
          avatar_changes_count: parsed.avatar_changes_count ?? 0,
          redeemed_codes: Array.isArray(parsed.redeemed_codes) ? parsed.redeemed_codes : [],
          last_daily_claim_at: parsed.last_daily_claim_at || null,
        };
        setProfile(normalized);
        setUser({ id: normalized.id, email: 'gamer@trendpulsex.com' });
      } catch (err) {
        setProfile(DEFAULT_PROFILE);
        setUser({ id: DEFAULT_PROFILE.id, email: 'gamer@trendpulsex.com' });
      }
    } else {
      setProfile(DEFAULT_PROFILE);
      setUser({ id: DEFAULT_PROFILE.id, email: 'gamer@trendpulsex.com' });
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(DEFAULT_PROFILE));
    }

    // 2. Attach live Supabase Auth listener
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          syncSupabaseProfile(session.user);
        }
      }).catch((err) => {
        console.warn('Supabase getSession catch:', err);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          await syncSupabaseProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(DEFAULT_PROFILE);
          localStorage.setItem('trendpulse_user_profile', JSON.stringify(DEFAULT_PROFILE));
        } else if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
        }
      });

      setIsLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const openEditProfile = () => setIsEditProfileOpen(true);
  const closeEditProfile = () => setIsEditProfileOpen(false);

  const openWalletModal = () => setIsWalletOpen(true);
  const closeWalletModal = () => setIsWalletOpen(false);

  const openAuthModal = (mode: 'signup' | 'signin' = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Check if current user has at least `cost` credits
  const hasEnoughCredits = (cost: number): boolean => {
    return credits >= cost;
  };

  // Record daily reward box claim timestamp (enforces 12-hour timer)
  const recordDailyClaim = async () => {
    const nowIso = new Date().toISOString();
    if (profile) {
      const updated: UserProfile = {
        ...profile,
        last_daily_claim_at: nowIso,
        updated_at: nowIso,
      };
      setProfile(updated);
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(updated));

      if (isSupabaseConfigured && profile.id) {
        try {
          await supabase.from('profiles').update({ last_daily_claim_at: nowIso }).eq('id', profile.id);
        } catch {}
      }
    }
  };

  // Claim Reward Box Credits (+100 Credits)
  const claimCredits = async (amount = 100, source = 'reward_box'): Promise<{ success: boolean; newBalance: number; error?: string }> => {
    const current = profile?.credits ?? 0;
    const newBalance = current + amount;
    const nowIso = new Date().toISOString();

    const isDaily = source === 'reward_box' || source === 'daily_reward';

    if (profile) {
      const updated: UserProfile = {
        ...profile,
        credits: newBalance,
        ...(isDaily ? { last_daily_claim_at: nowIso } : {}),
        updated_at: nowIso,
      };
      setProfile(updated);
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(updated));
    }

    // Attempt server sync
    try {
      if (profile?.id) {
        const res = await fetch('/api/wallet/claim-reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.id, amount, source }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.credits !== undefined && profile) {
            const serverUpdated: UserProfile = {
              ...profile,
              credits: json.credits,
              ...(isDaily ? { last_daily_claim_at: nowIso } : {}),
            };
            setProfile(serverUpdated);
            localStorage.setItem('trendpulse_user_profile', JSON.stringify(serverUpdated));
            return { success: true, newBalance: json.credits };
          }
        }
      }
    } catch (err) {
      console.warn('Backend claim sync error:', err);
    }

    // Direct Supabase update fallback
    if (isSupabaseConfigured && profile?.id) {
      try {
        const payload: any = { credits: newBalance };
        if (isDaily) payload.last_daily_claim_at = nowIso;
        await supabase.from('profiles').update(payload).eq('id', profile.id);
      } catch {}
    }

    return { success: true, newBalance };
  };

  // Redeem Promo / Gift Code (e.g. SPECIAL10K -> +10,000, BONUS300 -> +300)
  const redeemPromoCode = async (
    code: string
  ): Promise<{ success: boolean; creditsAdded: number; message: string; newBalance: number; error?: string }> => {
    const cleanCode = (code || '').trim().toUpperCase();

    if (!cleanCode) {
      return {
        success: false,
        creditsAdded: 0,
        message: 'Please enter a redeem code.',
        newBalance: credits,
        error: 'Please enter a redeem code.',
      };
    }

    const promo = PROMO_CODES_REGISTRY[cleanCode];
    if (!promo) {
      return {
        success: false,
        creditsAdded: 0,
        message: 'Invalid promo code. Please check your spelling and try again.',
        newBalance: credits,
        error: 'Invalid promo code. Please check your spelling and try again.',
      };
    }

    const currentRedeemed = Array.isArray(profile?.redeemed_codes) ? profile.redeemed_codes : [];
    if (currentRedeemed.includes(cleanCode)) {
      return {
        success: false,
        creditsAdded: 0,
        message: `Code ${cleanCode} has already been claimed on this account. Each code is single-use.`,
        newBalance: credits,
        error: `Code ${cleanCode} has already been claimed on this account.`,
      };
    }

    const creditsToAdd = promo.credits;
    const newBalance = credits + creditsToAdd;
    const updatedRedeemed = [...currentRedeemed, cleanCode];
    const nowIso = new Date().toISOString();

    // 1. Instant local update for responsive UX
    if (profile) {
      const updatedProfile: UserProfile = {
        ...profile,
        credits: newBalance,
        redeemed_codes: updatedRedeemed,
        updated_at: nowIso,
      };
      setProfile(updatedProfile);
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(updatedProfile));
    }

    // 2. Server API sync
    try {
      if (profile?.id) {
        const res = await fetch('/api/wallet/redeem-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: profile.id,
            code: cleanCode,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.credits !== undefined && profile) {
            const syncedProfile: UserProfile = {
              ...profile,
              credits: json.credits,
              redeemed_codes: json.redeemedCodes || updatedRedeemed,
            };
            setProfile(syncedProfile);
            localStorage.setItem('trendpulse_user_profile', JSON.stringify(syncedProfile));
            return {
              success: true,
              creditsAdded: creditsToAdd,
              message: `🎉 Success! Redeemed "${cleanCode}" for +${creditsToAdd.toLocaleString()} Credits!`,
              newBalance: json.credits,
            };
          }
        }
      }
    } catch (err) {
      console.warn('Server redeem sync error:', err);
    }

    // 3. Supabase fallback
    if (isSupabaseConfigured && profile?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            credits: newBalance,
            redeemed_codes: updatedRedeemed,
            updated_at: nowIso,
          })
          .eq('id', profile.id);
      } catch {}
    }

    return {
      success: true,
      creditsAdded: creditsToAdd,
      message: `🎉 Success! Redeemed "${cleanCode}" for +${creditsToAdd.toLocaleString()} Credits!`,
      newBalance,
    };
  };

  // Deduct Credits with server balance validation
  const deductCredits = async (
    cost: number,
    actionType: string,
    description = ''
  ): Promise<{ success: boolean; newBalance: number; error?: string }> => {
    if (cost <= 0) return { success: true, newBalance: credits };

    if (credits < cost) {
      return {
        success: false,
        newBalance: credits,
        error: `Insufficient Credits. You need ${cost} Credits (current balance: ${credits}). Click the Reward Box to claim 100 free Credits!`,
      };
    }

    const calculatedNew = Math.max(0, credits - cost);

    // Update local state instantly for snappy UX
    if (profile) {
      const updated: UserProfile = {
        ...profile,
        credits: calculatedNew,
        updated_at: new Date().toISOString(),
      };
      setProfile(updated);
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(updated));
    }

    // Attempt server verification & deduction
    try {
      if (profile?.id) {
        const res = await fetch('/api/wallet/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: profile.id,
            actionType,
            customCost: cost,
            description,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          // Rollback on server error
          if (profile) {
            const rollback = { ...profile, credits };
            setProfile(rollback);
            localStorage.setItem('trendpulse_user_profile', JSON.stringify(rollback));
          }
          return {
            success: false,
            newBalance: credits,
            error: json.message || json.error || 'Insufficient credits balance.',
          };
        }

        if (json.credits !== undefined && profile) {
          const synced = { ...profile, credits: json.credits };
          setProfile(synced);
          localStorage.setItem('trendpulse_user_profile', JSON.stringify(synced));
          return { success: true, newBalance: json.credits };
        }
      }
    } catch (err) {
      console.warn('Backend deduction call failed, falling back to local/supabase:', err);
    }

    // Supabase table update fallback
    if (isSupabaseConfigured && profile?.id) {
      try {
        await supabase.from('profiles').update({ credits: calculatedNew }).eq('id', profile.id);
      } catch {}
    }

    return { success: true, newBalance: calculatedNew };
  };

  // Record profile avatar changes count
  const recordAvatarChange = async (): Promise<number> => {
    const nextCount = (profile?.avatar_changes_count ?? 0) + 1;
    if (profile) {
      const updated: UserProfile = {
        ...profile,
        avatar_changes_count: nextCount,
        updated_at: new Date().toISOString(),
      };
      setProfile(updated);
      localStorage.setItem('trendpulse_user_profile', JSON.stringify(updated));

      if (isSupabaseConfigured && profile.id) {
        try {
          await supabase.from('profiles').update({ avatar_changes_count: nextCount }).eq('id', profile.id);
        } catch {}
      }
    }
    return nextCount;
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      alert('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to enable real Google OAuth.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google Sign In error:', error);
        alert(`Google Sign In failed: ${error.message}`);
      }
    } catch (err: any) {
      console.error('OAuth redirect error:', err);
      alert('Error initiating Google OAuth.');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    } as UserProfile;

    setProfile(updated);
    localStorage.setItem('trendpulse_user_profile', JSON.stringify(updated));

    // Update in Supabase if real backend is active
    if (isSupabaseConfigured && user?.id) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: updated.username,
            display_name: updated.display_name,
            avatar_url: updated.avatar_url,
            bio: updated.bio,
            favorite_game: updated.favorite_game,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    // Strictly photo only validation
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed for profile pictures.');
    }

    const publicUrl = await uploadSupabasePhoto('avatars', file, profile?.id || 'avatar');
    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
    displayName: string,
    agreedToTerms: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    if (!agreedToTerms) {
      return {
        success: false,
        error: 'You must agree to the Terms of Service and Privacy Policy to register an account.',
      };
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    const cleanDisplay = displayName.trim() || cleanUsername;

    // Try Supabase auth if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: cleanDisplay,
              agreed_to_terms_at: new Date().toISOString(),
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            username: cleanUsername,
            display_name: cleanDisplay,
            avatar_url: DEFAULT_PROFILE.avatar_url,
            bio: 'Gaming enthusiast on TrendPulseX 🚀',
            favorite_game: 'Roblox Blox Fruits',
            role: 'user',
            credits: 0,
            avatar_changes_count: 0,
            redeemed_codes: [],
            last_daily_claim_at: null,
            created_at: new Date().toISOString(),
          };

          await supabase.from('profiles').upsert(newProfile);
          setUser({ id: data.user.id, email: data.user.email || email });
          setProfile(newProfile);
          localStorage.setItem('trendpulse_user_profile', JSON.stringify(newProfile));
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase sign up error:', err);
      }
    }

    // Local state fallback registration
    const newLocalProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      display_name: cleanDisplay,
      avatar_url: DEFAULT_PROFILE.avatar_url,
      bio: 'Gaming enthusiast on TrendPulseX 🚀',
      favorite_game: 'Roblox Blox Fruits',
      role: 'user',
      credits: 0,
      avatar_changes_count: 0,
      redeemed_codes: [],
      last_daily_claim_at: null,
      created_at: new Date().toISOString(),
    };

    setUser({ id: newLocalProfile.id, email });
    setProfile(newLocalProfile);
    localStorage.setItem('trendpulse_user_profile', JSON.stringify(newLocalProfile));

    return { success: true };
  };

  const signInWithEmail = async (
    emailOrUsername: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && emailOrUsername.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email });
          await syncSupabaseProfile(data.user);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase sign in error:', err);
      }
    }

    // Local profile fallback
    const rawName = emailOrUsername.replace(/@/g, '').split('.')[0] || 'Gamer';
    const localProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id: `usr_${Date.now()}`,
      username: rawName,
      display_name: rawName,
    };

    setUser({ id: localProfile.id, email: emailOrUsername.includes('@') ? emailOrUsername : `${rawName}@trendpulsex.com` });
    setProfile(localProfile);
    localStorage.setItem('trendpulse_user_profile', JSON.stringify(localProfile));
    return { success: true };
  };

  const login = async (email?: string, username?: string) => {
    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id: `usr_${Date.now()}`,
      username: username || 'TrendPulseGamer',
      display_name: username || 'TrendPulse Gamer',
    };
    setUser({ id: newProfile.id, email: email || 'gamer@trendpulsex.com' });
    setProfile(newProfile);
    localStorage.setItem('trendpulse_user_profile', JSON.stringify(newProfile));
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    setUser({ id: DEFAULT_PROFILE.id, email: 'gamer@trendpulsex.com' });
    setProfile(DEFAULT_PROFILE);
    localStorage.setItem('trendpulse_user_profile', JSON.stringify(DEFAULT_PROFILE));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        credits,
        avatarChangesCount,
        redeemedCodes,
        lastDailyClaimAt,
        isDailyGiftAvailable,
        remainingDailyClaimMs,
        isAuthenticated: !!profile,
        isLoading,
        isSupabaseLive: isSupabaseConfigured,
        isEditProfileOpen,
        isWalletOpen,
        isAuthModalOpen,
        authModalMode,
        openEditProfile,
        closeEditProfile,
        openWalletModal,
        closeWalletModal,
        openAuthModal,
        closeAuthModal,
        updateProfile,
        uploadAvatar,
        claimCredits,
        redeemPromoCode,
        recordDailyClaim,
        deductCredits,
        hasEnoughCredits,
        recordAvatarChange,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
