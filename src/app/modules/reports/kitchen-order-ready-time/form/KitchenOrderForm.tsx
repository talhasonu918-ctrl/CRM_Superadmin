'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import type { KitchenOrderReadyTimeData } from '@/src/app/modules/pos/mockData';

const orderTypeOptions = [
  { value: 'all', label: 'All Order Types' },
  { value: 'TakeAway', label: 'TakeAway' },
  { value: 'DineIn', label: 'DineIn' },
  { value: 'Delivery', label: 'Delivery' },
];

interface KitchenOrderFormProps {
  isDarkMode: boolean;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  selectedOrderType: string;
  onOrderTypeChange: (v: string) => void;
  filteredData: KitchenOrderReadyTimeData[];
}

export const KitchenOrderForm: React.FC<KitchenOrderFormProps> = ({
  isDarkMode,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  searchTerm, onSearchTermChange,
  selectedOrderType, onOrderTypeChange,
  filteredData,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
      <div className="flex flex-col lg:flex-row items-end gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Invoice/Waiter/Rider..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">Order Type</label>
            <SearchableDropdown
              options={orderTypeOptions}
              value={selectedOrderType}
              onChange={onOrderTypeChange}
              placeholder="Select Order Type"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <ExportButton
          filename="Kitchen_ReadyTime_Report"
          title="Kitchen Order Ready Time Report"
          headers={['Invoice ID', 'Order Type', 'Order No', 'Waiter', 'Rider', 'Table No', 'Delay Time', 'Status']}
          data={filteredData.map(item => [
            item.invoiceId, item.orderType, item.orderNo, item.waiter,
            item.rider, item.tableNo, item.delayTime || '00:00:00', item.status,
          ])}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default KitchenOrderForm;
