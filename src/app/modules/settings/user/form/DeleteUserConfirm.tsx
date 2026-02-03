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
      title="Delete User"
     
      confirmButtonText="Delete User"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
