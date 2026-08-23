export type AdSlotId = 
  | 'header_banner'
  | 'codes_directory_top'
  | 'in_article_top'
  | 'in_article_mid'
  | 'in_article_bottom'
  | 'sidebar_article'
  | 'sidebar_community'
  | 'sidebar_category'
  | 'news_feed_banner'
  | 'search_page_banner'
  | 'home_feed_banner'
  | 'spin_wheel_banner'
  | 'footer_banner';

export type AdNetworkType = 'Adsterra' | 'DirectLink' | 'Custom' | 'BannerImage';

export interface AdSlotConfig {
  id: AdSlotId;
  name: string;
  description: string;
  size_label: string; // e.g. "728x90 (Leaderboard) / 320x50 (Mobile)"
  enabled: boolean;
  network_type: AdNetworkType;
  html_script: string; // Adsterra Script / iframe / JS tag
  banner_image_url?: string; // Direct image URL
  target_url?: string; // Target URL (defaults to active Adsterra Direct Link)
  alt_text?: string;
}

export interface AdSettingsState {
  global_ads_enabled: boolean;
  adsterra_direct_link: string; // 1. Direct Link / Smartlink URL
  vite_adsterra_direct_link: string; // Fallback / Client Direct Link
  adsterra_banner_script?: string; // 2. Banner Ads Script (Header/Top of PostView & CodesList)
  adsterra_popunder_script?: string; // 3. Popunder Script (Global <head> across all routes)
  adsterra_social_bar_script?: string; // 4. Social Bar Script (AppLayout floating notification ads)
  slots: Record<AdSlotId, AdSlotConfig>;
}

export const FALLBACK_ADSTERRA_DIRECT_LINK = 'https://www.profitablecpmrate.com/d0b9y9a3e?key=95a4358f27806f1d8c1c4e7825b448f8';

const defaultDirectLink = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ADSTERRA_DIRECT_LINK) || 
  FALLBACK_ADSTERRA_DIRECT_LINK;

export const DEFAULT_AD_SETTINGS: AdSettingsState = {
  global_ads_enabled: true,
  adsterra_direct_link: defaultDirectLink,
  vite_adsterra_direct_link: defaultDirectLink,
  adsterra_banner_script: '',
  adsterra_popunder_script: '',
  adsterra_social_bar_script: '',
  slots: {
    header_banner: {
      id: 'header_banner',
      name: 'Header Top Leaderboard',
      description: 'Prominently displayed beneath the navigation bar across all website pages.',
      size_label: '728x90 (Desktop) / 320x50 (Mobile)',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Claim Free Roblox Promo Codes & Bonus Rewards',
    },
    codes_directory_top: {
      id: 'codes_directory_top',
      name: 'Codes Directory Page Banner',
      description: 'Prominently placed at the top of the /codes directory above game filters and listings.',
      size_label: '728x90 / Responsive Native Banner',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Active Working Roblox Codes & Free Gift Drops',
    },
    in_article_top: {
      id: 'in_article_top',
      name: 'In-Article Top Placement',
      description: 'Placed immediately below the post header and above the active promo codes table.',
      size_label: '728x90 / Responsive Native Banner',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Unlock Exclusive Gamer Bonus Pack',
    },
    in_article_mid: {
      id: 'in_article_mid',
      name: 'In-Article Mid Placement',
      description: 'Placed between the promo codes table and step-by-step redemption instructions.',
      size_label: 'Responsive Rectangle (336x280 / 300x250)',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Special Gaming Deals & Rewards',
    },
    in_article_bottom: {
      id: 'in_article_bottom',
      name: 'In-Article Bottom Placement',
      description: 'Placed at the conclusion of article text and above related game posts.',
      size_label: 'Responsive Leaderboard (728x90 / 300x250)',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Instant Gift Rewards Box',
    },
    sidebar_article: {
      id: 'sidebar_article',
      name: 'Article View Sticky Sidebar Slot',
      description: 'Sticky high-converting sidebar container on dedicated game and article pages.',
      size_label: '300x250 / 300x600 Half-Page',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Top Trending Gaming Perks',
    },
    sidebar_community: {
      id: 'sidebar_community',
      name: 'Community Feed Sidebar Slot',
      description: 'Sticky placement on the Community discussions & screenshot feed.',
      size_label: '300x250 Medium Rectangle',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Join VIP Gamer Drops',
    },
    sidebar_category: {
      id: 'sidebar_category',
      name: 'Mods & Category Sidebar Slot',
      description: 'Placed on mod listings, category archives, and category search pages.',
      size_label: '300x250 Medium Rectangle',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Free In-Game Rewards & Verified Mods',
    },
    news_feed_banner: {
      id: 'news_feed_banner',
      name: 'News Feed Header Banner',
      description: 'Placed at the top of the /news gaming leaks and updates feed.',
      size_label: '728x90 / 970x90 Leaderboard',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Trending Gaming Leaks & Promo Codes',
    },
    search_page_banner: {
      id: 'search_page_banner',
      name: 'Search Results Page Banner',
      description: 'Placed above search results and query suggestions on /search.',
      size_label: '728x90 / Responsive Leaderboard',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Instant Roblox Promo Codes Search',
    },
    home_feed_banner: {
      id: 'home_feed_banner',
      name: 'Homepage Interstitial Banner',
      description: 'Placed between trending game showcases and fresh news on the front page.',
      size_label: '728x90 / 970x90 Billboard',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Trending Gamer Codes & Gifts',
    },
    spin_wheel_banner: {
      id: 'spin_wheel_banner',
      name: 'Daily Spin Wheel Placement Banner',
      description: 'Strategically positioned alongside and beneath the interactive Daily Spin Wheel container.',
      size_label: '728x90 / 300x250 Native Banner',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Claim Double Bonus & Extra Free Spins Now',
    },
    footer_banner: {
      id: 'footer_banner',
      name: 'Global Footer Persistent Banner',
      description: 'Placed directly above the global footer across all pages.',
      size_label: '728x90 / 970x90 Responsive Banner',
      enabled: true,
      network_type: 'Adsterra',
      html_script: '',
      banner_image_url: '',
      target_url: defaultDirectLink,
      alt_text: 'Instant Credit Claims & Perks',
    },
  },
};

const STORAGE_KEY = 'trendpulse_ad_settings_v2';

export function getActiveDirectLink(settings?: Partial<AdSettingsState>): string {
  if (settings?.adsterra_direct_link && settings.adsterra_direct_link.trim() !== '') {
    return settings.adsterra_direct_link;
  }
  if (settings?.vite_adsterra_direct_link && settings.vite_adsterra_direct_link.trim() !== '') {
    return settings.vite_adsterra_direct_link;
  }
  return defaultDirectLink;
}

export function getLocalAdSettings(): AdSettingsState {
  if (typeof window === 'undefined') return DEFAULT_AD_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AD_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AD_SETTINGS,
      ...parsed,
      adsterra_direct_link: parsed.adsterra_direct_link || defaultDirectLink,
      vite_adsterra_direct_link: parsed.vite_adsterra_direct_link || defaultDirectLink,
      adsterra_banner_script: parsed.adsterra_banner_script !== undefined ? parsed.adsterra_banner_script : '',
      adsterra_popunder_script: parsed.adsterra_popunder_script !== undefined ? parsed.adsterra_popunder_script : '',
      adsterra_social_bar_script: parsed.adsterra_social_bar_script !== undefined ? parsed.adsterra_social_bar_script : '',
      slots: {
        ...DEFAULT_AD_SETTINGS.slots,
        ...(parsed.slots || {}),
      },
    };
  } catch {
    return DEFAULT_AD_SETTINGS;
  }
}

export function saveLocalAdSettings(settings: AdSettingsState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save ad settings:', err);
  }
}
