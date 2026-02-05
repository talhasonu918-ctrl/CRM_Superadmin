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
    // tenantId and slug removed — tenants shouldn't see these columns
    {
      accessorKey: 'name',
      header: 'Branch Name',
      size: 180,
      cell: ({ getValue }) => (
        <span
          className={`font-semibold text-xs sm:text-sm block truncate max-w-[120px] sm:max-w-none ${theme.text.primary}`}
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'managerUserId',
      header: 'Manager',
      size: 160,
      cell: ({ row }) => {
        const branch = row.original;
        const display = (branch as any).managerName || branch.managerUserId || '-';
        return (
          <div className="text-xs sm:text-sm">
            <div className={`${theme.text.secondary} truncate max-w-[100px] sm:max-w-none`} title={display}>
              <span className={theme.text.primary}>{display}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 160,
      cell: ({ row }) => {
        const branch = row.original;
        const phone = (branch as any).phone || (branch as any).phoneNumber || '-';
        return (
          <div className={`text-xs sm:text-sm ${theme.text.secondary} truncate max-w-[100px] sm:max-w-none`} title={phone}>
            <span className={theme.text.primary}>{phone}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 250,
      cell: ({ getValue }) => (
        <span
          className={`text-xs sm:text-sm block truncate max-w-[150px] sm:max-w-none ${theme.text.primary}`}
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      size: 140,
      cell: ({ getValue }) => (
        <span
          className={`text-xs sm:text-sm block truncate max-w-[80px] sm:max-w-none ${theme.text.primary}`}
          title={getValue() as string || '-'}
        >
          {getValue() as string || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      size: 140,
      cell: ({ getValue }) => (
        <span
          className={`text-xs sm:text-sm block truncate max-w-[80px] sm:max-w-none ${theme.text.primary}`}
          title={getValue() as string || '-'}
        >
          {getValue() as string || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'lat',
      header: 'Lat',
      size: 100,
      cell: ({ getValue }) => <span className={`text-xs sm:text-sm ${theme.text.primary}`}>{getValue() as number ?? '-'}</span>,
    },
    {
      accessorKey: 'lng',
      header: 'Lng',
      size: 100,
      cell: ({ getValue }) => <span className={`text-xs sm:text-sm ${theme.text.primary}`}>{getValue() as number ?? '-'}</span>,
    },
    // {
    //   accessorKey: 'timezone',
    //   header: 'Timezone',
    //   size: 160,
    //   cell: ({ getValue }) => <span className={`text-xs sm:text-sm ${theme.text.primary}`}>{getValue() as string || '-'}</span>,
    // },
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
          badgeClass = `${theme.status.warning.bg} ${theme.status.warning.text} whitespace-nowrap`;
        }

        return (
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      size: 160,
      cell: ({ getValue }) => {
        const val = getValue() as string | undefined;
        return <span className={`text-xs sm:text-sm ${theme.text.primary}`}>{val ? new Date(val).toLocaleString() : '-'}</span>;
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
