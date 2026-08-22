# TrendPulseXhub.com - Production Deployment & Vercel Launch Guide

This guide outlines the step-by-step procedure to deploy **TrendPulseXhub.com** to Vercel, bind your custom domain, and configure SSL certificates.

---

## 1. Prerequisites & Environment Variables

Before triggering your production deployment, configure the following Environment Variables in your **Vercel Project Settings** (`Project Settings > Environment Variables`):

| Variable Name | Purpose | Example / Required Value |
|---|---|---|
| `GEMINI_API_KEY` | Server-side Gemini AI content and scraper engine | `AIzaSy...` (from Google AI Studio) |
| `DEEPSEEK_API_KEY` | DeepSeek API integration (optional) | `sk-...` |
| `APP_URL` | Base application URL | `https://trendpulsexhub.com` |
| `VITE_SITE_URL` | Client canonical URL for meta tags | `https://trendpulsexhub.com` |
| `VITE_SUPABASE_URL` | Supabase project API URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous client key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server administrative key | `eyJhbGciOi...` |
| `ADSTERRA_DIRECT_LINK` | High-converting Adsterra Direct Link URL for Claim Bonus CTAs & Code triggers | `https://www.profitablecpmrate.com/...` |
| `VITE_ADSTERRA_DIRECT_LINK` | Client-side Adsterra Direct Link URL fallback | `https://www.profitablecpmrate.com/...` |

---

## 2. Deploying via GitHub to Vercel

1. **Push Code to GitHub:**
   Ensure your latest codebase is pushed to your `main` branch:
   ```bash
   git add .
   git commit -m "feat: production ready build with SEO and ad monetization"
   git push origin main
   ```

2. **Import into Vercel:**
   - Log into [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New..."** > **"Project"**.
   - Select your GitHub repository (`TrendPulseX` or `trendpulsexhub`).
   - Framework Preset: **Vite** (auto-detected via `vercel.json`).
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables:**
   - Paste the required variables listed in Section 1.

4. **Click "Deploy":**
   - Vercel will run the build and provide an active `*.vercel.app` preview URL.

---

## 3. Custom Domain Setup (`TrendPulseXhub.com`)

To bind your custom apex domain (`trendpulsexhub.com`) and subdomain (`www.trendpulsexhub.com`):

1. In Vercel, navigate to **Project Settings > Domains**.
2. Enter `trendpulsexhub.com` and click **Add**.
3. Choose the recommended option to automatically redirect `trendpulsexhub.com` to `www.trendpulsexhub.com` (or vice-versa).
4. Go to your Domain Registrar (Namecheap, GoDaddy, Cloudflare, Google Domains/Squarespace) and update your DNS records:

### Required DNS Records

| Type | Name / Host | Target / Value | TTL |
|---|---|---|---|
| **A Record** | `@` | `76.76.21.21` | Automatic / 300s |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | Automatic / 300s |

*Note: If using Cloudflare DNS, set SSL/TLS mode to **"Full"** or **"Full (Strict)"**.*

---

## 4. SSL (HTTPS) & Automated Certificate Generation

- Vercel automatically provisions free **Let's Encrypt / DigiCert SSL certificates** for both `trendpulsexhub.com` and `www.trendpulsexhub.com` as soon as DNS propagation completes (typically 5–15 minutes).
- HTTPS redirection is enabled by default.

---

## 5. Post-Launch Verification Checklist

- [x] Test responsive navigation across Mobile and Desktop.
- [x] Check that `/codes`, `/news`, `/mods`, `/community`, and `/search` routes load without 404s.
- [x] Verify that the Google SERP metadata dynamically updates on post pages.
- [x] Test the Admin Panel at `/admin` (AI Auto-Scraper, Ad Slots, and SEO Meta-Tags).
- [x] Check that `/privacy` and `/terms` include the Fair Use and DMCA notices.
