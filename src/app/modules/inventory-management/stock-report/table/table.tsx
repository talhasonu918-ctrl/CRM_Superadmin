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
// import { PurchaseOrderForm } from '../form/AddPerchaseOrder';
// import { DeleteUserConfirm } from '../form/DeleteUserConfirm';
import { getThemeColors } from '../../../../../theme/colors';

interface UserTableProps {
  isDarkMode: boolean;
  onAddUser?: () => void;
  onEditUser?: (user: any) => void;
  onViewUser?: (user: any) => void;
  onDeleteUser?: (user: any) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ isDarkMode, onAddUser, onEditUser, onViewUser, onDeleteUser }) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl shadow-sm p-8 ${theme.neutral.background}`;
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

  const columns = useMemo(
    () => userColumns({
      onEdit: handleEdit,
      onView: handleView,
      onDelete: handleDelete,
      isDarkMode
    }),
    [isDarkMode]
  );

  // Use state for table data; initialize with sample purchase orders
  const samplePurchaseOrders = [
    { id: 1, productName: 'Product A', uom: 'kg', convUnit: 1, quantity: 10, bonusQty: 2, costPrice: 100, saleTax: 10, totalCost: 1010, discount: 50, netCost: 960 },
    { id: 2, productName: 'Product B', uom: 'liters', convUnit: 1, quantity: 5, bonusQty: 0, costPrice: 50, saleTax: 5, totalCost: 255, discount: 0, netCost: 255 },
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
      // Adapted to handle PO structure if needed
      return more;
    },
  });

  // Custom load more with count tracking
  const loadMoreWithCount = async () => {
    await loadMore();
    setLoadedCount(prev => Math.min(prev + 10, total));
  };

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

    return filtered;
  }, [table, searchTerm]);

  const toggleColumn = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleAddSubmit = (data: any) => {
    const newPO = { ...data, id: Date.now() };
    setUsers(prev => [newPO, ...prev]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (data: any) => {
    setUsers(prev => prev.map(po => po.id === selectedPO.id ? { ...po, ...data } : po));
    setIsEditOpen(false);
    setSelectedPO(null);
  };

  const handleDeleteConfirm = () => {
    setUsers(prev => prev.filter(po => po.id !== selectedPO.id));
    setIsDeleteOpen(false);
    setSelectedPO(null);
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

      {/* Add Modal */}
      <ReusableModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Purchase Order"
        size="lg"
        isDarkMode={isDarkMode}
      >
        <PurchaseOrderForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} isDarkMode={isDarkMode} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Purchase Order"
        size="lg"
        isDarkMode={isDarkMode}
      >
        {/* <PurchaseOrderForm
          initialData={selectedPO}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          isDarkMode={isDarkMode}
        /> */}
      </ReusableModal>

      {/* View Modal */}
      {/* <ReusableModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="View Purchase Order"
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(selectedPO || {}).map(([key, value]) => (
              key !== 'id' && (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className={`text-base ${theme.text.primary}`}>{String(value)}</p>
                </div>
              )
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsViewOpen(false)} className={`h-10 rounded-lg ${theme.button.primary}`}>
              Close
            </Button>
          </div>
        </div>
      </ReusableModal> */}

      {/* Delete Modal */}
      {/* <ReusableModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Purchase Order"
        size="sm"
        isDarkMode={isDarkMode}
      >
        <DeleteUserConfirm
          userData={selectedPO}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </ReusableModal> */}

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
        rows={searchTerm ? filteredData : undefined}
        className="max-h-[600px]"
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
