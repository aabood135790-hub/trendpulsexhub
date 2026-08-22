import { useState, useEffect, MouseEvent } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useRewardModal } from '../../context/RewardModalContext';

interface CopyButtonProps {
  text: string;
  className?: string;
  adUrl?: string;
}

export function CopyButton({ text, className, adUrl }: CopyButtonProps) {
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
    try {
      setCopied(true);
      await triggerRewardFlow({ code: text, adUrl });
    } catch (err) {
      console.error('Failed in copy/reward flow:', err);
    }
  };

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
          <span>COPIED</span>
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
