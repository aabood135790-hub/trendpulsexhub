import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  X, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Loader2, 
  Clock, 
  Tag, 
  KeyRound, 
  AlertCircle, 
  ClipboardPaste 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRewardModal } from '../../context/RewardModalContext';

function formatCooldown(ms: number): { formatted: string; hours: number; minutes: number; seconds: number; progressPct: number } {
  if (ms <= 0) return { formatted: '00:00:00', hours: 0, minutes: 0, seconds: 0, progressPct: 100 };
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const total12hMs = 12 * 60 * 60 * 1000;
  const elapsedMs = Math.max(0, total12hMs - ms);
  const progressPct = Math.min(100, Math.round((elapsedMs / total12hMs) * 100));

  return {
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    hours,
    minutes,
    seconds,
    progressPct,
  };
}

export function WalletModal() {
  const { 
    credits, 
    avatarChangesCount, 
    isWalletOpen, 
    closeWalletModal, 
    claimCredits, 
    isDailyGiftAvailable, 
    remainingDailyClaimMs, 
    redeemedCodes, 
    redeemPromoCode 
  } = useAuth();
  
  const { triggerRewardFlow } = useRewardModal();
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);

  // Redeem code states
  const [inputCode, setInputCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [redeemErrorMsg, setRedeemErrorMsg] = useState<string | null>(null);

  const cooldown = formatCooldown(remainingDailyClaimMs);

  const handleClaimRewardBox = async () => {
    if (!isDailyGiftAvailable) return;
    setIsClaiming(true);
    
    // 1. Trigger reward flow (ad / interstitial modal)
    await triggerRewardFlow({
      rewardTitle: 'Daily Reward Box +100 Credits',
      code: 'TREND-100-BOOST',
      creditBonus: 100,
    });

    // 2. Claim credits in wallet and start 12-hour timer
    const res = await claimCredits(100, 'daily_reward');
    setIsClaiming(false);
    if (res.success) {
      setClaimedJustNow(true);
      setTimeout(() => setClaimedJustNow(false), 4000);
    }
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeToRedeem = inputCode.trim().toUpperCase();
    if (!codeToRedeem) {
      setRedeemErrorMsg('Please enter a redeem code.');
      return;
    }

    setRedeemErrorMsg(null);
    setRedeemSuccessMsg(null);
    setIsRedeeming(true);

    try {
      const res = await redeemPromoCode(codeToRedeem);
      if (res.success) {
        setRedeemSuccessMsg(res.message);
        setInputCode('');
      } else {
        setRedeemErrorMsg(res.error || res.message || 'Failed to redeem code.');
      }
    } catch (err: any) {
      setRedeemErrorMsg(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputCode(text.trim().toUpperCase());
        setRedeemErrorMsg(null);
      }
    } catch (err) {
      console.warn('Could not read clipboard:', err);
    }
  };

  return (
    <AnimatePresence>
      {isWalletOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWalletModal}
            className="fixed inset-0 bg-indigo-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-sapphire-600/20 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeWalletModal}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer z-20"
              aria-label="Close wallet"
            >
              <X size={18} />
            </button>

            {/* Glowing Accent */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

            {/* Header / Current Balance Hero */}
            <div className="text-center relative z-10 pt-2 pb-3">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sapphire-600 to-sky-400 text-white shadow-lg shadow-sapphire-600/30 border-2 border-white">
                <Coins size={32} className="stroke-[2.5]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-azure-100 text-sapphire-700 text-xs font-black uppercase tracking-wider mb-2 border border-sapphire-200">
                <Sparkles size={12} /> Gamer Credits Wallet
              </div>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight font-mono">
                  {credits.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-sapphire-600 uppercase tracking-wide">
                  Credits
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-indigo-900/60 mt-1">
                Use credits to post codes, drop screenshots, comment, and personalize your profile.
              </p>
            </div>

            {/* SECTION 1: Daily Reward Box vs. 12-Hour Cooldown Timer */}
            {isDailyGiftAvailable ? (
              // ACTIVE CLAIM BOX
              <div className="my-4 rounded-2xl bg-gradient-to-r from-sapphire-900 via-indigo-950 to-sapphire-900 p-4 sm:p-5 text-white shadow-md border border-sapphire-500/30 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="h-12 w-12 rounded-xl bg-sky-500 text-indigo-950 flex items-center justify-center font-black shadow-md shrink-0">
                      <Gift size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-black uppercase tracking-wider text-sky-300">
                        <span>Daily Free Refill</span>
                        <span className="bg-sky-400/20 px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-bold">+100 CREDITS</span>
                      </div>
                      <h4 className="text-base font-black text-white">Daily Reward Box</h4>
                      <p className="text-xs text-azure-100/80">Click to watch an ad and unlock +100 Credits instantly!</p>
                    </div>
                  </div>

                  <button
                    onClick={handleClaimRewardBox}
                    disabled={isClaiming}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 active:scale-95 text-indigo-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-sky-400/30 transition-all cursor-pointer shrink-0 disabled:opacity-75"
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Unlocking...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim +100</span>
                        <ArrowRight size={15} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // 12-HOUR COUNTDOWN TIMER BOX (Claim button immediately disappeared)
              <div className="my-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white shadow-md border border-indigo-900/50 relative overflow-hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center font-black shadow-inner shrink-0">
                      <Clock size={22} className="stroke-[2.5] animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-sky-300">
                        <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                        <span>12-Hour Cooldown</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white">Daily Gift Claimed (+100)</h4>
                      <p className="text-xs text-slate-300">Next daily gift unlocks automatically.</p>
                    </div>
                  </div>

                  {/* Countdown Display */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Available In</span>
                    <div className="font-mono text-base sm:text-lg font-black text-sky-300 bg-slate-800/80 px-3 py-1 rounded-xl border border-sky-400/20 shadow-inner">
                      {cooldown.formatted}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${cooldown.progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {claimedJustNow && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 py-2 px-3 text-xs font-black text-emerald-800"
              >
                <CheckCircle2 size={16} className="text-emerald-600 stroke-[3]" />
                <span>+100 Credits successfully claimed! 12-hour timer started.</span>
              </motion.div>
            )}

            {/* SECTION 2: Redeem Code Feature */}
            <div className="my-4 rounded-2xl bg-azure-50/80 border border-indigo-950/10 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-sapphire-600 text-white flex items-center justify-center shadow-xs">
                    <KeyRound size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-wide">
                      Redeem Promo / Gift Code
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sapphire-600 bg-sapphire-50 px-2 py-0.5 rounded-full border border-sapphire-200">
                  Single-Use per User
                </span>
              </div>

              {/* Code input form */}
              <form onSubmit={handleRedeemSubmit} className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value.toUpperCase());
                        setRedeemErrorMsg(null);
                        setRedeemSuccessMsg(null);
                      }}
                      placeholder="Enter promo code"
                      className="w-full bg-white border border-indigo-950/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-indigo-950 placeholder:font-sans placeholder:font-medium placeholder:text-indigo-900/40 uppercase tracking-wider focus:outline-none focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={handlePasteCode}
                      title="Paste from clipboard"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-sapphire-600 p-1 rounded transition-colors cursor-pointer"
                    >
                      <ClipboardPaste size={16} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isRedeeming || !inputCode.trim()}
                    className="flex items-center justify-center gap-1.5 bg-sapphire-600 hover:bg-sapphire-700 active:scale-95 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-md shadow-sapphire-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isRedeeming ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Zap size={14} className="stroke-[3]" />
                        <span>Redeem</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Feedback Alerts */}
                {redeemSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-100/80 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-900"
                  >
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 stroke-[2.5]" />
                    <span>{redeemSuccessMsg}</span>
                  </motion.div>
                )}

                {redeemErrorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-rose-100/80 border border-rose-300 p-2.5 text-xs font-bold text-rose-900"
                  >
                    <AlertCircle size={16} className="text-rose-700 shrink-0" />
                    <span>{redeemErrorMsg}</span>
                  </motion.div>
                )}
              </form>
            </div>

            {/* SECTION 3: Credit Usage Costs Breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-indigo-950/70 px-1">
                <span>Rules & Usage Costs</span>
                <span className="text-sapphire-600">Fair Play Policy</span>
              </div>

              <div className="divide-y divide-indigo-950/5 rounded-2xl bg-azure-50/70 border border-indigo-950/10 p-3 sm:p-4 text-xs sm:text-sm font-semibold text-indigo-950 space-y-2">
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sapphire-600" />
                    Community Post (Text only)
                  </span>
                  <span className="font-mono font-black text-sapphire-700 bg-white px-2 py-0.5 rounded-md border border-indigo-950/10">
                    20 Credits
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Community Post with Photo / Screenshot
                  </span>
                  <span className="font-mono font-black text-sapphire-700 bg-white px-2 py-0.5 rounded-md border border-indigo-950/10">
                    50 Credits
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Simple Comment on Community Post
                  </span>
                  <span className="font-mono font-black text-sapphire-700 bg-white px-2 py-0.5 rounded-md border border-indigo-950/10">
                    10 Credits
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Profile Picture Change
                  </span>
                  <div className="text-right">
                    {avatarChangesCount === 0 ? (
                      <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                        1st Change: FREE
                      </span>
                    ) : (
                      <span className="font-mono font-black text-sapphire-700 bg-white px-2 py-0.5 rounded-md border border-indigo-950/10">
                        50 Credits
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={closeWalletModal}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-azure-100 hover:bg-azure-200 text-indigo-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
