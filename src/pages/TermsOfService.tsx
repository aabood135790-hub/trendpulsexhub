import { FileText, ShieldAlert, Coins, AlertCircle, Award, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
  const lastUpdated = 'February 2026';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sapphire-50 border border-sapphire-200 text-sapphire-700 text-xs font-bold mb-4">
          <FileText size={14} className="text-sapphire-600" />
          <span>User Agreement & Legal Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-indigo-900/60 font-medium mt-2">
          Effective & Last Updated: <strong>{lastUpdated}</strong> • TrendPulseXhub.com
        </p>
      </div>

      {/* Main Content Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-indigo-950/10 shadow-sm space-y-8 text-indigo-950/80 text-sm leading-relaxed">
        
        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <CheckCircle2 className="text-sapphire-600" size={20} />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong>TrendPulseXhub.com</strong> (&quot;the Service&quot;), you confirm that you are at least 13 years of age, have read and understood these Terms of Service, and agree to be bound by them. If you do not agree to all terms and conditions, you must immediately cease accessing the website.
          </p>
        </section>

        {/* 2. Virtual Credits, Wallet & Reward Boxes */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Coins className="text-sapphire-600" size={20} />
            2. Virtual Credits & Community Rewards System
          </h2>
          <p>
            TrendPulseXhub.com offers an on-site gamified virtual credit wallet for active community members:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-indigo-900/75">
            <li>
              <strong>Non-Monetary Nature:</strong> Virtual credits have no cash or monetary value, cannot be redeemed for fiat currency or real-world money, and cannot be traded, sold, or transferred outside of TrendPulseXhub.com.
            </li>
            <li>
              <strong>Earning Credits:</strong> Credits may be earned by participating in daily mystery reward boxes, completing daily logins, reporting working promo codes, and writing helpful community posts.
            </li>
            <li>
              <strong>Credit Costs:</strong> Virtual credits may be deducted for participating in community actions (such as posting custom content, attaching images, or changing profile avatars).
            </li>
            <li>
              <strong>Anti-Exploit Policy:</strong> We reserve the right to forfeit, reset, or suspend any user account or credit balance obtained through automated macros, bots, vulnerability exploits, or fraudulent actions.
            </li>
          </ul>
        </section>

        {/* 3. Promo Codes, Fair Use & Third-Party Game Artwork Disclaimers */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Award className="text-sapphire-600" size={20} />
            3. Promo Codes, Fair Use & Image Disclaimer
          </h2>
          <p>
            All game titles, trademarks, logos, character designs, and visual game assets (including banners, icons, artwork, and Pinterest visual previews) displayed across our news articles, code directories, and guides are the sole registered intellectual property of their respective creators, publishers, and trademark holders (including but not limited to <em>Roblox Corporation, Epic Games, miHoYo, Garena, and independent game development studios</em>).
          </p>
          <div className="p-4 rounded-2xl bg-azure-50 border border-sapphire-200 text-xs text-indigo-950 space-y-2">
            <p className="font-bold text-sapphire-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-sapphire-600 shrink-0" />
              Fair Use & Editorial Purpose Statement:
            </p>
            <p className="text-indigo-900/80 leading-relaxed">
              TrendPulseXhub.com is an independent news, gaming wiki, and community reward directory. Game artwork, cover banners, thumbnails, and screenshot previews are displayed solely for <strong>informational, editorial, educational, and commentary purposes</strong> under the <strong>Fair Use doctrine (Section 107 of the U.S. Copyright Act and applicable international copyright laws)</strong>. We do not claim ownership, endorsement, or partnership with any third-party game developer or brand. Promo codes are tested and compiled for community convenience.
            </p>
          </div>
        </section>

        {/* 4. Acceptable Use & User Conduct */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <ShieldAlert className="text-sapphire-600" size={20} />
            4. User Guidelines & Prohibited Conduct
          </h2>
          <p>When using our community forum, commenting, or interacting with the service, you agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-indigo-900/75">
            <li>Post or transmit unlawful, harassing, defamatory, abusive, threatening, harmful, or sexually explicit material.</li>
            <li>Impersonate any person, staff member, or entity.</li>
            <li>Post spam, unauthorized advertising, phishing links, or malicious code.</li>
            <li>Attempt to reverse-engineer, disrupt, or bypass rate limits on our backend servers or AI APIs.</li>
            <li>Use automated scrapers or bots to harvest content or manipulate ad impressions.</li>
          </ul>
        </section>

        {/* 5. Advertising & Third-Party Links */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <AlertCircle className="text-sapphire-600" size={20} />
            5. Advertising & Third-Party Links Disclosure
          </h2>
          <p>
            TrendPulseXhub.com displays third-party advertisements and affiliate partner links (e.g. Adsterra and Google partner networks) to support server infrastructure and maintain free services for gamers. We do not control or endorse the content, policies, or products offered by external third-party sites linked from advertisements.
          </p>
        </section>

        {/* 6. DMCA Takedown Policy & Copyright Notice Procedure */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <FileText className="text-sapphire-600" size={20} />
            6. DMCA Copyright Notice & Swift Takedown Policy
          </h2>
          <p>
            TrendPulseXhub.com respects the intellectual property rights of creators and copyright holders. We comply fully with the Digital Millennium Copyright Act (17 U.S.C. § 512) and international copyright legislation.
          </p>
          <p>
            If you are a copyright owner, authorized agent, or intellectual property holder and believe that any game artwork, banner, text, or file hosted on our service infringes upon your copyright, you may submit a formal takedown notice.
          </p>
          
          <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-950/10 space-y-3 text-xs">
            <h4 className="font-bold text-indigo-950 text-sm">How to Submit a DMCA Takedown Request:</h4>
            <p className="text-indigo-900/80 leading-relaxed">
              To expedite removal, submit your request through our <Link to="/contact" className="text-sapphire-600 font-bold underline">Contact Us Form</Link> (selecting <em>&quot;DMCA / Copyright Notice&quot;</em>) or email our copyright desk directly at <span className="font-mono font-bold text-indigo-950">support@trendpulsexhub.com</span> with the subject line <strong>&quot;DMCA Takedown Request&quot;</strong>, including the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-indigo-900/75">
              <li>Identification of the copyrighted work claimed to have been infringed (or representative list of works).</li>
              <li>The exact URL(s) on TrendPulseXhub.com where the allegedly infringing material is located.</li>
              <li>Your full legal name, company or studio name, email address, and phone number.</li>
              <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement under penalty of perjury that the information in your notice is accurate and that you are authorized to act on behalf of the copyright owner.</li>
              <li>An electronic or physical signature of the authorized representative.</li>
            </ul>
            <div className="pt-2 border-t border-indigo-950/10 flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Swift Resolution Guarantee: Upon receipt of a valid and verified DMCA notice, we will expeditiously remove or disable access to the infringing material within 24–48 business hours.</span>
            </div>
          </div>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <AlertCircle className="text-sapphire-600" size={20} />
            7. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TRENDPULSEXHUB.COM AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
          </p>
        </section>

        {/* 8. Modifications to Terms */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <HelpCircle className="text-sapphire-600" size={20} />
            8. Changes to Terms & Contact Information
          </h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued use of TrendPulseXhub.com after changes constitute acceptance of the updated terms. For questions or inquiries, please contact us via our <Link to="/contact" className="text-sapphire-600 underline font-bold">Contact Form</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
