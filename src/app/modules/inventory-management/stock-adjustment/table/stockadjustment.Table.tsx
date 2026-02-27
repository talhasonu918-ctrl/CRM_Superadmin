import React, { useMemo } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { StockAdjustment } from '../types';

interface StockAdjustmentTableProps {
  adjustments: StockAdjustment[];
  isDarkMode: boolean;
  onEdit: (adj: StockAdjustment) => void;
  onDelete: (id: string) => void;
}

export const StockAdjustmentTable: React.FC<StockAdjustmentTableProps> = ({
  adjustments,
  isDarkMode,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo<ColumnDef<StockAdjustment>[]>(
    () => [
      {
        header: () => <span className="whitespace-nowrap uppercase">No</span>,
        accessorKey: 'adjustmentNo',
        size: 100,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-bold ${isDarkMode ? 'text-primary' : 'text-primary'}`}>
            {getValue() as string}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Date</span>,
        accessorKey: 'date',
        size: 120,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Type</span>,
        accessorKey: 'type',
        size: 110,
        cell: ({ getValue }) => {
          const type = getValue() as string;
          return (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
              type === 'Increase' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-red-500/10 text-red-500'
            }`}>
              {type === 'Increase' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {type}
            </div>
          );
        },
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Product</span>,
        accessorKey: 'productName',
        size: 250,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {getValue() as string}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Adjustment Qty</span>,
        accessorKey: 'adjustmentQty',
        size: 150,
        cell: ({ getValue, row }) => (
          <span className={`text-[13px] font-black ${row.original.type === 'Increase' ? 'text-emerald-500' : 'text-red-500'}`}>
            {row.original.type === 'Increase' ? '+' : '-'}{getValue() as number}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">New Stock</span>,
        accessorKey: 'newStock',
        size: 120,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Reason</span>,
        accessorKey: 'reason',
        size: 140,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {getValue() as string}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Remarks</span>,
        accessorKey: 'remarks',
        size: 200,
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium truncate  ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Actions</span>,
        id: 'actions',
        size: 80,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2 pr-4">
            <button
              onClick={() => onEdit(row.original)}
              className="p-2 rounded-xl text-slate-400 hover:text-primary transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [isDarkMode, onEdit, onDelete]
  );

  const { table, isLoading } = useInfiniteTable<StockAdjustment>({
    columns,
    data: adjustments,
    pageSize: adjustments.length || 10,
  });

  return (
    <div className={`rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} overflow-hidden`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={adjustments.length}
        noDataMessage="No adjustments found."
        itemName="adjustments"
      />
    </div>
  );
};

