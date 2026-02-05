import React from 'react';
import {
  Settings as SettingsIcon, Store, Users, Smartphone,
  MapPin, Clock, Shield, Bell, Languages
} from 'lucide-react';
import { Button } from 'rizzui';
import Tabs, { TabItem } from '../../../components/Tabs';
import { UserTable } from './user/table/table';
import { ReusableModal } from '../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import { AddUserForm, EditUserForm, ViewUserDetails } from './user/form';
import { BranchesView } from './branches';
import { PracticeView } from './practice';
import { getThemeColors } from '../../../theme/colors';
import { User } from '../../../hooks/useInfiniteTable';

// Table Components
export { UserTable } from './user/table/table';

// Columns
export { userColumns } from './user/table/columns';

// Types and Hooks (re-exported for convenience)
export type { User } from '../../../hooks/useInfiniteTable';
export { useInfiniteTable, loadMoreUsers, generateMockUsers } from '../../../hooks/useInfiniteTable';

export const SettingsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);
  // Modal states
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Partial<User>>({});
  const cardStyle = `rounded-xl border shadow-sm p-8 ${theme.neutral.background} ${theme.border.main}`;
  const inputStyle = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

  const tabItems: TabItem[] = [
    {
      id: 'practice-setting',
      name: 'Practice Setting',
      icon: <SettingsIcon size={18} />,
      content: <PracticeView isDarkMode={isDarkMode} />
    },
    {
      id: 'branches',
      name: 'Branches',
      icon: <Store size={18} />,
      content: <BranchesView isDarkMode={isDarkMode} />
    },
    {
      id: 'users',
      name: 'Users',
      icon: <Users size={18} />,
      content: (
        <div className="space-y-6">
         
          <UserTable 
            isDarkMode={isDarkMode} 
            onAddUser={() => {
              setAddModalOpen(true);
            }}
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
      )
    },
    {
      id: 'mobile-web-setting',
      name: 'Mobile Web Setting',
      icon: <Smartphone size={18} />,
      content: (
        <div className="space-y-6">
          <div className={cardStyle}>
            <h4 className={`text-sm font-bold tracking-tight mb-6 ${theme.text.primary}`}>Mobile & Web Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>App Version</label>
                <input type="text" defaultValue="2.1.4" className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Web Version</label>
                <input type="text" defaultValue="3.0.1" className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>API Endpoint</label>
                <input type="url" defaultValue="https://api.nexus-food.com/v1" className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Maintenance Mode</label>
                <select className={inputStyle}>
                  <option>Disabled</option>
                  <option>Enabled</option>
                  <option>Scheduled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Push Notifications</label>
                <select className={inputStyle}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Auto Updates</label>
                <select className={inputStyle}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button className={`px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-orange-500/10 active:scale-95 transition-all ${theme.button.primary}`}>
                Save Settings
              </button>
              <button className={`border px-6 py-2 rounded-lg font-bold text-sm transition-all ${theme.button.secondary}`}>
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-2">
          <h1 className={`text-2xl font-bold tracking-tight ${theme.text.primary}`}>Settings</h1>
          <p className={`text-sm mt-1 ${theme.text.muted}`}>Manage your practice settings and configurations</p>
        </div>
      </div>

      <Tabs items={tabItems} isDarkMode={isDarkMode} />
    </div>
  );
};
