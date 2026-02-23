'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  UtensilsCrossed, Eye, Trash2, ChevronDown, ChevronUp, X,
  Grid as GridIcon, List as ListIcon,
} from 'lucide-react';
import {
  createColumnHelper, useReactTable, getCoreRowModel, getExpandedRowModel, ExpandedState,
} from '@tanstack/react-table';
import InfiniteTable from '@/src/components/InfiniteTable';
import type { KitchenSaleTransaction } from '@/src/app/modules/pos/mockData';
import type { ExtendedKitchenSaleReportData } from '@/src/app/modules/reports/kitchen-wise-sale/types';

const columnHelper = createColumnHelper<ExtendedKitchenSaleReportData>();

// Portal Component
const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
};

// Detail Modal Component
const KitchenDetailModal: React.FC<{
  item: ExtendedKitchenSaleReportData | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}> = ({ item, isOpen, onClose, isDarkMode }) => {
  if (!isOpen || !item) return null;
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <Portal>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
        <div className={`${cardStyle} w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${borderStyle} max-h-[95vh] flex flex-col`}>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
            <h2 className={`text-lg sm:text-xl font-bold ${textStyle}`}>Kitchen Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <X size={20} className="text-textSecondary" />
            </button>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <UtensilsCrossed size={28} className="text-primary sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <h3 className={`text-base sm:text-lg font-bold truncate ${textStyle}`}>{item.kdsName}</h3>
                <p className="text-sm text-textSecondary truncate">{item.totalProducts} Products</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`p-3 sm:p-4 rounded-xl border ${borderStyle}`}>
                <span className="text-[10px] sm:text-xs text-textSecondary uppercase font-bold tracking-wider">Sold Quantity</span>
                <p className={`text-lg sm:text-xl font-black ${textStyle}`}>{item.totalSoldQuantity}</p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl border ${borderStyle}`}>
                <span className="text-[10px] sm:text-xs text-textSecondary uppercase font-bold tracking-wider">Total Products</span>
                <p className={`text-lg sm:text-xl font-black ${textStyle}`}>{item.totalProducts}</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Gross Sale</span>
                <span className={`font-bold ${textStyle}`}>PKR {item.grossSale.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Total Sale Tax</span>
                <span className={`font-bold ${textStyle}`}>PKR {item.totalSaleTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Total Discount</span>
                <span className={`font-bold ${textStyle}`}>PKR {item.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center text-base sm:text-lg">
                <span className="text-textSecondary">Net Sale</span>
                <span className="font-bold text-primary">PKR {item.netSale.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// Grid card
const KitchenSaleCard: React.FC<{ item: ExtendedKitchenSaleReportData; isDarkMode: boolean }> = ({ item, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.kdsName}</h3>
            <span className="text-xs text-textSecondary">Products: {item.totalProducts}</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isExpanded ? 'text-primary' : 'text-gray-400'} transition-colors`}
          title={isExpanded ? 'Hide Products' : 'Show Products'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary">Net Sale</span>
          <span className="font-bold text-base sm:text-lg text-primary">PKR {(item.netSale ?? 0).toFixed(2)}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Quantity Sold</span>
            <span className="font-semibold text-textPrimary">{item.totalSoldQuantity ?? 0}</span>
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Gross Sale</span>
            <span className="font-semibold text-textPrimary">PKR {(item.grossSale ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={`mt-4 pt-3 border-t ${borderStyle}`}>
          <h4 className={`text-xs font-semibold mb-2 ${textStyle}`}>Product Breakdown</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {item.transactions.map((t, idx) => (
              <div key={idx} className={`p-2 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${textStyle} line-clamp-1`}>{t.productName}</span>
                  <span className="text-primary font-bold shrink-0">PKR {t.amount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-textSecondary text-[10px]">
                  <span>Qty: {t.quantity}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface KitchenWiseTableProps {
  isDarkMode: boolean;
  aggregatedData: ExtendedKitchenSaleReportData[];
  viewMode: 'list' | 'grid';
  onViewModeChange: (v: 'list' | 'grid') => void;
}

export const KitchenWiseTable: React.FC<KitchenWiseTableProps> = ({
  isDarkMode, aggregatedData, viewMode, onViewModeChange,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selectedItem, setSelectedItem] = useState<ExtendedKitchenSaleReportData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const renderSubComponent = ({ row }: { row: any }) => {
    const transactions = row.original.transactions as KitchenSaleTransaction[];
    return (
      <tr>
        <td colSpan={10} className="p-0">
          <div className={`border-t-2 ${borderStyle} p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h4 className={`text-xs font-bold mb-3 ${textStyle} uppercase tracking-wider`}>Product Breakdown: {row.original.kdsName}</h4>
            <div className={`rounded-lg border ${borderStyle} overflow-hidden`}>
              <table className="w-full text-sm text-left">
                <thead className={`text-xs uppercase font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Tax</th>
                    <th className="px-4 py-3 text-right">Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((t, idx) => (
                    <tr key={idx} className={isDarkMode ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-white hover:bg-gray-50'}>
                      <td className={`px-4 py-3 font-medium ${textStyle}`}>{t.productName}</td>
                      <td className="px-4 py-3 text-textSecondary">{t.date}</td>
                      <td className="px-4 py-3 text-right text-textPrimary">{t.quantity}</td>
                      <td className="px-4 py-3 text-right text-primary font-bold">PKR {t.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-textSecondary">PKR {t.tax.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-textSecondary">PKR {t.discount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };
  const columns = React.useMemo(() => [
    columnHelper.accessor('kdsName', {
      header: 'KDS Name',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => info.row.toggleExpanded()}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors shrink-0"
            title={info.row.getIsExpanded() ? 'Collapse' : 'Expand'}
          >
            {info.row.getIsExpanded() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <UtensilsCrossed size={16} className="text-primary shrink-0" />
          <span>{info.getValue() || 'N/A'}</span>
        </div>
      ),
    }),
    columnHelper.accessor('totalProducts', { header: 'Total Products', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalSoldQuantity', { header: 'Total Sold Quantity', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('grossSale', { header: 'Gross Sale', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalSaleTax', { header: 'Total Sale Tax', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalDiscount', { header: 'Total Discount', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('netSale', { header: 'Net Sale', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(row.original);
              setIsDetailOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors" title="Delete Record">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: aggregatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: { expanded },
    onExpandedChange: setExpanded,
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-bold ${textStyle}`}>Kitchen Wise Sale Report</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'list' ? 'bg-primary text-white border-primary' : cardStyle}`}
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'grid' ? 'bg-primary text-white border-primary' : cardStyle}`}
          >
            <GridIcon size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className={`rounded-xl border ${borderStyle} overflow-hidden`}>
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            total={aggregatedData.length}
            itemName="records"
            renderSubComponent={renderSubComponent}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {aggregatedData.map((item) => (
            <KitchenSaleCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}

      <KitchenDetailModal
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default KitchenWiseTable;
