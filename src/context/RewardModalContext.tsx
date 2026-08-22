import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Check, ArrowRight, X, Coins, Gift } from 'lucide-react';
import { useAuth } from './AuthContext';
import { getLocalAdSettings, getActiveDirectLink, FALLBACK_ADSTERRA_DIRECT_LINK } from '../lib/adConfig';

export const DEFAULT_ADSTERRA_DIRECT_LINK = FALLBACK_ADSTERRA_DIRECT_LINK;

interface TriggerRewardOptions {
  code?: string;
  adUrl?: string;
  rewardTitle?: string;
  creditBonus?: number;
}

interface RewardModalContextType {
  triggerRewardFlow: (options?: TriggerRewardOptions) => Promise<void>;
  closeRewardModal: () => void;
  isOpen: boolean;
}

const RewardModalContext = createContext<RewardModalContextType | undefined>(undefined);

export function RewardModalProvider({ children }: { children: ReactNode }) {
  const { claimCredits, credits } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [rewardTitle, setRewardTitle] = useState<string>('Daily Credit Claim');
  const [creditsEarned, setCreditsEarned] = useState<number>(100);

  const triggerRewardFlow = async (options?: TriggerRewardOptions) => {
    const code = options?.code;
    const dynamicDirectLink = getActiveDirectLink(getLocalAdSettings());
    const adUrl = options?.adUrl || dynamicDirectLink || DEFAULT_ADSTERRA_DIRECT_LINK;
    const bonus = options?.creditBonus !== undefined ? options.creditBonus : 100;
    setRewardTitle(options?.rewardTitle || 'Daily Credit Claim & Reward Box');
    setCreditsEarned(bonus);

    // 1. Copy code to clipboard if provided
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
        setCopiedCode(code);
      }
    } else {
      setCopiedCode(null);
    }

    // 2. Open Ad / Direct Link in background tab
    try {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Could not open background tab:', err);
    }

    // 3. Grant +100 Credits to user wallet automatically
    if (bonus > 0) {
      await claimCredits(bonus, 'reward_box_claim');
    }

    // 4. Show Reward Modal on the main page
    setIsOpen(true);
  };

  const closeRewardModal = () => {
    setIsOpen(false);
  };

  return (
    <RewardModalContext.Provider value={{ triggerRewardFlow, closeRewardModal, isOpen }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeRewardModal}
              className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-sapphire-600/20"
            >
              {/* Close Button */}
              <button
                onClick={closeRewardModal}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Glowing Background Elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

              {/* Animated Shiny Reward Icon */}
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sapphire-600 to-sky-400 text-white shadow-xl shadow-sapphire-600/35 border-2 border-white/60"
                >
                  <Coins size={40} className="stroke-[2.2] drop-shadow-md text-white" />
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-indigo-950 shadow-md font-bold text-xs"
                >
                  <Sparkles size={14} className="stroke-[2.5]" />
                </motion.div>
              </div>

              {/* Heading */}
              <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight mb-1">
                +100 Credits Claimed! 🪙
              </h3>
              <p className="text-xs font-semibold text-sapphire-600 uppercase tracking-wider">
                {rewardTitle}
              </p>

              {/* Credits Added Highlight Box */}
              <div className="my-4 rounded-2xl bg-gradient-to-b from-azure-50 to-white border border-sapphire-600/20 p-4 text-left shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900/60 uppercase">Credits Earned:</span>
                  <span className="inline-flex items-center gap-1 font-black text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Check size={12} strokeWidth={3} /> +{creditsEarned} Credits
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-950/5">
                  <span className="text-xs font-bold text-indigo-900/60 uppercase">Your Wallet Balance:</span>
                  <span className="text-base font-black text-indigo-950 font-mono">
                    {credits} Credits
                  </span>
                </div>

                {copiedCode && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white border border-indigo-950/10 py-2 px-3 shadow-2xs">
                    <span className="text-xs font-semibold text-indigo-900/50">Bonus Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-indigo-950 select-all">
                        {copiedCode}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-azure-100 text-sapphire-800 px-1.5 py-0.5 text-[10px] font-bold">
                        <Check size={10} strokeWidth={3} /> Copied!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button: Continue */}
              <button
                type="button"
                onClick={closeRewardModal}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sapphire-600 hover:bg-sapphire-500 text-white font-black text-base py-3.5 px-6 shadow-lg shadow-sapphire-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Awesome, Back to App</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </RewardModalContext.Provider>
  );
}

export function useRewardModal() {
  const context = useContext(RewardModalContext);
  if (!context) {
    throw new Error('useRewardModal must be used within a RewardModalProvider');
  }
  return context;
}

