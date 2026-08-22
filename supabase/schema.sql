-- =========================================================================
-- TrendPulseXhub.com Production Database Schema & Initializer
-- Platform: Supabase PostgreSQL + Auth + Storage
-- Ready for 1-Click Execution in the Supabase SQL Editor
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. PROFILES TABLE (User Accounts, Google OAuth & Gamer Personalization)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    favorite_game TEXT DEFAULT 'Roblox Blox Fruits',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    credits INTEGER DEFAULT 0 NOT NULL CHECK (credits >= 0),
    avatar_changes_count INTEGER DEFAULT 0 NOT NULL CHECK (avatar_changes_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- Automatic timestamp trigger
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto-create profile trigger on new Supabase/Google user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    clean_username TEXT;
    raw_name TEXT;
    user_avatar TEXT;
BEGIN
    -- Extract Google OAuth or Email metadata
    raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'Gamer'
    );
    
    clean_username := lower(regexp_replace(raw_name, '[^a-zA-Z0-9_]', '', 'g')) || '_' || floor(100 + random() * 899)::text;
    
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300'
    );

    INSERT INTO public.profiles (id, username, display_name, avatar_url, bio, role)
    VALUES (
        NEW.id,
        clean_username,
        raw_name,
        user_avatar,
        'Gaming enthusiast & promo code hunter on TrendPulseX 🚀',
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Profiles Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all profiles" ON public.profiles;
CREATE POLICY "Public can view all profiles"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);


-- =========================================================================
-- 2. POSTS TABLE (Main Content: Codes, News, Mods)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Codes', 'News', 'Mods')),
    content_type TEXT NOT NULL CHECK (content_type IN ('Article', 'Codes', 'Video', 'Mod')),
    codes_data JSONB DEFAULT '[]'::jsonb,
    content_text TEXT,
    ad_direct_link TEXT,
    download_url TEXT,
    youtube_url TEXT,
    image_url TEXT,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts(category);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);

DROP TRIGGER IF EXISTS tr_posts_updated_at ON public.posts;
CREATE TRIGGER tr_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Posts Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on posts" ON public.posts;
CREATE POLICY "Allow public read on posts"
ON public.posts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated admins write on posts" ON public.posts;
CREATE POLICY "Allow authenticated admins write on posts"
ON public.posts FOR ALL
USING (auth.role() = 'authenticated');


-- =========================================================================
-- 3. CODES TABLE (Individual Game Promo Codes)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    game_slug TEXT NOT NULL,
    game_title TEXT NOT NULL,
    code TEXT NOT NULL,
    reward TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_expired BOOLEAN DEFAULT false,
    expiration_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS codes_game_slug_idx ON public.codes(game_slug);
CREATE INDEX IF NOT EXISTS codes_is_active_idx ON public.codes(is_active);

DROP TRIGGER IF EXISTS tr_codes_updated_at ON public.codes;
CREATE TRIGGER tr_codes_updated_at
BEFORE UPDATE ON public.codes
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

ALTER TABLE public.codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on codes" ON public.codes;
CREATE POLICY "Allow public read on codes"
ON public.codes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on codes" ON public.codes;
CREATE POLICY "Allow authenticated write on codes"
ON public.codes FOR ALL
USING (auth.role() = 'authenticated');


-- =========================================================================
-- 4. THE COMMUNITY HUB POSTS (Photo-Only Attachments)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    game_tag TEXT NOT NULL DEFAULT 'General',
    category TEXT NOT NULL DEFAULT 'Discussions' CHECK (category IN ('Trending', 'Code Drops', 'Discussions', 'Screenshots', 'Guides')),
    content TEXT NOT NULL,
    image_url TEXT, -- PHOTO ONLY (strictly validated, no video uploads)
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_game_tag_idx ON public.community_posts(game_tag);
CREATE INDEX IF NOT EXISTS community_posts_category_idx ON public.community_posts(category);

DROP TRIGGER IF EXISTS tr_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER tr_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on community posts" ON public.community_posts;
CREATE POLICY "Allow public read on community posts"
ON public.community_posts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create community posts" ON public.community_posts;
CREATE POLICY "Allow authenticated users to create community posts"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow author to update community post" ON public.community_posts;
CREATE POLICY "Allow author to update community post"
ON public.community_posts FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow author to delete community post" ON public.community_posts;
CREATE POLICY "Allow author to delete community post"
ON public.community_posts FOR DELETE
USING (auth.uid() = user_id);


-- =========================================================================
-- 5. COMMUNITY LIKES TABLE & AUTOMATIC COUNTER
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_likes_post_idx ON public.community_likes(post_id);

-- Trigger to increment/decrement likes_count on post
CREATE OR REPLACE FUNCTION public.handle_community_like_counter()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_community_like_counter ON public.community_likes;
CREATE TRIGGER tr_community_like_counter
AFTER INSERT OR DELETE ON public.community_likes
FOR EACH ROW
EXECUTE FUNCTION public.handle_community_like_counter();

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on likes" ON public.community_likes;
CREATE POLICY "Allow public read on likes"
ON public.community_likes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated user to like" ON public.community_likes;
CREATE POLICY "Allow authenticated user to like"
ON public.community_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to remove like" ON public.community_likes;
CREATE POLICY "Allow user to remove like"
ON public.community_likes FOR DELETE
USING (auth.uid() = user_id);


-- =========================================================================
-- 6. COMMUNITY COMMENTS TABLE & AUTOMATIC COUNTER
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS community_comments_post_idx ON public.community_comments(post_id);

-- Trigger to increment/decrement comments_count on post
CREATE OR REPLACE FUNCTION public.handle_community_comment_counter()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_community_comment_counter ON public.community_comments;
CREATE TRIGGER tr_community_comment_counter
AFTER INSERT OR DELETE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_community_comment_counter();

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on comments" ON public.community_comments;
CREATE POLICY "Allow public read on comments"
ON public.community_comments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to comment" ON public.community_comments;
CREATE POLICY "Allow authenticated users to comment"
ON public.community_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow author to delete comment" ON public.community_comments;
CREATE POLICY "Allow author to delete comment"
ON public.community_comments FOR DELETE
USING (auth.uid() = user_id);


-- =========================================================================
-- 7. SUPABASE STORAGE BUCKETS (Avatars & Community Photos Only)
-- =========================================================================

-- Create or update storage buckets with photo-only MIME type restrictions (5MB for avatars, 10MB for photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('community_images', 'community_images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view avatar pictures" ON storage.objects;
CREATE POLICY "Public can view avatar pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their avatars" ON storage.objects;
CREATE POLICY "Users can update their avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view community photos" ON storage.objects;
CREATE POLICY "Public can view community photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'community_images');

DROP POLICY IF EXISTS "Authenticated users can upload community photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload community photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'community_images' AND auth.role() = 'authenticated');


-- =========================================================================
-- 6. CREDITS WALLET & GAMIFICATION SYSTEM
-- =========================================================================

-- Credit Transactions Log
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- Positive for reward earnings, negative for spending
    balance_after INTEGER NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('daily_claim', 'reward_box', 'post_create', 'post_image_create', 'comment_create', 'avatar_change', 'admin_grant')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS credit_transactions_user_idx ON public.credit_transactions(user_id, created_at DESC);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions"
ON public.credit_transactions FOR SELECT
USING (auth.uid() = user_id);

-- Atomic Function: Claim Reward Credits (+100)
CREATE OR REPLACE FUNCTION public.claim_reward_credits(
    p_user_id UUID,
    p_amount INTEGER DEFAULT 100,
    p_action_type TEXT DEFAULT 'reward_box',
    p_description TEXT DEFAULT 'Claimed Reward Box Credits'
)
RETURNS JSONB AS $$
DECLARE
    v_new_balance INTEGER;
BEGIN
    UPDATE public.profiles
    SET credits = credits + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING credits INTO v_new_balance;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User profile not found');
    END IF;

    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, action_type, description)
    VALUES (p_user_id, p_amount, v_new_balance, p_action_type, p_description);

    RETURN jsonb_build_object('success', true, 'credits', v_new_balance, 'amount_added', p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Function: Deduct Credits with Strict Balance Validation
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
    p_user_id UUID,
    p_cost INTEGER,
    p_action_type TEXT,
    p_description TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    SELECT credits INTO v_current_credits
    FROM public.profiles
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User profile not found');
    END IF;

    IF v_current_credits < p_cost THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INSUFFICIENT_CREDITS',
            'required', p_cost,
            'current_balance', v_current_credits
        );
    END IF;

    UPDATE public.profiles
    SET credits = credits - p_cost,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING credits INTO v_new_balance;

    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, action_type, description)
    VALUES (p_user_id, -p_cost, v_new_balance, p_action_type, p_description);

    RETURN jsonb_build_object('success', true, 'credits', v_new_balance, 'deducted', p_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

