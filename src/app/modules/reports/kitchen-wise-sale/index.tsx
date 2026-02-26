'use client';

import React, { useState, useMemo } from 'react';
import { mockKitchenSales } from '@/src/app/modules/pos/mockData';
import { KitchenWiseForm } from './form/KitchenWiseForm';
import { KitchenWiseTable } from './table/KitchenWiseTable';
import type { ExtendedKitchenSaleReportData } from '@/src/app/modules/reports/kitchen-wise-sale/types';

const KitchenWiseSaleReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedKDS, setSelectedKDS] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { aggregatedData, totals } = useMemo(() => {
    let filtered = mockKitchenSales;

    if (dateFrom || dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const start = dateFrom ? new Date(dateFrom) : null;
        const end = dateTo ? new Date(dateTo) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      });
    }
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(item => item.productId === selectedProduct);
    }
    if (selectedKDS !== 'all') {
      filtered = filtered.filter(item => item.kdsName === selectedKDS);
    }

    const map = new Map<string, ExtendedKitchenSaleReportData>();
    filtered.forEach(t => {
      const existing = map.get(t.kdsName) || {
        id: Math.random(),
        kdsName: t.kdsName,
        totalProducts: 0,
        totalSoldQuantity: 0,
        grossSale: 0,
        totalSaleTax: 0,
        totalDiscount: 0,
        netSale: 0,
        transactions: [],
      };
      existing.totalProducts += 1;
      existing.totalSoldQuantity += t.quantity;
      existing.grossSale += t.amount;
      existing.totalSaleTax += t.tax;
      existing.totalDiscount += t.discount;
      existing.netSale += (t.amount + t.tax - t.discount);
      existing.transactions.push(t);
      map.set(t.kdsName, existing);
    });

    const data = Array.from(map.values());
    const calculatedTotals = data.reduce((acc, curr) => ({
      totalSoldQuantity: acc.totalSoldQuantity + curr.totalSoldQuantity,
      grossSale: acc.grossSale + curr.grossSale,
      saleTax: acc.saleTax + curr.totalSaleTax,
      discount: acc.discount + curr.totalDiscount,
      netSale: acc.netSale + curr.netSale,
    }), { totalSoldQuantity: 0, grossSale: 0, saleTax: 0, discount: 0, netSale: 0 });

    return { aggregatedData: data, totals: calculatedTotals };
  }, [dateFrom, dateTo, selectedProduct, selectedKDS]);

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total Sold Quantity', value: (totals.totalSoldQuantity ?? 0).toFixed(2) },
          { label: 'Gross Sale', value: (totals.grossSale ?? 0).toFixed(2) },
          { label: 'Sale Tax', value: (totals.saleTax ?? 0).toFixed(2) },
          { label: 'Discount', value: (totals.discount ?? 0).toFixed(2) },
          { label: 'Net Sale', value: (totals.netSale ?? 0).toFixed(2), isPrimary: true },
        ].map((item, idx) => (
          <div key={idx} className={`${item.isPrimary ? 'bg-primary/10 border-primary/20' : cardStyle} rounded-xl p-4 sm:p-6 border ${item.isPrimary ? 'border-primary/20' : borderStyle} hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] sm:text-xs font-semibold ${item.isPrimary ? 'text-primary' : 'text-textSecondary'}`}>{item.label}</span>
            </div>
            <div className={`text-xl sm:text-2xl font-black truncate ${item.isPrimary ? 'text-primary' : textStyle}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <KitchenWiseForm
        isDarkMode={isDarkMode}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedKDS={selectedKDS}
        onKDSChange={setSelectedKDS}
        aggregatedData={aggregatedData}
      />

      {/* Table / Grid */}
      <KitchenWiseTable
        isDarkMode={isDarkMode}
        aggregatedData={aggregatedData}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};

export default KitchenWiseSaleReport;
