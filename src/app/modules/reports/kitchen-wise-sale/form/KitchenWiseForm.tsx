'use client';

import React, { useMemo } from 'react';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import { mockProducts } from '@/src/app/modules/pos/mockData';
import type { ExtendedKitchenSaleReportData } from '@/src/app/modules/reports/kitchen-wise-sale/types';

const kdsOptions = [
  { value: 'all', label: 'All KDS' },
  { value: 'Main Kitchen', label: 'Main Kitchen' },
  { value: 'Pizza Station', label: 'Pizza Station' },
  { value: 'Grill Station', label: 'Grill Station' },
  { value: 'Beverage Station', label: 'Beverage Station' },
];

interface KitchenWiseFormProps {
  isDarkMode: boolean;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  selectedProduct: string;
  onProductChange: (v: string) => void;
  selectedKDS: string;
  onKDSChange: (v: string) => void;
  aggregatedData: ExtendedKitchenSaleReportData[];
}

export const KitchenWiseForm: React.FC<KitchenWiseFormProps> = ({
  isDarkMode,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  selectedProduct, onProductChange,
  selectedKDS, onKDSChange,
  aggregatedData,
}) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const productOptions = useMemo(() => [
    { value: 'all', label: 'All Products' },
    ...mockProducts.map(p => ({ value: p.id, label: p.name })),
  ], []);

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
      <div className="flex flex-col lg:flex-row items-end gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm`}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm`}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">Product</label>
            <SearchableDropdown
              options={productOptions}
              value={selectedProduct}
              onChange={onProductChange}
              placeholder="Select Product"
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">KDS</label>
            <SearchableDropdown
              options={kdsOptions}
              value={selectedKDS}
              onChange={onKDSChange}
              placeholder="Select KDS Name"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <ExportButton
          filename="KitchenWise_Sale_Report"
          title="Kitchen Wise Sale Report"
          headers={['Kds Name', 'Total Products', 'Total Sold Quantity', 'Gross Sale', 'Total Sale Tax', 'Total Discount', 'Net Sale']}
          data={aggregatedData.map(item => [
            item.kdsName || 'N/A',
            (item.totalProducts ?? 0).toFixed(2),
            (item.totalSoldQuantity ?? 0).toFixed(2),
            (item.grossSale ?? 0).toFixed(2),
            (item.totalSaleTax ?? 0).toFixed(2),
            (item.totalDiscount ?? 0).toFixed(2),
            (item.netSale ?? 0).toFixed(2),
          ])}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default KitchenWiseForm;
