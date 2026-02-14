import React, { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { SearchInput } from '../../../../../components/SearchInput';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { PracticeSetting, mockPracticeSettings } from '../types';
import { practiceColumns } from './columns';
import { getThemeColors } from '../../../../../theme/colors';

interface PracticeTableProps {
  isDarkMode?: boolean;
  onAddSetting?: () => void;
  onEditSetting?: (setting: PracticeSetting) => void;
  onViewSetting?: (setting: PracticeSetting) => void;
  onDeleteSetting?: (setting: PracticeSetting) => void;
}

// Generate more mock settings for display
const generateMockSettings = (count: number, startIndex: number = 0): PracticeSetting[] => {
  const settings: PracticeSetting[] = [];

  for (let i = 0; i < count; i++) {
    const num = startIndex + i + 1;
    settings.push({
      id: `setting-${num}`,
      practiceName: `Practice Setting ${num}`,
      currency: ['USD', 'EUR', 'INR', 'GBP'][Math.floor(Math.random() * 4)],
      timezone: ['EST', 'CST', 'PST', 'MST'][Math.floor(Math.random() * 4)],
      locale: ['en-US', 'en-GB', 'en-IN', 'fr-FR'][Math.floor(Math.random() * 4)],
      planName: ['Premium', 'Enterprise', 'Standard'][Math.floor(Math.random() * 3)],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      billingCycle: ['monthly', 'quarterly', 'yearly'][Math.floor(Math.random() * 3)] as 'monthly' | 'quarterly' | 'yearly',
      defaultTaxPercentage: Math.floor(Math.random() * 10) + 5,
      serviceChargePercentage: Math.floor(Math.random() * 10) + 5,
      minimumOrderValue: Math.floor(Math.random() * 200) + 50,
      baseDeliveryCharges: Math.floor(Math.random() * 100) + 20,
      contactEmail: `admin${num}@practice.com`,
      phoneNumber: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${num} Business Street, City, State ${String(10000 + num).slice(0, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return settings;
};

const loadMoreSettings = async (page: number, limit: number): Promise<PracticeSetting[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate start index based on page and limit
      const startIndex = (page - 1) * limit;
      resolve(generateMockSettings(limit, startIndex));
    }, 800);
  });
};

export const PracticeTable: React.FC<PracticeTableProps> = ({
  isDarkMode = false,
  onAddSetting,
  onEditSetting,
  onViewSetting,
  onDeleteSetting
}) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl border shadow-sm p-4 sm:p-8 ${theme.neutral.background} ${theme.border.main}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? ' border-slate-700 focus:border-orange-500 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
    }`;

  const [loadedCount, setLoadedCount] = useState(10);
  const total = 100;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    practiceName: true,
    contactEmail: true,
    phoneNumber: true,
    timezone: true,
    address: true,
    actions: true,
  });

  const { control, watch } = useForm({
    defaultValues: {
      searchTerm: '',
    },
  });

  const searchTerm = watch('searchTerm');

  const columns = useMemo(
    () => practiceColumns({ onEdit: onEditSetting, onView: onViewSetting, onDelete: onDeleteSetting, isDarkMode }),
    [onEditSetting, onViewSetting, onDeleteSetting, isDarkMode]
  );

  // Initialize table with infinite scroll
  const initialData = useMemo(() => [...mockPracticeSettings, ...generateMockSettings(9)], []);
  const initialSlice = useMemo(() => initialData.slice(0, 10), [initialData]);

  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
  } = useInfiniteTable<PracticeSetting>({
    columns,
    data: initialSlice,
    pageSize: 10,
    onLoadMore: loadMoreSettings,
  });

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 10, total));
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!table.getRowModel) return [];

    let filtered = table.getRowModel().rows;

    if (searchTerm) {
      filtered = filtered.filter(row => {
        const setting = row.original;
        const search = searchTerm.toLowerCase();
        return (
          setting.practiceName.toLowerCase().includes(search) ||
          (setting.contactEmail?.toLowerCase().includes(search) ?? false) ||
          (setting.phoneNumber?.includes(search) ?? false) ||
          (setting.address?.toLowerCase().includes(search) ?? false)
        );
      });
    }

    return filtered;
  }, [table, searchTerm]);

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
          <h4 className={`text-lg font-bold tracking-tight ${theme.text.primary}`}>General Settings</h4>
          <p className={`text-sm mt-1 ${theme.text.secondary}`}>
            Manage practice configuration and details
          </p>
        </div>
        <Button
          onClick={onAddSetting}
          className={`${theme.button.primary} w-full sm:w-auto h-10 text-white whitespace-nowrap rounded-lg`}
          size="lg"
        >
          + Add Setting
        </Button>
      </div>

      {/* Search and Column Toggle Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="w-full sm:w-[350px]">
          <SearchInput
            control={control}
            placeholder="Search settings..."
            inputStyle={`${inputStyle} w-full`}
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ColumnToggle
            className="flex-shrink-0"
            columnVisibility={columnVisibility}
            onToggleColumn={toggleColumn}
            disabledColumns={['practiceName', 'actions']}
            columnLabels={{
              practiceName: 'Practice Name',
              contactEmail: 'Contact Email',
              phoneNumber: 'Phone Number',
              timezone: 'Timezone',
              address: 'Address',
              actions: 'Actions',
            }}
          />
        </div>
      </div>

      <InfiniteTable
        table={table}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMoreWithCount}
        emptyComponent={
          <div className={`text-center py-8 ${theme.text.secondary}`}>
            {searchTerm ? 'No settings match your search' : 'No settings found'}
          </div>
        }
        loadingComponent={
          <div className={`flex items-center justify-center gap-2 py-4 ${theme.text.secondary}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span>Loading settings...</span>
          </div>
        }
        columnVisibility={columnVisibility}
        rows={searchTerm ? filteredData : undefined}
        className="max-h-[600px]"
      />

      {/* Table Footer */}
      <div className={`mt-4 pt-4 border-t ${theme.border.main}`}>
        <div className={`flex items-center justify-between text-sm ${theme.text.secondary}`}>
          <span>
            Showing <span className={`font-semibold ${theme.text.primary}`}>{Math.min(loadedCount, filteredData.length || loadedCount)}</span> of{' '}
            <span className={`font-semibold ${theme.text.primary}`}>{total}</span> settings
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
