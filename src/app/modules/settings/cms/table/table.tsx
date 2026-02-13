import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { Button } from 'rizzui';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { SearchInput } from '../../../../../components/SearchInput';
import { FilterDropdown } from '../../../../../components/FilterDropdown';
import { cmsColumns, CMSPageRow } from './columns';
import { Layout, FileX, Search } from 'lucide-react';
import { getThemeColors } from '../../../../../theme/colors';

interface CMSTableProps {
    isDarkMode: boolean;
    pages: Record<string, any>;
    onEdit: (row: CMSPageRow) => void;
    onDelete: (row: CMSPageRow) => void;
    onView: (row: CMSPageRow) => void;
    onAddPage?: () => void;
}

export const CMSTable: React.FC<CMSTableProps> = ({
    isDarkMode,
    pages,
    onEdit,
    onDelete,
    onView,
    onAddPage
}) => {
    const theme = getThemeColors(isDarkMode);
    const cardStyle = `rounded-xl shadow-sm p-4 sm:p-8 ${theme.neutral.background}`;
    const inputStyle = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

    // Search and filter states
    const { control, watch } = useForm({
        defaultValues: {
            searchTerm: '',
            statusFilter: 'all',
        },
    });
    const searchTerm = watch('searchTerm');
    const statusFilter = watch('statusFilter');

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        name: true,
        status: true,
        lastUpdated: true,
        actions: true,
    });

    const data: CMSPageRow[] = useMemo(() =>
        Object.entries(pages).map(([key, value]) => ({
            id: key,
            name: value.title,
            status: value.status,
            lastUpdated: value.lastUpdated,
        })),
        [pages]
    );

    // Filter data based on search and status
    const filteredData = useMemo(() => {
        let filtered = data;

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(row =>
                row.name.toLowerCase().includes(search)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(row => row.status === statusFilter);
        }

        return filtered;
    }, [data, searchTerm, statusFilter]);

    const columns = useMemo(() => cmsColumns({ onEdit, onDelete, onView, isDarkMode }), [onEdit, onDelete, onView, isDarkMode]);

    // Create the table instance
    const table = useReactTable({
        data: filteredData,
        columns: columns as ColumnDef<CMSPageRow>[],
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <div className={cardStyle}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div>
                        <h4 className={`text-lg md:text-xl font-bold tracking-tight ${theme.text.primary}`}>
                            Content Management
                        </h4>
                        <p className={`text-xs md:text-sm mt-0.5 ${theme.text.tertiary} opacity-80`}>
                            Manage static pages and policy content.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={onAddPage}
                    className={`h-10 md:h-11 px-6 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto ${theme.button.primary}`}
                >
                    + Add New Page
                </Button>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchInput
                    control={control}
                    placeholder="Search pages..."
                    inputStyle={inputStyle}
                    isDarkMode={isDarkMode}
                />

                <FilterDropdown
                    control={control}
                    name="statusFilter"
                    options={[
                        { label: 'All Status', value: 'all' },
                        { label: 'Saved', value: 'Saved' },
                        { label: 'Draft', value: 'Draft' },
                    ]}
                    placeholder="Select status"
                    inputStyle={inputStyle}
                    isDarkMode={isDarkMode}
                />
            </div>

            <InfiniteTable
                table={table}
                columnVisibility={columnVisibility}
                isDarkMode={isDarkMode}
                className="max-h-[600px]"
                total={data.length}
                itemName="pages"
                emptyComponent={
                    <div className={`flex flex-col items-center justify-center text-center py-12 ${theme.text.tertiary}`}>
                        {searchTerm || statusFilter !== 'all' ? (
                            <>
                                <Search className="w-12 h-12 mb-4 opacity-20" />
                                <span>No pages match your filters</span>
                            </>
                        ) : (
                            <>
                                <FileX className="w-12 h-12 mb-4 opacity-20" />
                                <span>No pages found</span>
                            </>
                        )}
                    </div>
                }
            />
        </div>
    );
};
