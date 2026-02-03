import React, { useMemo, useState } from 'react';
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
}

// Generate more mock branches for infinite scroll
const generateMockBranches = (count: number): Branch[] => {
  const statuses: ('Active' | 'Inactive' | 'Under Maintenance')[] = ['Active', 'Inactive', 'Under Maintenance'];
  const branches: Branch[] = [];
  
  for (let i = 0; i < count; i++) {
    const num = mockBranches.length + i + 1;
    branches.push({
      id: String(num),
      branchName: `Branch ${num}`,
      managerName: `Manager ${num}`,
      phoneNumber: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${num} Street, City, State ${String(10000 + num).slice(0, 5)}`,
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
  onDeleteBranch 
}) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl border shadow-sm p-8 ${theme.neutral.background} ${theme.border.main}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
    isDarkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
  }`;

  const [loadedCount, setLoadedCount] = useState(20);
  const total = 100;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    branchName: true,
    managerName: true,
    phoneNumber: true,
    address: true,
    status: true,
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

  // Initialize table with infinite scroll
  const initialData = [...mockBranches, ...generateMockBranches(17)];
  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
  } = useInfiniteTable<Branch>({
    columns,
    initialData,
    pageSize: 20,
    onLoadMore: loadMoreBranches,
  });

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
          branch.branchName.toLowerCase().includes(search) ||
          branch.managerName.toLowerCase().includes(search) ||
          branch.phoneNumber.includes(search) ||
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className={`text-lg font-bold tracking-tight ${theme.text.primary}`}>Branches</h4>
          <p className={`text-sm mt-1 ${theme.text.secondary}`}>
            Manage all branch locations
          </p>
        </div>
        <Button
          onClick={onAddBranch}
          className={`${theme.button.primary} h-10 text-white rounded-lg`}
          size="lg"
        >
          + Add New Branch
        </Button>
      </div>

      {/* Search, Filter and Column Toggle Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          control={control}
          placeholder="Search branches..."
          inputStyle={inputStyle}
          isDarkMode={isDarkMode}
        />

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
          disabledColumns={['branchName', 'actions']}
          columnLabels={{
            branchName: 'Branch Name',
            managerName: 'Manager',
            phoneNumber: 'Phone',
            address: 'Address',
            status: 'Status',
            actions: 'Actions',
          }}
          isDarkMode={isDarkMode}
        />
      </div>

      <InfiniteTable
        table={table}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMoreWithCount}
        emptyComponent={
          <div className={`text-center py-8 ${theme.text.secondary}`}>
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

      {/* Table Footer */}
      <div className={`mt-4 pt-4 border-t ${theme.border.main}`}>
        <div className={`flex items-center justify-between text-sm ${theme.text.secondary}`}>
          <span>
            Showing <span className={`font-semibold ${theme.text.primary}`}>{Math.min(loadedCount, filteredData.length || loadedCount)}</span> of{' '}
            <span className={`font-semibold ${theme.text.primary}`}>{total}</span> branches
          </span>
          {hasNextPage && !isLoading && (
            <span className={`text-xs animate-pulse ${theme.text.tertiary}`}>
              Scroll down to load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
