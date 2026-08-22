// Default Avatar Management & Presets Utility

export const DEFAULT_FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300';
const DEFAULT_AVATAR_STORAGE_KEY = 'trendpulse_default_avatar_url';

export interface GamingAvatarPreset {
  id: string;
  name: string;
  category: 'Cyberpunk' | 'Anime' | 'Roblox' | 'Pixel' | 'Sci-Fi' | 'Fantasy';
  url: string;
}

export const GAMING_AVATAR_PRESETS: GamingAvatarPreset[] = [
  {
    id: 'cyber_shadow',
    name: 'Cyber Blade Raider',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'neon_hacker',
    name: 'Neon VR Phantom',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'anime_striker',
    name: 'Dragon Shinobi',
    category: 'Anime',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'pixel_knight',
    name: 'Retro Arcade Champion',
    category: 'Pixel',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'mecha_pilot',
    name: 'Quantum Mecha Pilot',
    category: 'Sci-Fi',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'roblox_legend',
    name: 'Blox Mastermind',
    category: 'Roblox',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'valkyrie_hero',
    name: 'Valkyrie Guardian',
    category: 'Fantasy',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'cosmic_wizard',
    name: 'Astral Speedrunner',
    category: 'Fantasy',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300',
  },
];

export function getActiveDefaultAvatar(): string {
  try {
    const stored = localStorage.getItem(DEFAULT_AVATAR_STORAGE_KEY);
    if (stored && stored.trim().startsWith('http') || (stored && stored.startsWith('data:image/'))) {
      return stored.trim();
    }
  } catch {}
  return DEFAULT_FALLBACK_AVATAR;
}

export function setActiveDefaultAvatar(newUrl: string): void {
  try {
    const clean = (newUrl || '').trim();
    if (clean) {
      localStorage.setItem(DEFAULT_AVATAR_STORAGE_KEY, clean);
      // Dispatch custom event for instant cross-component updates
      window.dispatchEvent(new CustomEvent('trendpulse_default_avatar_changed', { detail: { avatarUrl: clean } }));
    }
  } catch {}
}

export async function syncDefaultAvatarToServer(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/default-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defaultAvatarUrl: url }),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (err: any) {
    console.warn('Backend avatar sync warning:', err);
  }
  return { success: true };
}

export async function fetchServerDefaultAvatar(): Promise<string | null> {
  try {
    const res = await fetch('/api/admin/default-avatar');
    if (res.ok) {
      const data = await res.json();
      if (data.defaultAvatarUrl) {
        setActiveDefaultAvatar(data.defaultAvatarUrl);
        return data.defaultAvatarUrl;
      }
    }
  } catch {}
  return null;
}
