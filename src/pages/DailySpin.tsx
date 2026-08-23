import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Flame, ShieldCheck, Zap, Gift, Coins, ExternalLink, ArrowRight } from 'lucide-react';
import { SpinWheel } from '../components/spin/SpinWheel';
import { usePageSEO } from '../lib/seo';
import { SPIN_SECTORS } from '../lib/spinConfig';
import { UniversalAdSlot } from '../components/ads/UniversalAdSlot';
import { useAds } from '../context/AdContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function DailySpin() {
  const { activeDirectLink } = useAds();
  const { isAuthenticated, credits, openAuthModal, openWalletModal } = useAuth();

  usePageSEO({
    title: 'Daily Lucky Spin Wheel - Win Free Gamer Credits & VIP Promo Codes',
    description: 'Spin the TrendPulseX Daily Lucky Wheel every 24 hours to win free Credits, exclusive Roblox code drops, and 2X multipliers. 100% free daily rewards!',
    keywords: 'daily spin wheel, free roblox codes, gamer credits, lucky spin, daily promo codes 2026, free rewards',
  });

  const RECENT_WINNERS = [
    { user: 'BloxMaster_99', reward: 'JACKPOT +500 Credits', time: '2 mins ago', color: 'text-amber-500' },
    { user: 'ShadowNinjaX', reward: 'VIP Code Drop (+250)', time: '5 mins ago', color: 'text-purple-500' },
    { user: 'FischPro_Gamer', reward: '2X Multiplier (+200)', time: '9 mins ago', color: 'text-rose-500' },
    { user: 'BladeRunner99', reward: '+150 Credits', time: '14 mins ago', color: 'text-sky-500' },
    { user: 'VanguardKing', reward: '+100 Credits', time: '18 mins ago', color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
        <Link to="/" className="hover:text-sapphire-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Daily Spin Wheel</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-950 p-8 sm:p-12 mb-10 text-white shadow-xl border border-sky-400/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-black uppercase tracking-wider mb-4">
            <Flame size={14} className="text-amber-400" />
            <span>24-Hour Cooldown Reward System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Daily Lucky <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-white">Spin Wheel</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-azure-100/80 leading-relaxed font-medium">
            Test your luck every 24 hours! Spin the wheel to claim free wallet credits, unlock exclusive single-use promo code drops, and trigger 2X multipliers for instant gaming boosts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-900/60 border border-sky-400/30 px-4 py-2 rounded-xl text-xs font-bold text-sky-200">
              <Coins size={16} className="text-amber-400" />
              <span>Your Balance: {credits.toLocaleString()} Credits</span>
            </div>
            
            <button
              onClick={openWalletModal}
              className="text-xs font-bold text-sky-300 hover:text-sky-200 underline flex items-center gap-1"
            >
              View Wallet & Transactions <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Wheel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left / Center Column: Interactive Spin Wheel Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-950/10">
          <SpinWheel />
        </div>

        {/* Right Column: Live Winners, Rules & Direct Link Monetization */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Recent Winners Feed */}
          <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="text-base font-black text-indigo-950">Live Recent Winners</h3>
            </div>

            <div className="space-y-3">
              {RECENT_WINNERS.map((win, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-slate-800">{win.user}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-black ${win.color}`}>{win.reward}</div>
                    <div className="text-[10px] text-slate-400">{win.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adsterra High-CPM Banner Slot */}
          <UniversalAdSlot slotId="sidebar_article" />

          {/* Rules & Rewards Overview Card */}
          <div className="rounded-3xl bg-gradient-to-b from-indigo-950 to-slate-900 p-6 text-white shadow-lg border border-sky-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="text-base font-black">Prizes & Odds</h3>
            </div>

            <div className="space-y-2.5">
              {SPIN_SECTORS.map((sector) => (
                <div key={sector.id} className="flex items-center justify-between text-xs py-1 border-b border-indigo-900/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="font-bold text-slate-200">{sector.label} {sector.sublabel}</span>
                  </div>
                  <span className="font-semibold text-amber-300/90">{sector.badge}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-900/80">
              <a
                href={activeDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-sky-400 hover:bg-sky-300 text-indigo-950 font-black text-xs uppercase tracking-wider transition-all"
              >
                <span>Claim Extra Bonus Drop</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="mb-12 rounded-3xl bg-slate-50 border border-slate-200/80 p-8">
        <h2 className="text-2xl font-black text-indigo-950 mb-6 text-center">How the Daily Spin Wheel Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black mb-3">1</div>
            <h3 className="font-black text-indigo-950 text-base mb-1">Sign In Daily</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create a free account or log in with Google to start your daily spin streak and unlock free rewards.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black mb-3">2</div>
            <h3 className="font-black text-indigo-950 text-base mb-1">Spin & Win Prizes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hit the golden SPIN button once every 24 hours to score free Credits, grand jackpots, or secret promo codes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black mb-3">3</div>
            <h3 className="font-black text-indigo-950 text-base mb-1">Double Your Claim</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the Claim 2X Double Bonus button to instantly multiply your winnings and boost your wallet balance.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Global Adsterra Banner */}
      <UniversalAdSlot slotId="footer_banner" />
    </div>
  );
}
