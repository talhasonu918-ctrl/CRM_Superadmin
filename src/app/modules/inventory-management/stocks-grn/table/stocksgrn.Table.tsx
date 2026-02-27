import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';

export interface GRNRow {
  id: string;
  productId: string;
  productName: string;
  uom: string;
  quantity: number;
  bonusQuantity: number;
  costPrice: number;
  totalCost: number;
  batchName: string;
}

export interface GRNEntry {
  id: string;
  grnNumber: string;
  supplier: string;
  date: string;
  totalItems: number;
  totalAmount: number;
  status: 'Draft' | 'Completed' | 'Cancelled';
  flowType?: 'purchase' | 'direct';
  invoiceNo?: string;
  location?: string;
  reason?: string;
  items?: GRNRow[];
  totalQuantity?: number;
  totalProducts?: number;
}

const mockGRNs: GRNEntry[] = [
  {
    id: '1',
    grnNumber: 'GRN-2024-001',
    supplier: 'Metro Wholesale',
    date: '2024-02-20',
    totalItems: 5,
    totalAmount: 25000.00,
    status: 'Completed',
  },
  {
    id: '2',
    grnNumber: 'GRN-2024-002',
    supplier: 'Al-Madina Traders',
    date: '2024-02-22',
    totalItems: 3,
    totalAmount: 12450.50,
    status: 'Draft',
  },
  {
    id: '3',
    grnNumber: 'GRN-2024-003',
    supplier: 'Nestle Pakistan',
    date: '2024-02-25',
    totalItems: 12,
    totalAmount: 85200.00,
    status: 'Completed',
  },
    {
    id: '4',
    grnNumber: 'GRN-2024-003',
    supplier: 'Yum foods',
    date: '2024-02-25',
    totalItems: 12,
    totalAmount: 85200.00,
    status: 'Completed',
  }
  ,
    {
    id: '5',
    grnNumber: 'GRN-2024-003',
    supplier: 'Nst trades',
    date: '2024-02-25',
    totalItems: 12,
    totalAmount: 85200.00,
    status: 'Completed',
  },
    {
    id: '6',
    grnNumber: 'GRN-2024-003',
    supplier: 'Fresh Waters',
    date: '2024-02-25',
    totalItems: 12,
    totalAmount: 85200.00,
    status: 'Completed',
  }
];

interface StocksGRNTableProps {
  isDarkMode: boolean;
  searchTerm: string;
  viewMode: 'list' | 'grid';
  onView?: (entry: GRNEntry) => void;
  onDelete?: (id: string) => void;
  data?: GRNEntry[];
}

export const StocksGRNTable: React.FC<StocksGRNTableProps> = ({ isDarkMode, searchTerm, viewMode, onView, onDelete, data = [] }) => {
  // Combine localStorage data with mock data - show both together
  const allData = [...(data || []), ...mockGRNs];

  const filteredData = useMemo(() => {
    return allData.filter(item =>
      item.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allData]);

  const columns = useMemo<ColumnDef<GRNEntry>[]>(() => [
    {
      accessorKey: 'grnNumber',
      header: 'Stock ID',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {row.original.grnNumber}
        </span>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.supplier}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.date}</span>,
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.items || [];
        if (items.length === 0) return <span className="text-xs text-slate-500">No items</span>;
        
        const itemNames = items.map(item => item.productName).join(', ');
        return (
          <span className="text-xs font-medium" title={itemNames}>
            {itemNames.length > 40 ? itemNames.substring(0, 40) + '...' : itemNames}
          </span>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <span className="text-xs font-bold">
          {row.original.totalAmount.toLocaleString()} PKR
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colors = {
          Completed: 'bg-emerald-500/10 text-emerald-500',
          Draft: 'bg-amber-500/10 text-amber-500',
          Cancelled: 'bg-red-500/10 text-red-500',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[status]}`}>
            {status}
          </span>
        );
      },
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

  const { table, isLoading } = useInfiniteTable<GRNEntry>({
    columns,
    data: filteredData,
    pageSize: 10,
  });

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition-all hover:shadow-md ${isDarkMode
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Stock ID
                    </p>
                    <p className="text-sm font-bold text-primary">{item.grnNumber}</p>
                  </div>
                  <div>
                    {(() => {
                      const colors = {
                        Completed: 'bg-emerald-500/10 text-emerald-500',
                        Draft: 'bg-amber-500/10 text-amber-500',
                        Cancelled: 'bg-red-500/10 text-red-500',
                      };
                      return (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[item.status]}`}>
                          {item.status}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Supplier
                  </p>
                  <p className="text-sm font-medium">{item.supplier}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Date
                    </p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Items
                    </p>
                    <p className="text-sm font-medium">{item.totalItems}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Total Amount
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {item.totalAmount.toLocaleString()} PKR
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onView?.(item)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${isDarkMode
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => onDelete?.(item.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${isDarkMode
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredData.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              No GRN entries found.
            </p>
          </div>
        )}
      </div>
    );
  }

  // List View (Table)
  return (
    <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-sm`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={filteredData.length}
        noDataMessage="No GRN entries found."
      />
    </div>
  );
};

