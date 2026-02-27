import React from 'react';
import StockVarianceTable from './table/stockvariance.Table';

export const StockVarianceView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="">
    
      <StockVarianceTable isDarkMode={isDarkMode} />
    </div>
  );
};

export default StockVarianceView;

