import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Package, 
  Tag, 
  Hash, 
  DollarSign,
  Briefcase
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { InventoryProduct } from '../../../pos/mockData';

interface InventoryProductTableProps {
  products: InventoryProduct[];
  isDarkMode: boolean;
  onEdit: (product: InventoryProduct) => void;
  onDelete: (id: string) => void;
}

const ActionMenu = ({ 
  onEdit, 
  onDelete, 
  isDarkMode 
}: { 
  onEdit: () => void; 
  onDelete: () => void; 
  isDarkMode: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-xl transition-all ${
          isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
        }`}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border z-[100] overflow-hidden animate-in fade-in zoom-in duration-200 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
              isDarkMode ? 'text-slate-300 hover:bg-primary/10 hover:text-primary' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <Edit2 size={16} />
            Edit Product
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
              isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <Trash2 size={16} />
            Delete Product
          </button>
        </div>
      )}
    </div>
  );
};

export const InventoryProductTable: React.FC<InventoryProductTableProps> = ({
  products,
  isDarkMode,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo<ColumnDef<InventoryProduct>[]>(
    () => [
      {
        header: 'Product Name',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Manufacturer Name',
        accessorKey: 'manufacturerName',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Barcode',
        accessorKey: 'barcode',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Sub Category',
        accessorKey: 'subCategory',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Rack',
        accessorKey: 'rack',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Supplier',
        accessorKey: 'supplier',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Cost Price',
        accessorKey: 'costPrice',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Mean Price',
        accessorKey: 'meanPrice',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Retail Price',
        accessorKey: 'retailPrice',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Sale Price',
        accessorKey: 'salePrice',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Gross Margin',
        accessorKey: 'grossMargin',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Sale Tax',
        accessorKey: 'saleTax',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Discount',
        accessorKey: 'discount',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as number || '0'}
          </span>
        ),
      },
      {
        header: 'Generic Name',
        accessorKey: 'genericName',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Procurement Class',
        accessorKey: 'procurementClass',
        cell: ({ getValue }) => (
          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {getValue() as string || '-'}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end pr-4">
            <ActionMenu 
              onEdit={() => onEdit(row.original)} 
              onDelete={() => onDelete(row.original.id)} 
              isDarkMode={isDarkMode}
            />
          </div>
        ),
      },
    ],
    [isDarkMode, onEdit, onDelete]
  );

  const { table, isLoading } = useInfiniteTable<InventoryProduct>({
    columns,
    data: products,
    pageSize: products.length || 10,
  });

  return (
    <div className={`rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} overflow-hidden`}>
      <InfiniteTable
        table={table}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        total={products.length}
        noDataMessage="No products found."
        itemName="products"
      />
    </div>
  );
};


