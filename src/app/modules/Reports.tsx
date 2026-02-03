
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingBag, PieChart as PieChartIcon, Calendar } from 'lucide-react';

const salesPerformance = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 198 },
  { name: 'Wed', revenue: 5000, orders: 320 },
  { name: 'Thu', revenue: 4780, orders: 280 },
  { name: 'Fri', revenue: 6890, orders: 410 },
  { name: 'Sat', revenue: 8390, orders: 520 },
  { name: 'Sun', revenue: 7100, orders: 480 },
];

const bestSellers = [
  { item: 'Pepperoni Pizza', quantity: 850, revenue: 12750 },
  { item: 'Zesty Beef Burger', quantity: 620, revenue: 9300 },
  { item: 'Truffle Pasta', quantity: 450, revenue: 10125 },
  { item: 'Choco Shake', quantity: 380, revenue: 2280 },
  { item: 'Caesar Salad', quantity: 310, revenue: 2790 },
];

export const ReportsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const cardStyle = `rounded-xl border shadow-sm p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Business Reports</h2>
          <p className="text-slate-400 text-xs font-medium">Deep dive into sales, growth and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-xs ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
            <Calendar size={14} /> Custom Range
          </button>
          <button className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95 transition-all">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Growth rate', val: '+24.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
          { label: 'Avg Order Value', val: '$28.40', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-500/5' },
          { label: 'Peak Order Time', val: '7 PM - 9 PM', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/5' }
        ].map((stat, i) => (
          <div key={i} className={`${cardStyle} flex items-center gap-5`}>
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

      <div className="grid grid-cols-12 gap-6">
        <div className={`col-span-12 lg:col-span-8 ${cardStyle}`}>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold tracking-tight">Revenue Trend</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> <span className="text-[10px] font-bold text-slate-400">Revenue</span></div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesPerformance}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px'}} />
                <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`col-span-12 lg:col-span-4 ${cardStyle}`}>
          <h4 className="text-sm font-bold tracking-tight mb-6">Best Selling Items</h4>
          <div className="space-y-4">
            {bestSellers.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-bold">{item.item}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.quantity} units sold</p>
                </div>
                <p className="text-xs font-extrabold text-orange-500">${item.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">View All Products</button>
        </div>
      </div>
    </div>
  );
};

const Clock = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
