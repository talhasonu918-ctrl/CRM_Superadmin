import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Eye } from 'lucide-react';
import { Select, Button } from 'rizzui';
import { useForm, Controller } from 'react-hook-form';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable, User, loadMoreUsers, generateMockUsers } from '../../../../../hooks/useInfiniteTable';
import { userColumns } from './columns';
import { getThemeColors } from '../../../../../theme/colors';


interface UserTableProps {
  isDarkMode: boolean;
  onAddUser?: () => void;
  onEditUser?: (user: User) => void;
  onViewUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ isDarkMode, onAddUser, onEditUser, onViewUser, onDeleteUser }) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl border shadow-sm p-8 ${theme.neutral.background} ${theme.border.main}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

  // Search and filter states
  const { control, watch } = useForm({
    defaultValues: {
      searchTerm: '',
      activeFilter: 'all',
    },
  });
  const searchTerm = watch('searchTerm');
  const activeFilter = watch('activeFilter');
  const [loadedCount, setLoadedCount] = useState(20);
  const total = 60;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    userCode: true,
    firstName: true,
    lastName: false,
    userName: true,
    email: false,
    contact: true,
    avatar: false,
    gender: false,
    active: true,
    actions: false,
  });

  const columns = useMemo(
    () => userColumns({ onEdit: onEditUser, onView: onViewUser, onDelete: onDeleteUser }),
    [onEditUser, onViewUser, onDeleteUser]
  );

  // Initialize table with infinite scroll
  const initialData = generateMockUsers(20);
  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
  } = useInfiniteTable<User>({
    columns,
    initialData,
    pageSize: 20,
    onLoadMore: loadMoreUsers,
  });

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 20, total));
  };

  // Filter data based on search and active
  const filteredData = useMemo(() => {
    if (!table.getRowModel) return [];
    
    let filtered = table.getRowModel().rows;

    if (searchTerm) {
      filtered = filtered.filter(row => {
        const user = row.original;
        return (
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.contact.includes(searchTerm)
        );
      });
    }

    if (activeFilter !== 'all') {
      const isActive = activeFilter === 'true';
      filtered = filtered.filter(row => row.original.active === isActive);
    }

    return filtered;
  }, [table, searchTerm, activeFilter]);

  const toggleColumn = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between mb-6">
        <h4 className={`text-lg tracking-tight ${theme.text.primary}`}>Users</h4>
        <Button
          onClick={onAddUser}
          className={`h-10 rounded-lg ${theme.button.primary}`}
          size="lg"
        >
          + Add User
        </Button>
      </div>

      {/* Search, Filter and Column Toggle Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          control={control}
          placeholder="Search users..."
          inputStyle={inputStyle}
          isDarkMode={isDarkMode}
        />

        <FilterDropdown
          control={control}
          name="activeFilter"
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ]}
          placeholder="Select status"
          inputStyle={inputStyle}
          isDarkMode={isDarkMode}
        />

        <ColumnToggle
          className="flex-shrink-0"
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumn}
          disabledColumns={['userName', 'userCode', 'firstName', 'contact']}
          isDarkMode={isDarkMode}
          columnLabels={{
            userCode: 'User Code',
            firstName: 'First Name',
            lastName: 'Last Name',
            userName: 'User Name',
            email: 'Email',
            contact: 'Contact',
            avatar: 'Profile',
            gender: 'Gender',
            active: 'Active',
            actions: 'Actions',
          }}
        />
      </div>

      <InfiniteTable
        table={table}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMoreWithCount}
        emptyComponent={
          <div className={`text-center py-8 ${theme.text.tertiary}`}>
            {searchTerm || activeFilter !== 'all' ? 'No users match your filters' : 'No users found'}
          </div>
        }
        loadingComponent={
          <div className={`flex items-center justify-center gap-2 py-4 ${theme.text.tertiary}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span>Loading users...</span>
          </div>
        }
        columnVisibility={columnVisibility}
        rows={searchTerm || activeFilter !== 'all' ? filteredData : undefined}
        className="max-h-[600px]"
        isDarkMode={isDarkMode}
      />

      {/* Table Footer */}
      <div className={`mt-4 pt-4 border-t ${theme.border.main}`}>
        <div className={`flex items-center justify-between text-sm ${theme.text.tertiary}`}>
          <span>
            Showing <span className={`font-semibold ${theme.text.primary}`}>{Math.min(loadedCount, filteredData.length || loadedCount)}</span> of{' '}
            <span className={`font-semibold ${theme.text.primary}`}>{total}</span> users
          </span>
          {hasNextPage && !isLoading && (
            <span className={`text-xs animate-pulse ${theme.text.muted}`}>
              Scroll down to load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};