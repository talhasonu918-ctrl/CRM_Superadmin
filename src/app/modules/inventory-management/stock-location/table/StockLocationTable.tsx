import React, { useMemo, useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { StockLocation } from '../../../pos/mockData';

interface StockLocationTableProps {
  data: StockLocation[];
  isDarkMode: boolean;
  onEdit: (location: StockLocation) => void;
  onDelete: (id: string) => void;
  onView: (location: StockLocation) => void;
}

export const StockLocationTable: React.FC<StockLocationTableProps> = ({
  data,
  isDarkMode,
  onEdit,
  onDelete,
  onView
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns = useMemo<ColumnDef<StockLocation>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const parent = data.find(loc => loc.id === row.original.parentId);
        return (
          <div className="flex flex-col">
            {parent && (
              <span className={`text-[10px] uppercase tracking-tighter font-bold mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {parent.name} ›
              </span>
            )}
            <span className={`text-sm font-medium ${parent ? 'translate-x-1 border-l-2 border-primary/20 pl-2' : ''}`}>
              {row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'categoryName',
      header: 'Category Name',
      cell: ({ row }) => {
        const categories = row.original.categoryName;
        const items = row.original.stockItems?.map(i => i.itemName).join(', ');
        return (
          <span className="text-xs  text-slate-500 max-w-[500px] inline-block break-words">
            {categories || items || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.createdAt}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end pr-4">
          <div className="relative" ref={openMenuId === row.original.id ? menuRef : null}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === row.original.id ? null : row.original.id);
              }}
              className={`p-1 rounded-lg hover:bg-slate-100 ${isDarkMode ? 'hover:bg-slate-800' : ''}`}
            >
              <MoreVertical size={16} className="text-slate-400" />
            </button>
            {openMenuId === row.original.id && (
              <div className={`absolute right-0 top-full mt-1 w-32 z-50 rounded-lg shadow-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                <button
                  onClick={() => {
                    onView(row.original);
                    setOpenMenuId(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors rounded-t-lg`}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => {
                    onEdit(row.original);
                    setOpenMenuId(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors`}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(row.original.id);
                    setOpenMenuId(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 transition-colors rounded-b-lg`}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ], [isDarkMode, onEdit, onDelete, onView, openMenuId]);

  const { table, isLoading } = useInfiniteTable<StockLocation>({
    columns,
    data,
    pageSize: 10,
  });

  return (
    <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={data.length}
        noDataMessage="No stock locations found."
      />
    </div>
  );
};

