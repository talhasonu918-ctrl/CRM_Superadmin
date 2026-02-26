import React from 'react';

export const StocksGRNTable: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className={`p-8 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'} text-center`}>
      Stocks / GRN Table Implementation Coming Soon
    </div>
  );
};

