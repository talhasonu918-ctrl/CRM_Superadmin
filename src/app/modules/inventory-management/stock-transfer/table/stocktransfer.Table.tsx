import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';

export interface StockTransferEntry {
  id: string;
  documentNo: string;
  productNames: string;
  date: string;
  locationFrom: string;
  locationTo: string;
  totalQuantity: number;
  totalProducts: number;
  totalValue: number;
}

interface StockTransferTableProps {
  isDarkMode: boolean;
  searchTerm: string;
  data: StockTransferEntry[];
  onView?: (entry: StockTransferEntry) => void;
  onDelete?: (id: string) => void;
}

export const StockTransferTable: React.FC<StockTransferTableProps> = ({ isDarkMode, searchTerm, data, onView, onDelete }) => {
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationTo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const columns = useMemo<ColumnDef<StockTransferEntry>[]>(() => [
    {
      accessorKey: 'documentNo',
      header: 'Document No',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {row.original.documentNo}
        </span>
      ),
    },
    {
      accessorKey: 'productNames',
      header: 'Product Names',
      cell: ({ row }) => <span className="text-xs text-slate-700">{row.original.productNames}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.date}</span>,
    },
    {
      accessorKey: 'locationFrom',
      header: 'Location From',
      cell: ({ row }) => <span className="text-xs">{row.original.locationFrom}</span>,
    },
    {
      accessorKey: 'locationTo',
      header: 'Location To',
      cell: ({ row }) => <span className="text-xs">{row.original.locationTo}</span>,
    },
    {
      accessorKey: 'totalQuantity',
      header: 'Total Quantity',
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.totalQuantity}</span>,
    },
    {
      accessorKey: 'totalProducts',
      header: 'Total Product',
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.totalProducts}</span>,
    },
    {
      accessorKey: 'totalValue',
      header: 'Total Value',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-emerald-600">
          {row.original.totalValue.toLocaleString()} PKR
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(row.original)}
            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            title="View"
          >
            <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete?.(row.original.id)}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      ),
    },
  ], [onView, onDelete]);

  const { table } = useInfiniteTable({
    columns,
    data: filteredData,
    pageSize: 10,
  });

  return (
    <div className={`rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white'}`}>
      <InfiniteTable
        table={table}
        isDarkMode={isDarkMode}
        total={filteredData.length}
        itemName="transfers"
      />
    </div>
  );
};

export default StockTransferTable;
