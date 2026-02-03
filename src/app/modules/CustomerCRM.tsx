
import React, { useState, useMemo } from 'react';
import { 
  Users, Heart, Award, Ban, History, 
  Search, Filter, Mail, ExternalLink, X, Plus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_CUSTOMERS = [
  { id: 'CUST-881', name: 'Emma Stone', email: 'emma@hollywood.com', phone: '+1 234 567 890', points: 1250, orders: 15, status: 'ACTIVE', spend: 450.00 },
  { id: 'CUST-882', name: 'Robert Downey', email: 'rdj@stark.com', phone: '+1 987 654 321', points: 450, orders: 4, status: 'ACTIVE', spend: 125.50 },
  { id: 'CUST-883', name: 'Amber Heard', email: 'amber@justice.com', phone: '+1 555 444 333', points: 0, orders: 1, status: 'BLOCKED', spend: 15.00 },
  { id: 'CUST-884', name: 'Tony Parker', email: 'tony@spurs.com', phone: '+1 222 333 444', points: 850, orders: 8, status: 'ACTIVE', spend: 280.00 },
];

export const CustomerCRMView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardStyle = `rounded-2xl border transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;

  const filteredCustomers = useMemo(() => {
    return INITIAL_CUSTOMERS.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Customer CRM</h2>
          <p className="text-slate-400 text-xs font-medium">Manage user profiles, loyalty and engagement.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border-transparent transition-all outline-none min-w-[240px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'}`} 
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/10">
             <Plus size={16} /> Add Customer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Members', val: INITIAL_CUSTOMERS.length.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5' },
          { label: 'Avg Loyalty', val: '650 pts', icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/5' },
          { label: 'Top Segment', val: 'Gold (12%)', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/5' },
        ].map((stat, i) => (
          <div key={i} className={`${cardStyle} p-6 flex items-center gap-5`}>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-extrabold">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={`${cardStyle} overflow-hidden`}>
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-4">Customer Details</th>
                  <th className="px-6 py-4">Loyalty Tier</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4">Total Spend</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Profile</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
               {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                 <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random&color=fff`} className="w-10 h-10 rounded-xl" />
                          <div>
                             <h5 className="text-xs font-extrabold">{c.name}</h5>
                             <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Mail size={10} /> {c.email}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <Award size={14} className="text-orange-400" />
                          <span className="text-xs font-bold">{c.points >= 1000 ? 'Gold' : c.points >= 500 ? 'Silver' : 'Bronze'}</span>
                       </div>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">{c.points} Points</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-xs font-extrabold">{c.orders}</span>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">Visits</p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">${c.spend.toFixed(2)}</p>
                       <p className="text-[9px] text-orange-500 font-bold uppercase">LTV</p>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                         c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                       }`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all"><ExternalLink size={14} /></button>
                          <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"><Ban size={14} /></button>
                       </div>
                    </td>
                 </tr>
               )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">No customers found.</td>
                </tr>
               )}
            </tbody>
         </table>
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
                <h3 className="text-lg font-extrabold">Register New Customer</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="e.g. Brad Pitt" className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="email@example.com" className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" placeholder="+1 234..." className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <button className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all">
                  Create Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
