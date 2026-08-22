import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';

interface ReadingProgressBarProps {
  articleTitle?: string;
}

export function ReadingProgressBar({ articleTitle }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let timeoutId: any = null;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (windowHeight <= 0) {
        setProgress(0);
        setIsVisible(false);
        return;
      }

      const currentProgress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
      setProgress(currentProgress);
      setIsVisible(totalScroll > 60);

      if (currentProgress >= 99) {
        setCompleted(true);
      } else {
        setCompleted(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Article reading progress"
    >
      {/* Background track */}
      <div className="h-1.5 w-full bg-slate-900/10 backdrop-blur-xs">
        {/* Active Gradient Fill Bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-sky-400 via-sapphire-500 to-indigo-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>

      {/* Floating Pill on the Top Right (Shows current percentage and title) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 right-4 pointer-events-auto"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/90 text-white backdrop-blur-md shadow-lg border border-white/10 text-[11px] font-bold">
              {completed ? (
                <>
                  <Check size={12} className="text-emerald-400" strokeWidth={3} />
                  <span className="text-emerald-300 font-mono">100% READ</span>
                </>
              ) : (
                <>
                  <Sparkles size={11} className="text-sky-300 animate-pulse" />
                  <span className="font-mono text-azure-100">{Math.round(progress)}% READ</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
