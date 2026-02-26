import React from 'react';
import { StocksGRNTable } from './table/stocksgrn.Table';
import { StocksGRNForm } from './form/stocksgrn.Form';

export const StocksGRNView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Stocks / GRN</h2>
        <StocksGRNForm isDarkMode={isDarkMode} />
      </div>
      <StocksGRNTable isDarkMode={isDarkMode} />
    </div>
  );
};

export default StocksGRNView;

