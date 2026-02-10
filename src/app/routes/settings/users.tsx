import React, { useState } from 'react';
import { UserTable } from '../../modules/settings/user/table/table';
import { ReusableModal } from '../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import { AddUserForm, EditUserForm, ViewUserDetails } from '../../modules/settings/user/form';
import { Layout } from '../../../components/NavigationLayout';
import { User } from '../../../hooks/useInfiniteTable';

export default function UsersSettings() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
    const isDarkMode = false;

    return (
        <Layout>
            <div className="space-y-6">
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
