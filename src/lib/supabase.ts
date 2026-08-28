import { createClient } from '@supabase/supabase-js';
import { Post, CommunityPost, CommunityComment, UserProfile } from '../types';
import { mockPosts, STORAGE_SEED_VERSION, clearLocalStorageAndReseed } from './mock-data';
import { getGameRepresentativeImage } from './gameImages';
import { mockCommunityPosts } from './mock-community';

// Read from both Vite and Next.js public environment prefixes
const getEnvVar = (viteKey: string, nextKey: string, fallback: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[viteKey] || (import.meta as any).env[nextKey];
      if (val && typeof val === 'string' && val.trim() !== '' && !val.includes('placeholder')) {
        return val.trim();
      }
    }
  } catch {}

  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[viteKey] || process.env[nextKey];
      if (val && typeof val === 'string' && val.trim() !== '' && !val.includes('placeholder')) {
        return val.trim();
      }
    }
  } catch {}

  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder-project.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder-anon-key');

export const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder-project.supabase.co' && 
  supabaseAnonKey !== 'placeholder-anon-key' &&
  supabaseUrl.startsWith('https://');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/* =========================================================================
   LIVE DATABASE DATA SERVICES WITH SEAMLESS MOCK FALLBACK
   ========================================================================= */

// 1. Posts & Codes Service
export async function getLivePosts(): Promise<Post[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as Post[]).map(p => ({
          ...p,
          image_url: getGameRepresentativeImage(p.title, p.image_url),
        }));
      }
    } catch (err) {
      console.warn('Falling back to local data:', err);
    }
  }

  // Check storage version and fallback to local cached storage or re-seeded dataset
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const ver = window.localStorage.getItem('trendpulse_storage_version');
      const cached = window.localStorage.getItem('trendpulse_posts');
      if (ver !== STORAGE_SEED_VERSION || !cached) {
        const seeded = clearLocalStorageAndReseed();
        return seeded;
      }
      if (cached) {
        const parsed = JSON.parse(cached) as Post[];
        return parsed.map(p => ({
          ...p,
          image_url: getGameRepresentativeImage(p.title, p.image_url),
        }));
      }
    } catch {}
  }

  return mockPosts.map(p => ({
    ...p,
    image_url: getGameRepresentativeImage(p.title, p.image_url),
  }));
}

export async function getLivePostBySlug(slug: string): Promise<Post | undefined> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const post = data as Post;
        return {
          ...post,
          image_url: getGameRepresentativeImage(post.title, post.image_url),
        };
      }
    } catch (err) {
      console.warn('Falling back to local post lookup:', err);
    }
  }

  const posts = await getLivePosts();
  return posts.find((p) => p.slug === slug);
}

export async function saveLivePost(post: Partial<Post>): Promise<Post> {
  const currentPosts = await getLivePosts();
  let updatedPost: Post;

  if (post.id) {
    // Updating existing
    const existingIndex = currentPosts.findIndex((p) => p.id === post.id);
    if (existingIndex > -1) {
      updatedPost = {
        ...currentPosts[existingIndex],
        ...post,
        updated_at: new Date().toISOString(),
      } as Post;
      currentPosts[existingIndex] = updatedPost;
    } else {
      updatedPost = {
        id: post.id,
        title: post.title || 'Untitled',
        slug: post.slug || `post-${Date.now()}`,
        category: post.category || 'Codes',
        content_type: post.content_type || 'Codes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...post,
      } as Post;
      currentPosts.unshift(updatedPost);
    }
  } else {
    // Create new
    updatedPost = {
      id: crypto.randomUUID ? crypto.randomUUID() : `post_${Date.now()}`,
      title: post.title || 'Untitled Game Codes',
      slug: post.slug || `post-${Date.now()}`,
      category: post.category || 'Codes',
      content_type: post.content_type || 'Codes',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...post,
    } as Post;
    currentPosts.unshift(updatedPost);
  }

  // Update local cache
  localStorage.setItem('trendpulse_posts', JSON.stringify(currentPosts));

  // Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await supabase.from('posts').upsert(updatedPost);
    } catch (err) {
      console.warn('Supabase post sync failed, stored locally:', err);
    }
  }

  return updatedPost;
}

// 2. Community Feed Service
export async function getLiveCommunityPosts(category?: string, gameTag?: string): Promise<CommunityPost[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          community_comments (*)
        `)
        .order('created_at', { ascending: false });

      if (category && category !== 'Trending') {
        query = query.eq('category', category);
      }
      if (gameTag && gameTag !== 'All Games') {
        query = query.eq('game_tag', gameTag);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          comments: item.community_comments || [],
        })) as CommunityPost[];
      }
    } catch (err) {
      console.warn('Falling back to local community feed:', err);
    }
  }

  // Fallback to local storage or mock community data
  const cached = localStorage.getItem('trendpulse_community_posts');
  let posts: CommunityPost[] = mockCommunityPosts;
  if (cached) {
    try {
      posts = JSON.parse(cached);
    } catch {}
  }

  if (category && category !== 'Trending') {
    posts = posts.filter((p) => p.category === category);
  }
  if (gameTag && gameTag !== 'All Games') {
    posts = posts.filter((p) => p.game_tag.toLowerCase().includes(gameTag.toLowerCase()));
  }

  return posts;
}

export async function createLiveCommunityPost(newPost: Omit<CommunityPost, 'id' | 'created_at' | 'likes_count' | 'comments_count' | 'comments'>): Promise<CommunityPost> {
  const postObj: CommunityPost = {
    ...newPost,
    id: crypto.randomUUID ? crypto.randomUUID() : `post_${Date.now()}`,
    likes_count: 0,
    comments_count: 0,
    comments: [],
    created_at: new Date().toISOString(),
    is_liked: false,
  };

  // Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          id: postObj.id,
          user_id: postObj.user_id,
          username: postObj.username,
          avatar_url: postObj.avatar_url,
          game_tag: postObj.game_tag,
          category: postObj.category,
          content: postObj.content,
          image_url: postObj.image_url,
          likes_count: 0,
          comments_count: 0,
        })
        .select()
        .single();

      if (!error && data) {
        return { ...postObj, ...data, comments: [] };
      }
    } catch (err) {
      console.warn('Supabase post creation fallback to local:', err);
    }
  }

  // Local storage fallback
  const cached = localStorage.getItem('trendpulse_community_posts');
  const all = cached ? JSON.parse(cached) : mockCommunityPosts;
  all.unshift(postObj);
  localStorage.setItem('trendpulse_community_posts', JSON.stringify(all));

  return postObj;
}

// 3. Supabase Photo Upload Utility (Strictly images only)
export async function uploadSupabasePhoto(
  bucket: 'avatars' | 'community_images',
  file: File,
  prefix: string = 'upload'
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only photo files (JPEG, PNG, WebP, GIF) are allowed. Video uploads are prohibited.');
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `${prefix}-${Date.now()}.${fileExt}`;
  const filePath = `${cleanFileName}`;

  if (isSupabaseConfigured) {
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } else {
        console.warn('Storage upload error:', uploadError);
      }
    } catch (err) {
      console.warn('Storage upload catch:', err);
    }
  }

  // Fallback to client base64 Data URL for testing
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/* =========================================================================
   4. ORIGINAL ONLINE GAME SERVICES (PULSEWORLD 2D ARENA)
   ========================================================================= */

export async function getGameCharacter(userId: string): Promise<any | null> {
  // 1. Try server API
  try {
    const res = await fetch(`/api/game/character/${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.character) {
        return data.character;
      }
    }
  } catch (err) {
    console.warn('[Game Service] Fetch character error:', err);
  }

  // 2. Local storage fallback
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localChar = localStorage.getItem(`pulseworld_char_${userId}`);
      if (localChar) {
        return JSON.parse(localChar);
      }
    } catch {}
  }

  return null;
}

export async function checkGameUsername(username: string, excludeUserId?: string): Promise<boolean> {
  const clean = username.trim();
  if (!clean || clean.length < 3 || clean.length > 16) return false;

  try {
    const query = excludeUserId ? `?excludeUserId=${encodeURIComponent(excludeUserId)}` : '';
    const res = await fetch(`/api/game/check-username/${encodeURIComponent(clean)}${query}`);
    if (res.ok) {
      const data = await res.json();
      return !!data.available;
    }
  } catch {}

  return true;
}

export async function createGameCharacter(params: {
  userId: string;
  username: string;
  displayName?: string;
  race: string;
  age?: number;
  avatar_url?: string | null;
}): Promise<{ success: boolean; character?: any; error?: string }> {
  try {
    const res = await fetch('/api/game/character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (data.success && data.character) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`pulseworld_char_${params.userId}`, JSON.stringify(data.character));
      }
      return { success: true, character: data.character };
    }
    return { success: false, error: data.error || 'Failed to create character' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server connection error' };
  }
}

export async function sendGameChatMessage(userId: string, message: string): Promise<any | null> {
  try {
    const res = await fetch('/api/game/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.chat || null;
    }
  } catch {}
  return null;
}

export async function transferGameGold(fromUserId: string, toUserId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/game/transfer-gold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId, amount }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gold transfer failed' };
  }
}

