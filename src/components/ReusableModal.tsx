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
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} title={title}>
      <div className="relative h-full flex flex-col overflow-visible">
        {/* Absolute close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute -top-1 -right-1 z-50 p-1 rounded-md ${theme.neutral.hoverLight} transition-colors`}
        >
          <XMarkIcon className={`h-5 w-5 ${theme.text.muted}`} strokeWidth={2} />
        </button>

        <div className={`mb-4 flex items-center justify-start border-b pb-3 ${theme.border.main}`}>
          <Title as="h3" className={`${theme.text.primary} text-xl font-bold uppercase tracking-tight`}>
            {title}
          </Title>
        </div>
        
        <div className="flex-1 overflow-visible">
          {children}
        </div>
      </div>
    </Modal>
  );
};
