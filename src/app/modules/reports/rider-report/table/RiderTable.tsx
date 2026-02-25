'use client';

import React from 'react';
import { Bike, Star, TrendingUp } from 'lucide-react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import InfiniteTable from '@/src/components/InfiniteTable';
import type { RiderSaleReportData } from '@/src/app/modules/pos/mockData';

const columnHelper = createColumnHelper<RiderSaleReportData>();

interface RiderTableProps {
  isDarkMode: boolean;
  filteredData: RiderSaleReportData[];
  viewMode: 'list' | 'grid';
}

export const RiderTable: React.FC<RiderTableProps> = ({ isDarkMode, filteredData, viewMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const columns = React.useMemo(() => [
    columnHelper.accessor('employeeId', {
      header: 'Employee Id',
      cell: (info) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('riderName', {
      header: 'Rider Name',
      cell: (info) => <span className="text-primary font-medium cursor-pointer hover:underline">{info.getValue()}</span>,
    }),
    columnHelper.accessor('totalInvoices', {
      header: 'Total Deliveries',
      cell: (info) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('totalDistance', {
      header: 'Total Distance (KM)',
      cell: (info) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue().toFixed(2)} KM</span>,
    }),
    columnHelper.accessor('totalRevenue', {
      header: 'Total Revenue',
      cell: (info) => <span className="font-semibold text-primary">PKR {info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: (info) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue()}</span>
        </div>
      ),
    }),
  ], [isDarkMode]);

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  if (viewMode === 'list') {
    return (
      <div className={`${cardStyle} rounded-2xl border ${borderStyle} shadow-sm overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className={`font-bold text-lg ${textStyle}`}>Rider Performance Summary</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            {filteredData.length} Riders Found
          </span>
        </div>
        <InfiniteTable table={table} isDarkMode={isDarkMode} total={filteredData.length} itemName="riders" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredData.map((rider) => (
        <div key={rider.employeeId} className={`${cardStyle} rounded-2xl border ${borderStyle} p-5 hover:shadow-xl transition-all group relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />

          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Bike size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>ID: {rider.employeeId}</span>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold">{rider.rating}</span>
              </div>
            </div>
          </div>

          <h3 className={`text-lg font-bold mb-1 truncate ${textStyle}`}>{rider.riderName}</h3>
          <p className="text-sm font-medium mb-4 text-primary">Delivery Partner</p>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Invoices</span>
              <span className={`font-bold ${textStyle}`}>{rider.totalInvoices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Distance</span>
              <span className={`font-bold ${textStyle}`}>{rider.totalDistance.toFixed(2)} KM</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Revenue</span>
              <span className="text-lg font-extrabold text-primary">PKR {rider.totalRevenue.toLocaleString()}</span>
            </div>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
              <TrendingUp size={18} className="text-primary" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiderTable;
