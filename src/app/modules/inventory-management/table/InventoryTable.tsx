'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Package, MoreVertical, Eye, Edit, Trash2, Info } from 'lucide-react';
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import InfiniteTable from '@/src/components/InfiniteTable';
import type { InventoryItem } from '@/src/app/modules/pos/mockData';

const columnHelper = createColumnHelper<InventoryItem>();

interface InventoryTableProps {
  isDarkMode: boolean;
  data: InventoryItem[];
  total: number;
  itemName?: string;
  onView: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  isDarkMode,
  data,
  total,
  itemName = 'products',
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      id: 'product',
      header: 'Product',
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={16} className="text-slate-400" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-xs sm:text-sm text-inherit truncate">{info.getValue()}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onView(item); }}
                  className="text-slate-400 hover:text-primary transition-colors"
                  title="View Details"
                >
                  {/* <Info size={14} /> */}
                </button>
              </div>
              {item.isPopular && (
                <div className="flex flex-wrap gap-1 mt-0.5 sm:mt-1">
                  <span className="px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Popular
                  </span>
                  {(item.salesCount || 0) > 100 && (
                    <span className="px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      Top Seller
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: 'Category',
      cell: (info) => <span className="text-xs sm:text-sm text-inherit">{info.getValue()}</span>,
      size: 130,
    }),
    columnHelper.accessor('stock', {
      id: 'stock',
      header: 'Stock',
      cell: (info) => <span className="text-xs sm:text-sm font-medium text-inherit">{info.getValue()}</span>,
      size: 80,
    }),
    columnHelper.accessor('minStock', {
      id: 'minStock',
      header: 'Min. Stock',
      cell: (info) => <span className="text-xs sm:text-sm text-inherit">{info.getValue()}</span>,
      size: 100,
    }),
    columnHelper.accessor('price', {
      id: 'price',
      header: 'Price',
      cell: (info) => <span className="text-xs sm:text-sm text-inherit whitespace-nowrap">Rs. {info.getValue()}</span>,
      size: 100,
    }),
    columnHelper.accessor('sales', {
      id: 'sales',
      header: 'Sales',
      cell: (info) => <span className="text-xs sm:text-sm text-inherit whitespace-nowrap">Rs. {(info.getValue() || 0).toLocaleString()}</span>,
      size: 110,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as 'In Stock' | 'Low Stock' | 'Out of Stock';
        const statusStyles: Record<'In Stock' | 'Low Stock' | 'Out of Stock', string> = {
          'In Stock': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          'Low Stock': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          'Out of Stock': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        };
        return (
          <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px]  sm:whitespace-nowrap sm:text-xs font-bold border ${statusStyles[status]}`}>
            {status}
          </span>
        );
      },
      size: 110,
    }),
    columnHelper.accessor('lastUpdated', {
      id: 'lastUpdated',
      header: 'Date',
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-slate-400">-</span>;
        return (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{val}</span>
          </div>
        );
      },
      size: 120,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setIsOpen(false);
            }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const textStyle = isDarkMode ? 'text-white' : 'text-slate-900';

        return (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
              className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
            >
              <MoreVertical size={16} className="text-slate-400" />
            </button>

            {isOpen && (
              <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-xl border z-50 overflow-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
              }`}>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); onView(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${textStyle}`}
                >
                  <Eye size={14} className="text-slate-400" /> View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${textStyle}`}
                >
                  <Edit size={14} className="text-slate-400" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-900/20 transition-colors`}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        );
      },
      size: 80,
    }),
  ], [isDarkMode, onView, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`rounded-xl border shadow-sm transition-all overflow-hidden ${
      isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'
    }`}>
      <InfiniteTable
        table={table}
        isDarkMode={isDarkMode}
        total={total}
        itemName={itemName}
        noDataMessage="No products found. Add your first product to get started."
      />
    </div>
  );
};

export default InventoryTable;
