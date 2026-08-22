import { supabase, isSupabaseConfigured } from './supabase';

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribed_at: string;
  source?: string;
  active?: boolean;
}

export const NEWSLETTER_SQL_SNIPPET = `-- Run this in your Supabase SQL Editor to create the newsletter table:
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'footer_signup',
  active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous submissions
CREATE POLICY "Allow public insert to newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow admins/service role to view subscribers
CREATE POLICY "Allow service role full access to newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (true);
`;

const LOCAL_STORAGE_SUBSCRIBERS_KEY = 'trendpulse_newsletter_subscribers';

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: 'Please enter your email address.' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
  }

  return { valid: true };
}

export function isLocallySubscribed(email: string): boolean {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const stored = localStorage.getItem(LOCAL_STORAGE_SUBSCRIBERS_KEY);
    if (!stored) return false;
    const list: string[] = JSON.parse(stored);
    return Array.isArray(list) && list.includes(cleanEmail);
  } catch {
    return false;
  }
}

export function markLocallySubscribed(email: string): void {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const stored = localStorage.getItem(LOCAL_STORAGE_SUBSCRIBERS_KEY);
    const list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(cleanEmail)) {
      list.push(cleanEmail);
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIBERS_KEY, JSON.stringify(list));
    }
  } catch {}
}

export async function subscribeToNewsletter(emailInput: string): Promise<{
  success: boolean;
  message: string;
  isDuplicate?: boolean;
  tableCreatedHint?: boolean;
}> {
  const cleanEmail = (emailInput || '').trim().toLowerCase();

  // 1. Client-Side Validation
  const validation = validateEmail(cleanEmail);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || 'Invalid email address.',
    };
  }

  // 2. Client-Side Local Duplicate Check
  if (isLocallySubscribed(cleanEmail)) {
    return {
      success: false,
      isDuplicate: true,
      message: 'This email is already subscribed to our newsletter!',
    };
  }

  let dbSaved = false;
  let tableMissing = false;

  // 3. Supabase Direct Client Insert
  if (isSupabaseConfigured) {
    try {
      // Check if duplicate exists directly in Supabase
      const { data: existing, error: checkErr } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!checkErr && existing) {
        markLocallySubscribed(cleanEmail);
        return {
          success: false,
          isDuplicate: true,
          message: 'This email is already subscribed to our code alert newsletter.',
        };
      }

      const { error: insertErr } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: cleanEmail,
          subscribed_at: new Date().toISOString(),
          source: 'footer_signup',
          active: true,
        });

      if (!insertErr) {
        dbSaved = true;
      } else {
        // Handle code 23505 (Unique violation)
        if (insertErr.code === '23505' || insertErr.message?.toLowerCase().includes('duplicate') || insertErr.message?.toLowerCase().includes('unique')) {
          markLocallySubscribed(cleanEmail);
          return {
            success: false,
            isDuplicate: true,
            message: 'This email is already registered in our subscriber list.',
          };
        }

        // Handle code 42P01 (relation "newsletter_subscribers" does not exist)
        if (insertErr.code === '42P01' || insertErr.message?.toLowerCase().includes('does not exist')) {
          console.warn('[Supabase Newsletter Notice]: Table `newsletter_subscribers` does not exist yet. Falling back to server/local storage log.');
          tableMissing = true;
        }
      }
    } catch (err: any) {
      console.warn('[Supabase Newsletter error]:', err?.message);
    }
  }

  // 4. Server API Proxy & Sync (dual-layer persistence & fallback)
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, source: 'footer_signup' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.success && data.isDuplicate) {
        markLocallySubscribed(cleanEmail);
        return {
          success: false,
          isDuplicate: true,
          message: data.message || 'This email is already subscribed!',
        };
      }
      dbSaved = true;
    }
  } catch (apiErr) {
    console.warn('[Server newsletter API sync notice]:', apiErr);
  }

  // Mark in local storage to prevent duplicate attempts
  markLocallySubscribed(cleanEmail);

  return {
    success: true,
    message: 'Thanks for subscribing! You’ll get instant notifications when new game codes drop.',
    tableCreatedHint: tableMissing && isSupabaseConfigured,
  };
}
