import { ColumnDef } from '@tanstack/react-table';
import { Order } from '../types';

interface OrderQueueColumnProps {
  onPayment?: (order: Order) => void;
  onMarkPaid?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onPrint?: (order: Order) => void;
}

export const orderQueueColumns = ({ 
  onPayment, 
  onMarkPaid, 
  onEdit, 
  onCancel, 
  onPrint 
}: OrderQueueColumnProps = {}): ColumnDef<Order>[] => [
  {
    accessorKey: 'orderNumber',
    header: 'Order No',
    size: 140,
    cell: ({ row }) => (
      <span className="text-blue-500 hover:underline cursor-pointer font-medium">
        {row.original.orderNumber}
      </span>
    ),
  },
  {
    accessorKey: 'staff',
    header: 'Staff',
    size: 100,
    cell: () => (
      <span className="text-sm text-gray-900 dark:text-white">G6</span>
    ),
  },
  {
    accessorKey: 'tableId',
    header: 'Table No',
    size: 100,
    cell: ({ row }) => (
      <span className="text-sm text-gray-900 dark:text-white">{row.original.tableId || '-'}</span>
    ),
  },
  {
    id: 'floor',
    header: 'Floor No',
    size: 100,
    cell: () => (
      <span className="text-sm text-gray-900 dark:text-white">Ground</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    size: 120,
    cell: ({ row }) => (
      <span className="text-sm capitalize text-gray-900 dark:text-white">
        {row.original.type.replace('-', ' ')}
      </span>
    ),
  },
  {
    id: 'quantityCount',
    header: 'Quantity Count',
    size: 130,
    cell: () => (
      <span className="text-sm text-gray-900 dark:text-white">0.00</span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    size: 120,
    cell: ({ row }) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {row.original.customerName || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    size: 100,
    cell: ({ row }) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {row.original.discount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'grandTotal',
    header: 'Net Sale',
    size: 120,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {row.original.grandTotal.toFixed(2)}
      </span>
    ),
  },
  {
    id: 'paid',
    header: 'Paid',
    size: 100,
    cell: () => (
      <span className="text-sm text-gray-900 dark:text-white">0.00</span>
    ),
  },
  {
    accessorKey: 'cashBack',
    header: 'Cashback',
    size: 100,
    cell: ({ row }) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {row.original.cashBack.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    size: 150,
    cell: ({ row }) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {row.original.createdAt}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 140,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        ready: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        served: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      };
      
      const statusLabels = {
        ready: 'Ready/ForPickup',
        pending: 'InProgress',
        preparing: 'InProgress',
        served: 'Served',
        cancelled: 'Cancelled',
      };

      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 450,
    cell: ({ row }) => (
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onPayment?.(row.original)}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-medium"
        >
          Payment
        </button>
        <button
          onClick={() => onMarkPaid?.(row.original)}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-medium"
        >
          Mark Paid
        </button>
        <button
          onClick={() => onEdit?.(row.original)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onCancel?.(row.original)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => onPrint?.(row.original)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
        >
          Invoice Print
        </button>
      </div>
    ),
  },
];
