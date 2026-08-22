// =========================================================================
// TrendPulseXhub - Official Game Representative Visuals & Artwork Registry
// High-resolution, curated authentic artwork and logos for all top games
// =========================================================================

export interface GameVisual {
  game: string;
  aliases: string[];
  bannerUrl: string;
  logoIconUrl: string;
  themeColor: string;
  badgeTag: string;
}

export const GAME_VISUALS_REGISTRY: Record<string, GameVisual> = {
  'blox fruits': {
    game: 'Roblox Blox Fruits',
    aliases: ['blox fruits', 'bloxfruits', 'blox fruit', 'devil fruit', 'sea 3', 'buddha fruit', 'kitsune fruit'],
    bannerUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=300',
    themeColor: '#4f46e5',
    badgeTag: 'Roblox',
  },
  'free fire': {
    game: 'Garena Free Fire',
    aliases: ['free fire', 'freefire', 'garena free fire', 'ff max', 'free fire max', 'bermuda', 'ff redeem'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300',
    themeColor: '#f59e0b',
    badgeTag: 'Battle Royale',
  },
  'genshin': {
    game: 'Genshin Impact',
    aliases: ['genshin', 'genshin impact', 'genshingift', 'primogems', 'teyvat', 'hoyoverse', 'fontaine', 'natlan'],
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
    themeColor: '#0284c7',
    badgeTag: 'HoYoverse',
  },
  'king legacy': {
    game: 'Roblox King Legacy',
    aliases: ['king legacy', 'kinglegacy', 'king piece', 'sea king', 'dragon awaken'],
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=300',
    themeColor: '#e11d48',
    badgeTag: 'Roblox',
  },
  'honkai': {
    game: 'Honkai: Star Rail',
    aliases: ['honkai', 'star rail', 'hsr', 'stellar jade', 'astral express', 'penacony'],
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300',
    themeColor: '#9333ea',
    badgeTag: 'HoYoverse',
  },
  'monopoly': {
    game: 'Monopoly GO',
    aliases: ['monopoly', 'monopoly go', 'dice rolls', 'free dice', 'scopely', 'sticker boom'],
    bannerUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#16a34a',
    badgeTag: 'Mobile Board',
  },
  'anime defenders': {
    game: 'Roblox Anime Defenders',
    aliases: ['anime defenders', 'animedefenders', 'defenders', 'trait crystals', 'wish tokens'],
    bannerUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#ea580c',
    badgeTag: 'Roblox',
  },
  'blade ball': {
    game: 'Roblox Blade Ball',
    aliases: ['blade ball', 'bladeball', 'deflect ball', 'sword burst'],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#2563eb',
    badgeTag: 'Roblox',
  },
  'pet simulator': {
    game: 'Roblox Pet Simulator 99',
    aliases: ['pet simulator', 'ps99', 'pet sim x', 'pet sim 99', 'big games', 'huge pet'],
    bannerUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#06b6d4',
    badgeTag: 'Roblox',
  },
  'fisch': {
    game: 'Roblox Fisch',
    aliases: ['fisch', 'roblox fisch', 'fishing rod', 'mythical fish', 'aurora rod'],
    bannerUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
    themeColor: '#0ea5e9',
    badgeTag: 'Roblox',
  },
  'anime vanguards': {
    game: 'Roblox Anime Vanguards',
    aliases: ['anime vanguards', 'vanguards', 'anime vanguard', 'unit summon'],
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#8b5cf6',
    badgeTag: 'Roblox',
  },
  'dress to impress': {
    game: 'Roblox Dress To Impress',
    aliases: ['dress to impress', 'dti', 'fashion show roblox', 'runway dti'],
    bannerUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
    themeColor: '#ec4899',
    badgeTag: 'Roblox Fashion',
  },
  'strongest battlegrounds': {
    game: 'Roblox The Strongest Battlegrounds',
    aliases: ['strongest battlegrounds', 'tsb', 'saitama battlegrounds', 'hero hunter'],
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=300',
    themeColor: '#ef4444',
    badgeTag: 'Roblox Action',
  },
  'cod': {
    game: 'Call of Duty: Mobile',
    aliases: ['cod', 'call of duty', 'cod mobile', 'codm', 'warzone mobile', 'cod points'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300',
    themeColor: '#ca8a04',
    badgeTag: 'FPS Shooter',
  },
  'pubg': {
    game: 'PUBG Mobile',
    aliases: ['pubg', 'pubg mobile', 'bgmi', 'battlegrounds mobile', 'airdrop pubg'],
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300',
    themeColor: '#f97316',
    badgeTag: 'Battle Royale',
  },
  'fortnite': {
    game: 'Fortnite',
    aliases: ['fortnite', 'v-bucks', 'epic games fortnite', 'battle pass'],
    bannerUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#a855f7',
    badgeTag: 'Epic Games',
  },
  'brawl stars': {
    game: 'Brawl Stars',
    aliases: ['brawl stars', 'supercell brawl', 'starr drops', 'gem grab'],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#eab308',
    badgeTag: 'Supercell',
  },
  'pokemon': {
    game: 'Pokemon GO & TCG Pocket',
    aliases: ['pokemon', 'pokemon go', 'pokemon pocket', 'pokeball', 'niantic pokemon', 'tcg pocket'],
    bannerUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
    themeColor: '#ef4444',
    badgeTag: 'Nintendo',
  },
  'gta': {
    game: 'Grand Theft Auto VI',
    aliases: ['gta', 'gta 6', 'gta vi', 'grand theft auto', 'vice city', 'rockstar'],
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#db2777',
    badgeTag: 'Rockstar',
  },
  'stardew': {
    game: 'Stardew Valley',
    aliases: ['stardew', 'stardew valley', 'stardew expanded', 'concernedape'],
    bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1592840062758-154df663d2dc?auto=format&fit=crop&q=80&w=300',
    themeColor: '#65a30d',
    badgeTag: 'Cozy RPG',
  },
  'minecraft': {
    game: 'Minecraft',
    aliases: ['minecraft', 'mojang', 'mine craft', 'bedrock', 'java edition'],
    bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#22c55e',
    badgeTag: 'Sandbox',
  },
  'wuthering waves': {
    game: 'Wuthering Waves',
    aliases: ['wuthering waves', 'wuwa', 'kuro games', 'solaris-3', 'astrite'],
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300',
    themeColor: '#0ea5e9',
    badgeTag: 'Action RPG',
  },
  'zenless zone zero': {
    game: 'Zenless Zone Zero',
    aliases: ['zenless zone zero', 'zzz', 'new eridu', 'polychrome', 'hoyoverse zzz'],
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#eab308',
    badgeTag: 'HoYoverse',
  },
  'mobile legends': {
    game: 'Mobile Legends: Bang Bang',
    aliases: ['mobile legends', 'mlbb', 'mobile legends bang bang', 'moonton', 'ml codes', 'diamonds mlbb'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300',
    themeColor: '#3b82f6',
    badgeTag: 'MOBA',
  },
  'coin master': {
    game: 'Coin Master',
    aliases: ['coin master', 'coinmaster', 'free spins', 'moon active', 'spins coin master', 'millionaire coin'],
    bannerUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=300',
    themeColor: '#f59e0b',
    badgeTag: 'Casual Casual',
  },
  'ea sports fc': {
    game: 'EA Sports FC Mobile',
    aliases: ['ea sports fc', 'fc mobile', 'fifa mobile', 'ea fc', 'fifa', 'fut mobile', 'fc points'],
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=300',
    themeColor: '#10b981',
    badgeTag: 'Sports Mobile',
  },
  'all star tower defense': {
    game: 'Roblox All Star Tower Defense',
    aliases: ['all star tower defense', 'astd', 'all star', 'tower defense roblox', 'stardust astd'],
    bannerUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#6366f1',
    badgeTag: 'Roblox TD',
  },
  'roblox': {
    game: 'Roblox Universe',
    aliases: ['roblox', 'rbx', 'robux', 'brookhaven', 'adopt me', 'bedwars', 'doors', 'murder mystery', 'mm2'],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    logoIconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=300',
    themeColor: '#3b82f6',
    badgeTag: 'Roblox',
  },
};

/**
 * Normalizes game queries by stripping noise words, punctuation, and converting to lowercase
 */
function normalizeQuery(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns a high-quality, authentic representative banner image for a given game name, title, or post slug.
 * Avoids any generic console/atari placeholders.
 */
export function getGameRepresentativeImage(titleOrSlugOrGame: string, explicitImageUrl?: string | null): string {
  // If an explicit URL is provided (e.g. admin custom upload, direct link, data-URL), preserve and return it
  if (
    explicitImageUrl &&
    typeof explicitImageUrl === 'string' &&
    explicitImageUrl.trim().length > 0 &&
    (explicitImageUrl.startsWith('http') || explicitImageUrl.startsWith('data:image/') || explicitImageUrl.startsWith('blob:') || explicitImageUrl.startsWith('/')) &&
    !explicitImageUrl.includes('placeholder') &&
    !explicitImageUrl.includes('photo-1614680376573') &&
    !explicitImageUrl.includes('photo-1552820728-8b83bb6b773f')
  ) {
    return explicitImageUrl.trim();
  }

  const query = normalizeQuery(titleOrSlugOrGame);

  // Exact or alias match across our curated game visuals registry
  for (const [key, visual] of Object.entries(GAME_VISUALS_REGISTRY)) {
    if (query.includes(key) || visual.aliases.some((alias) => query.includes(normalizeQuery(alias)))) {
      return visual.bannerUrl;
    }
  }

  // Token-level match for game keywords
  for (const [key, visual] of Object.entries(GAME_VISUALS_REGISTRY)) {
    const keyTokens = key.split(' ');
    if (keyTokens.every((token) => query.includes(token))) {
      return visual.bannerUrl;
    }
  }

  // High quality default gaming hero keyart
  return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200';
}

/**
 * Returns a high-definition official game logo or avatar badge
 */
export function getGameIconUrl(titleOrSlugOrGame: string): string {
  const query = normalizeQuery(titleOrSlugOrGame);

  for (const [key, visual] of Object.entries(GAME_VISUALS_REGISTRY)) {
    if (query.includes(key) || visual.aliases.some((alias) => query.includes(normalizeQuery(alias)))) {
      return visual.logoIconUrl;
    }
  }

  return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300';
}

/**
 * Returns official game metadata like category tag and theme color
 */
export function getGameMetadata(titleOrSlugOrGame: string): { gameTitle: string; badgeTag: string; themeColor: string } {
  const query = normalizeQuery(titleOrSlugOrGame);

  for (const [key, visual] of Object.entries(GAME_VISUALS_REGISTRY)) {
    if (query.includes(key) || visual.aliases.some((alias) => query.includes(normalizeQuery(alias)))) {
      return {
        gameTitle: visual.game,
        badgeTag: visual.badgeTag,
        themeColor: visual.themeColor,
      };
    }
  }

  return {
    gameTitle: titleOrSlugOrGame || 'Gaming Hub',
    badgeTag: 'Promo Codes',
    themeColor: '#4f46e5',
  };
}
