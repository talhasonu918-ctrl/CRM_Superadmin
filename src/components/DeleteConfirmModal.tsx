import React from 'react';
import { Button } from 'rizzui';
import { AlertTriangle } from 'lucide-react';
import { ReusableModal } from './ReusableModal';
import { getThemeColors } from '../theme/colors';

interface DeleteConfirmContentProps {
  title?: string;
  message?: string;
  itemName?: string;
  itemDetails?: {
    image?: string;
    primaryText?: string;
    secondaryText?: string;
    tertiaryText?: string;
  };
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const DeleteConfirmContent: React.FC<DeleteConfirmContentProps> = ({
  title = 'Delete Item?',
  message,
  itemName,
  itemDetails,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <div className={`text-center py-4`}>
      {/* Warning Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 rounded-full ${theme.status.error.bg} flex items-center justify-center`}>
          <AlertTriangle className={`w-8 h-8 ${theme.status.error.text}`} />
        </div>
      </div>

      {/* Confirmation Message */}
      <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>{title}</h3>
      <p className={`${theme.text.secondary} mb-6`}>
        {message || (
          <>
            Are you sure you want to delete{' '}
            ? This action cannot be undone.
          </>
        )}
      </p>

    

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`${theme.button.secondary} h-10 rounded-lg px-8`}
        >
          {cancelButtonText}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className={`${theme.button.primary} h-10 text-white whitespace-nowrap rounded-lg px-8`}
        >
          {confirmButtonText}
        </Button>
      </div>
    </div>
  );
};

// Complete modal component with ReusableModal wrapper
interface DeleteConfirmModalProps extends DeleteConfirmContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  title = 'Delete Item?',
  message,
  itemName,
  itemDetails,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <DeleteConfirmContent
        title={title}
        message={message}
        itemName={itemName}
        itemDetails={itemDetails}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </ReusableModal>
  );
};
