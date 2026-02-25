
import React, { useState, useMemo, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  Cell, PieChart, Pie
} from 'recharts';
import {
  ShoppingBag, Users, DollarSign, Star,
  Clock, TrendingUp, CheckCircle2, Loader2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { mockLiveOrders, DashboardLiveOrder } from './pos/mockData';

const REVENUE_DATA = {
  today: [
    { name: '08:00', sales: 400, orders: 12 },
    { name: '10:00', sales: 1200, orders: 35 },
    { name: '12:00', sales: 2800, orders: 84 },
    { name: '14:00', sales: 2100, orders: 60 },
    { name: '16:00', sales: 1500, orders: 42 },
    { name: '18:00', sales: 3400, orders: 98 },
    { name: '20:00', sales: 4200, orders: 110 },
  ],
  weekly: [
    { name: 'Mon', sales: 12000, orders: 450 },
    { name: 'Tue', sales: 15000, orders: 510 },
    { name: 'Wed', sales: 13000, orders: 480 },
    { name: 'Thu', sales: 19000, orders: 620 },
    { name: 'Fri', sales: 24000, orders: 850 },
    { name: 'Sat', sales: 28000, orders: 940 },
    { name: 'Sun', sales: 21000, orders: 760 },
  ],
  monthly: [
    { name: 'Week 1', sales: 84000, orders: 2800 },
    { name: 'Week 2', sales: 92000, orders: 3100 },
    { name: 'Week 3', sales: 89000, orders: 2950 },
    { name: 'Week 4', sales: 112000, orders: 3800 },
  ]
};

const CATEGORY_DATA = [
  { name: 'Pizza', value: 45, color: '#FF6B35' },
  { name: 'Burgers', value: 35, color: '#334155' },
  { name: 'Drinks', value: 12, color: '#94A3B8' },
  { name: 'Desserts', value: 8, color: '#E2E8F0' },
];

const POPULAR_ITEMS = [
  { name: 'Truffle Mushroom Pizza', sold: 842, revenue: 16840, rating: 4.9, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop' },
  { name: 'Double Wagyu Burger', sold: 612, revenue: 15300, rating: 4.8, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { name: 'Belgian Choco Shake', sold: 450, revenue: 4500, rating: 4.7, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200&auto=format&fit=crop' },
];


export const DashboardView: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [timeframe, setTimeframe] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [liveOrders, setLiveOrders] = useState<DashboardLiveOrder[]>(mockLiveOrders);

  const cardStyle = `rounded-2xl border transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;

  useEffect(() => {
    // Helper to format time
    const formatTime = (timestamp: number) => {
      const diff = Date.now() - timestamp;
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ago`;
    };

    // Load existing kitchen orders on mount
    if (typeof window !== 'undefined') {
      const savedKitchenOrders = localStorage.getItem('kitchenOrders');
      if (savedKitchenOrders) {
        try {
          const kitchenOrders = JSON.parse(savedKitchenOrders);
          const mappedOrders: DashboardLiveOrder[] = kitchenOrders.slice(0, 5).map((ko: any) => {
            const itemTexts = (ko.items || []).map((it: any) => `${it.quantity}x ${it.name}`);
            const dealTexts = (ko.deals || []).map((d: any) => `Deal: ${d.name}`);
            const combinedItems = [...itemTexts, ...dealTexts].join(', ');

            return {
              id: ko.orderNumber,
              customer: ko.customerName || ko.waiterName || 'Guest',
              items: combinedItems || 'Order Detail',
              status: ko.status === 'ready' ? 'Ready' : 'Preparing',
              time: formatTime(ko.timestamp || Date.now()),
              total: ko.grandTotal || 0,
              timestamp: ko.timestamp || Date.now()
            };
          });
          
          setLiveOrders(prev => {
            // Keep the mock data if no real orders exist, else merge
            const combined = [...mappedOrders];
            // Add mock orders that aren't replaced by real orders (optional)
            prev.forEach(mock => {
              if (!combined.find(o => o.id === mock.id)) combined.push(mock);
            });
            return combined.slice(0, 5);
          });
        } catch (e) {
          console.error('Error loading dashboard orders:', e);
        }
      }
    }

    // Update times every minute
    const interval = setInterval(() => {
      setLiveOrders(prev => prev.map(order => ({
        ...order,
        time: order.timestamp ? formatTime(order.timestamp) : order.time
      })));
    }, 30000);

    // Listen for new orders from POS
    const handleNewOrder = (event: any) => {
      const kitchenOrder = event.detail;
      
      const itemTexts = (kitchenOrder.items || []).map((it: any) => `${it.quantity}x ${it.name}`);
      const dealTexts = (kitchenOrder.deals || []).map((d: any) => `Deal: ${d.name}`);
      const itemsString = [...itemTexts, ...dealTexts].join(', ') || 'New Order';

      const newLiveOrder: DashboardLiveOrder = {
        id: kitchenOrder.orderNumber || `#${Math.floor(Math.random() * 9000) + 1000}`,
        customer: kitchenOrder.customerName || kitchenOrder.waiterName || 'Guest',
        items: itemsString,
        status: 'Preparing',
        time: 'Just now',
        total: kitchenOrder.grandTotal || 0,
        timestamp: Date.now()
      };

      setLiveOrders(prev => {
        const existingIndex = prev.findIndex(o => o.id === newLiveOrder.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newLiveOrder };
          return updated;
        }
        return [newLiveOrder, ...prev].slice(0, 5);
      });
    };

    // Listen for order status updates from Kitchen Display
    const handleOrderReady = (event: any) => {
      const readyOrder = event.detail;
      setLiveOrders(prev => {
        // If order exists, update status
        const existingIndex = prev.findIndex(o => o.id === readyOrder.orderNumber);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { 
            ...updated[existingIndex], 
            status: 'Ready' 
          };
          return updated;
        }
        
        // If order doesn't exist (e.g. refresh), add it
        const itemTexts = (readyOrder.items || []).map((it: any) => `${it.quantity}x ${it.name}`);
        const dealTexts = (readyOrder.deals || []).map((d: any) => `Deal: ${d.name}`);
        const itemsString = [...itemTexts, ...dealTexts].join(', ') || 'Ready for Collection';

        const newReadyOrder: DashboardLiveOrder = {
          id: readyOrder.orderNumber,
          customer: readyOrder.customerName || readyOrder.waiterName || 'Guest',
          items: itemsString,
          status: 'Ready',
          time: 'Just now',
          total: readyOrder.grandTotal || 0,
          timestamp: Date.now()
        };
        
        return [newReadyOrder, ...prev].slice(0, 5);
      });
    };

    // Listen for custom events
    window.addEventListener('sendToKitchen', handleNewOrder);
    window.addEventListener('orderReady', handleOrderReady);

    // Sync across tabs via localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kitchenOrders' && e.newValue) {
        try {
          const kitchenOrders = JSON.parse(e.newValue);
          const mappedOrders: DashboardLiveOrder[] = kitchenOrders.slice(0, 5).map((ko: any) => ({
            id: ko.orderNumber,
            customer: ko.customerName || ko.waiterName || 'Guest',
            items: ko.items ? ko.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ') : 'Order Detail',
            status: ko.status === 'ready' ? 'Ready' : (ko.status === 'preparing' ? 'Preparing' : 'Pending'),
            time: formatTime(ko.timestamp || Date.now()),
            total: ko.grandTotal || 0,
            timestamp: ko.timestamp || Date.now()
          }));
          
          setLiveOrders(prev => {
            const result = [...mappedOrders];
            // Preserve mock data if results are fewer than 5
            if (result.length < 5) {
              prev.forEach(mock => {
                if (result.length < 5 && !result.find(o => o.id === mock.id)) {
                  result.push(mock);
                }
              });
            }
            return result.slice(0, 5);
          });
        } catch (err) {
          console.error('Error syncing storage in dashboard:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sendToKitchen', handleNewOrder);
      window.removeEventListener('orderReady', handleOrderReady);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const currentStats = useMemo(() => {
    const data = REVENUE_DATA[timeframe];
    const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
    const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
    
    return [
      { label: timeframe === 'today' ? 'Today Orders' : timeframe === 'weekly' ? 'Weekly Orders' : 'Monthly Orders', val: totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-primary', bg: 'bg-orange-500/5', trend: '+12.5%' },
      { label: 'Total Revenue', val: `$${totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: '+8.2%' },
      { label: 'Active Customers', val: '842', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5', trend: '+2.4%' },
      { label: 'Order Acceptance', val: '98.5%', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/5', trend: '+0.4%' },
    ];
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-400 text-xs font-medium">Real-time overview of your food operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['today', 'weekly', 'monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                  timeframe === t ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, i) => (
          <div key={i} className={`${cardStyle} p-5 flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[11px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-extrabold mt-1">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sales Chart */}
        <div className={`col-span-12 lg:col-span-8 ${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Revenue Analytics ({timeframe})</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[11px] font-bold text-slate-400">Sales</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA[timeframe]}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v >= 1000 ? v/1000 + 'k' : v}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="sales" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Tracking */}
        <div className={`col-span-12 lg:col-span-4 ${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Live Operations</h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
              <Loader2 className="w-3 h-3 animate-spin" /> Real-time
            </div>
          </div>
          <div className="space-y-4">
            {liveOrders.map((order, i) => (
              <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-800/20' : 'border-slate-50 bg-slate-50/50'} hover:border-orange-200 transition-colors cursor-pointer`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-xs">{order.id} • {order.customer}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                    order.status === 'Ready' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : order.status === 'Preparing'
                        ? 'bg-orange-500/10 text-primary' 
                        : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mb-2 truncate" title={order.items}>{order.items}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock size={12} /> {order.time}
                  </div>
                  <span className="font-bold text-xs text-primary">${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};
