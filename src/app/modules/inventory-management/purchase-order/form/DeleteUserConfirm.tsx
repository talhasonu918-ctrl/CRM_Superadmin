import React from 'react';
import { User } from '../../../../../hooks/useInfiniteTable';
import { DeleteConfirmContent } from '../../../../../components/DeleteConfirmModal';

interface DeleteUserConfirmProps {
  userData: Partial<User>;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteUserConfirm: React.FC<DeleteUserConfirmProps> = ({
  userData,
  onConfirm,
  onCancel,
}) => {
  return (
    <DeleteConfirmContent
      title="Delete this purchase order?"
     
      confirmButtonText="Delete Purchase Order"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
