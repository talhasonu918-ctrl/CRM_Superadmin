import React from 'react';

export const StockLocationTable: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className={`rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'} overflow-hidden`}>
      <table className="w-full text-left border-collapse">
        <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
          <tr>
            <th className="p-4 font-bold text-sm">Location Name</th>
            <th className="p-4 font-bold text-sm">Warehouse</th>
            <th className="p-4 font-bold text-sm">Address</th>
            <th className="p-4 font-bold text-sm">Status</th>
            <th className="p-4 font-bold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
            <td className="p-4 text-sm">Main Warehouse</td>
            <td className="p-4 text-sm">Warehouse A</td>
            <td className="p-4 text-sm">123 Street, City</td>
            <td className="p-4">
              <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Active</span>
            </td>
            <td className="p-4 text-sm">...</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

