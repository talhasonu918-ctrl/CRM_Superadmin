import React from 'react';

export const StockMovementReportView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Movement Report</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">Export Report</button>
      </div>
      <div className={`p-8 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'} text-center`}>
        Stock Movement Report Content Implementation Coming Soon
      </div>
    </div>
  );
};

export default StockMovementReportView;

