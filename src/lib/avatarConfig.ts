// Default Avatar Management & Presets Utility
export const DEFAULT_FALLBACK_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
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
    name: 'Controller Master',
    category: 'Cyberpunk',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M21.58 16.09l-1.09-7.66C20.18 6.27 18.4 5 16.32 5H7.68C5.6 5 3.82 6.27 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
  },
  {
    id: 'neon_hacker',
    name: 'Shield Guardian',
    category: 'Fantasy',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
  },
  {
    id: 'anime_striker',
    name: 'Swordsman',
    category: 'Anime',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f43f5e"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-1.25 0-2.45.49-3.34 1.38l-1.3 1.3 2.83 2.83 1.3-1.3c1.85-1.85 1.85-4.86 0-6.72l-2.03-2.03c-.45-.45-1.05-.7-1.68-.7-.63 0-1.23.25-1.68.7L9.5 5.5l2.83 2.83 1.3-1.3c.49-.49.49-1.28 0-1.77-.49-.49-1.28-.49-1.77 0l-1.3 1.3-2.83-2.83 1.3-1.3C10.22 1.49 11.42 1 12.67 1c1.25 0 2.45.49 3.34 1.38L17.66 3z"/></svg>',
  },
  {
    id: 'pixel_knight',
    name: 'Gamepad Hero',
    category: 'Pixel',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><path d="M21.58 16.09l-1.09-7.66C20.18 6.27 18.4 5 16.32 5H7.68C5.6 5 3.82 6.27 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
  },
  {
    id: 'mecha_pilot',
    name: 'Hardware Geek',
    category: 'Sci-Fi',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230ea5e9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/></svg>',
  },
  {
    id: 'roblox_legend',
    name: 'Build Master',
    category: 'Roblox',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23eab308"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>',
  },
  {
    id: 'valkyrie_hero',
    name: 'Magic Staff',
    category: 'Fantasy',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ec4899"><path d="M19.08 4.93l-1.41-1.42c-.39-.39-1.02-.39-1.41 0L4.93 14.85c-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l11.33-11.33c.39-.39.39-1.03 0-1.41zM6.34 14.85l1.41-1.41 1.41 1.41-1.41 1.41-1.41-1.41z"/></svg>',
  },
  {
    id: 'cosmic_wizard',
    name: 'Space Explorer',
    category: 'Sci-Fi',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f97316"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>',
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
