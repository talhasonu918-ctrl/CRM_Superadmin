import React from 'react';
import { StockLocationTable } from './table/StockLocationTable';
import { StockLocationForm } from './form/StockLocationForm';

export const StockLocationView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Location</h2>
        <StockLocationForm isDarkMode={isDarkMode} />
      </div>
      <StockLocationTable isDarkMode={isDarkMode} />
    </div>
  );
};

export default StockLocationView;

