
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getThemeColors } from '../theme/colors';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg p-8 rounded-[2rem] ${theme.shadow['2xl']} border ${theme.neutral.backgroundTertiary} ${theme.border.main} ${theme.text.heading}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
              <button 
                onClick={onClose} 
                className={`p-2 ${theme.neutral.hoverLight} rounded-full transition-colors`}
              >
                <X size={20} className={theme.text.muted} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
