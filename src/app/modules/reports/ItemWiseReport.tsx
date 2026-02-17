'use client';

import React, { useState, useMemo } from 'react';
import {  TrendingUp,  Package,  Grid as GridIcon,  List as ListIcon,  ShoppingBag,
  Eye,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import InfiniteTable from '@/src/components/InfiniteTable';
import { ExportButton } from '@/src/components/ExportButton';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { mockItemWiseSales } from '@/src/app/modules/pos/mockData';
import { ItemWiseSalesData } from '@/src/app/modules/pos/types';

const columnHelper = createColumnHelper<ItemWiseSalesData>();

const branchOptions = [
  { value: 'main-branch', label: 'Main Branch' },
  { value: 'branch-2', label: 'Branch 2' },
  { value: 'branch-3', label: 'Branch 3' },
];

const productOptions = [
  { value: 'all', label: 'All Products' },
  { value: 'CHICKEN TIKKA', label: 'CHICKEN TIKKA' },
  { value: 'BEEF BURGER', label: 'BEEF BURGER' },
  { value: 'PIZZA', label: 'PIZZA' },
  { value: 'PASTA', label: 'PASTA' },
  { value: 'Deals', label: 'Deals' },
  { value: 'Wings', label: 'Wings' },
  { value: 'Broast', label: 'Broast' },
  { value: 'Drinks', label: 'Drinks' },
];

const channelOptions = [
  { value: 'all', label: 'All Channels' },
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
];

// Grid View Card Component
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
    <div className={`${cardStyle} rounded-xl  p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.productName}</h3>
            {item.category && (
              <span className="text-xs text-textSecondary truncate block">{item.category}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className={`px-2 sm:px-3 py-1 rounded-lg ${profitMargin >= 50 ? 'bg-success/10 text-success' :
            profitMargin >= 30 ? 'bg-primary/10 text-primary' :
              'bg-warning/10 text-warning'
            }`}>
            <span className="font-bold text-[10px] sm:text-xs text-nowrap">{profitMargin.toFixed(1)}%</span>
          </div>
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
          <button
            onClick={() => onView(item)}
            className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all focus:ring-2 focus:ring-primary/50"
          >
            <Eye size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 sm:p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all focus:ring-2 focus:ring-error/50"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Components
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all focus:ring-2 focus:ring-gray-200"
          >
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
              <span className={`font-bold ${item.profit >= 0 ? 'text-success' : 'text-error'}`}>
                PKR {item.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Profit Margin</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm sm:text-base">
                {item.margin.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all focus:ring-4 focus:ring-primary/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shrink-0">
          <AlertTriangle size={32} className="text-error sm:w-10 sm:h-10" />
        </div>
        <h2 className={`text-xl sm:text-2xl font-black mb-2 ${textStyle}`}>Are you sure?</h2>
        <p className="text-textSecondary mb-6 sm:mb-8 text-sm sm:text-lg">
          You are about to delete the sales record for <br className="hidden sm:block" />
          <span className={`font-bold ${textStyle}`}>{item.productName}</span>.
          This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 order-2 sm:order-1 py-3 px-6 rounded-xl border border-gray-200 font-bold text-textSecondary hover:bg-gray-50 transition-all focus:ring-2 focus:ring-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 order-1 sm:order-2 py-3 px-6 rounded-xl bg-error text-white font-bold hover:bg-error/90 hover:shadow-lg hover:shadow-error/20 transition-all focus:ring-4 focus:ring-error/30"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-17');
  const [dateTo, setDateTo] = useState('2026-02-17');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [viewItem, setViewItem] = useState<ItemWiseSalesData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemWiseSalesData | null>(null);

  // Filter data based on search and selections
  const filteredData = useMemo(() => {
    return mockItemWiseSales.filter(item => {
      const matchesSearch = !searchTerm ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct = selectedProduct === 'all' ||
        item.productName.toLowerCase().includes(selectedProduct.toLowerCase()) ||
        item.category?.toLowerCase() === selectedProduct.toLowerCase();

      const matchesChannel = selectedChannel === 'all' ||
        item.channel === selectedChannel;

      // Date filtering
      const itemDate = new Date(item.date);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      // Reset hours to compare dates only
      itemDate.setHours(0, 0, 0, 0);
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);

      const matchesDate = itemDate >= from && itemDate <= to;

      return matchesSearch && matchesProduct && matchesChannel && matchesDate;
    });
  }, [searchTerm, selectedProduct, selectedChannel, dateFrom, dateTo]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce((acc, item) => ({
      soldQuantity: acc.soldQuantity + item.soldQuantity,
      costPrice: acc.costPrice + (item.costPrice * item.soldQuantity),
      revenue: acc.revenue + item.revenue,
      profit: acc.profit + item.profit,
    }), { soldQuantity: 0, costPrice: 0, revenue: 0, profit: 0 });
  }, [filteredData]);

  const columns = useMemo(() => [
    columnHelper.accessor('productName', {
      header: 'Product Name',
      cell: (info) => (
        <div className="flex items-center gap-2 min-w-[150px] sm:min-w-[200px]">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`font-semibold text-sm truncate text-primary`}>
              {info.getValue()}
            </span>
            {info.row.original.category && (
              <span className="text-[10px] text-textSecondary truncate">{info.row.original.category}</span>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('channel', {
      header: 'Channel',
      cell: (info) => (
        <span className="text-[10px] font-bold uppercase py-1 px-2 rounded-lg bg-gray-100 text-textSecondary text-nowrap">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('soldQuantity', {
      header: 'Sold Qty',
      cell: (info) => (
        <span className="font-semibold text-textPrimary text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('retailPrice', {
      header: 'Retail Price',
      cell: (info) => (
        <span className="font-medium text-textSecondary text-xs sm:text-sm text-nowrap">PKR {info.getValue().toFixed(0)}</span>
      ),
    }),
    columnHelper.accessor('revenue', {
      header: 'Revenue',
      cell: (info) => (
        <span className="font-bold text-success text-xs sm:text-sm text-nowrap">PKR {info.getValue().toFixed(0)}</span>
      ),
    }),
    columnHelper.accessor('profit', {
      header: 'Profit',
      cell: (info) => (
        <span className={`font-bold text-xs sm:text-sm text-nowrap ${info.getValue() >= 0 ? 'text-success' : 'text-error'}`}>
          PKR {info.getValue().toFixed(0)}
        </span>
      ),
    }),
    columnHelper.accessor('margin', {
      header: 'Margin (%)',
      cell: (info) => (
        <div className={`px-2 py-1 rounded-lg inline-block text-nowrap ${info.getValue() >= 50 ? 'bg-success/10 text-success' :
          info.getValue() >= 30 ? 'bg-primary/10 text-primary' :
            'bg-warning/10 text-warning'
          }`}>
          <span className="font-bold text-[10px] sm:text-xs">{info.getValue().toFixed(1)}%</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setViewItem(info.row.original)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-primary transition-all focus:ring-2 focus:ring-primary/40"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setDeleteItem(info.row.original)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-error/10 text-error transition-all focus:ring-2 focus:ring-error/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ], [isDarkMode]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4 sm:space-y-6">
      <ViewDetailModal
        item={viewItem}
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        isDarkMode={isDarkMode}
      />

      <DeleteConfirmModal
        item={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => setDeleteItem(null)}
        isDarkMode={isDarkMode}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="text-primary sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-textSecondary">Sold Quantity</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black truncate ${textStyle}`}>{totals.soldQuantity.toFixed(0)}</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-success" />
            <span className="text-[10px] sm:text-xs text-success font-semibold">+12% from last period</span>
          </div>
        </div>

        <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Package size={18} className="text-warning sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-textSecondary">Total Cost</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black truncate ${textStyle}`}>PKR {totals.costPrice.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] sm:text-xs text-textSecondary font-medium">Total investment</span>
          </div>
        </div>

        <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-success sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-textSecondary">Revenue</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black text-success truncate`}>PKR {totals.revenue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-success" />
            <span className="text-[10px] sm:text-xs text-success font-semibold">+8.2% growth</span>
          </div>
        </div>

        <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-primary sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-textSecondary">Profit</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black text-primary truncate`}>PKR {totals.profit.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] sm:text-xs text-textSecondary font-medium">Net profit earned</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name..."
              className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="text-sm font-medium text-textSecondary lg:hidden">View Mode:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-3 py-2  sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'list'
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : `${cardStyle} hover:border-primary`
                  }`}
              >
                <ListIcon size={20} />
                <span className="sm:hidden font-bold">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 py-2  sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'grid'
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : `${cardStyle} hover:border-primary`
                  }`}
              >
                <GridIcon size={20} />
                <span className="sm:hidden font-bold">Grid</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>

          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>

          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Branch
            </label>
            <SearchableDropdown
              options={branchOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category/Product
            </label>
            <SearchableDropdown
              options={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder="Select Category"
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Order Channel
            </label>
            <SearchableDropdown
              options={channelOptions}
              value={selectedChannel}
              onChange={setSelectedChannel}
              placeholder="Select Channel"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <ExportButton
            headers={['Product Name', 'Category', 'Channel', 'Sold Qty', 'Retail Price', 'Revenue', 'Profit', 'Margin (%)']}
            data={filteredData.map(item => [
              item.productName,
              item.category || 'N/A',
              item.channel,
              item.soldQuantity.toString(),
              `PKR ${item.retailPrice.toFixed(0)}`,
              `PKR ${item.revenue.toFixed(0)}`,
              `PKR ${item.profit.toFixed(0)}`,
              `${item.margin.toFixed(1)}%`
            ])}
            fileName="item-wise-sales-report"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Data View */}
      {viewMode === 'list' ? (
        <div className={`${cardStyle} rounded-xl border ${borderStyle} shadow-xl overflow-hidden`}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="min-w-[800px]">
              <InfiniteTable
                table={table}
                isDarkMode={isDarkMode}
                total={filteredData.length}
                itemName="sales records"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base sm:text-lg font-bold ${textStyle}`}>
              Sales Records ({filteredData.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredData.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                isDarkMode={isDarkMode}
                onView={setViewItem}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
          {filteredData.length === 0 && (
            <div className={`${cardStyle} rounded-xl p-8 sm:p-12 border ${borderStyle} text-center shadow-lg`}>
              <Package size={40} className="mx-auto mb-4 text-textSecondary sm:w-12 sm:h-12 opacity-50" />
              <p className="text-textSecondary text-base sm:text-lg font-bold">No sales records found</p>
              <p className="text-textSecondary text-xs sm:text-sm mt-2">Try adjusting your filters or date range</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemWiseReport;
