'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, ConciergeBell, ClipboardList, Tag, Truck, DollarSign, XCircle } from 'lucide-react';
import { mockTransactions } from '@/src/app/modules/pos/mockData';
import { TransactionForm } from './form/TransactionForm';
import { TransactionTable } from './table/TransactionTable';

const TransactionReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [showTaxCompliant, setShowTaxCompliant] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTable, setSearchTable] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('main-branch');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('all');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { filteredData, totals } = useMemo(() => {
    const data = mockTransactions.filter((item) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        item.orderNo.toLowerCase().includes(searchLower) ||
        item.customer.toLowerCase().includes(searchLower);
      const matchesTable = item.table.toLowerCase().includes(searchTable.toLowerCase());
      const matchesUser = item.waiter.toLowerCase().includes(searchUser.toLowerCase());
      const matchesType = selectedInvoiceType === 'all' || item.type === selectedInvoiceType;
      const matchesPayment =
        selectedPaymentMode === 'all' ||
        item.paymentMode.toLowerCase() === selectedPaymentMode.toLowerCase();
      const itemDate = new Date(item.paymentDate);
      const start = dateFrom ? new Date(dateFrom) : null;
      const end = dateTo ? new Date(dateTo) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);
      return matchesSearch && matchesTable && matchesUser && matchesType && matchesPayment && matchesDate;
    });

    const calculatedTotals = data.reduce(
      (acc, curr) => ({
        totalGuests: acc.totalGuests + curr.guestsCount,
        grossSale: acc.grossSale + curr.grossSale,
        serviceCharges: acc.serviceCharges + curr.serviceCharges,
        salesTax: acc.salesTax + curr.salesTax,
        discount: acc.discount + curr.discount,
        deliveryCharges: acc.deliveryCharges + curr.deliveryCharges,
        netSale: acc.netSale + curr.netSale,
        excludeSC: acc.excludeSC + (curr.netSale - curr.serviceCharges),
      }),
      { totalGuests: 0, grossSale: 0, serviceCharges: 0, salesTax: 0, discount: 0, deliveryCharges: 0, netSale: 0, excludeSC: 0 }
    );

    return { filteredData: data, totals: calculatedTotals };
  }, [searchText, searchTable, searchUser, selectedInvoiceType, selectedPaymentMode, dateFrom, dateTo]);

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const handleResetFilters = () => {
    setSearchText('');
    setSearchTable('');
    setSearchUser('');
    setSelectedInvoiceType('all');
    setSelectedBranch('main-branch');
    setSelectedPaymentMode('all');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Guests', value: totals.totalGuests.toString(), icon: <Users size={18} className="text-warning" />, boxColor: 'bg-warning/10' },
          { label: 'Gross Sale', value: totals.grossSale.toFixed(2), icon: <TrendingUp size={18} className="text-success" />, boxColor: 'bg-success/10' },
          { label: 'Service Charges', value: totals.serviceCharges.toFixed(2), icon: <ConciergeBell size={18} className="text-primary" />, boxColor: 'bg-primary/10' },
          { label: 'Sale Tax', value: totals.salesTax.toFixed(2), icon: <ClipboardList size={18} className="text-primary" />, boxColor: 'bg-primary/10' },
          { label: 'Discount', value: totals.discount.toFixed(2), icon: <Tag size={18} className="text-error" />, boxColor: 'bg-error/10' },
          { label: 'Delivery Charges', value: totals.deliveryCharges.toFixed(2), icon: <Truck size={18} className="text-amber-700" />, boxColor: 'bg-amber-700/10' },
          { label: 'Net Sale', value: totals.netSale.toFixed(2), icon: <DollarSign size={18} className="text-success" />, boxColor: 'bg-success/10' },
          { label: 'Exclude_SC', value: totals.excludeSC.toFixed(2), icon: <XCircle size={18} className="text-textSecondary" />, boxColor: 'bg-gray-100' },
        ].map((item, idx) => (
          <div key={idx} className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-md transition-all group`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${item.boxColor} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-textSecondary">{item.label}</span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black truncate ${textStyle}`}>{item.value}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-success" />
              <span className="text-[10px] sm:text-xs text-success font-semibold">+0% from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <TransactionForm
        isDarkMode={isDarkMode}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchTable={searchTable}
        onSearchTableChange={setSearchTable}
        searchUser={searchUser}
        onSearchUserChange={setSearchUser}
        selectedInvoiceType={selectedInvoiceType}
        onInvoiceTypeChange={setSelectedInvoiceType}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedPaymentMode={selectedPaymentMode}
        onPaymentModeChange={setSelectedPaymentMode}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        fromTime={fromTime}
        onFromTimeChange={setFromTime}
        toTime={toTime}
        onToTimeChange={setToTime}
        showTaxCompliant={showTaxCompliant}
        onTaxCompliantChange={setShowTaxCompliant}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        filteredData={filteredData}
      />

      {/* Table / Grid */}
      <TransactionTable isDarkMode={isDarkMode} filteredData={filteredData} viewMode={viewMode} />
    </div>
  );
};

export default TransactionReport;
