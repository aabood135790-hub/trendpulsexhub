import { useState, useEffect, MouseEvent } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useRewardModal } from '../../context/RewardModalContext';
import { trackUserInteraction } from '../../lib/analytics';

interface CopyButtonProps {
  text: string;
  className?: string;
  adUrl?: string;
  variant?: 'default' | 'compact' | 'pill' | 'mini';
  showRewardModal?: boolean;
}

export function CopyButton({ 
  text, 
  className, 
  adUrl, 
  variant = 'default',
  showRewardModal = true 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { triggerRewardFlow } = useRewardModal();

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Write text directly to clipboard
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Direct clipboard write failed:', err);
    }

    setCopied(true);
    trackUserInteraction('code_copy', `Copied: ${text}`);

    // 2. Trigger reward flow if enabled
    if (showRewardModal && triggerRewardFlow) {
      try {
        await triggerRewardFlow({ code: text, adUrl });
      } catch (err) {
        console.warn('Reward flow error:', err);
      }
    }
  };

  if (variant === 'mini') {
    return (
      <button
        onClick={handleCopy}
        aria-label={copied ? "Code copied to clipboard" : `Copy code ${text}`}
        className={cn(
          "relative inline-flex h-7 px-2.5 items-center justify-center gap-1 rounded-lg font-bold text-[11px] font-mono tracking-tight transition-all shadow-2xs active:scale-95 cursor-pointer select-none",
          copied 
            ? "bg-emerald-600 text-white ring-2 ring-emerald-400/40" 
            : "bg-sapphire-600 hover:bg-sapphire-500 text-white",
          className
        )}
      >
        {copied ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
            <Check size={12} strokeWidth={3} />
            <span>COPIED!</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-1">
            <Copy size={11} strokeWidth={2.5} />
            <span>COPY</span>
          </div>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        aria-label={copied ? "Code copied to clipboard" : `Copy code ${text}`}
        className={cn(
          "relative inline-flex h-8 min-w-[90px] items-center justify-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer select-none",
          copied 
            ? "bg-emerald-600 text-white ring-2 ring-emerald-400/40 shadow-emerald-600/20" 
            : "bg-sapphire-600 hover:bg-sapphire-500 text-white shadow-sapphire-600/20",
          className
        )}
      >
        {copied ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
            <Check size={13} strokeWidth={3} />
            <span>COPIED!</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-1">
            <Copy size={13} strokeWidth={2.5} />
            <span>COPY</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Code copied to clipboard" : `Copy code ${text}`}
      className={cn(
        "relative inline-flex h-9 md:h-10 min-w-[110px] items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer select-none",
        copied 
          ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20 ring-2 ring-emerald-500/30" 
          : "bg-sapphire-600 text-white hover:bg-sapphire-500 active:bg-sapphire-700 shadow-sapphire-600/25 hover:shadow-md hover:shadow-sapphire-600/30",
        className
      )}
    >
      {copied ? (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <Check size={15} strokeWidth={3} />
          <span>COPIED!</span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <Copy size={15} strokeWidth={2.5} />
          <span>COPY</span>
        </motion.div>
      )}
    </button>
  );
}

