import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { SpinWheel } from './SpinWheel';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpinWheelModal({ isOpen, onClose }: SpinWheelModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl my-8 rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-indigo-950/10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close Spin Wheel"
          >
            <X size={18} />
          </button>

          {/* Interactive Wheel Body */}
          <SpinWheel compact={false} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
