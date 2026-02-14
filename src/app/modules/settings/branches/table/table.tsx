import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
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
const generateMockBranches = (count: number, startIndex: number = 0): Branch[] => {
  const statuses: ('Active' | 'Inactive' | 'Under Maintenance')[] = ['Active', 'Inactive', 'Under Maintenance'];
  const branches: Branch[] = [];

  for (let i = 0; i < count; i++) {
    const num = startIndex + i + 1;
    branches.push({
      id: String(num),
      tenantId: 'tenant_1',
      name: `Branch ${num}`,
      slug: `branch-${num}`,
      address: `${num} Street, City, State ${String(10000 + num).slice(0, 5)}`,
      city: 'City',
      country: 'Country',

      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      email: `branch${num}@example.com`,
      // timezone: 'UTC',
      managerUserId: `user_${num}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return branches;
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
  const cardStyle = `rounded-xl shadow-sm p-4 sm:p-8 ${theme.neutral.background}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? ' border-slate-700 focus:border-orange-500 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
    }`;

  // Establish source of truth for full dataset
  const fullData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Ensure we have at least 100 items for demo purpose if no data provided
    const missingCount = 100 - mockBranches.length;
    return [...mockBranches, ...generateMockBranches(Math.max(0, missingCount), mockBranches.length)];
  }, [data]);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    name: true,
    status: true,
    managerUserId: true,
    city: true,
    country: true,
    phone: true,
    createdAt: true,
    actions: true,
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

  // Client-side pagination logic
  const pageSize = 10;

  const handleLoadMore = useCallback(async (page: number, limit: number) => {
    return new Promise<Branch[]>((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        resolve(fullData.slice(start, end));
      }, 500);
    });
  }, [fullData]);

  const initialBranchesSlice = useMemo(() => fullData.slice(0, pageSize), [fullData, pageSize]);

  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
    data: tableData, // Get actual loaded data from hook
  } = useInfiniteTable<Branch>({
    columns,
    data: initialBranchesSlice,
    pageSize,
    onLoadMore: handleLoadMore,
  });



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
          (branch.city || '').toLowerCase().includes(search)
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(row =>
        row.original.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [table, searchTerm, statusFilter, tableData]); // Added tableData dependency

  const toggleColumn = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const isFiltering = !!searchTerm || statusFilter !== 'all';
  const displayedRows = isFiltering ? filteredData : undefined;
  // If filtering, count based on filtered result. If not, use loaded count.
  const currentCount = isFiltering ? filteredData.length : tableData.length;
  // If filtering, total is vague in infinite scroll unless we filter fullData. 
  // For now, keep showing fullData.length as total, or just filtered length if filtering.
  const totalCount = isFiltering ? filteredData.length : fullData.length;

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
              status: 'Status',
              managerUserId: 'Manager',
              city: 'City',
              country: 'Country',
              phone: 'Phone',
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
          hasNextPage={hasNextPage && !isFiltering}
          onLoadMore={loadMore}
          total={totalCount}
          itemName="branches"
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
          rows={displayedRows}
          className="max-h-[600px]"
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
