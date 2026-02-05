import React, { useMemo, useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable, loadMoreUsers } from '../../../../../hooks/useInfiniteTable';
import { Branch, mockBranches } from '../types';
import { branchColumns } from './columns';
import { getThemeColors } from '../../../../../theme/colors';

interface BranchTableProps {
  isDarkMode: boolean;
  onAddBranch?: () => void;
  onEditBranch?: (branch: Branch) => void;
  onViewBranch?: (branch: Branch) => void;
  onDeleteBranch?: (branch: Branch) => void;
  data?: Branch[];
}

// Generate more mock branches for infinite scroll
const generateMockBranches = (count: number): Branch[] => {
  const statuses: ('Active' | 'Inactive' | 'Under Maintenance')[] = ['Active', 'Inactive', 'Under Maintenance'];
  const branches: Branch[] = [];

  for (let i = 0; i < count; i++) {
    const num = mockBranches.length + i + 1;
    branches.push({
      id: String(num),
      tenantId: 'tenant_1',
      name: `Branch ${num}`,
      slug: `branch-${num}`,
      address: `${num} Street, City, State ${String(10000 + num).slice(0, 5)}`,
      city: 'City',
      country: 'Country',
      lat: 0,
      lng: 0,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      email: `branch${num}@example.com`,
      timezone: 'UTC',
      managerUserId: `user_${num}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return branches;
};

const loadMoreBranches = async (): Promise<Branch[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockBranches(20));
    }, 800);
  });
};

export const BranchTable: React.FC<BranchTableProps> = ({
  isDarkMode,
  onAddBranch,
  onEditBranch,
  onViewBranch,
  onDeleteBranch,
  data,
}) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl border shadow-sm p-4 sm:p-8 ${theme.neutral.background} ${theme.border.main}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? ' border-slate-700 focus:border-orange-500 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
    }`;

  const [loadedCount, setLoadedCount] = useState(20);
  const total = 100;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    name: true, // Make name non-hideable
    managerUserId: true,
    phone: true,
    email: true,
    address: true,
    city: true,
    country: true,
    lat: true,
    lng: true,
    timezone: true,
    status: true,
    createdAt: true,
    actions: true, // Make actions non-hideable
  });

  const { control, watch } = useForm({
    defaultValues: {
      searchTerm: '',
      statusFilter: 'all',
    },
  });

  const searchTerm = watch('searchTerm');
  const statusFilter = watch('statusFilter');

  const columns = useMemo(
    () => branchColumns({ onEdit: onEditBranch, onView: onViewBranch, onDelete: onDeleteBranch, isDarkMode }),
    [onEditBranch, onViewBranch, onDeleteBranch, isDarkMode]
  );

  // Initialize table with provided data or mock/infinite data
  const initialData = data && data.length > 0 ? data : [...mockBranches, ...generateMockBranches(17)];
  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
    setInitialData,
  } = useInfiniteTable<Branch>({
    columns,
    data: initialData,
    pageSize: 20,
    onLoadMore: loadMoreBranches,
  });
  // If parent provides `data` (from localStorage), keep the internal table data in sync
  useEffect(() => {
    if (data && data.length > 0) {
      setInitialData(data);
    }
  }, [data, setInitialData]);

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 20, total));
  };

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    if (!table.getRowModel) return [];

    let filtered = table.getRowModel().rows;

    if (searchTerm) {
      filtered = filtered.filter(row => {
        const branch = row.original;
        const search = searchTerm.toLowerCase();
        return (
          branch.name.toLowerCase().includes(search) ||
          (branch.managerUserId || '').toLowerCase().includes(search) ||
          (branch.phone || '').includes(search) ||
          branch.address.toLowerCase().includes(search)
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(row =>
        row.original.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [table, searchTerm, statusFilter]);

  const toggleColumn = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  return (
    <div className={cardStyle}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className={`text-lg font-bold tracking-tight ${theme.text.primary}`}>Branches</h4>
          <p className={`text-sm mt-1 ${theme.text.secondary}`}>
            Manage all branch locations
          </p>
        </div>
        <Button
          onClick={onAddBranch}
          className={`${theme.button.primary} w-full sm:w-auto h-10 text-white whitespace-nowrap rounded-lg`}
          size="lg"
        >
          + Add New Branch
        </Button>
      </div>

      {/* Search, Filter and Column Toggle Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center justify-between">
        <SearchInput
          control={control}
          placeholder="Search branches..."
          inputStyle={inputStyle}
          isDarkMode={isDarkMode}
        />
        <div className='flex gap-4  sm:justify-start p-2 items-center justify-between '>
          <FilterDropdown
            control={control}
            name="statusFilter"
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Under Maintenance', value: 'under maintenance' },
            ]}
            placeholder="Select status"
            inputStyle={inputStyle}
            isDarkMode={isDarkMode}
          />

          <ColumnToggle
            className="flex-shrink-0"
            columnVisibility={columnVisibility}
            onToggleColumn={toggleColumn}
            disabledColumns={['name', 'actions']}
            columnLabels={{
              name: 'Branch Name',
              managerUserId: 'Manager',
              phone: 'Phone',
              email: 'Email',
              address: 'Address',
              city: 'City',
              country: 'Country',
              lat: 'Lat',
              lng: 'Lng',
              timezone: 'Timezone',
              status: 'Status',
              createdAt: 'Created',
              actions: 'Actions',
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      <div className="overflow-hidden w-full">
        <InfiniteTable
          table={table}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          onLoadMore={loadMoreWithCount}
          emptyComponent={
            <div className={`text-center py-8  ${theme.text.secondary}`}>
              {searchTerm || statusFilter !== 'all' ? 'No branches match your filters' : 'No branches found'}
            </div>
          }
          loadingComponent={
            <div className={`flex items-center justify-center gap-2 py-4 ${theme.text.secondary}`}>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              <span>Loading branches...</span>
            </div>
          }
          columnVisibility={columnVisibility}
          rows={searchTerm || statusFilter !== 'all' ? filteredData : undefined}
          className="max-h-[600px]"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Table Footer */}
      <div className={`mt-4 pt-4 border-t ${theme.border.main}`}>
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm ${theme.text.secondary}`}>
          <span className="text-center sm:text-left">
            Showing <span className={`font-semibold ${theme.text.primary}`}>{Math.min(loadedCount, filteredData.length || loadedCount)}</span> of{' '}
            <span className={`font-semibold ${theme.text.primary}`}>{total}</span> branches
          </span>
          {hasNextPage && !isLoading && (
            <span className={`animate-pulse ${theme.text.tertiary}`}>
              Scroll down to load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
