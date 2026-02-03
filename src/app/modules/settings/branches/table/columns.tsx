import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Branch } from '../types';
import { getThemeColors } from '../../../../../theme/colors';

interface BranchColumnProps {
  onEdit?: (branch: Branch) => void;
  onView?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
  isDarkMode?: boolean;
}

export const branchColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: BranchColumnProps = {}): ColumnDef<Branch>[] => {
  const theme = getThemeColors(isDarkMode);
  return [
  {
    accessorKey: 'branchName',
    header: 'Branch Name',
    size: 180,
    cell: ({ getValue }) => (
      <span className={`font-bold ${theme.text.primary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'managerName',
    header: 'Manager',
    size: 160,
    cell: ({ row }) => {
      const branch = row.original;
      return (
        <div className="text-sm">
          <div className={theme.text.secondary}>
            Manager: <span className={theme.text.primary}>{branch.managerName}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
    size: 160,
    cell: ({ row }) => {
      const branch = row.original;
      return (
        <div className={`text-sm ${theme.text.secondary}`}>
          Phone: <span className={theme.text.primary}>{branch.phoneNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 250,
    cell: ({ getValue }) => (
      <span className={`text-sm ${theme.text.secondary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 140,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusLower = status.toLowerCase();
      
      let badgeClass = '';
      if (statusLower === 'active') {
        badgeClass = `${theme.status.success.bg} ${theme.status.success.text}`;
      } else if (statusLower === 'inactive') {
        badgeClass = isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
      } else if (statusLower === 'under maintenance') {
        badgeClass = `${theme.status.warning.bg} ${theme.status.warning.text}`;
      }

      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 120,
    cell: ({ row }) => {
      const branch = row.original;

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(branch)}
            className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-orange-900/20' : 'hover:bg-orange-50'} text-orange-600 dark:text-orange-400 transition-colors`}
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit?.(branch)}
            className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-orange-900/20' : 'hover:bg-orange-50'} text-orange-600 dark:text-orange-400 transition-colors`}
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete?.(branch)}
            className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} text-red-600 dark:text-red-400 transition-colors`}
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
