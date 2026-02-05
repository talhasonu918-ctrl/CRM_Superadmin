import { ColumnDef } from '@tanstack/react-table';
import { Category } from '../types';
import { MoreVertical } from 'lucide-react';
import DropdownMenu from '../../../../components/dropdown';

interface CategoryColumnProps {
  onEdit?: (category: Category) => void;
  onView?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  isDarkMode?: boolean;
}

export const categoryColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: CategoryColumnProps = {}): ColumnDef<Category>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: 'categoryName',
    header: 'Category Name',
    cell: ({ row }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={row.original.productImage || 'https://via.placeholder.com/40'}
          alt={row.original.categoryName}
          style={{ width: 40, height: 40, marginRight: 10, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: 600 }}>{row.original.categoryName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'subCategories',
    header: 'Sub Categories',
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu
        items={[
          { label: 'View Details', onClick: () => onView?.(row.original) },
          { label: 'Edit Details', onClick: () => onEdit?.(row.original) },
          { label: 'Delete', onClick: () => onDelete?.(row.original) },
        ]}
        trigger={
          <button
            className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <MoreVertical size={18} />
          </button>
        }
      />
    ),
  },
];
