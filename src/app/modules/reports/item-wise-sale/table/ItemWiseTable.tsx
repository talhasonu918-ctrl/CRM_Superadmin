'use client';

import React, { useMemo } from 'react';
import {
  Eye, Trash2, X, AlertTriangle, Package, ShoppingBag, TrendingUp
} from 'lucide-react';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ItemWiseSalesData } from '@/src/app/modules/pos/types';

const columnHelper = createColumnHelper<ItemWiseSalesData>();

// Product Card Component
const ProductCard: React.FC<{
  item: ItemWiseSalesData;
  isDarkMode: boolean;
  onView: (item: ItemWiseSalesData) => void;
  onDelete: (item: ItemWiseSalesData) => void;
}> = ({ item, isDarkMode, onView, onDelete }) => {
  const profitMargin = ((item.profit / item.revenue) * 100) || 0;
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.productName}</h3>
            {item.category && <span className="text-xs text-textSecondary truncate block">{item.category}</span>}
          </div>
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-lg ${profitMargin >= 50 ? 'bg-success/10 text-success' : profitMargin >= 30 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
          <span className="font-bold text-[10px] sm:text-xs text-nowrap">{profitMargin.toFixed(1)}%</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary">Sold Quantity</span>
          <span className="font-bold text-base sm:text-lg text-primary">{item.soldQuantity}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Channel</span>
            <span className="font-semibold capitalize text-textPrimary truncate block">{item.channel}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Date</span>
            <span className="font-semibold text-textPrimary truncate block">{item.date}</span>
          </div>
        </div>
      </div>

      <div className={`pt-4 border-t ${borderStyle} flex items-center justify-between gap-2`}>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Revenue</span>
          <span className="font-bold text-success text-xs sm:text-sm truncate block">PKR {item.revenue.toFixed(2)}</span>
        </div>
        <div className="flex gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onView(item)} className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
            <Eye size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button onClick={() => onDelete(item)} className="p-1.5 sm:p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all">
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// View Detail Modal
const ViewDetailModal: React.FC<{
  item: ItemWiseSalesData | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}> = ({ item, isOpen, onClose, isDarkMode }) => {
  if (!isOpen || !item) return null;
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${cardStyle} w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${borderStyle} max-h-[95vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <h2 className={`text-lg sm:text-xl font-bold ${textStyle}`}>Product Sales Detail</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <X size={20} className="text-textSecondary" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package size={28} className="text-primary sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-base sm:text-lg font-bold truncate ${textStyle}`}>{item.productName}</h3>
              <p className="text-sm text-textSecondary truncate">{item.category} • {item.date}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-xl border ${borderStyle}`}>
              <span className="text-[10px] sm:text-xs text-textSecondary uppercase font-bold tracking-wider">Sold Quantity</span>
              <p className={`text-lg sm:text-xl font-black ${textStyle}`}>{item.soldQuantity}</p>
            </div>
            <div className={`p-3 sm:p-4 rounded-xl border ${borderStyle}`}>
              <span className="text-[10px] sm:text-xs text-textSecondary uppercase font-bold tracking-wider">Order Channel</span>
              <p className={`text-lg sm:text-xl font-black capitalize ${textStyle}`}>{item.channel}</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Cost Price (Unit)</span>
              <span className={`font-bold ${textStyle}`}>PKR {item.costPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Retail Price (Unit)</span>
              <span className={`font-bold ${textStyle}`}>PKR {item.retailPrice.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center text-base sm:text-lg">
              <span className="text-textSecondary">Total Revenue</span>
              <span className="font-bold text-success">PKR {item.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg">
              <span className="text-textSecondary">Total Profit</span>
              <span className={`font-bold ${item.profit >= 0 ? 'text-success' : 'text-error'}`}>PKR {item.profit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Profit Margin</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm sm:text-base">{item.margin.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50/50 flex justify-end shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirm Modal
const DeleteConfirmModal: React.FC<{
  item: ItemWiseSalesData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}> = ({ item, isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen || !item) return null;
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${cardStyle} w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 text-center`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertTriangle size={32} className="text-error sm:w-10 sm:h-10" />
        </div>
        <h2 className={`text-xl sm:text-2xl font-black mb-2 ${textStyle}`}>Are you sure?</h2>
        <p className="text-textSecondary mb-6 sm:mb-8 text-sm sm:text-lg">
          You are about to delete the sales record for{' '}
          <span className={`font-bold ${textStyle}`}>{item.productName}</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 order-2 sm:order-1 py-3 px-6 rounded-xl border border-gray-200 font-bold text-textSecondary hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 order-1 sm:order-2 py-3 px-6 rounded-xl bg-error text-white font-bold hover:bg-error/90 transition-all">Delete Record</button>
        </div>
      </div>
    </div>
  );
};

interface ItemWiseTableProps {
  isDarkMode: boolean;
  filteredData: ItemWiseSalesData[];
  viewMode: 'list' | 'grid';
  viewItem: ItemWiseSalesData | null;
  setViewItem: (item: ItemWiseSalesData | null) => void;
  deleteItem: ItemWiseSalesData | null;
  setDeleteItem: (item: ItemWiseSalesData | null) => void;
}

const ItemWiseTable: React.FC<ItemWiseTableProps> = ({
  isDarkMode, filteredData, viewMode,
  viewItem, setViewItem, deleteItem, setDeleteItem,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const columns = useMemo(() => [
    columnHelper.accessor('productName', {
      header: 'Product Name',
      cell: (info) => (
        <div className="flex items-center gap-2 min-w-[150px] sm:min-w-[200px]">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate text-primary">{info.getValue()}</span>
            {info.row.original.category && <span className="text-[10px] text-textSecondary truncate">{info.row.original.category}</span>}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('channel', {
      header: 'Channel',
      cell: (info) => <span className="text-[10px] font-bold uppercase py-1 px-2 rounded-lg bg-gray-100 text-textSecondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('soldQuantity', {
      header: 'Sold Qty',
      cell: (info) => <span className="font-semibold text-textPrimary text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('retailPrice', {
      header: 'Retail Price',
      cell: (info) => <span className="font-medium text-textSecondary text-xs sm:text-sm text-nowrap">PKR {info.getValue().toFixed(0)}</span>,
    }),
    columnHelper.accessor('revenue', {
      header: 'Revenue',
      cell: (info) => <span className="font-bold text-success text-xs sm:text-sm text-nowrap">PKR {info.getValue().toFixed(0)}</span>,
    }),
    columnHelper.accessor('profit', {
      header: 'Profit',
      cell: (info) => <span className={`font-bold text-xs sm:text-sm text-nowrap ${info.getValue() >= 0 ? 'text-success' : 'text-error'}`}>PKR {info.getValue().toFixed(0)}</span>,
    }),
    columnHelper.accessor('margin', {
      header: 'Margin (%)',
      cell: (info) => (
        <div className={`px-2 py-1 rounded-lg inline-block text-nowrap ${info.getValue() >= 50 ? 'bg-success/10 text-success' : info.getValue() >= 30 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
          <span className="font-bold text-[10px] sm:text-xs">{info.getValue().toFixed(1)}%</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setViewItem(info.row.original)} className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-primary transition-all">
            <Eye size={16} />
          </button>
          <button onClick={() => setDeleteItem(info.row.original)} className="p-1.5 sm:p-2 rounded-lg hover:bg-error/10 text-error transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ], [isDarkMode]);

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <ViewDetailModal item={viewItem} isOpen={!!viewItem} onClose={() => setViewItem(null)} isDarkMode={isDarkMode} />
      <DeleteConfirmModal item={deleteItem} isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={() => setDeleteItem(null)} isDarkMode={isDarkMode} />

      {viewMode === 'list' ? (
        <div className={`${cardStyle} rounded-xl border ${borderStyle} shadow-xl overflow-hidden`}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="min-w-[800px]">
              <InfiniteTable table={table} isDarkMode={isDarkMode} total={filteredData.length} itemName="sales records" />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base sm:text-lg font-bold ${textStyle}`}>Sales Records ({filteredData.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredData.map((item) => (
              <ProductCard key={item.id} item={item} isDarkMode={isDarkMode} onView={setViewItem} onDelete={setDeleteItem} />
            ))}
          </div>
          {filteredData.length === 0 && (
            <div className={`${cardStyle} rounded-xl p-8 sm:p-12 border ${borderStyle} text-center shadow-lg`}>
              <Package size={40} className="mx-auto mb-4 text-textSecondary opacity-50" />
              <p className="text-textSecondary text-base sm:text-lg font-bold">No sales records found</p>
              <p className="text-textSecondary text-xs sm:text-sm mt-2">Try adjusting your filters or date range</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ItemWiseTable;
