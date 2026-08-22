export type Category = 'Codes' | 'News' | 'Mods';
export type ContentType = 'Article' | 'Codes' | 'Video' | 'Mod';

export interface CodeEntry {
  id: string;
  game: string;
  code: string;
  reward: string;
  status: 'Active' | 'Expired';
  image_url?: string | null;
  updated_at: string;
}

export interface PostSEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
  og_type?: string;
}

export interface GlobalSEOSettings {
  siteName: string;
  titleSeparator: string;
  defaultTitleTemplate: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  twitterHandle: string;
  robotsIndexing: boolean;
  autoStructuredData: boolean;
  enableRichSnippets: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: Category;
  content_type: ContentType;
  codes_data: CodeEntry[] | null;
  content_text: string | null;
  ad_direct_link: string | null;
  download_url: string | null;
  youtube_url: string | null;
  image_url: string | null;
  custom_image_override?: boolean;
  version: string | null;
  created_at: string;
  updated_at: string;
  seo?: PostSEO;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio?: string;
  favorite_game?: string;
  role?: 'user' | 'moderator' | 'admin';
  credits: number;
  avatar_changes_count: number;
  redeemed_codes?: string[];
  last_daily_claim_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CommunityCategory = 'All' | 'Trending' | 'Code Drops' | 'Discussions' | 'Screenshots' | 'Guides';

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  game_tag: string;
  category: CommunityCategory;
  content: string;
  image_url?: string | null; // Photo only
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  comments?: CommunityComment[];
  created_at: string;
  updated_at?: string;
}

