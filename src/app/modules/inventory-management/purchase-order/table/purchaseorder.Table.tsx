import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import InfiniteTable, { TableColumn } from '@/src/components/InfiniteTable';

interface PurchaseOrder {
  productName: string;
  uom: string;
  convUnit: number;
  quantity: number;
  bonusQty: number;
  costPrice: number;
  saleTax: number;
  totalCost: number;
  discount: number;
  netCost: number;
}

interface PurchaseOrderTableProps {
  data?: PurchaseOrder[];
  onAddOrder: () => void;
  onEditOrder: (order: PurchaseOrder) => void;
  onViewOrder: (order: PurchaseOrder) => void;
  onDeleteOrder: (order: PurchaseOrder) => void;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  data = [],
  onAddOrder,
  onEditOrder,
  onViewOrder,
  onDeleteOrder,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const columns = useMemo<TableColumn<PurchaseOrder>[]>(
    () => [
      { id: 'productName', header: 'Product Name', accessorKey: 'productName' },
      { id: 'uom', header: 'UOM', accessorKey: 'uom' },
      { id: 'convUnit', header: 'Conv Unit', accessorKey: 'convUnit' },
      { id: 'quantity', header: 'Quantity', accessorKey: 'quantity' },
      { id: 'bonusQty', header: 'Bonus Qty', accessorKey: 'bonusQty' },
      { id: 'costPrice', header: 'Cost Price', accessorKey: 'costPrice' },
      { id: 'saleTax', header: 'Sale Tax', accessorKey: 'saleTax' },
      { id: 'totalCost', header: 'Total Cost', accessorKey: 'totalCost' },
      { id: 'discount', header: 'Discount', accessorKey: 'discount' },
      { id: 'netCost', header: 'Net Cost', accessorKey: 'netCost' },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row: PurchaseOrder) => row.productName, // Added explicit type for row
    getCoreRowModel: getCoreRowModel(), // Added required property
  });

  const handleAddPurchaseOrder = () => {
    onAddOrder();
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    onEditOrder(order);
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    onViewOrder(order);
  };

  const handleDeleteOrder = (order: PurchaseOrder) => {
    onDeleteOrder(order);
  };

  return (
    <div className="purchase-order-table">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Purchase Orders</h2>
        <button
          onClick={handleAddPurchaseOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + Add Purchase Order
        </button>
      </div>
      <InfiniteTable
        table={table}
        total={data.length}
        itemName="Purchase Orders"
        rows={table.getRowModel().rows}
        isDarkMode={false} // Adjust based on theme
      />
    </div>
  );
};

export default PurchaseOrderTable;
