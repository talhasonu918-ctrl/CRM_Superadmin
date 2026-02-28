import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Eye, Printer, Download, Trash } from 'lucide-react';
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
import { GridView, GridViewItem, ViewToggle } from '../../../../../components/GridView';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [cardVariant, setCardVariant] = useState<'simple' | 'premium'>('simple');

  const handleViewModeChange = (mode: 'grid' | 'list') => setViewMode(mode);

  const handleGridItemClick = (item: GridViewItem) => {
    // reuse existing view handler when clicking a grid item
    if (item && (item as any).original) {
      handleView((item as any).original);
    }
  };

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

  // Prepare GridView items from displayData
  const gridItems: GridViewItem[] = displayData.map((row) => ({
    id: (row.productId || row.id || Math.random().toString(36).slice(2)),
    name: row.product || row.title || '',
    title: row.category || '',
    icon: () => <Eye size={20} />,
    bgColor: 'bg-white',
    iconColor: 'text-primary',
    original: row,
  }));

  // Custom card renderer to show all requested fields (no action buttons)
  const renderCustomCard = (item: any) => {
    const row = item.original || item;
    const id = row.productId || row.id || '—';
    const product = row.product || row.title || '—';
    const category = row.category || '—';
    const subCategory = row.subCategory || row.sub_category || row.subCategoryName || '—';
    const costPrice = row.costPrice ?? row.cost_price ?? row.totalCostPrice ?? row.cost ?? '';
    const salePrice = row.salePrice ?? row.sale_price ?? row.sale ?? '';
    const retail = row.retailPrice ?? row.retail_price ?? row.retail ?? '';
    const stockInOut = row.stockStatus || row.stock_in_out || row.stockStatus || '—';
    const uom = row.uom || row.unit || '—';
    const availableStock = row.availableStock ?? row.available_stock ?? row.qty ?? '—';
    const totalRetail = row.totalRetailPrice ?? row.total_retail_price ?? row.totalRetail ?? '';
    const totalCost = row.totalCostPrice ?? row.total_cost_price ?? row.totalCost ?? '';

    const formatCurrency = (v: any) => (v !== '' && v !== undefined && v !== null ? `${Number(v).toLocaleString()} PKR` : '—');

    return (
      <div key={id} className="rounded-xl border p-5 bg-white shadow-sm hover:shadow-md transition-colors cursor-pointer min-h-[220px]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-slate-400">Product ID</p>
            <div className="text-blue-600 font-semibold mt-1">{id}</div>
            <p className="text-xs text-slate-400 mt-3">Product</p>
            <div className="font-medium mt-1">{product}</div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{row.status || row.stockStatus || 'COMPLETED'}</span>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-3" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
          <div>
            <p className="text-xs text-slate-400">Category</p>
            <div className="mt-1 font-medium text-slate-800">{category}</div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sub Category</p>
            <div className="mt-1 font-medium text-slate-800">{subCategory}</div>
          </div>

          <div>
            <p className="text-xs text-slate-400">Cost Price</p>
            <div className="mt-1 font-medium text-slate-800">{formatCurrency(costPrice)}</div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sale Price</p>
            <div className="mt-1 font-medium text-slate-800">{formatCurrency(salePrice)}</div>
          </div>

          <div>
            <p className="text-xs text-slate-400">Retail</p>
            <div className="mt-1 font-medium text-slate-800">{formatCurrency(retail)}</div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Stock In/Out</p>
            <div className="mt-1 font-medium text-slate-800">{stockInOut}</div>
          </div>

          <div>
            <p className="text-xs text-slate-400">UOM</p>
            <div className="mt-1 font-medium text-slate-800">{uom}</div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Available Stock</p>
            <div className="mt-1 font-medium text-slate-800">{availableStock}</div>
          </div>

          <div>
            <p className="text-xs text-slate-400">Total Retail Price</p>
            <div className="mt-1 font-semibold text-green-600">{formatCurrency(totalRetail)}</div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Cost Price</p>
            <div className="mt-1 font-semibold text-slate-800">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>
    );
  };

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
            <div className="ml-2 flex items-center gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} isDarkMode={isDarkMode} />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCardVariant('simple')}
                  className={`px-3 py-2 rounded-lg border ${cardVariant === 'simple' ? 'bg-slate-100' : 'bg-white'} text-sm`}
                  title="Simple card"
                >
                  Simple
                </button>
                <button
                  onClick={() => setCardVariant('premium')}
                  className={`px-3 py-2 rounded-lg border ${cardVariant === 'premium' ? 'bg-slate-100' : 'bg-white'} text-sm`}
                  title="Premium card"
                >
                  Premium
                </button>
              </div>
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

          {viewMode === 'grid' ? (
            <GridView
              isDarkMode={isDarkMode}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              items={gridItems}
              showHeaderToggle={false}
              renderCustomCard={renderCustomCard}
              onItemClick={handleGridItemClick}
              table={table}
              itemName="purchase orders"
            />
          ) : (
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
          )}
    </div>
  );
};

export default StockReportTable;
