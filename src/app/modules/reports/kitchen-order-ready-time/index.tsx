'use client';

import React, { useState, useMemo } from 'react';
import { Clock, List as ListIcon } from 'lucide-react';
import { mockKitchenOrderReadyTime } from '@/src/app/modules/pos/mockData';
import { KitchenOrderForm } from './form/KitchenOrderForm';
import { KitchenOrderTable } from './table/KitchenOrderTable';

const KitchenOrderReadyTimeReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { filteredData, stats } = useMemo(() => {
    const data = mockKitchenOrderReadyTime.filter(item => {
      const itemDate = new Date(item.date);
      const start = dateFrom ? new Date(dateFrom) : null;
      const end = dateTo ? new Date(dateTo) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);

      const matchesSearch = !searchTerm ||
        item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.waiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rider.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedOrderType === 'all' || item.orderType === selectedOrderType;
      return matchesDate && matchesSearch && matchesType;
    });

    return {
      filteredData: data,
      stats: {
        totalInvoices: data.length,
        lateInvoices: data.filter(i => i.status === 'Late').length,
        onTimeInvoices: data.filter(i => i.status === 'On Time').length,
      },
    };
  }, [dateFrom, dateTo, searchTerm, selectedOrderType]);

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total Invoices', value: stats.totalInvoices.toFixed(2), icon: <ListIcon size={18} className="text-primary" /> },
          { label: 'Total Late Invoices', value: stats.lateInvoices.toFixed(2), icon: <Clock size={18} className="text-red-500" /> },
          { label: 'Total On Time Invoices', value: stats.onTimeInvoices.toFixed(2), isPrimary: true },
        ].map((item, idx) => (
          <div key={idx} className={`${item.isPrimary ? 'bg-primary/10 border-primary/20' : cardStyle} rounded-xl p-4 sm:p-6 border ${item.isPrimary ? 'border-primary/20' : borderStyle} hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] sm:text-xs font-semibold ${item.isPrimary ? 'text-primary' : 'text-textSecondary uppercase'}`}>{item.label}</span>
            </div>
            <div className={`text-xl sm:text-2xl font-black ${item.isPrimary ? 'text-primary' : textStyle}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <KitchenOrderForm
        isDarkMode={isDarkMode}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedOrderType={selectedOrderType}
        onOrderTypeChange={setSelectedOrderType}
        filteredData={filteredData}
      />

      {/* Table / Grid */}
      <KitchenOrderTable
        isDarkMode={isDarkMode}
        filteredData={filteredData}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};

export default KitchenOrderReadyTimeReport;
