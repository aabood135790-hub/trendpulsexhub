import { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  imageUrl: string | null;
  altText?: string;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, altText, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10"
        >
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center p-1 sm:p-2">
            <img
              src={imageUrl}
              alt={altText || 'Community Photo'}
              className="max-h-[82vh] w-auto object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {altText && (
            <div className="p-3 bg-black/70 backdrop-blur-md text-center text-xs font-semibold text-white/80 border-t border-white/10 flex items-center justify-center gap-2">
              <ZoomIn size={14} className="text-sky-400" />
              <span>{altText}</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
