import React from 'react';

export const StockAdjustmentView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Adjustment</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">New Adjustment</button>
      </div>
      <div className={`p-8 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'} text-center`}>
        Stock Adjustment Content Implementation Coming Soon
      </div>
    </div>
  );
};

export default StockAdjustmentView;

