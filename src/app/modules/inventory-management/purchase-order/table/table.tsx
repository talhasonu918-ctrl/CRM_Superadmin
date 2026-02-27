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
import { PurchaseOrderForm } from '../form/AddPerchaseOrder';
import { DeleteUserConfirm } from '../form/DeleteUserConfirm';
import { getThemeColors } from '../../../../../theme/colors';
import { TbFileUpload } from "react-icons/tb";


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
    { id: 1, productName: 'Product A', uom: 'kg', convUnit: 1, quantity: 10, bonusQty: 2, costPrice: 100, saleTax: 10, totalCost: 1010, discount: 50, netCost: 960, supplier: 'Supplier A' },
    { id: 2, productName: 'Product B', uom: 'liters', convUnit: 1, quantity: 5, bonusQty: 0, costPrice: 50, saleTax: 5, totalCost: 255, discount: 0, netCost: 255, supplier: 'Supplier B' },
    { id: 3, productName: 'Product C', uom: 'pcs', convUnit: 1, quantity: 20, bonusQty: 1, costPrice: 30, saleTax: 3, totalCost: 633, discount: 20, netCost: 613, supplier: 'Supplier C' },
    { id: 4, productName: 'Product D', uom: 'kg', convUnit: 1, quantity: 15, bonusQty: 3, costPrice: 80, saleTax: 8, totalCost: 1232, discount: 40, netCost: 1192, supplier: 'Supplier D' },
    { id: 5, productName: 'Product E', uom: 'liters', convUnit: 1, quantity: 8, bonusQty: 0, costPrice: 60, saleTax: 6, totalCost: 528, discount: 10, netCost: 518, supplier: 'Supplier E' },
    { id: 6, productName: 'Product F', uom: 'pcs', convUnit: 1, quantity: 50, bonusQty: 5, costPrice: 20, saleTax: 2, totalCost: 1100, discount: 100, netCost: 1000, supplier: 'Supplier F' },
    { id: 7, productName: 'Product G', uom: 'kg', convUnit: 1, quantity: 25, bonusQty: 2, costPrice: 90, saleTax: 9, totalCost: 2349, discount: 150, netCost: 2199, supplier: 'Supplier G' },
    { id: 8, productName: 'Product H', uom: 'liters', convUnit: 1, quantity: 12, bonusQty: 1, costPrice: 70, saleTax: 7, totalCost: 924, discount: 50, netCost: 874, supplier: 'Supplier H' },
    { id: 9, productName: 'Product I', uom: 'pcs', convUnit: 1, quantity: 30, bonusQty: 3, costPrice: 40, saleTax: 4, totalCost: 1242, discount: 60, netCost: 1182, supplier: 'Supplier I' },
    { id: 10, productName: 'Product J', uom: 'kg', convUnit: 1, quantity: 18, bonusQty: 2, costPrice: 110, saleTax: 11, totalCost: 2118, discount: 100, netCost: 2018, supplier: 'Supplier J' },
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
    // Do not provide a default onLoadMore here - avoid auto-loading mock data.
    // Provide `onLoadMore` from higher-level code if real pagination is required.
  });

  // If a remote loader is supplied, use `loadMore()` from the hook; otherwise pagination will be disabled.

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
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

  <h4 className={`text-lg font-semibold tracking-tight ${theme.text.primary}`}>
    View Purchase Orders
  </h4>
<div className="flex items-center gap-2">
  
  <Button
    onClick={() => setIsAddOpen(true)}
    className={`h-10 w-full whitespace-nowrap sm:w-auto rounded-lg ${theme.button.primary}`}
  >
    + Add Purchase Order
  </Button>

  <Button
    onClick={() => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,application/pdf'; // Accept images and PDFs
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log('Selected file:', file);
          // Add logic to process the file here
        }
      };
      fileInput.click();
    }}
    className={`h-10  w-full sm:w-auto whitespace-nowrap rounded-lg flex items-center gap-2 ${theme.button.primary}`}
  >
    <TbFileUpload size={20} />
    Smart Import
  </Button>
</div>

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
        <PurchaseOrderForm
          initialData={selectedPO}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>

      {/* View Modal */}
      <ReusableModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="View Purchase Order"
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6">
          {/* Product Details Section */}
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Product Name</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.productName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">UOM</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.uom}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Conv Unit</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.convUnit}</p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Cost Price</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.costPrice}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sale Tax</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.saleTax}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Discount</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.discount}</p>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.quantity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bonus Qty</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.bonusQty}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.totalCost}</p>
            </div>
           
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Cost</p>
              <p className="text-2xl font-semibold text-blue-600">{selectedPO?.netCost}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Supplier</p>
              <p className={`text-base ${theme.text.primary}`}>{selectedPO?.supplier}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsViewOpen(false)} className={`h-10 rounded-lg ${theme.button.primary}`}>
              Close
            </Button>
          </div>
        </div>
      </ReusableModal>

      {/* Delete Modal */}
      <ReusableModal
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
        onLoadMore={undefined}
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
