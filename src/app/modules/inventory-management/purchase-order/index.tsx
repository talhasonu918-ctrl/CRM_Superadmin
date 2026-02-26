import React from 'react';

export const PurchaseOrderView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchase Order</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">Create PO</button>
      </div>
      <div className={`p-8 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'} text-center`}>
        Purchase Order Content Implementation Coming Soon
      </div>
    </div>
  );
};

export default PurchaseOrderView;

