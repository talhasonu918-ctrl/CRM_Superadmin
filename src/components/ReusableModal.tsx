import React from 'react';
import { Modal, Title, ActionIcon } from 'rizzui';
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <div className={`m-auto px-7 pt-6 pb-8 rounded-lg w-full ${theme.neutral.background}`}>
        <div className={`mb-7 flex items-center justify-between border-b pb-4 ${theme.border.main}`}>
          <Title as="h3" className={theme.text.primary}>{title}</Title>
          <ActionIcon 
            size="sm" 
            variant="text" 
            onClick={onClose}
            className={theme.text.secondary}
          >
            <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
          </ActionIcon>
        </div>
        <div className={theme.text.secondary}>
          {children}
        </div>
      </div>
    </Modal>
  );
};
