import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText,
  BadgeInfo
} from 'lucide-react';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { StockMovement } from '../types';

interface StockMovementReportTableProps {
  movements: StockMovement[];
  isDarkMode: boolean;
  isLoading?: boolean;
}

export const StockMovementReportTable: React.FC<StockMovementReportTableProps> = ({
  movements,
  isDarkMode,
  isLoading = false
}) => {
  const columns = useMemo<ColumnDef<StockMovement>[]>(
    () => [
      {
        header: () => <span className="whitespace-nowrap uppercase">Date</span>,
        accessorKey: 'date',
        cell: ({ getValue }) => (
          <div className="flex flex-col">
            <span className="font-bold text-xs">{getValue() as string}</span>
          </div>
        ),
        size: 120,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Product Details</span>,
        accessorKey: 'productName',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-black text-sm uppercase">{row.original.productName}</span>
            <span className="text-[10px] text-slate-400 font-bold">PID: {row.original.productId}</span>
          </div>
        ),
        size: 220,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Type</span>,
        accessorKey: 'transactionType',
        cell: ({ getValue }) => {
          const type = getValue() as string;
          const colors: Record<string, string> = {
            'Adjustment': 'text-blue-500 bg-blue-500/10',
            'GRN': 'text-emerald-500 bg-emerald-500/10',
            'Sale': 'text-purple-500 bg-purple-500/10',
            'Transfer': 'text-orange-500 bg-orange-500/10',
            'Variance': 'text-red-500 bg-red-500/10',
          };
          return (
            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${colors[type] || 'text-slate-500 bg-slate-100'}`}>
              {type}
            </span>
          );
        },
        size: 120,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Ref No</span>,
        accessorKey: 'referenceNo',
        cell: ({ getValue }) => (
          <span className="font-black text-xs text-primary">{getValue() as string}</span>
        ),
        size: 120,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase text-emerald-500">In</span>,
        accessorKey: 'quantityIn',
        cell: ({ getValue }) => {
          const val = getValue() as number;
          return val > 0 ? (
            <div className="flex items-center gap-1 text-emerald-600 font-black">
              <ArrowUpRight size={14} />
              <span>{val}</span>
            </div>
          ) : <span className="text-slate-300">-</span>;
        },
        size: 100,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase text-red-500">Out</span>,
        accessorKey: 'quantityOut',
        cell: ({ getValue }) => {
          const val = getValue() as number;
          return val > 0 ? (
            <div className="flex items-center gap-1 text-red-600 font-black">
              <ArrowDownRight size={14} />
              <span>{val}</span>
            </div>
          ) : <span className="text-slate-300">-</span>;
        },
        size: 100,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Opening</span>,
        accessorKey: 'openingBalance',
        cell: ({ getValue }) => <span className="font-bold text-slate-500">{getValue() as number}</span>,
        size: 100,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Closing</span>,
        accessorKey: 'closingBalance',
        cell: ({ getValue }) => <span className="font-black text-slate-900 dark:text-white">{getValue() as number}</span>,
        size: 100,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Location</span>,
        accessorKey: 'location',
        cell: ({ getValue }) => <span className="font-bold text-xs uppercase">{getValue() as string}</span>,
        size: 150,
      },
      {
        header: () => <span className="whitespace-nowrap uppercase">Remarks</span>,
        accessorKey: 'remarks',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-500  max-w-xs truncate block" title={getValue() as string}>
            {getValue() as string || '-'}
          </span>
        ),
        size: 200,
      },
    ],
    []
  );

  const { table } = useInfiniteTable({
    data: movements,
    columns,
  });

  return (
    <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} overflow-hidden`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={movements.length}
        noDataMessage="No stock movements recorded."
        itemName="movements"
      />
    </div>
  );
};

