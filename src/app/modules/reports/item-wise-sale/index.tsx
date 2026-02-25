'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Package, ShoppingBag } from 'lucide-react';
import { mockItemWiseSales } from '@/src/app/modules/pos/mockData';
import { ItemWiseSalesData } from '@/src/app/modules/pos/types';
import ItemWiseForm from './form/ItemWiseForm';
import ItemWiseTable from './table/ItemWiseTable';

const ItemWiseSaleReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-17');
  const [dateTo, setDateTo] = useState('2026-02-17');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewItem, setViewItem] = useState<ItemWiseSalesData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemWiseSalesData | null>(null);

  const filteredData = useMemo(() => {
    return mockItemWiseSales.filter(item => {
      const matchesSearch = !searchTerm || item.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = selectedProduct === 'all' ||
        item.productName.toLowerCase().includes(selectedProduct.toLowerCase()) ||
        item.category?.toLowerCase() === selectedProduct.toLowerCase();
      const matchesChannel = selectedChannel === 'all' || item.channel === selectedChannel;
      const itemDate = new Date(item.date);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      itemDate.setHours(0, 0, 0, 0);
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
      const matchesDate = itemDate >= from && itemDate <= to;
      return matchesSearch && matchesProduct && matchesChannel && matchesDate;
    });
  }, [searchTerm, selectedProduct, selectedChannel, dateFrom, dateTo]);

  const totals = useMemo(() => filteredData.reduce(
    (acc, item) => ({
      soldQuantity: acc.soldQuantity + item.soldQuantity,
      costPrice: acc.costPrice + item.costPrice * item.soldQuantity,
      revenue: acc.revenue + item.revenue,
      profit: acc.profit + item.profit,
    }),
    { soldQuantity: 0, costPrice: 0, revenue: 0, profit: 0 }
  ), [filteredData]);

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Sold Quantity', value: totals.soldQuantity.toFixed(0), icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', trend: '+12% from last period' },
          { label: 'Total Cost', value: `PKR ${totals.costPrice.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`, icon: Package, color: 'text-warning', bg: 'bg-warning/10', trend: 'Total investment' },
          { label: 'Revenue', value: `PKR ${totals.revenue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', trend: '+8.2% growth' },
          { label: 'Profit', value: `PKR ${totals.profit.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', trend: 'Net profit earned' },
        ].map((stat, i) => (
          <div key={i} className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-textSecondary">{stat.label}</span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black truncate ${i === 2 ? 'text-success' : i === 3 ? 'text-primary' : textStyle}`}>{stat.value}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-success" />
              <span className="text-[10px] sm:text-xs text-success font-semibold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Form */}
      <ItemWiseForm
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredData={filteredData}
      />

      {/* Data Table / Grid */}
      <ItemWiseTable
        isDarkMode={isDarkMode}
        filteredData={filteredData}
        viewMode={viewMode}
        viewItem={viewItem}
        setViewItem={setViewItem}
        deleteItem={deleteItem}
        setDeleteItem={setDeleteItem}
      />
    </div>
  );
};

export default ItemWiseSaleReport;
