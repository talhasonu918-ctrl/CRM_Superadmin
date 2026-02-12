import React from 'react';
import { Modal } from './Modal';
import { Title, ActionIcon } from 'rizzui';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getThemeColors } from '../theme/colors';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isDarkMode?: boolean;
}

export const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  // Map size prop to Tailwind max-width classes for consistent control
  const sizeClass =
    size === 'sm' ? 'max-w-sm' :
      size === 'md' ? 'max-w-md' :
        size === 'lg' ? 'max-w-lg' :
          size === 'xl' ? 'max-w-4xl' :
            size === 'full' ? 'max-w-full' : 'max-w-lg';
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} title={title}>
      <div className={`relative m-auto px-6  pb-6 rounded-lg w-full ${sizeClass} overflow-visible ${theme.neutral.background}`}>
        {/* Absolute close button (single) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-2 rounded-md ${theme.neutral.hoverLight} transition-colors`}
        >
          <XMarkIcon className={`h-5 w-5 ${theme.text.muted}`} strokeWidth={1.6} />
        </button>

        <div className={`mb-5 flex items-center justify-start border-b pb-3 ${theme.border.main}`}>
          <Title as="h3" className={`${theme.text.primary} text-xl font-semibold`}>{title}</Title>
        </div>

        <div className={`${theme.text.secondary} space-y-4`}>
          {children}
        </div>
      </div>
    </Modal>
  );
};
