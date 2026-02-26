'use client';

import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import type { RiderSaleReportData } from '@/src/app/modules/pos/mockData';

const branchOptions = [
  { value: 'all-branches', label: 'All Branches' },
  { value: 'main-branch', label: 'Main Branch' },
  { value: 'branch-2', label: 'Branch 2' },
];

interface RiderFormProps {
  isDarkMode: boolean;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  selectedBranch: string;
  onBranchChange: (v: string) => void;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (v: 'list' | 'grid') => void;
  filteredData: RiderSaleReportData[];
}

export const RiderForm: React.FC<RiderFormProps> = ({
  isDarkMode,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  selectedBranch, onBranchChange,
  searchQuery, onSearchQueryChange,
  viewMode, onViewModeChange,
  filteredData,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <>
      {/* Filter Card */}
      <div className={`${cardStyle} rounded-2xl p-6 border ${borderStyle} shadow-sm`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar size={14} className="text-primary" /> From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar size={14} className="text-primary" /> To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-500">
              <MapPin size={14} className="text-primary" /> Branch
            </label>
            <SearchableDropdown
              options={branchOptions}
              value={selectedBranch}
              onChange={onBranchChange}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex justify-end gap-3 px-1">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search riders..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border ${borderStyle} outline-none focus:ring-2 focus:ring-primary/50 transition-all ${isDarkMode ? 'bg-[#1e2836] text-white' : 'bg-white text-gray-900'}`}
          />
        </div>
        <ExportButton
          filename="RiderWise_Sale_Report"
          title="Rider Wise Sale Report"
          headers={['Employee Id', 'Rider Name', 'Total Invoices', 'Total Distance (KM)', 'Total Revenue', 'Rating']}
          data={filteredData.map(item => [
            item.employeeId, item.riderName, item.totalInvoices,
            item.totalDistance.toFixed(2),
            `PKR ${item.totalRevenue.toLocaleString()}`,
            item.rating,
          ])}
          isDarkMode={isDarkMode}
        />
        <div className={`flex items-center p-1 rounded-xl border ${borderStyle} ${isDarkMode ? 'bg-[#1e2836]' : 'bg-white shadow-sm'}`}>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/30' : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}`}
          >
            <span className="text-sm font-medium">Grid</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/30' : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}`}
          >
            <span className="text-sm font-medium">List</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RiderForm;
