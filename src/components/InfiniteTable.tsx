import React, { useEffect, useRef, useCallback } from 'react';
import { Table } from 'rizzui/table';
import { flexRender, Table as TanStackTableTypes, Row } from '@tanstack/react-table';
import { getThemeColors } from '../theme/colors';
import { useTheme } from '../contexts/ThemeContext';

export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (props: { getValue: () => any; row: any }) => React.ReactNode;
  size?: number;
}

export interface InfiniteTableProps<T = any> {
  table: TanStackTableTypes<T>;
  hasNextPage?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
  columnVisibility?: Record<string, boolean>;
  rows?: Row<T>[];
  isDarkMode?: boolean;
  total?: number;
  noDataMessage?: string;
  itemName?: string;
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactNode;
}

function InfiniteTable<T = any>({
  table,
  hasNextPage = false,
  isLoading = false,
  onLoadMore,
  loadingComponent,
  emptyComponent,
  className = '',
  columnVisibility,
  rows,
  isDarkMode: propDarkMode = false,
  total,
  noDataMessage,
  itemName = 'items',
  renderSubComponent,
}: InfiniteTableProps<T>) {
  const { isDarkMode: themeDarkMode } = useTheme();
  const isDarkMode = propDarkMode || themeDarkMode;
  const theme = getThemeColors(isDarkMode);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Early return if table is not provided
  if (!table) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className={getThemeColors(isDarkMode).text.tertiary}>Table not initialized</p>
        </div>
      </div>
    );
  }

  // Intersection Observer implementation using a callback ref
  const observer = useRef<IntersectionObserver | null>(null);
  const observerTargetCallback = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    if (node && hasNextPage && !isLoading) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isLoading && onLoadMore) {
            onLoadMore();
          }
        },
        {
          root: tableContainerRef.current,
          threshold: 0.01
        }
      );
      observer.current.observe(node);
    }
  }, [hasNextPage, isLoading, onLoadMore]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const footers = table.getFooterGroups()
    .map((group: any) =>
      group.headers.map((header: any) => header.column.columnDef.footer)
    )
    .flat()
    .filter(Boolean);

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: isDarkMode ? '#fb923c' : '#f97316' }}></div>
      <span className={`ml-2 text-sm ${theme.text.tertiary}`}>Loading more...</span>
    </div>
  );

  const defaultEmptyComponent = (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className={`text-4xl mb-4 ${theme.text.muted}`}>📋</div>
        <h3 className={`text-lg font-medium mb-2 ${theme.text.primary}`}>No data found</h3>
        <p className={theme.text.tertiary}>{noDataMessage || 'There are no items to display at the moment.'}</p>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={tableContainerRef}
        className={`w-full overflow-x-auto overflow-y-auto custom-scrollbar max-h-[600px] ${className}`}
      >
        <Table
          className="!shadow-none hover:!bg-transparent !border-0 [&_tbody_tr]:hover:!bg-transparent"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <Table.Header className={`!border-y-0 ${isDarkMode ? '!bg-gray-700' : theme.neutral.backgroundSecondary}`}>
            {table.getHeaderGroups().map((headerGroup: any) => {
              return (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => {
                    // Check column visibility
                    if (columnVisibility && columnVisibility[header.column.id] === false) {
                      return null;
                    }
                    return (
                      <Table.Head
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.getSize(),
                        }}
                        className={`!font-semibold px-2 sm:px-6 ${isDarkMode ? '!text-slate-200' : '!text-slate-700'}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </Table.Head>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Header>
          <Table.Body>
            {(rows || table.getRowModel().rows).length === 0 && !isLoading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={table.getAllColumns().length}
                  className="!text-center !py-12"
                >
                  {emptyComponent || defaultEmptyComponent}
                </Table.Cell>
              </Table.Row>
            ) : (
              (rows || table.getRowModel().rows).map((row: any) => (
                <React.Fragment key={row.id}>
                  <Table.Row
                    onClick={() => row.onClick?.()}
                    className={`transition-colors ${theme.neutral.hoverLight} ${row.onClick ? 'cursor-pointer' : ''}`}
                  >
                    {row.getVisibleCells().map((cell: any) => {
                      // Check column visibility
                      if (columnVisibility && columnVisibility[cell.column.id] === false) {
                        return null;
                      }
                      return (
                        <Table.Cell
                          key={cell.id}
                          className="!text-start py-4 px-2 sm:px-6"
                          style={{
                            width: cell.column.getSize(),
                            color: isDarkMode ? '#f1f5f9' : '#0f172a',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                  {row.getIsExpanded() && renderSubComponent && (
                    <Table.Row>
                      <Table.Cell colSpan={row.getVisibleCells().length} className="p-0 border-0">
                        {renderSubComponent({ row })}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              ))
            )}
            {/* Loading row inside the body */}
            {isLoading && (
              <Table.Row>
                <Table.Cell
                  colSpan={table.getAllColumns().length}
                  className="!text-center !py-4 border-0"
                >
                  {loadingComponent || defaultLoadingComponent}
                </Table.Cell>
              </Table.Row>
            )}

            {/* Sentinel for infinite scroll - only visible when not loading and has more */}
            {!isLoading && hasNextPage && (
              <Table.Row>
                <Table.Cell colSpan={table.getAllColumns().length} className="p-0 border-0 h-0">
                  <div ref={observerTargetCallback} style={{ height: '10px', width: '100%', opacity: 0 }} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>

          {footers.length > 0 && (
            <Table.Footer>
              {table.getFooterGroups().map((footerGroup: any) => (
                <Table.Row key={footerGroup.id}>
                  {footerGroup.headers.map((footer: any) => {
                    return (
                      <Table.Cell key={footer.id} className="!py-4 px-2 sm:px-6">
                        {footer.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              footer.column.columnDef.footer,
                              footer.getContext()
                            )}
                          </>
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Footer>
          )}
        </Table>
      </div >

      {/* Integrated Pagination Footer */}
      {
        (total !== undefined || hasNextPage || isLoading) && (
          <div className={`mt-4 pt-4 px-0 sm:px-6 border-t ${theme.border.main}`}>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm ${theme.text.secondary}`}>
              <span className="text-center sm:text-left">
                Showing <span className={`font-semibold ${theme.text.primary}`}>{(rows || table.getRowModel().rows).length}</span>
                {total !== undefined && (
                  <>
                    {' '}of <span className={`font-semibold ${theme.text.primary}`}>{total}</span>
                  </>
                )} {itemName}
              </span>
              {hasNextPage && !isLoading && (
                <span className={`animate-pulse ${theme.text.muted}`}>
                  Scroll down to load more
                </span>
              )}
              {isLoading && (
                <span className={`flex items-center gap-2 ${theme.text.muted}`}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading more...
                </span>
              )}
            </div>
          </div>
        )
      }
    </>
  );
}

export default InfiniteTable;