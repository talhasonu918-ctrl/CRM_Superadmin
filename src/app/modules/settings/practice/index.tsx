import React from 'react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';
import { PracticeTable } from './table/table';
import { PracticeSettingForm, ViewPracticeSetting } from './form';
import { PracticeSetting } from './types';

interface PracticeViewProps {
  isDarkMode: boolean;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ isDarkMode }) => {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedSetting, setSelectedSetting] = React.useState<Partial<PracticeSetting>>({});

  const handleAddSetting = (data: Partial<PracticeSetting>) => {
    console.log('Add setting:', data);
    setAddModalOpen(false);
  };

  const handleEditSetting = (data: Partial<PracticeSetting>) => {
    console.log('Edit setting:', data);
    setEditModalOpen(false);
  };

  const handleDeleteSetting = () => {
    console.log('Delete setting:', selectedSetting);
    setDeleteModalOpen(false);
  };

  const openEditModal = (setting: PracticeSetting) => {
    setSelectedSetting(setting);
    setEditModalOpen(true);
  };

  const openViewModal = (setting: PracticeSetting) => {
    setSelectedSetting(setting);
    setViewModalOpen(true);
  };

  const openDeleteModal = (setting: PracticeSetting) => {
    setSelectedSetting(setting);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <PracticeTable
        isDarkMode={isDarkMode}
        onAddSetting={() => setAddModalOpen(true)}
        onEditSetting={openEditModal}
        onViewSetting={openViewModal}
        onDeleteSetting={openDeleteModal}
      />

      {/* Add Setting Modal */}
      <ReusableModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Practice Setting"
        size="lg"
      >
        <PracticeSettingForm
          onSubmit={handleAddSetting}
          onCancel={() => setAddModalOpen(false)}
        />
      </ReusableModal>

      {/* Edit Setting Modal */}
      <ReusableModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Practice Setting"
        size="lg"
      >
        <PracticeSettingForm
          initialData={selectedSetting}
          onSubmit={handleEditSetting}
          onCancel={() => setEditModalOpen(false)}
          isEditMode
        />
      </ReusableModal>

      {/* View Setting Modal */}
      <ReusableModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Practice Setting Details"
        size="lg"
      >
        <ViewPracticeSetting settingData={selectedSetting} />
      </ReusableModal>

      {/* Delete Setting Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Practice Setting?"
        message="Are you sure you want to delete this practice setting? This action cannot be undone."
        itemName={selectedSetting.practiceName}
        onConfirm={handleDeleteSetting}
        onCancel={() => setDeleteModalOpen(false)}
        confirmButtonText="Delete Setting"
      />
    </>
  );
};

export default PracticeView;
