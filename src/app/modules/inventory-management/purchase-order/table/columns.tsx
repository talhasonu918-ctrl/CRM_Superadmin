import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
// Use `any` for rows in this purchase-order columns file to avoid coupling
// to the user type from the shared hook.
import { getThemeColors } from '../../../../../theme/colors';

interface UserColumnProps {
  onEdit?: (row: any, rowIndex?: number) => void;
  onView?: (row: any, rowIndex?: number) => void;
  onDelete?: (row: any, rowIndex?: number) => void;
  isDarkMode?: boolean;
}

export const userColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: UserColumnProps = {}): ColumnDef<any>[] => {
  const theme = getThemeColors(isDarkMode);
  return [
    {
      accessorKey: 'productName',
      header: 'Product Name',
      size: 160,
      cell: ({ row }) => {
        const name = row.original?.productName;
        return (
          <span
            className={`font-semibold text-xs sm:text-sm block truncate max-w-[140px] sm:max-w-none ${theme.text.primary}`}
            title={name}
          >
            {name || ''}
          </span>
        );
      },
    },
    {
      accessorKey: 'uom',
      header: 'UOM',
      size: 90,
      cell: ({ getValue }) => <span>{(getValue() as string) ?? ''}</span>,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size: 100,
      cell: ({ getValue }) => <span>{(getValue() as number) ?? ''}</span>,
    },
    {
      accessorKey: 'bonusQty',
      header: () => <span className="whitespace-nowrap">Bonus Qty</span>,
      size: 120,
      cell: ({ getValue }) => <span>{(getValue() as number) ?? ''}</span>,
    },
    {
      accessorKey: 'costPrice',
      header: 'Cost Price',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : ''}</span>;
      },
    },
    {
      accessorKey: 'saleTax',
      header: 'Sale Tax',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : ''}</span>;
      },
    },
    {
      accessorKey: 'totalCost',
      header: 'Total Cost',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : ''}</span>;
      },
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : ''}</span>;
      },
    },
    {
      accessorKey: 'netCost',
      header: 'Net Cost',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : ''}</span>;
      },
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      size: 140,
      cell: ({ getValue }) => {
        const supplier = getValue() as string | undefined;
        return <span>{supplier ?? ''}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-blue-900/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-orange-900/20 text-orange-400' : 'hover:bg-orange-50 text-orange-600'}`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];
};
