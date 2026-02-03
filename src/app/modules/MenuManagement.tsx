
import React, { useState, useMemo } from 'react';
import { Plus, Search, Star, Edit3, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../lib/types';

const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'BBQ Beef Brisket Pizza', category: 'Pizza', price: 24.5, description: 'Slow cooked brisket with house smokey sauce', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop', available: true, stock: 45, rating: 4.9 },
  { id: '2', name: 'Zesty Jalapeno Burger', category: 'Burger', price: 16.0, description: 'Angus beef patty with fire-roasted peppers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop', available: true, stock: 20, rating: 4.8 },
  { id: '3', name: 'Classic Strawberry Shake', category: 'Drinks', price: 8.5, description: 'Fresh berries and artisanal ice cream', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=300&auto=format&fit=crop', available: false, stock: 0, rating: 4.7 },
  { id: '4', name: 'Truffle Parmesan Fries', category: 'Sides', price: 9.0, description: 'Hand-cut potatoes with truffle zest', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=300&auto=format&fit=crop', available: true, stock: 120, rating: 4.6 },
];

export const MenuManagementView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [activeCat, setActiveCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardStyle = `rounded-2xl border transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;

  const filteredMenu = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(item => {
      const matchesCat = activeCat === 'ALL' || item.category === activeCat;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCat, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Menu Catalog</h2>
          <p className="text-slate-400 text-xs font-medium">Manage categories, availability and recipes.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border-transparent transition-all outline-none min-w-[200px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'}`} 
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
             <Plus size={18} /> Add Item
           </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit overflow-x-auto">
        {['ALL', 'Pizza', 'Burger', 'Drinks', 'Dessert', 'Sides'].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeCat === c ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.length > 0 ? filteredMenu.map((item) => (
          <div key={item.id} className={`${cardStyle} overflow-hidden group hover:border-orange-200 transition-all`}>
            <div className="relative h-48 overflow-hidden">
               <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-600 hover:text-orange-500 transition-colors"><Edit3 size={14} /></button>
                  <button className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
               </div>
               <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${item.available ? 'bg-emerald-500/20 text-white' : 'bg-rose-500/80 text-white'}`}>
                  {item.available ? 'In Stock' : 'Out of Stock'}
               </div>
            </div>
            <div className="p-5">
               <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.category}</span>
                  <div className="flex items-center gap-1 text-[#FECB00]">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.rating}</span>
                  </div>
               </div>
               <h4 className="font-extrabold text-sm mb-1">{item.name}</h4>
               <p className="text-[11px] text-slate-400 font-medium mb-5 line-clamp-2 h-8 leading-relaxed">{item.description}</p>
               
               <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-lg font-black text-orange-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Stock</p>
                       <p className={`text-[11px] font-extrabold ${item.stock < 15 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.stock}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium">No menu items found.</div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg p-8 rounded-3xl shadow-2xl ${isDarkMode ? 'bg-[#1A1E26]' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold">Add Menu Item</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                  <input type="text" placeholder="e.g. Mushroom Swiss" className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}>
                      <option>Pizza</option>
                      <option>Burger</option>
                      <option>Drinks</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                    <input type="number" step="0.01" placeholder="12.99" className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea placeholder="Ingredients, recipe notes..." rows={3} className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <button className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all">
                  Publish to Menu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
