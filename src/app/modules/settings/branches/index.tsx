import React from 'react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';
import { BranchTable } from './table/table';
import { AddBranchForm, EditBranchForm, ViewBranchDetails } from './form';
import { Branch } from './types';
import { mockBranches } from './types';

interface BranchesViewProps {
  isDarkMode: boolean;
}

export const BranchesView: React.FC<BranchesViewProps> = ({ isDarkMode }) => {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<Partial<Branch>>({});

  const [branches, setBranches] = React.useState<Branch[]>(() => {
    try {
      const raw = localStorage.getItem('branches');
      if (raw) return JSON.parse(raw) as Branch[];
    } catch (e) {
      // ignore
    }
    return mockBranches;
  });
  const [tenantFont, setTenantFont] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    try {
      const f = localStorage.getItem('tenantFont');
      if (f) setTenantFont(f);
    } catch (e) {}
  }, []);

  const handleAddBranch = (data: Partial<Branch>) => {
    const newBranch: Branch = {
      id: String(Date.now()),
      tenantId: data.tenantId || 'tenant_local',
      name: data.name || 'Unnamed Branch',
      slug: data.slug || `branch-${Date.now()}`,
      address: data.address || '',
      city: data.city || '',
      country: data.country || '',
      lat: data.lat || 0,
      lng: data.lng || 0,
      phone: data.phone || '',
      email: data.email || '',
      timezone: data.timezone || '',
      managerUserId: data.managerUserId || '',
      status: (data.status as any) || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newBranch, ...branches];
    setBranches(updated);
    try { localStorage.setItem('branches', JSON.stringify(updated)); } catch (e) {}
    setAddModalOpen(false);
  };

  const handleEditBranch = (data: Partial<Branch>) => {
    if (!data.id) return setEditModalOpen(false);
    const updated = branches.map(b => b.id === data.id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b);
    setBranches(updated);
    try { localStorage.setItem('branches', JSON.stringify(updated)); } catch (e) {}
    setEditModalOpen(false);
  };

  const handleDeleteBranch = () => {
    if (!selectedBranch?.id) return setDeleteModalOpen(false);
    const updated = branches.filter(b => b.id !== selectedBranch.id);
    setBranches(updated);
    try { localStorage.setItem('branches', JSON.stringify(updated)); } catch (e) {}
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
        data={branches}
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
        fontFamily={tenantFont}
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
        fontFamily={tenantFont}
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
        fontFamily={tenantFont}
      >
        <ViewBranchDetails branchData={selectedBranch} />
      </ReusableModal>

      {/* Delete Branch Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Branch?"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        itemName={(selectedBranch as any).name}
        onConfirm={handleDeleteBranch}
        onCancel={() => setDeleteModalOpen(false)}
        confirmButtonText="Delete Branch"
      />
    </>
  );
};

export default BranchesView;
