'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, MapPin, Bike } from 'lucide-react';
import { mockRiderReport } from '@/src/app/modules/pos/mockData';
import { RiderForm } from './form/RiderForm';
import { RiderTable } from './table/RiderTable';

const RiderReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-17');
  const [dateTo, setDateTo] = useState('2026-02-17');
  const [selectedBranch, setSelectedBranch] = useState('all-branches');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return mockRiderReport.filter(item => {
      const matchesSearch =
        item.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeId.toString().includes(searchQuery);
      const matchesBranch = selectedBranch === 'all-branches' || item.branchId === selectedBranch;

      const itemDate = new Date(item.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      itemDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      const matchesDate = itemDate >= fromDate && itemDate <= toDate;

      return matchesSearch && matchesBranch && matchesDate;
    });
  }, [searchQuery, selectedBranch, dateFrom, dateTo]);

  const stats = useMemo(() => ({
    totalInvoices: filteredData.reduce((s, i) => s + (i.totalInvoices ?? 0), 0),
    totalDistance: filteredData.reduce((s, i) => s + (i.totalDistance ?? 0), 0),
    totalRevenue: filteredData.reduce((s, i) => s + (i.totalRevenue ?? 0), 0),
  }), [filteredData]);

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Invoices', value: stats.totalInvoices.toLocaleString(), icon: <TrendingUp size={24} />, iconBg: 'bg-blue-500/10 text-blue-500' },
          { label: 'Total Distance', value: `${stats.totalDistance.toFixed(2)} KM`, icon: <MapPin size={24} />, iconBg: 'bg-green-500/10 text-green-500' },
          { label: 'Total Revenue', value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: <Bike size={24} />, iconBg: 'bg-primary/10 text-primary' },
        ].map((item, idx) => (
          <div key={idx} className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm group hover:border-primary/50 transition-all cursor-default`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.iconBg} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                <h3 className={`text-2xl font-bold ${textStyle}`}>{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Actions */}
      <RiderForm
        isDarkMode={isDarkMode}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredData={filteredData}
      />

      {/* Table / Grid */}
      <RiderTable isDarkMode={isDarkMode} filteredData={filteredData} viewMode={viewMode} />
    </div>
  );
};

export default RiderReport;
