import { Shield, Lock, Eye, Cookie, Database, Globe, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  const lastUpdated = 'February 2026';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sapphire-50 border border-sapphire-200 text-sapphire-700 text-xs font-bold mb-4">
          <Shield size={14} className="text-sapphire-600" />
          <span>GDPR, CCPA & Ad Network Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-indigo-900/60 font-medium mt-2">
          Effective & Last Updated: <strong>{lastUpdated}</strong> • TrendPulseXhub.com
        </p>
      </div>

      {/* Main Content Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-indigo-950/10 shadow-sm space-y-8 text-indigo-950/80 text-sm leading-relaxed">
        
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Globe className="text-sapphire-600" size={20} />
            1. Introduction & Overview
          </h2>
          <p>
            Welcome to <strong>TrendPulseXhub.com</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your privacy and ensuring transparent handling of your data. This Privacy Policy details how we collect, utilize, disclose, and safeguard your personal information when you visit our website, use our promo code directory, engage with our community features, participate in daily credit reward programs, or interact with displayed advertisements.
          </p>
          <p>
            By accessing or using TrendPulseXhub.com, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Database className="text-sapphire-600" size={20} />
            2. Information We Collect
          </h2>
          <p>We may collect several types of information to provide and enhance our gaming service to you:</p>
          <ul className="list-disc pl-5 space-y-2 text-indigo-900/75">
            <li>
              <strong>Account & Profile Information:</strong> When you register or interact on TrendPulseXhub.com, we may collect your username, email address, chosen avatar, and community engagement activity.
            </li>
            <li>
              <strong>Community Credits & Reward Balance:</strong> We track your on-site virtual credits balance, completed daily reward boxes, comment history, and promo code verification votes to prevent automated abuse and reward loyal community members.
            </li>
            <li>
              <strong>Automatically Collected Log & Device Data:</strong> Information your browser transmits whenever you visit our website, including your IP address, browser version, operating system, pages visited, timestamp, and referring URL.
            </li>
            <li>
              <strong>Contact Inquiries:</strong> When you submit a message via our inline Contact Form, we securely receive your name, email address, message subject, and inquiry details to respond to your request.
            </li>
          </ul>
        </section>

        {/* Cookies & Advertising Technologies */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Cookie className="text-sapphire-600" size={20} />
            3. Cookies, Third-Party Ad Networks & Tracking Technologies
          </h2>
          <p>
            TrendPulseXhub.com uses cookies, local web storage, and similar tracking technologies to enhance user session persistence, customize content, and serve relevant advertisements through third-party advertising partners (such as <strong>Adsterra, Google AdSense, and affiliated ad networks</strong>).
          </p>
          <div className="bg-azure-50/70 p-4 rounded-2xl border border-sapphire-200/60 space-y-2 text-xs">
            <p className="font-bold text-sapphire-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-sapphire-600" />
              Ad Network Data Collection Notice:
            </p>
            <p className="text-indigo-900/80 leading-normal">
              Third-party vendors and ad networks use cookies and device identifiers to serve personalized and non-personalized ads based on prior visits to this website or other internet sites. You may choose to disable cookies through your personal browser settings or visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-sapphire-600 underline font-semibold">AboutAds.info</a> or <a href="https://youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-sapphire-600 underline font-semibold">YourOnlineChoices.eu</a> to manage ad preferences.
            </p>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Eye className="text-sapphire-600" size={20} />
            4. How We Use Collected Information
          </h2>
          <p>We use the collected information for the following legitimate purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-indigo-900/75">
            <li>To operate, maintain, and continuously improve the speed, design, and usability of TrendPulseXhub.com.</li>
            <li>To deliver automated, verified gaming promo codes, updates, leaks, and downloadable mod files.</li>
            <li>To manage community discussions, moderate user submissions, and prevent spam, fraud, or automated scraping bots.</li>
            <li>To track and credit virtual community points for engaging in the daily reward boxes.</li>
            <li>To monitor aggregate traffic metrics and comply with legal or advertising partner obligations.</li>
          </ul>
        </section>

        {/* Data Protection & Security */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Lock className="text-sapphire-600" size={20} />
            5. Data Protection, Security & Retention
          </h2>
          <p>
            We implement strict security measures including SSL/TLS 256-bit encryption for all data in transit, tokenized authentication, and secure database storage. We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        {/* Fair Use & Third-Party Media Disclaimer */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Shield className="text-sapphire-600" size={20} />
            6. Fair Use & Third-Party Image / Media Disclaimer
          </h2>
          <p>
            TrendPulseXhub.com publishes news, guides, and promo code verification directories for gaming enthusiasts. All game screenshots, banners, promotional artwork, character icons, and Pinterest visual previews referenced on this website are the property of their respective copyright holders (such as <strong>Roblox Corporation, developer studios, and game publishers</strong>).
          </p>
          <div className="bg-azure-50/70 p-4 rounded-2xl border border-sapphire-200/60 space-y-1.5 text-xs text-indigo-950">
            <p className="font-bold text-sapphire-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-sapphire-600 shrink-0" />
              Fair Use Doctrine Compliance (17 U.S.C. § 107):
            </p>
            <p className="text-indigo-900/80 leading-relaxed">
              Such media is utilized strictly for transformative, non-commercial identification, news reporting, commentary, and educational guide purposes under Fair Use principles. We do not claim ownership of, nor an official relationship with, any third-party gaming trademarks or intellectual property.
            </p>
          </div>
        </section>

        {/* GDPR & CCPA Rights */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <FileText className="text-sapphire-600" size={20} />
            7. Your Privacy Rights (GDPR & CCPA)
          </h2>
          <p>Depending on your location, you have statutory rights concerning your personal information, including:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-indigo-900/75">
            <li><strong>Right of Access:</strong> You may request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> You may request that we correct inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request deletion of your account and personal details.</li>
            <li><strong>Right to Opt-Out of Sale / Sharing:</strong> We do not sell your personal data to third parties.</li>
          </ul>
          <p>
            To exercise any of these privacy rights, please reach out to us directly through our <Link to="/contact" className="text-sapphire-600 font-bold hover:underline">Contact Us page</Link>.
          </p>
        </section>

        {/* Children's Information */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <Shield className="text-sapphire-600" size={20} />
            8. Children&apos;s Information (COPPA Compliance)
          </h2>
          <p>
            Protecting children&apos;s privacy online is paramount. TrendPulseXhub.com does not knowingly collect personally identifiable information from children under the age of 13. If you believe your child has provided personal information on our site, please contact us immediately and we will promptly delete such records.
          </p>
        </section>

        {/* DMCA / Copyright Inquiries & Contact Information */}
        <section className="space-y-3 pt-4 border-t border-indigo-950/5">
          <h2 className="text-lg font-black text-indigo-950 flex items-center gap-2">
            <HelpCircle className="text-sapphire-600" size={20} />
            9. DMCA Takedown Notices & Contact Information
          </h2>
          <p>
            If you have questions, feedback, privacy concerns, or wish to submit a DMCA copyright takedown notice regarding any image or content, please contact our legal desk:
          </p>
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-950/10 text-xs space-y-1 font-medium">
            <p><strong>Website:</strong> TrendPulseXhub.com</p>
            <p><strong>Contact Form:</strong> <Link to="/contact" className="text-sapphire-600 underline font-bold">TrendPulseXhub.com/contact</Link> (Select <em>&quot;DMCA / Copyright Notice&quot;</em>)</p>
            <p><strong>Support & DMCA Email:</strong> support@trendpulsexhub.com</p>
            <p className="text-emerald-700 font-bold pt-1">
              ✓ Verified DMCA removal requests are reviewed and resolved expeditiously within 24–48 hours.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
