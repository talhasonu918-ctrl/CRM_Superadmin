import React, { useEffect, useRef, useCallback } from 'react';
import { Table } from 'rizzui/table';
import { flexRender, Table as TanStackTableTypes, Row } from '@tanstack/react-table';
import { getThemeColors } from '../theme/colors';

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
  isDarkMode = false,
  total,
  noDataMessage,
}: InfiniteTableProps<T>) {
  const theme = getThemeColors(isDarkMode);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // Once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isLoading &&
          hasNextPage &&
          onLoadMore
        ) {
          onLoadMore();
        }
      }
    },
    [onLoadMore, isLoading, hasNextPage]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const footers = table
    .getFooterGroups()
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
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        className={`w-full overflow-x-auto overflow-y-auto custom-scrollbar max-h-[600px] ${className}`}
      >
        <Table
          className="!shadow-none !border-0"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <Table.Header className={`!border-y-0 ${theme.neutral.backgroundSecondary}`}>
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
                        className={`!text-start !font-semibold ${theme.text.primary}`}
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
                <Table.Row
                  key={row.id}
                  className={`transition-colors ${theme.neutral.hoverLight}`}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    // Check column visibility
                    if (columnVisibility && columnVisibility[cell.column.id] === false) {
                      return null;
                    }
                    return (
                      <Table.Cell
                        key={cell.id}
                        className="!text-start py-4 px-2 sm:px-4"
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))
            )}
          </Table.Body>

          {isLoading && (
            <Table.Body>
              <Table.Row>
                <Table.Cell
                  colSpan={table.getAllColumns().length}
                  className="!text-center !py-4"
                >
                  {loadingComponent || defaultLoadingComponent}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}

          {footers.length > 0 && (
            <Table.Footer>
              {table.getFooterGroups().map((footerGroup: any) => (
                <Table.Row key={footerGroup.id}>
                  {footerGroup.headers.map((footer: any) => {
                    return (
                      <Table.Cell key={footer.id} className="!py-4">
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
      </div>
      {/* Removed bottom pagination controls for infinite scroll tables */}
    </>
  );
}

export default InfiniteTable;