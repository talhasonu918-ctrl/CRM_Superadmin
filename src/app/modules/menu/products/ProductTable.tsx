import React, { useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { createColumnHelper, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import InfiniteTable from '../../../../components/InfiniteTable';
import { Product } from './types';

interface ProductTableProps {
  data: Product[];
  isDarkMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ data, isDarkMode, onEdit, onDelete }) => {
  const columnHelper = createColumnHelper<Product>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            {info.row.original.image && (
              <img
                src={info.row.original.image}
                alt={info.getValue()}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {info.getValue()}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {info.row.original.barCode}
              </div>
            </div>
          </div>
        ),
        size: 250,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <div>
            <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {info.getValue()}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {info.row.original.subCategory}
            </div>
          </div>
        ),
        size: 150,
      }),
      columnHelper.accessor('supplier', {
        header: 'Supplier',
        cell: (info) => (
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {info.getValue()}
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className={`font-semibold text-primary`}>
            ${info.getValue().toFixed(2)}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => (
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {info.getValue()} units
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('available', {
        header: 'Status',
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue()
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
              }`}
          >
            {info.getValue() ? 'Available' : 'Out of Stock'}
          </span>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(info.row.original)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'hover:bg-slate-700 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
                }`}
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(info.row.original.id)}
              className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [isDarkMode, onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      <InfiniteTable
        table={table}
        isDarkMode={isDarkMode}
        total={data.length}
        noDataMessage="No products found."
      />
    </div>
  );
};

export default ProductTable;
