
import React, { useState, useMemo } from 'react';
import { UserCircle, Shield, Clock, Plus, MoreVertical, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_STAFF = [
  { name: 'Mario Batali', role: 'HEAD CHEF', shift: 'Morning', status: 'ACTIVE', lastActive: '2m ago' },
  { name: 'Orlando Laurentius', role: 'SUPER ADMIN', shift: 'All Day', status: 'ACTIVE', lastActive: 'Now' },
  { name: 'Alex Rivera', role: 'DELIVERY CAPTAIN', shift: 'Evening', status: 'OFFLINE', lastActive: '2h ago' },
];

export const StaffManagementView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredStaff = useMemo(() => {
    return INITIAL_STAFF.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const cardStyle = `rounded-xl border shadow-sm transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Staff Roster</h2>
          <p className="text-slate-400 text-xs font-medium">Manage operational roles, permissions and shifts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border-transparent transition-all outline-none min-w-[200px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'}`} 
              />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-8 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95 transition-all">
            <Plus size={18} /> Invite Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? filteredStaff.map((member) => (
          <div key={member.name} className={`${cardStyle} p-6 flex flex-col items-center text-center relative group`}>
             <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-all opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
             <div className="relative mb-6">
                <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random&color=fff`} className="w-16 h-16 rounded-xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-orange-50/20" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'} rounded-full border-4 border-white dark:border-[#16191F]`}></div>
             </div>
             <h4 className="font-bold text-sm leading-none mb-1">{member.name}</h4>
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg mb-6">{member.role}</span>
             
             <div className="w-full grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800 mb-6">
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Shift</p>
                   <p className="text-xs font-extrabold">{member.shift}</p>
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pulse</p>
                   <p className="text-xs font-extrabold">{member.lastActive}</p>
                </div>
             </div>

             <div className="flex gap-3 w-full">
                <button className="flex-1 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold text-[10px] hover:text-orange-500 transition-all uppercase tracking-widest">Audit Logs</button>
                <button className="flex-1 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-bold text-[10px] text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all uppercase tracking-widest">Restrict</button>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium">No staff members match your search.</div>
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
                <h3 className="text-lg font-extrabold">Invite New Staff</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Staff Member Name</label>
                  <input type="text" placeholder="e.g. Gordon Ramsay" className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                  <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}>
                    <option>Chef</option>
                    <option>Delivery</option>
                    <option>Admin</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Shift Type</label>
                  <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}>
                    <option>Morning (08:00 - 16:00)</option>
                    <option>Evening (16:00 - 00:00)</option>
                    <option>Full Day</option>
                  </select>
                </div>
                <button className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all">
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
