import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { PracticeSetting } from '../types';
import { getThemeColors } from '../../../../../theme/colors';

interface PracticeColumnProps {
  onEdit?: (setting: PracticeSetting) => void;
  onView?: (setting: PracticeSetting) => void;
  onDelete?: (setting: PracticeSetting) => void;
  isDarkMode?: boolean;
}

export const practiceColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: PracticeColumnProps = {}): ColumnDef<PracticeSetting>[] => {
  const theme = getThemeColors(isDarkMode);
  
  return [
  {
    accessorKey: 'practiceName',
    header: 'Practice Name',
    size: 200,
    cell: ({ getValue }) => (
      <span className={`font-bold ${theme.text.primary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'contactEmail',
    header: 'Contact Email',
    size: 220,
    cell: ({ getValue }) => (
      <span className={`text-sm ${theme.text.secondary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    size: 160,
    cell: ({ getValue }) => (
      <span className={`text-sm ${theme.text.secondary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'timezone',
    header: 'Timezone',
    size: 200,
    cell: ({ getValue }) => (
      <span className={`text-sm ${theme.text.secondary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 280,
    cell: ({ getValue }) => (
      <span className={`text-sm line-clamp-2 ${theme.text.secondary}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 120,
    cell: ({ row }) => {
      const setting = row.original;

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(setting)}
            className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-blue-900/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit?.(setting)}
            className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-orange-900/20 text-orange-400' : 'hover:bg-orange-50 text-orange-600'}`}
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete?.(setting)}
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
