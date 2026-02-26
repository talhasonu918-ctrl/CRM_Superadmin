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
import { ReusableModal } from '../../../../../components/ReusableModal';
import AddPurchaseOrderForm from '../form/AddPerchaseOrder';
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
  const cardStyle = `rounded-xl  shadow-sm p-8 ${theme.neutral.background}`;
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
  const [loadedCount, setLoadedCount] = useState(10);
  const total = 60;
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    productName: true,
    uom: true,
    convUnit: true,
    quantity: true,
    bonusQty: true,
    costPrice: true,
    saleTax: true,
    totalCost: true,
    discount: true,
    netCost: true,
    actions: true,
  });

  const columns = useMemo(
    () => userColumns({ onEdit: onEditUser, onView: onViewUser, onDelete: onDeleteUser, isDarkMode }),
    [onEditUser, onViewUser, onDeleteUser, isDarkMode]
  );

  // Use state for table data; initialize with sample purchase orders
  const samplePurchaseOrders = [
    { productName: 'Product A', uom: 'kg', convUnit: 1, quantity: 10, bonusQty: 2, costPrice: 100, saleTax: 10, totalCost: 1010, discount: 50, netCost: 960 },
    { productName: 'Product B', uom: 'liters', convUnit: 1, quantity: 5, bonusQty: 0, costPrice: 50, saleTax: 5, totalCost: 255, discount: 0, netCost: 255 },
  ];

  const [users, setUsers] = useState<any[]>(() => samplePurchaseOrders);
  const {
    table,
    isLoading,
    hasNextPage,
    loadMore,
  } = useInfiniteTable<any>({
    columns,
    data: users,
    pageSize: 10,
    onLoadMore: async (page, limit) => {
      const more = await loadMoreUsers(page, limit);
      setUsers(prev => [...prev, ...more]);
      return more;
    },
  });

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 10, total));
  };

  // Filter data based on search and active
  const filteredData = useMemo(() => {

    if (!table.getRowModel) return [];

    let filtered = table.getRowModel().rows;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(row => {
        const po = row.original;
        return (
          (po.productName?.toLowerCase().includes(search) ?? false) ||
          (po.uom?.toLowerCase().includes(search) ?? false)
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

  // Modal state for adding purchase orders
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddSubmit = (data: any) => {
    // Prepend the new purchase order to the list
    setUsers(prev => [data, ...prev]);
    setIsAddOpen(false);
  };

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between mb-6">
        <h4 className={`text-lg font-semibold tracking-tight ${theme.text.primary}`}>View Purchase Orders</h4>
        <Button
          onClick={() => setIsAddOpen(true)}
          className={`h-10 rounded-lg ${theme.button.primary}`}
          size="lg"
        >
          + Add Purchase Order
        </Button>
      </div>

      {/* Add Purchase Order Modal */}
      <ReusableModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Purchase Order"
        size="lg"
        isDarkMode={isDarkMode}
      >
        <AddPurchaseOrderForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} isDarkMode={isDarkMode} />
      </ReusableModal>

      {/* Search, Filter and Column Toggle Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          control={control}
          placeholder="Search purchase orders..."
          inputStyle={inputStyle}
          isDarkMode={isDarkMode}
        />

       

        <ColumnToggle
          className="flex-shrink-0"
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumn}
          disabledColumns={[]}
          isDarkMode={isDarkMode}
          columnLabels={{
            productName: 'Product Name',
            uom: 'UOM',
            convUnit: 'Conv Unit',
            quantity: 'Quantity',
            bonusQty: 'Bonus Qty',
            costPrice: 'Cost Price',
            saleTax: 'Sale Tax',
            totalCost: 'Total Cost',
            discount: 'Discount',
            netCost: 'Net Cost',
            actions: 'Actions',
          }}
        />
      </div>

      <InfiniteTable
        table={table}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onLoadMore={loadMoreWithCount}
        total={total}
        itemName="users"
        emptyComponent={
          <div className={`text-center py-8 ${theme.text.tertiary}`}>
            {searchTerm || activeFilter !== 'all' ? 'No purchase orders match your filters' : 'No purchase orders found'}
          </div>
        }
        loadingComponent={
          <div className={`flex items-center justify-center gap-2 py-4 ${theme.text.tertiary}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span>Loading purchase orders...</span>
          </div>
        }
        columnVisibility={columnVisibility}
        rows={searchTerm || activeFilter !== 'all' ? filteredData : undefined}
        className="max-h-[600px]"
        isDarkMode={isDarkMode}
      />
    </div>
  );
};