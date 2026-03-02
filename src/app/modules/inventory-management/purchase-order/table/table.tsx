import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Select, Button } from 'rizzui';
import { useForm, Controller } from 'react-hook-form';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { GridView, ViewToggle } from '../../../../../components/GridView';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { userColumns } from './columns';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { PurchaseOrderForm } from '../form/AddPerchaseOrder';
import { DeleteUserConfirm } from '../form/DeleteUserConfirm';
import { getThemeColors } from '../../../../../theme/colors';
import { TbFileUpload } from 'react-icons/tb';

interface UserTableProps {
  isDarkMode: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);
  const cardStyle = `rounded-xl shadow-sm  ${theme.neutral.background}`;
  const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const handleViewModeChange = (mode: 'grid' | 'list') => setViewMode(mode);

  const { control, watch } = useForm({ defaultValues: { searchTerm: '', activeFilter: 'all' } });
  const searchTerm = watch('searchTerm');

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

  // modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  const handleEdit = (po: any) => { setSelectedPO(po); setIsEditOpen(true); };
  const handleView = (po: any) => { setSelectedPO(po); setIsViewOpen(true); };
  const handleDelete = (po: any) => { setSelectedPO(po); setIsDeleteOpen(true); };

  const columns = useMemo(
    () => userColumns({ onEdit: handleEdit, onView: handleView, onDelete: (id: any) => { setSelectedPO({ id }); setIsDeleteOpen(true); }, isDarkMode }),
    [isDarkMode]
  );

  // sample data (10 entries)
  const samplePurchaseOrders = [
    { id: 'PO-1001', productName: 'Whole Wheat Flour', uom: 'kg', convUnit: 1, quantity: 10, bonusQty: 0, costPrice: 120, saleTax: 12, totalCost: 1230, discount: 0, netCost: 1230, supplier: 'Yum Foods', date: '2026-02-27', totalItems: 1, totalAmount: 121 },
    { id: 'PO-1002', productName: 'Canned Beans', uom: 'pcs', convUnit: 1, quantity: 20, bonusQty: 2, costPrice: 50, saleTax: 5, totalCost: 1100, discount: 20, netCost: 1080, supplier: 'Supplier B', date: '2026-02-20', totalItems: 2, totalAmount: 500 },
    { id: 'PO-1003', productName: 'Tomato Paste', uom: 'pcs', convUnit: 1, quantity: 15, bonusQty: 1, costPrice: 80, saleTax: 8, totalCost: 1230, discount: 10, netCost: 1220, supplier: 'Metro Wholesale', date: '2026-02-18', totalItems: 3, totalAmount: 980 },
    { id: 'PO-1004', productName: 'Milk Powder', uom: 'kg', convUnit: 1, quantity: 8, bonusQty: 0, costPrice: 400, saleTax: 40, totalCost: 3520, discount: 100, netCost: 3420, supplier: 'Dairy Supplies', date: '2026-01-30', totalItems: 4, totalAmount: 3420 },
    { id: 'PO-1005', productName: 'Sugar', uom: 'kg', convUnit: 1, quantity: 25, bonusQty: 0, costPrice: 90, saleTax: 9, totalCost: 2275, discount: 25, netCost: 2250, supplier: 'Sweet Traders', date: '2026-02-10', totalItems: 6, totalAmount: 2250 },
    { id: 'PO-1006', productName: 'Salt', uom: 'kg', convUnit: 1, quantity: 30, bonusQty: 0, costPrice: 30, saleTax: 3, totalCost: 930, discount: 0, netCost: 930, supplier: 'Oceanic Salts', date: '2026-02-05', totalItems: 7, totalAmount: 930 },
    { id: 'PO-1007', productName: 'Cooking Oil', uom: 'liters', convUnit: 1, quantity: 12, bonusQty: 0, costPrice: 550, saleTax: 55, totalCost: 7260, discount: 200, netCost: 7060, supplier: 'Oil Co', date: '2026-02-12', totalItems: 8, totalAmount: 7060 },
    { id: 'PO-1008', productName: 'Rice', uom: 'kg', convUnit: 1, quantity: 40, bonusQty: 2, costPrice: 180, saleTax: 18, totalCost: 7440, discount: 120, netCost: 7320, supplier: 'Grain Hub', date: '2026-02-01', totalItems: 9, totalAmount: 7320 },
    { id: 'PO-1009', productName: 'Tea', uom: 'kg', convUnit: 1, quantity: 6, bonusQty: 0, costPrice: 800, saleTax: 80, totalCost: 5280, discount: 50, netCost: 5230, supplier: 'Tea Brokers', date: '2026-01-25', totalItems: 2, totalAmount: 5230 },
    { id: 'PO-1010', productName: 'Spices Mix', uom: 'kg', convUnit: 1, quantity: 18, bonusQty: 1, costPrice: 220, saleTax: 22, totalCost: 4032, discount: 32, netCost: 4000, supplier: 'Spice Importers', date: '2026-02-15', totalItems: 5, totalAmount: 4000 },
  ];

  const [users, setUsers] = useState<any[]>(() => samplePurchaseOrders as any[]);

  const { table, isLoading, hasNextPage, loadMore } = useInfiniteTable<any>({ columns, data: users, pageSize: 10 });

  const filteredData = useMemo(() => {
    if (!table?.getRowModel) return users;
    if (!searchTerm) return users;
    const s = String(searchTerm).toLowerCase();
    return users.filter(u => (u.productName || '').toLowerCase().includes(s) || (u.supplier || '').toLowerCase().includes(s));
  }, [users, table, searchTerm]);

  const toggleColumn = (columnId: string) => setColumnVisibility(prev => ({ ...prev, [columnId]: !prev[columnId] }));

  const handleAddSubmit = (data: any) => { const newPO = { ...data, id: `PO-${Date.now()}` }; setUsers(prev => [newPO, ...prev]); setIsAddOpen(false); };
  const handleEditSubmit = (data: any) => { setUsers(prev => prev.map(po => po.id === selectedPO?.id ? { ...po, ...data } : po)); setIsEditOpen(false); setSelectedPO(null); };
  const handleDeleteConfirm = () => { setUsers(prev => prev.filter(po => po.id !== selectedPO?.id)); setIsDeleteOpen(false); setSelectedPO(null); };

  return (
    <div className={cardStyle}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-4 mb-6">
        <h4 className={`text-lg font-semibold tracking-tight ${theme.text.primary}`}>View Purchase Orders</h4>
       <div className="flex  justify-center sm:flex-nowrap items-center  gap-2">
  <Button
    onClick={() => setIsAddOpen(true)}
    className={`h-8 px-3 text-xs  sm:text-sm whitespace-nowrap sm:h-10 sm:w-auto rounded-lg ${theme.button.primary}`}
  >
    + Add Purchase Order
  </Button>

  <Button
    onClick={() => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,application/pdf';
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) console.log('Selected file:', file);
      };
      fileInput.click();
    }}
    className={`h-8 px-3  text-xs sm:text-sm whitespace-nowrap sm:h-10 sm:w-auto rounded-lg flex items-center gap-1 ${theme.button.primary}`}
  >
    <TbFileUpload size={16} /> Smart Import
  </Button>
</div>
      </div>

      {/* Add Modal */}
      <ReusableModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Purchase Order" size="lg" isDarkMode={isDarkMode}>
        <PurchaseOrderForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} isDarkMode={isDarkMode} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Purchase Order" size="lg" isDarkMode={isDarkMode}>
        <PurchaseOrderForm initialData={selectedPO} onSubmit={handleEditSubmit} onCancel={() => setIsEditOpen(false)} isDarkMode={isDarkMode} />
      </ReusableModal>

      {/* View Modal */}
      <ReusableModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="View Purchase Order" size="lg" isDarkMode={isDarkMode}>
        <div className="space-y-6">
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
            <Button onClick={() => setIsViewOpen(false)} className={`h-10 rounded-lg ${theme.button.primary}`}>Close</Button>
          </div>
        </div>
      </ReusableModal>

      {/* Delete Modal */}
      <ReusableModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Purchase Order" size="sm" isDarkMode={isDarkMode}>
        <DeleteUserConfirm userData={selectedPO} onConfirm={handleDeleteConfirm} onCancel={() => setIsDeleteOpen(false)} />
      </ReusableModal>


      <div className="flex items-center gap-4 mb-6 flex-nowrap">
        <div className="flex-1 min-w-0">
          <SearchInput control={control} placeholder="Search purchase orders..." inputStyle={inputStyle} isDarkMode={isDarkMode} />
        </div>
        <div className="ml-2 flex-shrink-0"><ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} isDarkMode={isDarkMode} /></div>
      </div>

      {viewMode === 'grid' ? (
        <GridView
          isDarkMode={isDarkMode}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          items={users.map(u => ({ id: String(u.id), name: u.productName, title: u.supplier, icon: () => <Edit size={18} />, original: u }))}
          renderCustomCard={(item) => {
            const r = item.original || item;
            const format = (v: any) => (v !== undefined && v !== null ? v : '—');
            const amount = r.netCost ?? r.totalCost ?? 0;

            return (
              <div key={r.id} className={`rounded-xl border p-4 transition-all hover:shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stock ID</p>
                      <p className="text-sm font-bold text-primary">{r.id}</p>
                    </div>
                    <div>
                      {(() => {
                        const colors: Record<string, string> = { Completed: 'bg-emerald-500/10 text-emerald-500', Draft: 'bg-amber-500/10 text-amber-500', Cancelled: 'bg-red-500/10 text-red-500' };
                        return <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[r.status] || ''}`}>{r.status ?? ''}</span>;
                      })()}
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Supplier</p>
                    <p className="text-sm font-medium">{format(r.supplier)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Product Name</p>
                      <p className="text-xs text-slate-500">{format(r.productName)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>UOM</p>
                      <p className="text-xs text-slate-500">{format(r.uom)}</p>
                    </div>

                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quantity</p>
                      <p className="text-sm font-medium">{format(r.quantity)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bonus Qty</p>
                      <p className="text-sm font-medium">{format(r.bonusQty ?? r.bonusQuantity)}</p>
                    </div>

                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Cost Price</p>
                      <p className="text-sm text-slate-500">{format(r.costPrice)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Sale Tax</p>
                      <p className="text-sm text-slate-500">{format(r.saleTax)}</p>
                    </div>

                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Cost</p>
                      <p className="text-sm text-slate-500">{format(r.totalCost)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Discount</p>
                      <p className="text-sm text-slate-500">{format(r.discount)}</p>
                    </div>

                    <div>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Net Cost</p>
                      <p className="text-sm font-bold text-emerald-600">{format(r.netCost)}</p>
                    </div>
                  </div>

                  {/* <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Amount</p>
                    <p className="text-sm font-bold text-emerald-600">{Number(amount).toLocaleString()} PKR</p>
                  </div> */}

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleEdit(r)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${isDarkMode ? 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/50' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}>
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(r)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          showHeaderToggle={false}
        />
      ) : (
        <InfiniteTable
          table={table}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          onLoadMore={loadMore}
          itemName="purchase orders"
          emptyComponent={<div className={`text-center py-8 ${theme.text.tertiary}`}>{searchTerm ? 'No purchase orders match your search' : 'No purchase orders found'}</div>}
          loadingComponent={<div className={`flex items-center justify-center gap-2 py-4 ${theme.text.tertiary}`}><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div><span>Loading purchase orders...</span></div>}
          columnVisibility={columnVisibility}
          rows={searchTerm ? filteredData : undefined}
          className="max-h-[600px]"
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default UserTable;
