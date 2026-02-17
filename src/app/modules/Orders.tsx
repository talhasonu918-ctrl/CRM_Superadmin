
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Printer, MoreVertical, 
  UserCircle, ArrowUpDown, X, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../../lib/types';

const INITIAL_ORDERS: Order[] = [
  { id: '#ORD-5491', items: [{ name: 'BBQ Beef Pizza', qty: 2, price: 49.00 }], total: 54.50, customer: 'John Wick', status: 'PREPARING', payment: 'PAID', method: 'ONLINE', time: '5m ago' },
  { id: '#ORD-5492', items: [{ name: 'Double Wagyu Burger', qty: 1, price: 22.50 }], total: 24.00, customer: 'Sarah Connor', status: 'PENDING', payment: 'UNPAID', method: 'COD', time: '12m ago' },
  { id: '#ORD-5493', items: [{ name: 'Strawberry Mojito', qty: 3, price: 21.00 }], total: 23.00, customer: 'Tony Stark', status: 'READY', payment: 'PAID', method: 'ONLINE', time: '20m ago' },
  { id: '#ORD-5494', items: [{ name: 'Truffle Fries', qty: 1, price: 9.00 }], total: 10.50, customer: 'Bruce Wayne', status: 'DELIVERY', payment: 'PAID', method: 'ONLINE', time: '45m ago' },
];

export const OrdersView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter(order => {
      const matchesFilter = filter === 'ALL' || order.status === filter;
      const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                            order.id.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const cardStyle = `rounded-2xl border transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      PENDING: 'bg-slate-100 text-slate-500 dark:bg-slate-800',
      ACCEPTED: 'bg-blue-50 text-blue-500 dark:bg-blue-500/10',
      PREPARING: 'bg-orange-50 text-orange-500 dark:bg-orange-500/10',
      READY: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10',
      DELIVERY: 'bg-primary/10 text-primary dark:bg-primary/20',
      DELIVERED: 'bg-emerald-500/10 text-emerald-600',
      CANCELLED: 'bg-rose-50 text-rose-500 dark:bg-rose-500/10',
    };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Active Orders</h2>
          <p className="text-slate-400 text-xs font-medium">Monitoring real-time kitchen and delivery flow.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border-transparent transition-all outline-none min-w-[240px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'}`} 
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 rounded-xl text-white font-bold text-[11px] shadow-lg shadow-orange-500/10 active:scale-95 transition-all">
             <Plus size={14} /> New Order
           </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit overflow-x-auto">
        {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERY'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === s ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={`${cardStyle} overflow-hidden`}>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4">Order ID <ArrowUpDown size={10} className="inline ml-1 opacity-40" /></th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items Summary</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-5">
                  <span className="font-extrabold text-xs">{order.id}</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.time}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <UserCircle size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-xs">{order.customer}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Downtown Zone</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs font-semibold truncate max-w-[180px]">{order.items[0].qty}x {order.items[0].name}</p>
                  {order.items.length > 1 && <p className="text-[10px] text-orange-500 font-bold">+{order.items.length - 1} more items</p>}
                </td>
                <td className="px-6 py-5">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-bold ${order.payment === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>{order.payment}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{order.method}</span>
                   </div>
                </td>
                <td className="px-6 py-5 font-extrabold text-xs text-slate-700 dark:text-slate-200">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><Printer size={14} /></button>
                    <button className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white">Process</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">No orders found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg p-8 rounded-3xl shadow-2xl ${isDarkMode ? 'bg-[#1A1E26]' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold">Create New Order</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                  <input type="text" placeholder="Enter name..." className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Order Type</label>
                    <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}>
                      <option>Dine-in</option>
                      <option>Takeaway</option>
                      <option>Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Payment</label>
                    <select className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}>
                      <option>COD</option>
                      <option>Online</option>
                    </select>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all">
                  Generate Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
