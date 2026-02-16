'use client';

import React, { useState, useMemo } from 'react';
import { Printer, Download, X } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface ItemWiseData {
  productName: string;
  soldQuantity: number;
  costPrice: number;
  retailPrice: number;
  revenue: number;
  profit: number;
  margin: number;
}

const columnHelper = createColumnHelper<ItemWiseData>();

const ItemWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [selectedProduct, setSelectedProduct] = useState('CHICKEN TIKKA');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');
  const [selectedChannel, setSelectedChannel] = useState('all');

  const mockData: ItemWiseData[] = [
    { 
      productName: 'CHICKEN TIKKA (MEDIUM)', 
      soldQuantity: 1, 
      costPrice: 0.00, 
      retailPrice: 1120.00, 
      revenue: 1120.00, 
      profit: 1120.00, 
      margin: 100.00 
    }
  ];

  const branchOptions = [
    { value: 'main-branch', label: 'Main Branch' },
    { value: 'branch-2', label: 'Branch 2' },
    { value: 'branch-3', label: 'Branch 3' },
  ];

  const productOptions = [
    { value: 'CHICKEN TIKKA', label: 'CHICKEN TIKKA' },
    { value: 'BEEF BURGER', label: 'BEEF BURGER' },
    { value: 'PIZZA', label: 'PIZZA' },
    { value: 'PASTA', label: 'PASTA' },
  ];

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'dine-in', label: 'Dine In' },
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'delivery', label: 'Delivery' },
  ];

  const columns = useMemo(() => [
    columnHelper.accessor('productName', {
      header: 'Product Name',
      cell: (info) => (
        <span className={`font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('soldQuantity', {
      header: 'Sold Quantity',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('costPrice', {
      header: 'Cost Price',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('retailPrice', {
      header: 'Retail Price',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('revenue', {
      header: 'Revenue',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('profit', {
      header: 'Profit',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('margin', {
      header: 'Margin (%)',
      cell: (info) => info.getValue().toFixed(2),
    }),
  ], [isDarkMode]);

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sold Quantity</div>
          <div className={`text-2xl font-bold ${textStyle}`}>1.00</div>
        </div>
        <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cost</div>
          <div className={`text-2xl font-bold ${textStyle}`}>0.00</div>
        </div>
        <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</div>
          <div className={`text-2xl font-bold ${textStyle}`}>1,120.00</div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
        <div className="grid grid-cols-5 gap-4 items-end">
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Main Branch</label>
            <SearchableDropdown
              options={branchOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Product</label>
            <SearchableDropdown
              options={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder="Select Product"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Order Channel</label>
            <SearchableDropdown
              options={channelOptions}
              value={selectedChannel}
              onChange={setSelectedChannel}
              placeholder="Select Channel"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
          <Printer size={16} /> Print
        </button>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Table */}
      <div className={`${cardStyle} rounded-lg border ${borderStyle} overflow-hidden`}>
        <InfiniteTable
          table={table}
          isDarkMode={isDarkMode}
          total={mockData.length}
          itemName="products"
        />
      </div>
    </div>
  );
};

export default ItemWiseReport;
