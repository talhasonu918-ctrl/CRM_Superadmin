'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, ConciergeBell, ClipboardList, Tag, Truck, DollarSign, XCircle, Search, Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import InfiniteTable from '@/src/components/InfiniteTable';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { mockTransactions, TransactionData } from '@/src/app/modules/pos/mockData';

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

// Grid View Card Component
const TransactionCard: React.FC<{
  item: TransactionData;
  isDarkMode: boolean;
}> = ({ item, isDarkMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.orderNo}</h3>
            <span className="text-xs text-textSecondary truncate block">{item.customer}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-2 py-1 rounded text-xs ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary">Net Sale</span>
          <span className="font-bold text-base sm:text-lg text-primary">{item.netSale.toFixed(2)}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Type</span>
            <span className="font-semibold capitalize text-textPrimary truncate block">{item.type}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Date</span>
            <span className="font-semibold text-textPrimary truncate block">{item.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');


  const { filteredData, totals } = useMemo(() => {
    const data = mockTransactions.filter((item) => {
      // 1. Text Search (Order No, Customer)
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        item.orderNo.toLowerCase().includes(searchLower) ||
        item.customer.toLowerCase().includes(searchLower);

      // 2. Table Search
      const tableLower = searchTable.toLowerCase();
      const matchesTable = item.table.toLowerCase().includes(tableLower);

      // 3. User Search (Waiter)
      const userLower = searchUser.toLowerCase();
      const matchesUser = item.waiter.toLowerCase().includes(userLower);

      // 4. Invoice Type Filter
      const matchesType =
        selectedInvoiceType === 'all' || item.type === selectedInvoiceType;

      // 5. Payment Mode Filter
      const matchesPayment =
        selectedPaymentMode === 'all' ||
        item.paymentMode.toLowerCase() === selectedPaymentMode.toLowerCase();

      // 6. Date Range Filter
      const itemDate = new Date(item.paymentDate);
      const start = dateFrom ? new Date(dateFrom) : null;
      const end = dateTo ? new Date(dateTo) : null;
      // Reset times for accurate date comparison
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const matchesDate =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      return (
        matchesSearch &&
        matchesTable &&
        matchesUser &&
        matchesType &&
        matchesPayment &&
        matchesDate
      );
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
      {
        totalGuests: 0,
        grossSale: 0,
        serviceCharges: 0,
        salesTax: 0,
        discount: 0,
        deliveryCharges: 0,
        netSale: 0,
        excludeSC: 0,
      }
    );

    return { filteredData: data, totals: calculatedTotals };
  }, [
    searchText,
    searchTable,
    searchUser,
    selectedInvoiceType,
    selectedPaymentMode,
    dateFrom,
    dateTo,
  ]);

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
        <span className={`px-2 py-1 rounded text-xs ${info.getValue() === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
          {info.getValue()}
        </span>
      )
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
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
      {/* Filters & Actions - Premium Layout */}
      <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
        {/* Row 1: Search and Toggles */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Transactions
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
              <input
                type="text"
                placeholder="Search transactions (Order No, Customer...)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
              />
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="text-sm font-medium text-textSecondary lg:hidden">View Mode:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'list'
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : `${cardStyle} hover:border-primary`
                  }`}
              >
                <ListIcon size={20} />
                <span className="sm:hidden font-bold">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'grid'
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : `${cardStyle} hover:border-primary`
                  }`}
              >
                <GridIcon size={20} />
                <span className="sm:hidden font-bold">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Table Search
            </label>
            <input
              type="text"
              placeholder="Enter Table Name..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              User Search
            </label>
            <input
              type="text"
              placeholder="Enter User Name..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
        </div>

        {/* Row 3: Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Invoice Type
            </label>
            <SearchableDropdown
              options={invoiceTypeOptions}
              value={selectedInvoiceType}
              onChange={setSelectedInvoiceType}
              placeholder="Select Type"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Branch
            </label>
            <SearchableDropdown
              options={branchOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Payment Mode
            </label>
            <SearchableDropdown
              options={paymentModeOptions}
              value={selectedPaymentMode}
              onChange={setSelectedPaymentMode}
              placeholder="Select Payment"
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter Options
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSearchText('');
                  setSearchTable('');
                  setSearchUser('');
                  setSelectedInvoiceType('all');
                  setSelectedBranch('main-branch');
                  setSelectedPaymentMode('all');
                }}
                className={`flex-1 px-4 py-3 rounded-lg border ${borderStyle} font-bold text-sm ${isDarkMode ? 'bg-[#16191F] text-white hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'} transition-all`}
              >
                Reset Filters
              </button>
              <div className="flex items-center gap-3 px-4 py-2 border rounded-lg border-dashed">
                <input
                  type="checkbox"
                  id="tax-compliant-inline"
                  checked={showTaxCompliant}
                  onChange={(e) => setShowTaxCompliant(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="tax-compliant-inline" className={`text-xs font-semibold ${textStyle} whitespace-nowrap`}>Tax Compliant</label>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Date/Time and Final Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From Time
            </label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
          <div>
            <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To Time
            </label>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <ExportButton 
            filename="Transaction_Report"
            title="Transaction Report"
            headers={['Order No', 'Waiter', 'Table', 'Type', 'Customer', 'Gross Sale', 'Service Charges', 'Sales Tax', 'Discount', 'Net Sale', 'Payment Mode', 'Payment Date']}
            data={filteredData.map(item => [
              item.orderNo,
              item.waiter,
              item.table,
              item.type,
              item.customer,
              item.grossSale.toFixed(2),
              item.serviceCharges.toFixed(2),
              item.salesTax.toFixed(2),
              item.discount.toFixed(2),
              item.netSale.toFixed(2),
              item.paymentMode,
              item.paymentDate
            ])}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Data View */}
      {viewMode === 'list' ? (
        <div className={`${cardStyle} rounded-xl border ${borderStyle} shadow-xl overflow-hidden`}>
          <div className="overflow-x-auto scrollbar-hide">
            <InfiniteTable
              table={table}
              isDarkMode={isDarkMode}
              total={filteredData.length}
              itemName="transactions"
              noDataMessage="No transactions found for the selected filters"
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base sm:text-lg font-bold ${textStyle}`}>
              Transactions ({filteredData.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredData.map((item) => (
              <TransactionCard
                key={item.id}
                item={item}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
          {filteredData.length === 0 && (
            <div className={`${cardStyle} rounded-xl p-8 sm:p-12 border ${borderStyle} text-center shadow-lg`}>
              <ClipboardList size={40} className="mx-auto mb-4 text-textSecondary sm:w-12 sm:h-12 opacity-50" />
              <p className="text-textSecondary text-base sm:text-lg font-bold">No transactions found</p>
              <p className="text-textSecondary text-xs sm:text-sm mt-2">Try adjusting your filters or date range</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionReport;
