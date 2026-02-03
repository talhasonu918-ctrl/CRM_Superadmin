
import React, { useState, useMemo } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import { Modal } from '../../components/Modal';

const INITIAL_INVENTORY = [
  { id: 'INV-001', name: 'Mozzarella Cheese', stock: 50, unit: 'kg', min: 20, status: 'NORMAL' },
  { id: 'INV-002', name: 'Artisan Burger Buns', stock: 150, unit: 'units', min: 200, status: 'LOW' },
  { id: 'INV-003', name: 'Angus Beef Patties', stock: 0, unit: 'kg', min: 10, status: 'OUT' },
  { id: 'INV-004', name: 'San Marzano Sauce', stock: 25, unit: 'liters', min: 10, status: 'NORMAL' },
];

export const InventoryManagementView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardStyle = `rounded-xl border shadow-sm transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  const filteredInventory = useMemo(() => {
    return INITIAL_INVENTORY.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Stock Inventory</h2>
          <p className="text-slate-400 text-xs font-medium">Critical material tracking and low stock mitigation.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search stock..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none transition-all min-w-[240px] ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'
                }`} 
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
           >
             <Plus size={18} /> New Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredInventory.length > 0 ? filteredInventory.map((item) => (
          <div key={item.id} className={`${cardStyle} p-6 flex flex-col group hover:border-orange-200`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 ${item.status === 'NORMAL' ? 'bg-blue-500/5 text-blue-500' : 'bg-rose-500/5 text-rose-500'} rounded-xl flex items-center justify-center`}>
                <Package size={22} />
              </div>
              {item.status !== 'NORMAL' && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'OUT' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'}`}>
                   <AlertTriangle size={10} /> {item.status}
                </div>
              )}
            </div>
            <h4 className="font-bold text-sm mb-0.5 leading-tight">{item.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{item.id}</p>
            
            <div className="flex-1 flex flex-col justify-end space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Stock</p>
                    <p className="text-2xl font-extrabold">{item.stock} <span className="text-[10px] text-slate-400 font-medium">{item.unit}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Threshold</p>
                    <p className="text-xs font-bold text-slate-300">{item.min} {item.unit}</p>
                  </div>
               </div>
               <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${item.status === 'NORMAL' ? 'bg-emerald-500' : item.status === 'LOW' ? 'bg-orange-500' : 'bg-rose-500'}`} 
                    style={{ width: `${Math.min(100, (item.stock / (item.min * 1.5)) * 100)}%` }}
                  ></div>
               </div>
            </div>
            <button className="w-full mt-6 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100">Restock Now</button>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium">No items found matching your search.</div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Inventory Item" 
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
            <input 
              type="text" 
              placeholder="e.g. Extra Virgin Olive Oil" 
              className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
              }`} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Current Stock</label>
              <input 
                type="number" 
                placeholder="0" 
                className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
                }`} 
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Unit</label>
              <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
                }`}>
                <option>kg</option>
                <option>liters</option>
                <option>units</option>
                <option>boxes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Min. Threshold</label>
            <input 
              type="number" 
              placeholder="e.g. 10" 
              className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-500'
              }`} 
            />
          </div>
          <button className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all">
            Add to Inventory
          </button>
        </div>
      </Modal>
    </div>
  );
};
