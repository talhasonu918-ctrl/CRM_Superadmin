'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import InfiniteTable from './InfiniteTable';
import { getThemeColors } from '../theme/colors';

interface ViewToggleProps {
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isDarkMode: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange, isDarkMode }) => {
    const theme = getThemeColors(isDarkMode);

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${viewMode === 'grid'
                    ? `${theme.primary.text} ${theme.primary.border} ${theme.neutral.card} shadow-sm`
                    : `${theme.text.tertiary} ${theme.border.main} ${theme.neutral.card} opacity-60 hover:opacity-100`
                    }`}
                title="Grid View"
            >
                <LayoutGrid size={20} />
            </button>
            <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${viewMode === 'list'
                    ? `${theme.primary.text} ${theme.primary.border} ${theme.neutral.card} shadow-sm`
                    : `${theme.text.tertiary} ${theme.border.main} ${theme.neutral.card} opacity-60 hover:opacity-100`
                    }`}
                title="List View"
            >
                <List size={20} />
            </button>
        </div>
    );
};

export interface GridViewItem {
    id: string;
    name?: string;
    title?: string;
    icon: any;
    bgColor?: string;
    iconColor?: string;
    [key: string]: any;
}

interface GridViewProps {
    title?: string;
    subtitle?: string;
    isDarkMode: boolean;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    items: GridViewItem[];
    onItemClick?: (item: GridViewItem) => void;
    table?: any;
    itemName?: string;
    gridClassName?: string;
    renderCustomCard?: (item: any) => React.ReactNode;
}

export const GridView: React.FC<GridViewProps> = ({
    title,
    subtitle,
    isDarkMode,
    viewMode,
    onViewModeChange,
    items,
    onItemClick = () => {},
    table,
    itemName = 'items',
    gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    renderCustomCard
}) => {
    const theme = getThemeColors(isDarkMode);
    const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white shadow-sm';
    const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
    const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className="space-y-6">
            {title && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className={`text-xl sm:text-3xl font-medium tracking-tight break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
                        {subtitle && <p className="text-slate-400 text-sm font-medium mt-1">{subtitle}</p>}
                    </div>
                    <div className="flex-shrink-0">
                        <ViewToggle
                            viewMode={viewMode}
                            onViewModeChange={onViewModeChange}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>
            )}

            {viewMode === 'grid' ? (
                <div className={gridClassName}>
                    {items.map((item) => {
                        if (renderCustomCard) return renderCustomCard(item);

                        const Icon = item.icon;
                        const itemBgColor = item.bgColor || (isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50');
                        const itemIconColor = item.iconColor || 'text-primary';
                        const displayName = item.name || item.title || '';

                        return (
                            <div
                                key={item.id}
                                onClick={() => onItemClick(item)}
                                className={`${cardStyle} rounded-xl p-6 border ${borderStyle} hover:shadow-lg transition-all cursor-pointer hover:scale-105 flex flex-col items-center justify-center text-center gap-3 min-h-[140px]`}
                            >
                                <div className={`w-12 h-12 rounded-lg ${itemBgColor} flex items-center justify-center`}>
                                    {React.isValidElement(Icon) ? (
                                        Icon
                                    ) : Icon ? (
                                        (() => {
                                            const IconComp = Icon as any;
                                            return <IconComp className={`w-6 h-6 ${itemIconColor}`} />;
                                        })()
                                    ) : null}
                                </div>
                                <h3 className={`text-sm font-semibold ${textStyle}`}>{displayName}</h3>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={`overflow-hidden rounded-xl border ${theme.border.main} ${theme.neutral.card}`}>
                    {table && (
                        <InfiniteTable
                            table={table}
                            isDarkMode={isDarkMode}
                            className="max-h-none"
                            total={items.length}
                            itemName={itemName}
                            rows={table.getRowModel().rows.map((row: any) => ({
                                ...row,
                                onClick: () => onItemClick(row.original)
                            }))}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
