'use client';

import React from 'react';
import { Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import { ItemWiseSalesData } from '@/src/app/modules/pos/types';

const branchOptions = [
  { value: 'main-branch', label: 'Main Branch' },
  { value: 'branch-2', label: 'Branch 2' },
  { value: 'branch-3', label: 'Branch 3' },
];

const productOptions = [
  { value: 'all', label: 'All Products' },
  { value: 'CHICKEN TIKKA', label: 'CHICKEN TIKKA' },
  { value: 'BEEF BURGER', label: 'BEEF BURGER' },
  { value: 'PIZZA', label: 'PIZZA' },
  { value: 'PASTA', label: 'PASTA' },
  { value: 'Deals', label: 'Deals' },
  { value: 'Wings', label: 'Wings' },
  { value: 'Broast', label: 'Broast' },
  { value: 'Drinks', label: 'Drinks' },
];

const channelOptions = [
  { value: 'all', label: 'All Channels' },
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
];

interface ItemWiseFormProps {
  isDarkMode: boolean;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  selectedBranch: string;
  onBranchChange: (v: string) => void;
  selectedProduct: string;
  onProductChange: (v: string) => void;
  selectedChannel: string;
  onChannelChange: (v: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (v: 'list' | 'grid') => void;
  filteredData: ItemWiseSalesData[];
}

const ItemWiseForm: React.FC<ItemWiseFormProps> = ({
  isDarkMode, searchTerm, onSearchChange,
  dateFrom, onDateFromChange, dateTo, onDateToChange,
  selectedBranch, onBranchChange, selectedProduct, onProductChange,
  selectedChannel, onChannelChange, viewMode, onViewModeChange, filteredData,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
      {/* Search + View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Search Products
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name..."
            className={`w-full px-4 py-3 rounded-lg border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-sm font-medium text-textSecondary lg:hidden">View Mode:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${cardStyle} hover:border-primary`}`}
            >
              <ListIcon size={20} />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${borderStyle} transition-all flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : `${cardStyle} hover:border-primary`}`}
            >
              <GridIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
          />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Branch</label>
          <SearchableDropdown options={branchOptions} value={selectedBranch} onChange={onBranchChange} placeholder="Select Branch" isDarkMode={isDarkMode} />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category/Product</label>
          <SearchableDropdown options={productOptions} value={selectedProduct} onChange={onProductChange} placeholder="Select Category" isDarkMode={isDarkMode} />
        </div>
        <div>
          <label className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Order Channel</label>
          <SearchableDropdown options={channelOptions} value={selectedChannel} onChange={onChannelChange} placeholder="Select Channel" isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Export */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <ExportButton
          headers={['Product Name', 'Category', 'Channel', 'Sold Qty', 'Retail Price', 'Revenue', 'Profit', 'Margin (%)']}
          data={filteredData.map(item => [
            item.productName,
            item.category || 'N/A',
            item.channel,
            item.soldQuantity.toString(),
            `PKR ${item.retailPrice.toFixed(0)}`,
            `PKR ${item.revenue.toFixed(0)}`,
            `PKR ${item.profit.toFixed(0)}`,
            `${item.margin.toFixed(1)}%`,
          ])}
          fileName="item-wise-sales-report"
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default ItemWiseForm;
