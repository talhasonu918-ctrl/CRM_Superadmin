import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { User } from '../../../../../hooks/useInfiniteTable';
import { getThemeColors } from '../../../../../theme/colors';

interface UserColumnProps {
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  isDarkMode?: boolean;
}

export const userColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: UserColumnProps = {}): ColumnDef<User>[] => {
  const theme = getThemeColors(isDarkMode);
  return [
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      size: 120,
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        const name = [firstName, lastName].filter(Boolean).join(' ');
        return (
          <span
            className={`font-semibold text-xs sm:text-sm block truncate max-w-[100px] sm:max-w-none ${theme.text.primary}`}
            title={name}
          >
            {name || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'Phone No',
      size: 130,
      cell: ({ getValue }) => {
        const phone = getValue() as string || '-';
        return (
          <span
            className={`text-xs sm:text-sm block truncate max-w-[90px] sm:max-w-none ${theme.text.primary}`}
            title={phone}
          >
            {phone}
          </span>
        );
      }
    },
    {
      accessorKey: 'cnic',
      header: 'CNIC',
      size: 130,
      cell: ({ getValue }) => {
        const cnic = getValue() as string || '-';
        return (
          <span
            className={`text-xs sm:text-sm block truncate max-w-[90px] sm:max-w-none ${theme.text.primary}`}
            title={cnic}
          >
            {cnic}
          </span>
        );
      }
    },
    {
      accessorKey: 'active',
      header: 'Active',
      size: 80,
      cell: ({ getValue }) => {
        const active = getValue() as boolean;
        return (
          <div className="flex items-center justify-start">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${active ? `${theme.status.success.bg} ${theme.status.success.text}` : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}`}>
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
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
              onClick={() => onView?.(user)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-blue-900/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit?.(user)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-orange-900/20 text-orange-400' : 'hover:bg-orange-50 text-orange-600'}`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete?.(user)}
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
