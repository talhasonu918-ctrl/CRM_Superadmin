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
    accessorKey: 'userCode',
    header: 'Employee Code',
    size: 120,
  },
  {
    accessorKey: 'firstName',
    header: 'Full Name',
    size: 120,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 120,
  },
  {
    accessorKey: 'userName',
    header: 'User Name',
    size: 140,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 200,
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    size: 150,
  },
  {
    accessorKey: 'avatar',
    header: 'Profile',
    size: 80,
    cell: ({ getValue }) => {
      const avatar = getValue() as string;
      return avatar ? (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${theme.neutral.backgroundSecondary} ${theme.text.tertiary}`}>
          N/A
        </div>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    size: 100,
  },
  {
    accessorKey: 'active',
    header: 'Active',
    size: 80,
    cell: ({ getValue }) => {
      const active = getValue() as boolean;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${active ? `${theme.status.success.bg} ${theme.status.success.text}` : `${theme.status.error.bg} ${theme.status.error.text}`}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 120,
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