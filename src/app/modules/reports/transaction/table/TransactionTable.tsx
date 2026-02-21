'use client';

import React from 'react';
import { ClipboardList } from 'lucide-react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import InfiniteTable from '@/src/components/InfiniteTable';
import { TransactionData } from '@/src/app/modules/pos/mockData';

const columnHelper = createColumnHelper<TransactionData>();

// Grid View Card Component
const TransactionCard: React.FC<{ item: TransactionData; isDarkMode: boolean }> = ({ item, isDarkMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.orderNo}</h3>
            <span className="text-xs text-textSecondary truncate block">{item.customer}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-2 py-1 rounded text-xs ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary">Net Sale</span>
          <span className="font-bold text-base sm:text-lg text-primary">{item.netSale.toFixed(2)}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Type</span>
            <span className="font-semibold capitalize text-textPrimary truncate block">{item.type}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Date</span>
            <span className="font-semibold text-textPrimary truncate block">{item.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TransactionTableProps {
  isDarkMode: boolean;
  filteredData: TransactionData[];
  viewMode: 'list' | 'grid';
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ isDarkMode, filteredData, viewMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const columns = React.useMemo(() => [
    columnHelper.accessor('id', { header: 'Id', cell: (info) => info.getValue() }),
    columnHelper.accessor('orderNo', { header: 'Order No', cell: (info) => info.getValue() }),
    columnHelper.accessor('waiter', { header: 'Waiter', cell: (info) => info.getValue() }),
    columnHelper.accessor('table', { header: 'Table', cell: (info) => info.getValue() }),
    columnHelper.accessor('floorNo', { header: 'Floor No', cell: (info) => info.getValue() }),
    columnHelper.accessor('type', { header: 'Type', cell: (info) => info.getValue() }),
    columnHelper.accessor('guestsCount', { header: 'Guests Count', cell: (info) => info.getValue() }),
    columnHelper.accessor('customer', { header: 'Customer', cell: (info) => info.getValue() }),
    columnHelper.accessor('phone', { header: 'Phone', cell: (info) => info.getValue() }),
    columnHelper.accessor('grossSale', { header: 'Gross Sale', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('serviceCharges', { header: 'Service Charges', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('salesTax', { header: 'Sales Tax', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('discount', { header: 'Discount', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('deliveryCharges', { header: 'Delivery Charges', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('netSale', { header: 'Net Sale', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('paid', { header: 'Paid', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('paymentMode', { header: 'Payment Mode', cell: (info) => info.getValue() }),
    columnHelper.accessor('paymentDate', { header: 'Payment Date', cell: (info) => info.getValue() }),
    columnHelper.accessor('due', { header: 'Due', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('cashback', { header: 'Cashback', cell: (info) => info.getValue().toFixed(2) }),
    columnHelper.accessor('createdAt', { header: 'Created At', cell: (info) => info.getValue() }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1 rounded text-xs ${info.getValue() === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {info.getValue()}
        </span>
      ),
    }),
  ], []);

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  if (viewMode === 'list') {
    return (
      <div className={`${cardStyle} rounded-xl border ${borderStyle} shadow-xl overflow-hidden`}>
        <div className="overflow-x-auto scrollbar-hide">
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            total={filteredData.length}
            itemName="transactions"
            noDataMessage="No transactions found for the selected filters"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base sm:text-lg font-bold ${textStyle}`}>Transactions ({filteredData.length})</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredData.map((item) => (
          <TransactionCard key={item.id} item={item} isDarkMode={isDarkMode} />
        ))}
      </div>
      {filteredData.length === 0 && (
        <div className={`${cardStyle} rounded-xl p-8 sm:p-12 border ${borderStyle} text-center shadow-lg`}>
          <ClipboardList size={40} className="mx-auto mb-4 text-textSecondary opacity-50" />
          <p className="text-textSecondary text-base sm:text-lg font-bold">No transactions found</p>
          <p className="text-textSecondary text-xs sm:text-sm mt-2">Try adjusting your filters or date range</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
