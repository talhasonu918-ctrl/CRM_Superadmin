
import React, { useState, useMemo } from 'react';
import { CreditCard, Wallet, FileText, CheckCircle, Clock, AlertCircle, ArrowUpDown, Search } from 'lucide-react';

const INITIAL_PAYMENTS = [
  { id: 'PAY-8821', order: 'ORD-5491', amount: 39.5, method: 'ONLINE (Stripe)', status: 'PAID', time: '10:30 AM', date: '2023-10-27' },
  { id: 'PAY-8822', order: 'ORD-5492', amount: 14.0, method: 'COD', status: 'UNPAID', time: '10:45 AM', date: '2023-10-27' },
  { id: 'PAY-8823', order: 'ORD-5493', amount: 20.0, method: 'JazzCash', status: 'PAID', time: '11:15 AM', date: '2023-10-26' },
  { id: 'PAY-8824', order: 'ORD-5494', amount: 55.0, method: 'Stripe', status: 'REFUNDED', time: '12:00 PM', date: '2023-10-20' },
];

export const PaymentView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'weekly' | 'monthly'>('today');
  
  const cardStyle = `rounded-xl border shadow-sm transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  const filteredPayments = useMemo(() => {
    return INITIAL_PAYMENTS.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase()) || 
                            p.order.toLowerCase().includes(search.toLowerCase());
      
      // Simulated date filtering logic (simplified for demo)
      let matchesDate = true;
      if (dateFilter === 'today' && p.date !== '2023-10-27') matchesDate = false;
      if (dateFilter === 'weekly' && !['2023-10-27', '2023-10-26'].includes(p.date)) matchesDate = false;
      
      return matchesSearch && matchesDate;
    });
  }, [search, dateFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Transaction Ledger</h2>
          <p className="text-slate-400 text-xs font-medium">Tracking and reconciling all financial flows.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search TxID or Order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border-transparent transition-all outline-none min-w-[240px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-100'}`} 
              />
           </div>
           <button className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95 transition-all">
             <FileText size={16} /> Export CSV
           </button>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {['today', 'weekly', 'monthly'].map((period) => (
          <button
            key={period}
            onClick={() => setDateFilter(period as any)}
            className={`px-5 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
              dateFilter === period ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sales', val: '$1,240.50', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
          { label: 'Pending COD', val: '$320.00', icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-500/5' },
          { label: 'Refunds', val: '$45.00', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/5' },
        ].map((stat, i) => (
          <div key={i} className={`${cardStyle} p-6 flex items-center gap-5`}>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h3 className="text-xl font-extrabold">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={`${cardStyle} overflow-hidden`}>
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4">Transaction ID <ArrowUpDown size={10} className="inline ml-1 opacity-30" /></th>
              <th className="px-6 py-4">Order Ref</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4 text-center">Net Amount</th>
              <th className="px-6 py-4">Settlement Status</th>
              <th className="px-6 py-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredPayments.length > 0 ? filteredPayments.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-bold text-xs">{p.id}</td>
                <td className="px-6 py-4 font-bold text-xs text-slate-400">{p.order}</td>
                <td className="px-6 py-4 font-bold text-xs">{p.method}</td>
                <td className="px-6 py-4 text-center font-extrabold text-xs text-orange-500">${p.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                    p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 
                    p.status === 'UNPAID' ? 'bg-orange-500/10 text-orange-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {p.status === 'PAID' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[10px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">Get Receipt</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">No transactions match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
