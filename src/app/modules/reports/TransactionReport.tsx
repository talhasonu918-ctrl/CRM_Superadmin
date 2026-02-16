'use client';

import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface TransactionData {
  id: number;
  orderNo: string;
  waiter: string;
  table: string;
  floorNo: string;
  type: string;
  guestsCount: number;
  customer: string;
  phone: string;
  grossSale: number;
  serviceCharges: number;
  salesTax: number;
  discount: number;
  deliveryCharges: number;
  netSale: number;
  paid: number;
  paymentMode: string;
  paymentDate: string;
  due: number;
  cashback: number;
  createdAt: string;
  status: string;
}

const columnHelper = createColumnHelper<TransactionData>();

const TransactionReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-18');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [showTaxCompliant, setShowTaxCompliant] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTable, setSearchTable] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('all');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  const mockData: TransactionData[] = [];

  const invoiceTypeOptions = [
    { value: 'all', label: 'All Invoice Types' },
    { value: 'dine-in', label: 'Dine In' },
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'delivery', label: 'Delivery' },
  ];

  const branchOptions = [
    { value: 'main-branch', label: 'Main Branch' },
    { value: 'branch-2', label: 'Branch 2' },
    { value: 'branch-3', label: 'Branch 3' },
  ];

  const paymentModeOptions = [
    { value: 'all', label: 'All Payment Modes' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'online', label: 'Online' },
  ];

  const columns = useMemo(() => [
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
        <span className={`px-2 py-1 rounded text-xs ${
          info.getValue() === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {info.getValue()}
        </span>
      )
    }),
  ], []);

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
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Guests', value: '0.00' },
          { label: 'Gross Sale', value: '0.00' },
          { label: 'Service Charges', value: '0.00' },
          { label: 'Sale Tax', value: '0.00' },
        ].map((item, idx) => (
          <div key={idx} className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</div>
            <div className={`text-2xl font-bold ${textStyle}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Discount', value: '0.00' },
          { label: 'Delivery Charges', value: '0.00' },
          { label: 'Net Sale', value: '0.00' },
          { label: 'Exclude_SC', value: '0.00' },
        ].map((item, idx) => (
          <div key={idx} className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</div>
            <div className={`text-2xl font-bold ${textStyle}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <input 
              type="text" 
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search Table"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search User"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div>
            <SearchableDropdown
              options={invoiceTypeOptions}
              value={selectedInvoiceType}
              onChange={setSelectedInvoiceType}
              placeholder="Select Invoice Type"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <SearchableDropdown
              options={branchOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <SearchableDropdown
              options={paymentModeOptions}
              value={selectedPaymentMode}
              onChange={setSelectedPaymentMode}
              placeholder="Select Payment Mode"
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showTaxCompliant}
              onChange={(e) => setShowTaxCompliant(e.target.checked)}
              className="w-4 h-4"
            />
            <label className={`text-sm ${textStyle}`}>Show Tax Compliant</label>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500">
              Reset
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
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
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Time</label>
            <input 
              type="time" 
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Time</label>
            <input 
              type="time" 
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardStyle} rounded-lg border ${borderStyle} overflow-hidden`}>
        <InfiniteTable
          table={table}
          isDarkMode={isDarkMode}
          total={mockData.length}
          itemName="transactions"
          noDataMessage="No transactions found for the selected filters"
        />
      </div>
    </div>
  );
};

export default TransactionReport;
