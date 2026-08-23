import React, { MouseEvent } from 'react';
import { ExternalLink, Gift, Sparkles, Coins, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRewardModal } from '../../context/RewardModalContext';
import { useAuth } from '../../context/AuthContext';
import { useAds } from '../../context/AdContext';

interface BonusCodeCtaProps {
  url?: string;
  title?: string;
  subtitle?: string;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

export function BonusCodeCta({ 
  url, 
  title = "Daily Credit Claim & Reward Box", 
  subtitle = "Click to claim +100 Credits added directly to your wallet & access exclusive drops!" 
}: BonusCodeCtaProps) {
  const { triggerRewardFlow } = useRewardModal();
  const { isAuthenticated, isDailyGiftAvailable, remainingDailyClaimMs, openWalletModal, openAuthModal } = useAuth();
  const { activeDirectLink } = useAds();

  const targetLink = url || activeDirectLink;

  const handleClaim = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDailyGiftAvailable) {
      isAuthenticated ? openWalletModal() : openAuthModal("signin");
      return;
    }
    triggerRewardFlow({ adUrl: targetLink, rewardTitle: title, creditBonus: 100 });
  };

  return (
    <motion.div
      onClick={handleClaim}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.988 }}
      className={`relative overflow-hidden group flex w-full flex-col sm:flex-row items-center justify-between rounded-3xl p-6 md:p-8 shadow-xl border transition-all cursor-pointer ${
        isDailyGiftAvailable 
          ? 'bg-gradient-to-r from-indigo-950 via-sapphire-900 to-indigo-950 border-sapphire-400/20'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-950/40 opacity-95'
      }`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-sapphire-500/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-5 text-center sm:text-left mb-6 sm:mb-0">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg border rotate-3 group-hover:rotate-6 transition-transform ${
          isDailyGiftAvailable
            ? 'bg-gradient-to-tr from-sapphire-600 to-sky-400 border-sky-400/30 shadow-sapphire-600/40'
            : 'bg-gradient-to-tr from-slate-700 to-slate-600 border-slate-500/30 shadow-slate-900/50'
        }`}>
          {isDailyGiftAvailable ? (
            <Gift size={32} className="stroke-[2.5]" />
          ) : (
            <Clock size={30} className="stroke-[2.5] text-sky-300" />
          )}
        </div>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400 mb-1 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1">
              <Sparkles size={13} />
              <span>{isDailyGiftAvailable ? 'Daily Refill Box' : '12-Hour Cooldown Active'}</span>
            </span>
            {isDailyGiftAvailable ? (
              <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-black">
                <Coins size={10} className="stroke-[3]" /> +100 CREDITS REWARD
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-black">
                <CheckCircle2 size={10} className="stroke-[3]" /> Claimed (+100)
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
            {isDailyGiftAvailable ? title : 'Daily Gift Claimed — Recharging!'}
          </h3>
          <p className="text-sm md:text-base font-medium text-azure-100/80 mt-0.5 max-w-xl">
            {isDailyGiftAvailable 
              ? subtitle 
              : `You have claimed today's gift. Next refill unlocks in ${formatCountdown(remainingDailyClaimMs)}.`}
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full sm:w-auto shrink-0">
        {isDailyGiftAvailable ? (
          <div className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-sky-400 hover:bg-sky-300 px-7 font-black text-indigo-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all group-hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] cursor-pointer">
            <Coins size={18} className="stroke-[2.5]" />
            <span>CLAIM +100 CREDITS</span>
            <ExternalLink size={16} strokeWidth={2.5} />
          </div>
        ) : (
          <div className="flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 px-6 font-black text-sky-300 shadow-inner">
            <Clock size={16} className="stroke-[2.5] animate-pulse text-sky-400" />
            <span className="font-mono text-sm tracking-wider">{formatCountdown(remainingDailyClaimMs)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

