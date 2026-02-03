import React from 'react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';
import { BranchTable } from './table/table';
import { AddBranchForm, EditBranchForm, ViewBranchDetails } from './form';
import { Branch } from './types';

interface BranchesViewProps {
  isDarkMode: boolean;
}

export const BranchesView: React.FC<BranchesViewProps> = ({ isDarkMode }) => {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<Partial<Branch>>({});

  const handleAddBranch = (data: Partial<Branch>) => {
    console.log('Add branch:', data);
    setAddModalOpen(false);
  };

  const handleEditBranch = (data: Partial<Branch>) => {
    console.log('Edit branch:', data);
    setEditModalOpen(false);
  };

  const handleDeleteBranch = () => {
    console.log('Delete branch:', selectedBranch);
    setDeleteModalOpen(false);
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditModalOpen(true);
  };

  const openViewModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setViewModalOpen(true);
  };

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <BranchTable
        isDarkMode={isDarkMode}
        onAddBranch={() => setAddModalOpen(true)}
        onEditBranch={openEditModal}
        onViewBranch={openViewModal}
        onDeleteBranch={openDeleteModal}
      />

      {/* Add Branch Modal */}
      <ReusableModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Branch"
        size="lg"
      >
        <AddBranchForm
          onSubmit={handleAddBranch}
          onCancel={() => setAddModalOpen(false)}
        />
      </ReusableModal>

      {/* Edit Branch Modal */}
      <ReusableModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Branch"
        size="lg"
      >
        <EditBranchForm
          initialData={selectedBranch}
          onSubmit={handleEditBranch}
          onCancel={() => setEditModalOpen(false)}
        />
      </ReusableModal>

      {/* View Branch Modal */}
      <ReusableModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Branch Details"
        size="lg"
      >
        <ViewBranchDetails branchData={selectedBranch} />
      </ReusableModal>

      {/* Delete Branch Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Branch?"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        itemName={selectedBranch.branchName}
        onConfirm={handleDeleteBranch}
        onCancel={() => setDeleteModalOpen(false)}
        confirmButtonText="Delete Branch"
      />
    </>
  );
};

export default BranchesView;
