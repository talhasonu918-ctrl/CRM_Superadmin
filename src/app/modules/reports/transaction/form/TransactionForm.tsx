'use client';

import React from 'react';
import { Search, Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import { TransactionData } from '@/src/app/modules/pos/mockData';

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

interface TransactionFormProps {
  isDarkMode: boolean;
  searchText: string;
  onSearchTextChange: (v: string) => void;
  searchTable: string;
  onSearchTableChange: (v: string) => void;
  searchUser: string;
  onSearchUserChange: (v: string) => void;
  selectedInvoiceType: string;
  onInvoiceTypeChange: (v: string) => void;
  selectedBranch: string;
  onBranchChange: (v: string) => void;
  selectedPaymentMode: string;
  onPaymentModeChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  fromTime: string;
  onFromTimeChange: (v: string) => void;
  toTime: string;
  onToTimeChange: (v: string) => void;
  showTaxCompliant: boolean;
  onTaxCompliantChange: (v: boolean) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (v: 'list' | 'grid') => void;
  onResetFilters: () => void;
  filteredData: TransactionData[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isDarkMode,
  searchText, onSearchTextChange,
  searchTable, onSearchTableChange,
  searchUser, onSearchUserChange,
  selectedInvoiceType, onInvoiceTypeChange,
  selectedBranch, onBranchChange,
  selectedPaymentMode, onPaymentModeChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  fromTime, onFromTimeChange,
  toTime, onToTimeChange,
  showTaxCompliant, onTaxCompliantChange,
  viewMode, onViewModeChange,
  onResetFilters,
  filteredData,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
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
              onChange={(e) => onSearchTextChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-sm font-medium text-textSecondary lg:hidden">View Mode:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${cardStyle} hover:border-primary`}`}
            >
              <ListIcon size={20} />
              <span className="sm:hidden font-bold">List</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${cardStyle} hover:border-primary`}`}
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
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Table Search</label>
          <input
            type="text"
            placeholder="Enter Table Name..."
            value={searchTable}
            onChange={(e) => onSearchTableChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User Search</label>
          <input
            type="text"
            placeholder="Enter User Name..."
            value={searchUser}
            onChange={(e) => onSearchUserChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
      </div>

      {/* Row 3: Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Invoice Type</label>
          <SearchableDropdown options={invoiceTypeOptions} value={selectedInvoiceType} onChange={onInvoiceTypeChange} placeholder="Select Type" isDarkMode={isDarkMode} />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Branch</label>
          <SearchableDropdown options={branchOptions} value={selectedBranch} onChange={onBranchChange} placeholder="Select Branch" isDarkMode={isDarkMode} />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment Mode</label>
          <SearchableDropdown options={paymentModeOptions} value={selectedPaymentMode} onChange={onPaymentModeChange} placeholder="Select Payment" isDarkMode={isDarkMode} />
        </div>
        <div className="sm:col-span-2">
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filter Options</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onResetFilters}
              className={`flex-1 px-4 py-3 rounded-lg border ${borderStyle} font-bold text-sm ${isDarkMode ? 'bg-[#16191F] text-white hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'} transition-all`}
            >
              Reset Filters
            </button>
            <div className="flex items-center gap-3 px-4 py-2 border rounded-lg border-dashed">
              <input
                type="checkbox"
                id="tax-compliant-inline"
                checked={showTaxCompliant}
                onChange={(e) => onTaxCompliantChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="tax-compliant-inline" className={`text-xs font-semibold ${textStyle} whitespace-nowrap`}>Tax Compliant</label>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Date/Time and Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Time</label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => onFromTimeChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Time</label>
          <input
            type="time"
            value={toTime}
            onChange={(e) => onToTimeChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ExportButton
          filename="Transaction_Report"
          title="Transaction Report"
          headers={['Order No', 'Waiter', 'Table', 'Type', 'Customer', 'Gross Sale', 'Service Charges', 'Sales Tax', 'Discount', 'Net Sale', 'Payment Mode', 'Payment Date']}
          data={filteredData.map(item => [
            item.orderNo, item.waiter, item.table, item.type, item.customer,
            item.grossSale.toFixed(2), item.serviceCharges.toFixed(2),
            item.salesTax.toFixed(2), item.discount.toFixed(2),
            item.netSale.toFixed(2), item.paymentMode, item.paymentDate,
          ])}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default TransactionForm;
