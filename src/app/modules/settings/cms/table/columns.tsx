import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'rizzui';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { getThemeColors } from '../../../../../theme/colors';

export interface CMSPageRow {
    id: string;
    name: string;
    status: 'Draft' | 'Saved';
    lastUpdated: string;
}

export function cmsColumns({
    onEdit,
    onDelete,
    onView,
    isDarkMode = false
}: {
    onEdit: (row: CMSPageRow) => void;
    onDelete: (row: CMSPageRow) => void;
    onView: (row: CMSPageRow) => void;
    isDarkMode?: boolean;
}): ColumnDef<CMSPageRow>[] {
    const theme = getThemeColors(isDarkMode);

    return [
        {
            accessorKey: 'name',
            header: 'Page Name',
            size: 150,
            cell: info => (
                <span className={`font-semibold text-xs md:text-sm whitespace-nowrap ${theme.text.primary}`}>
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 120,
            cell: info => (
                <Badge
                    variant="flat"
                    className={`text-[10px] md:text-xs ${info.getValue() === 'Saved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
                >
                    {info.getValue() as string}
                </Badge>
            ),
        },
        {
            accessorKey: 'lastUpdated',
            header: 'Last Edited',
            size: 180,
            cell: info => (
                <span className={`text-[10px] md:text-sm whitespace-nowrap ${theme.text.secondary}`}>
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 120,
            cell: ({ row }) => {
                const page = row.original;
                return (
                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            onClick={() => onView(page)}
                            className={`p-1.5 md:p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-blue-900/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                            title="View"
                        >
                            <Eye size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(page)}
                            className={`p-1.5 md:p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-orange-900/20 text-orange-400' : 'hover:bg-orange-50 text-orange-600'}`}
                            title="Edit"
                        >
                            <Edit size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(page)}
                            className={`p-1.5 md:p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                            title="Delete"
                        >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                        </button>
                    </div>
                );
            },
        },
    ];
}
