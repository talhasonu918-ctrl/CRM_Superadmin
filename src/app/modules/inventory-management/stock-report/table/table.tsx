import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Eye, Printer, Download } from 'lucide-react';
import { Select, Button } from 'rizzui';
import { useForm, Controller } from 'react-hook-form';
import { userColumns, stockReportColumns, mockStockReportData } from './columns';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable, User, loadMoreUsers, generateMockUsers } from '../../../../../hooks/useInfiniteTable';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { ExportButton } from '../../../../../components/ExportButton';

import { getThemeColors } from '../../../../../theme/colors';

interface StockReportTableProps {
  isDarkMode: boolean;
  onAddUser?: () => void;
  onEditUser?: (user: any) => void;
  onViewUser?: (user: any) => void;
  onDeleteUser?: (user: any) => void;
  onTotalsChange?: (totals: { totalRetail: number; totalCost: number }) => void;
  onDataChange?: (data: any) => void; // Added missing prop
}
export const StockReportTable: React.FC<StockReportTableProps> = ({ isDarkMode, onAddUser, onEditUser, onViewUser, onDeleteUser, onTotalsChange, onDataChange }) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl shadow-sm ${theme.neutral.background}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

  // Search and filter states
  const todayStr = new Date().toISOString().slice(0, 10);
  const { control, watch, setValue } = useForm({
    defaultValues: {
      searchTerm: '',
      activeFilter: 'all',
      fromDate: todayStr,
      toDate: todayStr,
    },
  });
  const searchTerm = watch('searchTerm');
  const activeFilter = watch('activeFilter');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const [loadedCount, setLoadedCount] = useState(10);
  const total = 60;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    productId: true,
    product: true,
    category: true,
    subCategory: true,
    costPrice: true,
    salePrice: true,
    retailPrice: true,
    stockStatus: true,
    uom: true,
    availableStock: true,
    totalRetailPrice: true,
    totalCostPrice: true,
  });

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  const handleEdit = (po: any) => {
    setSelectedPO(po);
    setIsEditOpen(true);
  };

  const handleView = (po: any) => {
    setSelectedPO(po);
    setIsViewOpen(true);
  };

  const handleDelete = (po: any) => {
    setSelectedPO(po);
    setIsDeleteOpen(true);
  };

  // Use stock report columns and mock data for this table
  const columns = useMemo(() => stockReportColumns(isDarkMode), [isDarkMode]);

  // Initialize table data with the 10 sample rows
  const [users, setUsers] = useState<any[]>(() => mockStockReportData);

  // compute display rows by date and search
  const displayData = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return users.filter((row) => {
      // date filter
      if (from && to && row.date) {
        const d = new Date(row.date);
        // normalize to dates only
        d.setHours(0, 0, 0, 0);
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        const t = new Date(to);
        t.setHours(0, 0, 0, 0);
        if (d < f || d > t) return false;
      }

      // search filter (on product and uom)
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchesProduct = (row.product || '').toString().toLowerCase().includes(s);
        const matchesUom = (row.uom || '').toString().toLowerCase().includes(s);
        if (!matchesProduct && !matchesUom) return false;
      }

      return true;
    });
  }, [users, fromDate, toDate, searchTerm]);

  // compute totals from displayData and notify parent
  useEffect(() => {
    const totalRetail = displayData.reduce((sum, r) => sum + (Number(r.totalRetailPrice) || 0), 0);
    const totalCost = displayData.reduce((sum, r) => sum + (Number(r.totalCostPrice) || 0), 0);
    if (typeof onTotalsChange === 'function') onTotalsChange({ totalRetail, totalCost });
  }, [displayData]);

  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
    setInitialData,
  } = useInfiniteTable<any>({
    columns,
    data: users,
    pageSize: 10,
    onLoadMore: async (page, limit) => {
      const more = await loadMoreUsers(page, limit);
      // Adapted to handle PO structure if needed
      return more;
    },
  });

  // When displayData (filtered by date/search) changes, update the table's data
  useEffect(() => {
    if (typeof setInitialData === 'function') {
      setInitialData(displayData);
    }
  }, [displayData, setInitialData]);

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 10, total));
  };

  // Build visible column order for export/print (use accessorKey if available)
  const visibleColumns = columns.filter((c: any) => c.accessorKey || c.id);

  const headers = columns.map((col) => col.header as string);

  return (
    <div className={cardStyle}>
      <div className="flex items-center gap-2 justify-between mb-6">
        {/* Add any content or buttons here */}
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {/* DATE SECTION */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* From + To */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-gray-500 mb-1">From</label>
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className={`${inputStyle} h-10 w-full sm:w-auto`}
                  />
                )}
              />
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-gray-500 mb-1">To</label>
              <Controller
                name="toDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className={`${inputStyle} h-10 w-full sm:w-auto`}
                  />
                )}
              />
            </div>
          </div>

          {/* SEARCH + BUTTONS */}
          <div className="flex  sm:flex-row gap-3 w-full sm:w-auto justify-center items-center">
            <div className="w-full sm:w-64">
              <SearchInput
                control={control}
                placeholder="Search purchase orders..."
                inputStyle={inputStyle}
                isDarkMode={isDarkMode}
              />
            </div>

          <ExportButton
  headers={headers}
  data={displayData.map((row) =>
    columns.map((col: any) => {
      const key = col.accessorKey ?? col.id;
      return key && row[key] !== undefined ? row[key] : '';
    })
  )}
  filename="stock-report"
  title="Stock Report"
  isDarkMode={isDarkMode}
/>
          </div>
        </div>
      </div>

      <InfiniteTable
        table={table}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMoreWithCount}
        total={total}
        itemName="purchase orders"
        emptyComponent={
          <div className={`text-center py-8 ${theme.text.tertiary}`}>
            {searchTerm ? 'No purchase orders match your search' : 'No purchase orders found'}
          </div>
        }
        loadingComponent={
          <div className={`flex items-center justify-center gap-2 py-4 ${theme.text.tertiary}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span>Loading purchase orders...</span>
          </div>
        }
        columnVisibility={columnVisibility}
        className="max-h-[600px]"
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default StockReportTable;
