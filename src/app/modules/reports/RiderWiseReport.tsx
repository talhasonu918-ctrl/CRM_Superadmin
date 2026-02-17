'use client';

import React, { useState, useMemo } from 'react';
import { Download, LayoutGrid, List, Bike, Search, Calendar, MapPin, TrendingUp, Star } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { mockRiderReport, RiderSaleReportData } from '../pos/mockData';

const columnHelper = createColumnHelper<RiderSaleReportData>();

const RiderWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-17');
  const [dateTo, setDateTo] = useState('2026-02-17');
  const [selectedBranch, setSelectedBranch] = useState('all-branches');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const branchOptions = [
    { value: 'all-branches', label: 'All Branches' },
    { value: 'main-branch', label: 'Main Branch' },
    { value: 'branch-2', label: 'Branch 2' },
  ];

  const filteredData = useMemo(() => {
    return mockRiderReport.filter(item => {
      const matchesSearch = item.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.employeeId.toString().includes(searchQuery);
      const matchesBranch = selectedBranch === 'all-branches' || item.branchId === selectedBranch;
      
      // Date filtering logic
      const itemDate = new Date(item.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      
      // Reset hours to compare only dates
      itemDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      const matchesDate = itemDate >= fromDate && itemDate <= toDate;
      
      return matchesSearch && matchesBranch && matchesDate;
    });
  }, [searchQuery, selectedBranch, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const totalInvoices = filteredData.reduce((sum, item) => sum + (item.totalInvoices ?? 0), 0);
    const totalDistance = filteredData.reduce((sum, item) => sum + (item.totalDistance ?? 0), 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + (item.totalRevenue ?? 0), 0);
    return { totalInvoices, totalDistance, totalRevenue };
  }, [filteredData]);

  const columns = useMemo(() => [
    columnHelper.accessor('employeeId', {
      header: 'Employee Id',
      cell: (info) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('riderName', {
      header: 'Rider Name',
      cell: (info) => (
        <span className="text-primary font-medium cursor-pointer hover:underline">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('totalInvoices', {
      header: 'Total Invoices',
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
    columnHelper.accessor('averageSpeed', {
      header: 'Avg. Speed',
      cell: (info) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{info.getValue()} km/h</span>,
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

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      {/* Search and View Toggle Bar */}
      {/* <div className="flex justify-between items-center bg-transparent"> */}
      
           {/* </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm group hover:border-primary/50 transition-all cursor-default`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Invoices</p>
              <h3 className={`text-2xl font-bold ${textStyle}`}>{stats.totalInvoices.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm group hover:border-primary/50 transition-all cursor-default`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Distance</p>
              <h3 className={`text-2xl font-bold ${textStyle}`}>{stats.totalDistance.toFixed(2)} KM</h3>
            </div>
          </div>
        </div>

        <div className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm group hover:border-primary/50 transition-all cursor-default`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <Bike size={24} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
              <h3 className={`text-2xl font-bold ${textStyle}`}>PKR {stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar size={14} className="text-primary" /> From
            </label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                isDarkMode ? 'bg-[#16191F] text-white' : 'bg-gray-50 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar size={14} className="text-primary" /> To
            </label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                isDarkMode ? 'bg-[#16191F] text-white' : 'bg-gray-50 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-500">
              <MapPin size={14} className="text-primary" /> Branch
            </label>
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
      <div className="flex justify-end gap-3 px-1">
          <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search riders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              isDarkMode ? 'bg-[#1e2836] text-white' : 'bg-white text-gray-900'
            }`}
          />
        </div>
        <ExportButton 
          filename="RiderWise_Sale_Report"
          title="Rider Wise Sale Report"
          headers={['Employee Id', 'Rider Name', 'Total Invoices', 'Total Distance (KM)', 'Total Revenue', 'Avg. Speed', 'Rating']}
          data={filteredData.map(item => [
            item.employeeId, 
            item.riderName, 
            item.totalInvoices, 
            item.totalDistance.toFixed(2), 
            `PKR ${item.totalRevenue.toLocaleString()}`,
            `${item.averageSpeed} km/h`,
            item.rating
          ])}
          isDarkMode={isDarkMode}
        />
        <div className={`flex items-center p-1 rounded-xl border ${borderStyle} ${isDarkMode ? 'bg-[#1e2836]' : 'bg-white shadow-sm'}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'grid' 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`
            }`}
          >
            <LayoutGrid size={18} />
            <span className="text-sm font-medium">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'list' 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`
            }`}
          >
            <List size={18} />
            <span className="text-sm font-medium">List</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <div className={`${cardStyle} rounded-2xl border ${borderStyle} shadow-sm overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className={`font-bold text-lg ${textStyle}`}>Rider Performance Summary</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              {filteredData.length} Riders Found
            </span>
          </div>
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            total={filteredData.length}
            itemName="riders"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((rider) => (
            <div 
              key={rider.employeeId} 
              className={`${cardStyle} rounded-2xl border ${borderStyle} p-5 hover:shadow-xl transition-all group relative overflow-hidden`}
            >
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

              <h3 className={`text-lg font-bold mb-1 truncate ${textStyle}`}>
                {rider.riderName}
              </h3>
              <p className={`text-sm font-medium mb-4 text-primary`}>Delivery Partner</p>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Invoices</span>
                  <span className={`font-bold ${textStyle}`}>{rider.totalInvoices}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Distance</span>
                  <span className={`font-bold ${textStyle}`}>{rider.totalDistance.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Avg. Speed</span>
                  <span className={`font-bold ${textStyle}`}>{rider.averageSpeed} km/h</span>
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
      )}
    </div>
  );
};

export default RiderWiseReport;


// export default RiderWiseReport;
