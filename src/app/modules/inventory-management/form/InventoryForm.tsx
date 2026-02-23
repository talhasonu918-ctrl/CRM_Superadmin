'use client';

import React from 'react';
import { Search, Plus, Calendar } from 'lucide-react';
import { ExportButton } from '@/src/components/ExportButton';
import type { InventoryItem } from '@/src/app/modules/pos/mockData';

interface InventoryFormProps {
  isDarkMode: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onAddClick: () => void;
  filteredData: InventoryItem[];
  startDate: string;
  onStartDateChange: (v: string) => void;
  endDate: string;
  onEndDateChange: (v: string) => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  isDarkMode,
  search,
  onSearchChange,
  onAddClick,
  filteredData,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 border-b border-slate-100 dark:border-slate-800">
      <div className="text-lg font-bold">Product List</div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Date Range Group */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={`pl-9 pr-3 py-2 rounded-lg text-xs outline-none transition-all w-[140px] ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
              } border`}
            />
          </div>
          <span className="text-slate-400 text-xs font-bold">To</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={`pl-9 pr-3 py-2 rounded-lg text-xs outline-none transition-all w-[140px] ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
              } border`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full sm:min-w-[200px] pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
              }`}
            />
          </div>
          <ExportButton
            filename="Inventory_Report"
            title="Inventory Management Report"
            isDarkMode={isDarkMode}
            headers={['Product Name', 'Category', 'Stock', 'Min Stock', 'Price', 'SalesCount', 'Status', 'Last Updated']}
            data={filteredData.map(item => [
              item.name,
              item.category,
              item.stock,
              item.minStock,
              item.price,
              item.salesCount || 0,
              item.status,
              item.lastUpdated || '-'
            ])}
          />
          <button
            onClick={onAddClick}
            className="bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;
