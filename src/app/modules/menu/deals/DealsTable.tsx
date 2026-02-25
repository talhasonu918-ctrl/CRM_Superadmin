import React, { useMemo } from 'react';
import { Edit3, Trash2, Eye, Tag } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import InfiniteTable from '../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../hooks/useInfiniteTable';
import { Deal } from './types';

interface DealsTableProps {
  data: Deal[];
  isDarkMode: boolean;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
  onView: (deal: Deal) => void;
}

const DealsTable: React.FC<DealsTableProps> = ({ data, isDarkMode, onEdit, onDelete, onView }) => {
  const columns = useMemo<ColumnDef<Deal>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Deal Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Tag className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row.original.name}</div>
            <div className="text-xs text-slate-500 line-clamp-1">{row.original.displayName}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-bold text-primary">₹{(row.original.price ?? 0).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.original.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onView(row.original)} className="p-1.5 hover:bg-primary/10 rounded transition-colors" title="View Details">
            <Eye className="w-4 h-4 text-primary" />
          </button>
          <button onClick={() => onEdit(row.original)} className="p-1.5 hover:bg-primary/10 rounded transition-colors" title="Edit Deal">
            <Edit3 className="w-4 h-4 text-primary" />
          </button>
          <button onClick={() => onDelete(row.original.id)} className="p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Delete Deal">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ], [isDarkMode, onEdit, onDelete, onView]);

  const { table, isLoading } = useInfiniteTable<Deal>({
    columns,
    data,
    pageSize: 10,
  });

  return (
    <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} overflow-hidden shadow-sm`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={data.length}
        noDataMessage="No deals found. Create your first deal!"
      />
    </div>
  );
};

export default DealsTable;
