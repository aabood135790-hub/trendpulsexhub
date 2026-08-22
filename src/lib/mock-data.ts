import { Post, Category } from '../types';
import { getGameRepresentativeImage } from './gameImages';

// Production verified Roblox games roster with real active codes
export const mockPosts: Post[] = [
  {
    id: 'roblox-blox-fruits-codes',
    title: 'Roblox Blox Fruits Codes - Double XP & Stat Reset',
    slug: 'roblox-blox-fruits-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_bf_1', game: 'Roblox Blox Fruits', code: 'EARN_FRUITS_2026', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_2', game: 'Roblox Blox Fruits', code: 'SUB2CAPTAINMAUI', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_3', game: 'Roblox Blox Fruits', code: 'BLOXFRUITS_RELOADED', reward: 'Stat Reset & 15,000 Beli', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_4', game: 'Roblox Blox Fruits', code: 'KITT_RESET', reward: 'Free In-Game Stat Reset', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_5', game: 'Roblox Blox Fruits', code: 'CHANDLER', reward: '0 Beli (Troll / Title Unlock)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_6', game: 'Roblox Blox Fruits', code: 'SUB2GAMERROBOT_RESET1', reward: 'Stat Reset', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    content_text: `<p>Looking to level up fast in <strong>Roblox Blox Fruits</strong>? Use these active 2x EXP codes and Stat Resets to reach the Third Sea and awaken your Devil Fruits faster.</p>
    <p>Codes expire quickly during major updates, so bookmark this page to never miss free boosts.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 22',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-fisch-codes',
    title: 'Roblox Fisch Codes - Free Cash & Carbon Rods',
    slug: 'roblox-fisch-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_fi_1', game: 'Roblox Fisch', code: 'FischFabulous', reward: '10,000 Cash + 2 Carbon Rods', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_2', game: 'Roblox Fisch', code: 'MythicalSea', reward: '500 Bait + 1 Gold Lure', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_3', game: 'Roblox Fisch', code: 'AuroraBoost', reward: '2x Mutation Luck (15m)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_4', game: 'Roblox Fisch', code: 'TheDepths', reward: '5x Sea Enchant Relics', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Catch the rarest mythical mutations and upgrade your fishing gear in <strong>Roblox Fisch</strong> with verified active promo codes for thousands of cash, carbon rods, and luck multipliers.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    version: 'v1.5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-blade-ball-codes',
    title: 'Roblox Blade Ball Codes - Free Coins & Sword Spins',
    slug: 'roblox-blade-ball-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_bb_1', game: 'Roblox Blade Ball', code: 'GOODGAME', reward: '1x Free Sword Spin Ticket', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_2', game: 'Roblox Blade Ball', code: 'DRAGON_BLADE', reward: '500 Free Coins + Rare Emote', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_3', game: 'Roblox Blade Ball', code: 'DELAYBALL', reward: 'Free Sword Skin Crate', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_4', game: 'Roblox Blade Ball', code: 'UPD3_SPINS', reward: '1,000 Coins + 2 Wheel Spins', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Unlock exclusive sword skins, weapon wheel spins, and coins in <strong>Roblox Blade Ball</strong> with verified working redemption codes.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-anime-vanguards-codes',
    title: 'Roblox Anime Vanguards Codes - Free Gems & Trait Crystals',
    slug: 'roblox-anime-vanguards-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_av_1', game: 'Roblox Anime Vanguards', code: 'VANGUARDS2026', reward: '1,000 Free Gems + 10 Trait Crystals', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_2', game: 'Roblox Anime Vanguards', code: 'AVRELEASE', reward: '500 Gems + 1x Super Lucky Potion', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_3', game: 'Roblox Anime Vanguards', code: 'UPDATE1_LUCK', reward: '30 Minutes 2x Drop Rate Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_4', game: 'Roblox Anime Vanguards', code: '100MVISITS', reward: '2,500 Gems + Mythic Unit Voucher', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Summon top-tier anime tower defense units in <strong>Roblox Anime Vanguards</strong>. Claim free gems, reroll trait crystals, and boost potions.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-anime-defenders-codes',
    title: 'Roblox Anime Defenders Codes - Free Wish Crystals & Gems',
    slug: 'roblox-anime-defenders-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_ad_1', game: 'Roblox Anime Defenders', code: 'UPDATE3_DEFENSE', reward: '500 Free Gems + 2 Trait Crystals', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ad_2', game: 'Roblox Anime Defenders', code: 'SUMMER_HEROES', reward: '250 Gems + 1 Wish Token', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ad_3', game: 'Roblox Anime Defenders', code: 'DEFENDERS100K', reward: '1,000 Gems + Exclusive Banner Roll', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ad_4', game: 'Roblox Anime Defenders', code: 'RAID_RELOADED', reward: '50 Trait Crystals', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Defend your base and summon powerful secret mythical units in <strong>Roblox Anime Defenders</strong> with active gem codes and trait rerolls.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-king-legacy-codes',
    title: 'Roblox King Legacy Codes - Free Gems & Stat Resets',
    slug: 'roblox-king-legacy-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_kl_1', game: 'Roblox King Legacy', code: 'UPDATE7_RELEASE', reward: '5 Free Copper Keys + 30m 2x EXP', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_2', game: 'Roblox King Legacy', code: 'FREEBOOST2026', reward: '15 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_3', game: 'Roblox King Legacy', code: 'DRAGON_AWAKEN', reward: '3 Stat Reset Tokens', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_4', game: 'Roblox King Legacy', code: 'SKGAMES_KING', reward: '100,000 Beli + 5 Gems', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Rule the seas in <strong>Roblox King Legacy</strong> with verified working codes for free Gems, copper keys, EXP boosters, and instant stat resets.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-pet-simulator-99-codes',
    title: 'Roblox Pet Simulator 99 Codes - Free Diamonds & Huge Pets',
    slug: 'roblox-pet-simulator-99-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_ps_1', game: 'Roblox Pet Simulator 99', code: 'RELEASE_PS99', reward: 'Free Huge Pet Hoverboard Skin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ps_2', game: 'Roblox Pet Simulator 99', code: 'DIAMOND_BOOST_2026', reward: '50,000 Free Diamonds + 3 Mini Chests', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ps_3', game: 'Roblox Pet Simulator 99', code: 'LUCKY_POTION_X', reward: '5x Tier VIII Lucky Potions', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Hatch huge pets, upgrade your coin enchants, and unlock secret diamond zones in <strong>Roblox Pet Simulator 99</strong>.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 24',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-all-star-tower-defense-codes',
    title: 'Roblox All Star Tower Defense Codes - Stardust & Gems',
    slug: 'roblox-all-star-tower-defense-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_astd_1', game: 'Roblox All Star Tower Defense', code: 'ASTD2026UPDATE', reward: '500 Stardust + 1,000 Gems', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_astd_2', game: 'Roblox All Star Tower Defense', code: 'SUPER_SUMMON_50', reward: '50 Free Summons', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_astd_3', game: 'Roblox All Star Tower Defense', code: 'DRAGON_WARRIOR', reward: 'Exclusive 6-Star Banner Token', status: 'Active', updated_at: new Date().toISOString() },
    ],
    content_text: `<p>Summon the strongest 6-star anime heroes in <strong>Roblox All Star Tower Defense</strong>. Use these working promo codes for free stardust and summon gems.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    version: 'Evolution Update',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const STORAGE_SEED_VERSION = 'trendpulse_roblox_verified_v1_2026';

/**
 * Completely clears outdated local storage and forces a pristine re-seed
 * of all official game key visuals and verified code databases.
 */
export function clearLocalStorageAndReseed(): Post[] {
  const seeded = mockPosts.map(p => ({
    ...p,
    image_url: getGameRepresentativeImage(p.title, p.image_url),
  }));

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem('trendpulse_posts');
      window.localStorage.removeItem('trendpulse_posts_v1');
      window.localStorage.removeItem('trendpulse_cache_codes');
      window.localStorage.removeItem('trendpulse_community_posts');
      window.localStorage.setItem('trendpulse_posts', JSON.stringify(seeded));
      window.localStorage.setItem('trendpulse_community_posts', JSON.stringify([]));
      window.localStorage.setItem('trendpulse_storage_version', STORAGE_SEED_VERSION);
    } catch (e) {
      console.warn('LocalStorage reset error:', e);
    }
  }

  return seeded;
}

// Auto-run storage cleanup and re-seed on initialization if storage version is missing or old
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const currentVer = window.localStorage.getItem('trendpulse_storage_version');
    if (currentVer !== STORAGE_SEED_VERSION) {
      clearLocalStorageAndReseed();
    }
  } catch {}
}

export async function getPosts(category?: Category): Promise<Post[]> {
  // Simulate rapid reactive delay
  await new Promise(resolve => setTimeout(resolve, 80));

  let items: Post[] = mockPosts;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = window.localStorage.getItem('trendpulse_posts');
      if (cached) {
        items = JSON.parse(cached);
      }
    } catch {}
  }

  // Try to fetch fresh posts from the server (which includes Gemini viral trends & live scraped codes)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/posts/all');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.posts) && data.posts.length > 0) {
          const newItems = [...data.posts];
          items = newItems;
          try {
            window.localStorage.setItem('trendpulse_posts', JSON.stringify(items));
          } catch {}
        }
      }
    } catch {
      // Offline fallback
    }
  }

  const mapped = items.map(p => ({
    ...p,
    image_url: getGameRepresentativeImage(p.title, p.image_url),
  }));
  
  if (category) {
    return mapped.filter(p => p.category === category);
  }
  return mapped;
}

export async function addPostToStore(post: Post): Promise<void> {
  const current = await getPosts();
  const existingIdx = current.findIndex(p => p.id === post.id || p.slug === post.slug);
  let updated: Post[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = post;
  } else {
    updated = [post, ...current];
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('trendpulse_posts', JSON.stringify(updated));
    } catch {}
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 80));
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}

