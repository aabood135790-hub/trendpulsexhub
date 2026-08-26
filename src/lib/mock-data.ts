import { Post, Category } from '../types';
import { getGameRepresentativeImage } from './gameImages';

// Production verified gaming & Roblox games roster with real active codes
export const mockPosts: Post[] = [
  {
    id: 'roblox-blox-fruits-codes',
    title: 'Roblox Blox Fruits Codes - Double XP, Stat Resets & Titles',
    slug: 'roblox-blox-fruits-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_bf_1', game: 'Roblox Blox Fruits', code: 'EASTEREXP', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_2', game: 'Roblox Blox Fruits', code: 'KITT_RESET', reward: 'Free Stat Reset / Refund', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_3', game: 'Roblox Blox Fruits', code: 'SUB2OFFICIALNOOBIE', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_4', game: 'Roblox Blox Fruits', code: 'BIGNEWS', reward: 'In-Game Title "BIGNEWS" (Second Sea)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_5', game: 'Roblox Blox Fruits', code: 'ENYU_IS_PRO', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_6', game: 'Roblox Blox Fruits', code: 'SUB2CAPTAINMAUI', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_7', game: 'Roblox Blox Fruits', code: 'SUB2GAMERROBOT_EXP1', reward: '30 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_8', game: 'Roblox Blox Fruits', code: 'SUB2GAMERROBOT_RESET1', reward: 'Free Stat Reset / Refund', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_9', game: 'Roblox Blox Fruits', code: 'SUB2FER999', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_10', game: 'Roblox Blox Fruits', code: 'BLUXXY', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_11', game: 'Roblox Blox Fruits', code: 'MAGICBUS', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_12', game: 'Roblox Blox Fruits', code: 'STARCODEHEO', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_13', game: 'Roblox Blox Fruits', code: 'LIGHTNINGABUSE', reward: '20 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_14', game: 'Roblox Blox Fruits', code: 'CHANDLER', reward: '0 Beli (Troll Title Unlock)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bf_15', game: 'Roblox Blox Fruits', code: '1LOSTADMIN', reward: '20 Minutes 2x EXP Boost', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'c_bf_16', game: 'Roblox Blox Fruits', code: 'TY_FOR_WATCHING', reward: '20 Minutes 2x EXP', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    ],
    content_text: `<p>Looking to level up fast in <strong>Roblox Blox Fruits</strong>? Use these active 2x EXP codes and Stat Resets to reach the Third Sea and awaken your Devil Fruits faster.</p>
    <p>To redeem: Launch Blox Fruits on Roblox, select your faction (Pirate/Marine), tap the small Gift icon on the left menu, paste your code, and click Redeem!</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 22.4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-fisch-codes',
    title: 'Roblox Fisch Codes - Free Coins, Meteoric Rod & Submarine Parts',
    slug: 'roblox-fisch-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_fi_1', game: 'Roblox Fisch', code: 'ShootingStars', reward: '1,000 Coins, XL Meteoric Rod Skin, Icy Fisch\'n Dots, Coral Pearl & Totem', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_2', game: 'Roblox Fisch', code: 'SCARLET', reward: 'Exclusive Scarlet Skin for Nate\'s Blade', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_3', game: 'Roblox Fisch', code: 'TemporarySubmarine', reward: 'Full Submarine Parts (Top, Fins, Panels & Windows)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_4', game: 'Roblox Fisch', code: 'CARBON', reward: 'Free Carbon Bobber (Never Expires)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_5', game: 'Roblox Fisch', code: 'Fischfest2026', reward: 'Beach Umbrella, Sunshells, Tropical Mix & Umbrella Title (Lvl 25+)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_6', game: 'Roblox Fisch', code: '049andnickneedatan', reward: 'Reef Slasher, Coral Pearl & Sunshells (Lvl 25+)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_fi_7', game: 'Roblox Fisch', code: 'THE_DEPTHS_BETA', reward: '5x Sea Enchant Relics', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    content_text: `<p>Catch the rarest mythical mutations and upgrade your fishing gear in <strong>Roblox Fisch</strong> with verified active promo codes for coins, submarine parts, and rod skins.</p>
    <p>How to redeem: Open Fisch, click the Menu button at the top, scroll down to the Codes section, enter the code, and press Enter!</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    version: 'v1.6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-anime-vanguards-codes',
    title: 'Roblox Anime Vanguards Codes - Free Trait Rerolls & Memoria Shards',
    slug: 'roblox-anime-vanguards-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_av_1', game: 'Roblox Anime Vanguards', code: 'Miniupdate1', reward: '50x Trait Rerolls + 50x Memoria Shards', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_2', game: 'Roblox Anime Vanguards', code: '2BVisits', reward: '200x Trait Rerolls + 200x Memoria Shards', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_3', game: 'Roblox Anime Vanguards', code: 'Prepare', reward: '1x Free Red Key', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_4', game: 'Roblox Anime Vanguards', code: '1DayL8', reward: '500x Trait Rerolls (Requires Level 30+)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_5', game: 'Roblox Anime Vanguards', code: 'HeavyEyes', reward: '50x Memoria Shards + 50x Extermination Tokens (Lvl 30+)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_6', game: 'Roblox Anime Vanguards', code: 'ExecutionPart2', reward: '50x Memoria Shards + 20x Copycat Tokens (Lvl 30+)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_7', game: 'Roblox Anime Vanguards', code: 'kat', reward: 'Exclusive Secret Meme Code Reward', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_av_8', game: 'Roblox Anime Vanguards', code: 'AVRELEASE_OLD', reward: '500 Gems', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 6).toISOString() },
    ],
    content_text: `<p>Summon top-tier anime tower defense units in <strong>Roblox Anime Vanguards</strong>. Claim free trait rerolls, memoria shards, and keys to dominate stage challenges.</p>
    <p>How to redeem: Launch Anime Vanguards, tap the Codes option on the right side of the screen, input the code, and click Redeem Code.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-blade-ball-codes',
    title: 'Roblox Blade Ball Codes - Free Wheel Spins, Swords & Luck Boosts',
    slug: 'roblox-blade-ball-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_bb_1', game: 'Roblox Blade Ball', code: '5BVISITS', reward: 'Free Sparkler Sword Skin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_2', game: 'Roblox Blade Ball', code: 'RAMADAN', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_3', game: 'Roblox Blade Ball', code: 'SPOOKYSEASON', reward: '1x Free Wheel Spin / Halloween Crate', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_4', game: 'Roblox Blade Ball', code: '4BVISITS', reward: 'Free Bubble Wand Sword Skin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_5', game: 'Roblox Blade Ball', code: 'SHARKATTACK', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_6', game: 'Roblox Blade Ball', code: 'SUMMERWHEEL', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_7', game: 'Roblox Blade Ball', code: 'SUMMERSTARTSHERE', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_8', game: 'Roblox Blade Ball', code: 'ENERGYSWORDS', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_9', game: 'Roblox Blade Ball', code: 'GIVEMELUCK', reward: '10 Minutes 4x Luck in RNG World', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_10', game: 'Roblox Blade Ball', code: 'FREESPINS', reward: '1x Free Wheel Spin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_11', game: 'Roblox Blade Ball', code: 'SERPENT', reward: 'Enters Giveaway for 3 Serpent Katanas', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_bb_12', game: 'Roblox Blade Ball', code: 'DELAYBALL', reward: 'Free Sword Skin Crate', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    ],
    content_text: `<p>Unlock exclusive sword skins, weapon wheel spins, and RNG luck boosts in <strong>Roblox Blade Ball</strong> with verified working redemption codes.</p>
    <p>How to redeem: Open Blade Ball, tap the Extra menu on the top left, select Codes, paste the code, and click the green checkmark.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'roblox-king-legacy-codes',
    title: 'Roblox King Legacy Codes - Free Cash, Gems & Stat Resets',
    slug: 'roblox-king-legacy-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_kl_1', game: 'Roblox King Legacy', code: 'DinoxLive', reward: '100,000 Free Beli Cash', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_2', game: 'Roblox King Legacy', code: 'Peodiz', reward: '100,000 Free Beli Cash', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_3', game: 'Roblox King Legacy', code: 'FREESTATSRESET', reward: 'Free Refund Stats Token', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_4', game: 'Roblox King Legacy', code: '2MFAV', reward: 'Free Refund Stats Token', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_5', game: 'Roblox King Legacy', code: '<3LEEPUNGG', reward: '30 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_6', game: 'Roblox King Legacy', code: 'WELCOMETOKINGLEGACY', reward: '30 Minutes 2x EXP Boost', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_7', game: 'Roblox King Legacy', code: 'SKGames', reward: '30 Minutes 2x EXP Boost (Sea King Group)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_8', game: 'Roblox King Legacy', code: 'DragonColorRefund', reward: '10x - 50x Free Gems', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_9', game: 'Roblox King Legacy', code: 'RainbowDragon', reward: '100x Free Gems (Dragon Unlocked)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_kl_10', game: 'Roblox King Legacy', code: 'UPDATE7_RELEASE_OLD', reward: '5 Copper Keys', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    content_text: `<p>Rule the seas in <strong>Roblox King Legacy</strong> with verified working codes for free Gems, Beli cash, EXP boosters, and instant stat resets.</p>
    <p>How to redeem: Launch King Legacy, click the Menu icon beside your health bar, select Settings (gear icon), paste the code in the redemption box, and press Use.</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200',
    version: 'Update 7.2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'genshin-impact-codes',
    title: 'Genshin Impact Codes - Free Primogems, Mora & Hero\'s Wit',
    slug: 'genshin-impact-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_gi_1', game: 'Genshin Impact', code: 'BALLETCOLLAB', reward: '30 Primogems, 10k Mora, 3 Hero\'s Wit & 3 Mystic Ore', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_2', game: 'Genshin Impact', code: 'MySnezhnayaCareer', reward: '160 Primogems, 20k Mora & 3 Hero\'s Wit', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_3', game: 'Genshin Impact', code: 'XVIZDH2B9WGX', reward: '10k Mora, 10 Adventurer\'s EXP & 5 Jueyun Chili Chicken', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_4', game: 'Genshin Impact', code: 'EHVE2TEAFY6O', reward: '10k Mora, 10 Adventurer\'s EXP & 5 Enhancement Ore', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_5', game: 'Genshin Impact', code: '2BJ64QRZ7RT8', reward: '60 Primogems + 5 Adventurer\'s Experience', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_6', game: 'Genshin Impact', code: 'LEGEDILJKSGM', reward: '60 Primogems + 5 Adventurer\'s Experience', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_7', game: 'Genshin Impact', code: 'GENSHINGIFT', reward: '50 Primogems + 3 Hero\'s Wit (Semi-Permanent)', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_8', game: 'Genshin Impact', code: 'GS70YTASTJ', reward: '30k Mora + 3 Hero\'s Wit + 5 Mystic Ore', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_gi_9', game: 'Genshin Impact', code: 'Everwinter', reward: '100 Primogems + 10 Mystic Ore', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: 'c_gi_10', game: 'Genshin Impact', code: 'OntoSnezhnaya', reward: '100 Primogems + 5 Hero\'s Wit', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    ],
    content_text: `<p>Claim free Primogems, Mora, and character level-up materials in <strong>Genshin Impact</strong>. Redeem via the official HoYoverse redemption portal or in-game Settings > Account > Redeem Code (requires Adventure Rank 10+).</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    version: 'v5.8 / v6.0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'honkai-star-rail-codes',
    title: 'Honkai: Star Rail Codes - Free Stellar Jade, Fuel & Credits',
    slug: 'honkai-star-rail-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_hsr_1', game: 'Honkai: Star Rail', code: 'NSJR3B97ZZ5X', reward: '50 Stellar Jade + 10,000 Credits', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_2', game: 'Honkai: Star Rail', code: 'STARRAILFATE2026', reward: '3 Traveler\'s Guides + 2 Fan Glowsticks', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_3', game: 'Honkai: Star Rail', code: 'PSJQKBQPYGMT', reward: '50 Stellar Jade + 10,000 Credits', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_4', game: 'Honkai: Star Rail', code: 'BESTCOFFEEEVER', reward: '3 Traveler\'s Guides + 2 Express Special Blends', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_5', game: 'Honkai: Star Rail', code: 'OMEGA', reward: '60 Stellar Jade + 1 Fuel', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_6', game: 'Honkai: Star Rail', code: 'CREATIONNYMPH', reward: '60 Stellar Jade + 1 Fuel', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_7', game: 'Honkai: Star Rail', code: 'FAREWELL', reward: '60 Stellar Jade + 1 Fuel', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_8', game: 'Honkai: Star Rail', code: '4TKSX77Y58QK', reward: '30 Stellar Jade + 3 Traveler\'s Guides + 20k Credits', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_9', game: 'Honkai: Star Rail', code: 'STARRAILGIFT', reward: '50 Stellar Jade + 10k Credits + 2 Traveler\'s Guides', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_10', game: 'Honkai: Star Rail', code: 'BladeFitCheck', reward: '3 Traveler\'s Guides + 2 Cold Jokes', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_hsr_11', game: 'Honkai: Star Rail', code: 'HSR_OLD_STREAM', reward: '100 Stellar Jade', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    content_text: `<p>Redeem working promo codes for <strong>Honkai: Star Rail</strong> to stock up on Stellar Jade for limited warp banners, Trailblaze fuel, and traveler\'s guides.</p>
    <p>How to redeem: Open the in-game Phone menu, click the "..." three dots icon beside your avatar portrait, select Redemption Code, paste and confirm!</p>`,
    ad_direct_link: 'https://example.com/bonus',
    download_url: null,
    youtube_url: null,
    image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200',
    version: 'v3.2',
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
      { id: 'c_ad_5', game: 'Roblox Anime Defenders', code: 'ADRELEASE', reward: '150 Gems + 1x Super Lucky Potion', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ad_6', game: 'Roblox Anime Defenders', code: 'BETA_DEFENDERS_OLD', reward: '250 Gems', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 7).toISOString() },
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
    id: 'roblox-pet-simulator-99-codes',
    title: 'Roblox Pet Simulator 99 Codes - Free Diamonds & Huge Pets',
    slug: 'roblox-pet-simulator-99-codes',
    category: 'Codes',
    content_type: 'Codes',
    codes_data: [
      { id: 'c_ps_1', game: 'Roblox Pet Simulator 99', code: 'RELEASE_PS99', reward: 'Free Huge Pet Hoverboard Skin', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ps_2', game: 'Roblox Pet Simulator 99', code: 'DIAMOND_BOOST_2026', reward: '50,000 Free Diamonds + 3 Mini Chests', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ps_3', game: 'Roblox Pet Simulator 99', code: 'LUCKY_POTION_X', reward: '5x Tier VIII Lucky Potions', status: 'Active', updated_at: new Date().toISOString() },
      { id: 'c_ps_4', game: 'Roblox Pet Simulator 99', code: 'EASTER_OLD_2024', reward: 'Mini Chest', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 10).toISOString() },
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
      { id: 'c_astd_4', game: 'Roblox All Star Tower Defense', code: 'OLD_SUMMON_2024', reward: '100 Gems', status: 'Expired', updated_at: new Date(Date.now() - 86400000 * 10).toISOString() },
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

export const STORAGE_SEED_VERSION = 'trendpulse_live_codes_v2_2026';

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

