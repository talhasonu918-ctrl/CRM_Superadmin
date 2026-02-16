'use client';

import React, { useState, useMemo } from 'react';
import { Printer, Download } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface RiderData {
  employeeId: number;
  name: string;
  totalInvoices: number;
  totalDistance: number;
  totalRevenue: number;
}

const columnHelper = createColumnHelper<RiderData>();

const RiderWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');

  const mockData: RiderData[] = [
    { 
      employeeId: 2254, 
      name: 'Usman (rider)', 
      totalInvoices: 3, 
      totalDistance: 0, 
      totalRevenue: 6080.00 
    }
  ];

  const branchOptions = [
    { value: 'main-branch', label: 'Main Branch' },
    { value: 'branch-2', label: 'Branch 2' },
    { value: 'branch-3', label: 'Branch 3' },
  ];

  const columns = useMemo(() => [
    columnHelper.accessor('employeeId', {
      header: 'Employee Id',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <span className={`font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} cursor-pointer hover:underline`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('totalInvoices', {
      header: 'Total Invoices',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('totalDistance', {
      header: 'Total Distance (KM)',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('totalRevenue', {
      header: 'Total Revenue',
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
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invoices</div>
          <div className={`text-2xl font-bold ${textStyle}`}>3.00</div>
        </div>
        <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Distance (KM)</div>
          <div className={`text-2xl font-bold ${textStyle}`}>0.00</div>
        </div>
        <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</div>
          <div className={`text-2xl font-bold ${textStyle}`}>6,080.00</div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardStyle} rounded-lg p-4 border ${borderStyle}`}>
        <div className="grid grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
          <Printer size={16} /> A4 Print
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
          itemName="riders"
        />
      </div>
    </div>
  );
};

export default RiderWiseReport;
