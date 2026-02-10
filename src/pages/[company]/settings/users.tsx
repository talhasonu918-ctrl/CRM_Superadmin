import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { UserTable } from '@/src/app/modules/settings/user/table/table';
import { ReusableModal } from '@/src/components/ReusableModal';
import { DeleteConfirmModal } from '@/src/components/DeleteConfirmModal';
import { AddUserForm, EditUserForm, ViewUserDetails } from '@/src/app/modules/settings/user/form';
import { Layout } from '@/src/components/NavigationLayout';
import { User } from '@/src/hooks/useInfiniteTable';
import { getThemeColors } from '@/src/theme/colors';
import { useCompany } from '@/src/contexts/CompanyContext';
import { ROUTES } from '@/src/const/constants';

export default function UsersSettings() {
    const router = useRouter();
    const { company } = useCompany();
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
    const isDarkMode = false;
    const theme = getThemeColors(isDarkMode);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => company && router.push(ROUTES.SETTINGS(company))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme.border.main} ${theme.text.muted} hover:${theme.text.primary} hover:border-orange-400`}
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </button>

                <UserTable
                    isDarkMode={isDarkMode}
                    onAddUser={() => setAddModalOpen(true)}
                    onEditUser={(user: User) => {
                        setSelectedUser(user);
                        setEditModalOpen(true);
                    }}
                    onViewUser={(user: User) => {
                        setSelectedUser(user);
                        setViewModalOpen(true);
                    }}
                    onDeleteUser={(user: User) => {
                        setSelectedUser(user);
                        setDeleteModalOpen(true);
                    }}
                />

                {/* Add User Modal */}
                <ReusableModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    title="Add User"
                    isDarkMode={isDarkMode}
                >
                    <AddUserForm
                        onSubmit={(data: any) => {
                            console.log('Add user:', data);
                            setAddModalOpen(false);
                        }}
                        onCancel={() => setAddModalOpen(false)}
                        isDarkMode={isDarkMode}
                    />
                </ReusableModal>

                {/* Edit User Modal */}
                <ReusableModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    title="Update User"
                    isDarkMode={isDarkMode}
                >
                    <EditUserForm
                        initialData={selectedUser}
                        onSubmit={(data: any) => {
                            console.log('Update user:', data);
                            setEditModalOpen(false);
                        }}
                        onCancel={() => setEditModalOpen(false)}
                        isDarkMode={isDarkMode}
                    />
                </ReusableModal>

                {/* View User Modal */}
                <ReusableModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    title="User Details"
                    isDarkMode={isDarkMode}
                >
                    <ViewUserDetails
                        userData={selectedUser}
                        isDarkMode={isDarkMode}
                    />
                </ReusableModal>

                {/* Delete User Modal */}
                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    title="Delete User"
                    confirmButtonText="Delete User"
                    onConfirm={() => {
                        console.log('Delete user:', selectedUser);
                        setDeleteModalOpen(false);
                    }}
                    onCancel={() => setDeleteModalOpen(false)}
                    isDarkMode={isDarkMode}
                />
            </div>
        </Layout>
    );
}
