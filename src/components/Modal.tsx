
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getThemeColors } from '../theme/colors';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDarkMode = false, size = 'lg' }) => {
  const theme = getThemeColors(isDarkMode);
  // map size to max-width classes
  const sizeClass =
    size === 'sm' ? 'max-w-sm' :
      size === 'md' ? 'max-w-md' :
        size === 'lg' ? 'max-w-lg' :
          size === 'xl' ? 'max-w-4xl' :
            size === '2xl' ? 'max-w-5xl' :
              size === '3xl' ? 'max-w-7xl' :
                size === 'full' ? 'max-w-full' : 'max-w-lg';

  // prevent body scroll when modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed -inset-7 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className={`relative w-full ${sizeClass} p-6 rounded-lg border ${theme.neutral.background} ${theme.border.main} ${theme.text.heading} max-h-[90vh] overflow-y-auto scrollbar-hidden shadow-md`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
