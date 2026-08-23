import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { SearchAutocomplete } from './SearchAutocomplete';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  // Lock body scroll and listen for Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-indigo-950/15 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-indigo-950/10 flex items-center justify-between bg-azure-50/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sapphire-600 text-white">
                <Search size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-indigo-950">Dynamic Search & Code Finder</h3>
                <p className="text-[11px] text-indigo-900/60 font-medium">Instant game titles, active promo codes & viral drops</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-indigo-900/40 hover:text-indigo-950 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-indigo-950/10"
              title="Close Search"
            >
              <X size={18} />
            </button>
          </div>

          {/* Autocomplete Body */}
          <div className="p-4 sm:p-6">
            <SearchAutocomplete
              autoFocus
              variant="page"
              placeholder="Search Roblox titles, active codes, rewards (e.g. Blox Fruits, Fisch)..."
              onClose={onClose}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
