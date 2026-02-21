'use client';

import React, { useState } from 'react';
import {
  Eye, Trash2, ChevronUp, Clock, LayoutGrid, List as ListIcon,
} from 'lucide-react';
import {
  createColumnHelper, useReactTable, getCoreRowModel, getExpandedRowModel,
} from '@tanstack/react-table';
import InfiniteTable from '@/src/components/InfiniteTable';
import type { KitchenOrderReadyTimeData } from '@/src/app/modules/pos/mockData';

const columnHelper = createColumnHelper<KitchenOrderReadyTimeData>();

// Grid view card
const KitchenOrderCard: React.FC<{ item: KitchenOrderReadyTimeData; isDarkMode: boolean }> = ({ item, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'Late' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            <Clock size={20} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>INV: {item.invoiceId}</h3>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
              item.orderType === 'Delivery' ? 'bg-blue-100 text-blue-700' :
              item.orderType === 'DineIn' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {item.orderType}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isExpanded ? 'text-primary' : 'text-gray-400'} transition-colors`}
        >
          {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-textSecondary">Order No</span>
          <span className={`font-semibold ${textStyle}`}>{item.orderNo}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-textSecondary">Table / Waiter</span>
          <span className={`font-medium ${textStyle}`}>{item.tableNo} / {item.waiter}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">Delay Time</span>
          <span className={`font-black text-lg ${item.status === 'Late' ? 'text-red-500' : 'text-primary'}`}>
            {item.delayTime || '00:00:00'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className={`mt-4 pt-3 border-t ${borderStyle}`}>
          <h4 className={`text-xs font-semibold mb-2 ${textStyle} uppercase`}>Items Checklist</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {item.items.map((prod, idx) => (
              <div key={idx} className={`p-2 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} flex justify-between items-center`}>
                <div className="min-w-0 flex-1">
                  <span className={`font-medium ${textStyle} truncate block`}>{prod.productName}</span>
                  <span className="text-textSecondary text-[10px]">Qty: {prod.quantity}</span>
                </div>
                <span className="text-primary font-bold shrink-0">{prod.readyTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface KitchenOrderTableProps {
  isDarkMode: boolean;
  filteredData: KitchenOrderReadyTimeData[];
  viewMode: 'list' | 'grid';
  onViewModeChange: (v: 'list' | 'grid') => void;
}

export const KitchenOrderTable: React.FC<KitchenOrderTableProps> = ({
  isDarkMode, filteredData, viewMode, onViewModeChange,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const renderSubComponent = ({ row }: { row: any }) => {
    const items = row.original.items;
    return (
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-bold mb-3 ${textStyle}`}>Order Items Checklist</h4>
        <div className={`rounded-lg border ${borderStyle} overflow-hidden bg-white dark:bg-gray-800`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Ready Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className={`px-4 py-2 font-medium ${textStyle}`}>{item.productName}</td>
                  <td className="px-4 py-2 text-center text-textSecondary">{item.quantity}</td>
                  <td className="px-4 py-2 text-right text-primary font-semibold">{item.readyTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const columns = React.useMemo(() => [
    columnHelper.accessor('invoiceId', {
      header: 'Invoice ID',
      cell: (info) => <span className="font-semibold text-primary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('orderType', {
      header: 'Order Type',
      cell: (info) => (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
          info.getValue() === 'Delivery' ? 'bg-blue-100 text-blue-700' :
          info.getValue() === 'DineIn' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('orderNo', { header: 'Order No' }),
    columnHelper.accessor('waiter', { header: 'Waiter' }),
    columnHelper.accessor('rider', { header: 'Rider' }),
    columnHelper.accessor('tableNo', { header: 'Table No' }),
    columnHelper.accessor('delayTime', {
      header: 'Delay Time',
      cell: (info) => (
        <span className={info.row.original.status === 'Late' ? 'text-red-500 font-bold' : 'text-textSecondary'}>
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => row.toggleExpanded()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            title={row.getIsExpanded() ? 'Hide Items' : 'View Items'}
          >
            {row.getIsExpanded() ? <ChevronUp size={18} /> : <Eye size={18} />}
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-bold ${textStyle}`}>Kitchen Order Details</h2>
        <div className="flex items-center gap-2 dark:bg-[#232a36] rounded-lg px-2 py-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'list' ? 'bg-primary text-white border-primary' : cardStyle}`}
            title="List View"
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'grid' ? 'bg-primary text-white border-primary' : cardStyle}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className={`rounded-xl border ${borderStyle} shadow-sm overflow-hidden`}>
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            total={filteredData.length}
            isLoading={false}
            renderSubComponent={renderSubComponent}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <KitchenOrderCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
          {filteredData.length === 0 && (
            <div className={`col-span-full ${cardStyle} rounded-xl border ${borderStyle} p-12 text-center`}>
              <p className="text-textSecondary">No order found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default KitchenOrderTable;
