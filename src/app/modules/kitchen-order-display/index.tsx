import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Printer, CheckCircle, User, ShoppingBag, Star, Search } from 'lucide-react';
import { getThemeColors } from '../../../theme/colors';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

interface Deal {
  name: string;
  items: string[];
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DineIn' | 'TakeAway' | 'Delivery';
  waiterName: string;
  elapsedTime: string;
  items: OrderItem[];
  deals?: Deal[];
  status: 'preparing' | 'ready' | 'served';
  customerName?: string;
  customerPhone?: string;
  timestamp?: number;
}

interface KitchenDisplayViewProps {
  isDarkMode?: boolean;
}

// Mock data matching the image design - Initial orders
const initialMockOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: '# 115',
    tableNumber: 'G11',
    orderType: 'DineIn',
    waiterName: 'Ahmed Ali',
    elapsedTime: '23:03',
    status: 'preparing',
    timestamp: Date.now() - 23 * 60 * 1000,
    items: [
      { id: '1', name: 'Grilled Chicken', quantity: 2, completed: false },
      { id: '2', name: 'Caesar Salad', quantity: 1, completed: true },
      { id: '3', name: 'French Fries', quantity: 3, completed: false },
    ],
    deals: [
      {
        name: 'Family Deal',
        items: ['2x Pizza', '1x Pasta', '4x Drinks']
      }
    ]
  },
  {
    id: '2',
    orderNumber: '# 114',
    tableNumber: 'F8',
    orderType: 'DineIn',
    waiterName: 'Sara Khan',
    elapsedTime: '20:42',
    status: 'preparing',
    timestamp: Date.now() - 20 * 60 * 1000,
    items: [
      { id: '1', name: 'Beef Burger', quantity: 2, completed: true },
      { id: '2', name: 'Chicken Wings', quantity: 1, completed: false },
      { id: '3', name: 'Onion Rings', quantity: 2, completed: true },
      { id: '4', name: 'Coca Cola', quantity: 2, completed: true },
    ],
  },
  {
    id: '3',
    orderNumber: '# 113',
    tableNumber: 'G3',
    orderType: 'DineIn',
    waiterName: 'Hassan Raza',
    elapsedTime: '18:15',
    status: 'ready',
    timestamp: Date.now() - 18 * 60 * 1000,
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, completed: true },
      { id: '2', name: 'Garlic Bread', quantity: 1, completed: true },
      { id: '3', name: 'Ice Cream', quantity: 2, completed: true },
    ],
  },
  {
    id: '4',
    orderNumber: '# 112',
    tableNumber: 'TKA-001',
    orderType: 'TakeAway',
    waiterName: 'Fatima Sheikh',
    elapsedTime: '15:28',
    status: 'preparing',
    timestamp: Date.now() - 15 * 60 * 1000,
    customerName: 'Muhammad Usman',
    customerPhone: '+92 300 1234567',
    items: [
      { id: '1', name: 'Chicken Biryani', quantity: 3, completed: false },
      { id: '2', name: 'Raita', quantity: 3, completed: true },
      { id: '3', name: 'Salad', quantity: 1, completed: true },
      { id: '4', name: 'Garlic Naan', quantity: 4, completed: false },
    ],
    deals: [
      {
        name: 'Lunch Special',
        items: ['3x Biryani', '3x Drinks', '3x Raita']
      }
    ]
  },
  {
    id: '5',
    orderNumber: '# 111',
    tableNumber: 'A5',
    orderType: 'Delivery',
    waiterName: 'Ali Ahmed',
    elapsedTime: '12:05',
    status: 'ready',
    timestamp: Date.now() - 12 * 60 * 1000,
    customerName: 'Ayesha Khan',
    customerPhone: '+92 321 9876543',
    items: [
      { id: '1', name: 'BBQ Pizza', quantity: 2, completed: true },
      { id: '2', name: 'Chicken Tikka', quantity: 1, completed: true },
      { id: '3', name: 'Pepsi', quantity: 4, completed: true },
    ],
  },
  {
    id: '6',
    orderNumber: '# 110',
    tableNumber: 'B7',
    orderType: 'DineIn',
    waiterName: 'Zainab Ali',
    elapsedTime: '08:30',
    status: 'preparing',
    timestamp: Date.now() - 8 * 60 * 1000,
    items: [
      { id: '1', name: 'Pasta Alfredo', quantity: 1, completed: true },
      { id: '2', name: 'Soup', quantity: 2, completed: false },
    ],
  },
  {
    id: '7',
    orderNumber: '# 109',
    tableNumber: 'TKA-002',
    orderType: 'TakeAway',
    waiterName: 'Hassan Raza',
    elapsedTime: '06:15',
    status: 'preparing',
    timestamp: Date.now() - 6 * 60 * 1000,
    customerName: 'Ali Hassan',
    customerPhone: '+92 333 5554444',
    items: [
      { id: '1', name: 'Beef Burger', quantity: 4, completed: false },
      { id: '2', name: 'Loaded Fries', quantity: 2, completed: false },
      { id: '3', name: 'Chicken Nuggets', quantity: 3, completed: true },
      { id: '4', name: 'Coca Cola', quantity: 4, completed: false },
      { id: '5', name: 'Sprite', quantity: 2, completed: false },
    ],
  },
  {
    id: '8',
    orderNumber: '# 108',
    tableNumber: 'TKA-003',
    orderType: 'TakeAway',
    waiterName: 'Fatima Sheikh',
    elapsedTime: '04:22',
    status: 'preparing',
    timestamp: Date.now() - 4 * 60 * 1000,
    customerName: 'Sarah Ahmed',
    customerPhone: '+92 345 7778888',
    items: [
      { id: '1', name: 'Pizza Sandwich', quantity: 2, completed: false },
      { id: '2', name: 'Club Sandwich', quantity: 1, completed: false },
      { id: '3', name: 'French Fries', quantity: 2, completed: true },
    ],
    deals: [
      {
        name: 'Sandwich Combo',
        items: ['2x Sandwich', '2x Fries', '2x Drinks']
      }
    ]
  },
];

const KitchenOrderCard: React.FC<{ order: KitchenOrder; isDarkMode: boolean; onReady: (order: KitchenOrder) => void }> = ({ order, isDarkMode, onReady }) => {
  const theme = getThemeColors(isDarkMode);
  const [itemStates, setItemStates] = useState(order.items);
  const [dealsExpanded, setDealsExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds

  // Countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleItemComplete = (itemId: string) => {
    setItemStates(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedItems = itemStates.filter(item => item.completed).length;
  const totalItems = itemStates.length;
  const isAllCompleted = completedItems === totalItems;

  // Get badge color based on order type
  const getBadgeColor = () => {
    switch (order.orderType) {
      case 'DineIn':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'TakeAway':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Delivery':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col min-h-[320px] max-h-[420px] border-2 ${theme.neutral.card} ${theme.border.main} ${theme.text.primary} shadow-md hover:shadow-lg`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header - All info on two lines */}
      <div className="relative z-10 mb-3">
        {/* Line 1: Order # | Table | Type */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-black">{order.orderNumber}</span>
          <span className="text-lg font-black text-gray-400 dark:text-gray-600">|</span>
          <span className="text-lg font-bold">{order.tableNumber}</span>
          <span className="text-lg font-black text-gray-400 dark:text-gray-600">|</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${getBadgeColor()}`}>{order.orderType}</span>
        </div>
        
        {/* Line 2: Waiter Name | Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={12} className={theme.text.tertiary} />
            <span className={`text-xs font-medium ${theme.text.secondary}`}>{order.waiterName}</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-100'}`}>
            <Clock size={12} className="text-orange-600" />
            <span className="text-sm font-bold text-orange-600">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="relative z-10 flex-1 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={12} className={theme.text.tertiary} />
          <span className={`text-xs font-bold ${theme.text.tertiary}`}>ITEMS ({completedItems}/{totalItems})</span>
        </div>
        
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
          {itemStates.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItemComplete(item.id)}
              className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all ${
                item.completed 
                  ? `${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} opacity-70` 
                  : `${isDarkMode ? 'bg-gray-800/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                item.completed 
                  ? 'bg-orange-500 border-orange-500' 
                  : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
              }`}>
                {item.completed && <CheckCircle size={10} className="text-white" />}
              </div>
              <span className={`text-xs font-medium text-left flex-1 ${
                item.completed ? 'line-through' : ''
              }`}>
                {item.quantity}x {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Deals Section - Collapsible */}
        {order.deals && order.deals.length > 0 && (
          <div className="mt-3">
            <button 
              onClick={() => setDealsExpanded(!dealsExpanded)}
              className={`w-full flex items-center justify-between gap-1 mb-2 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-yellow-400" />
                <span className={`text-xs font-bold ${theme.text.tertiary}`}>DEALS ({order.deals.length})</span>
              </div>
              <svg 
                className={`w-3 h-3 transition-transform ${dealsExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dealsExpanded && (
              <div className="space-y-2">
                {order.deals!.map((deal, idx) => (
                  <div key={idx} className={`rounded-lg p-2.5 ${isDarkMode ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-black bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded">
                        DEAL
                      </span>
                      <span className={`text-xs font-bold ${theme.text.primary}`}>{deal.name}</span>
                    </div>
                    <div className={`text-[10px] ${theme.text.tertiary} pl-1`}>
                      {deal.items.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mt-auto pt-3">
        <button className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all font-bold text-xs ${theme.border.main} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${theme.text.primary}`}>
          <Printer size={14} />
          Print
        </button>
        <button 
          onClick={() => onReady(order)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
            isAllCompleted
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : `border-2 ${theme.border.main} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${theme.text.primary}`
          }`}
        >
          <CheckCircle size={14} />
          Ready
        </button>
      </div>

      {/* Status Indicator */}
      {order.status === 'ready' && (
        <div className="absolute top-3 left-3 w-3 h-3 bg-green-400 rounded-full animate-pulse ring-4 ring-green-400/30" />
      )}
    </div>
  );
};

export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [orders, setOrders] = useState<KitchenOrder[]>(() => {
    // Load orders from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('kitchenOrders');
      if (savedOrders) {
        return JSON.parse(savedOrders);
      }
    }
    return initialMockOrders;
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'preparing' | 'ready' | 'served'>('all');
  const [filterType, setFilterType] = useState<'all' | 'DineIn' | 'TakeAway' | 'Delivery'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Listen for new orders from POS system
  useEffect(() => {
    const handleNewOrder = (event: CustomEvent<KitchenOrder>) => {
      const newOrder = event.detail;
      setOrders(prev => {
        const updatedOrders = [newOrder, ...prev];
        // Save to localStorage
        localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    };

    // Listen for the custom event
    window.addEventListener('sendToKitchen', handleNewOrder as EventListener);

    return () => {
      window.removeEventListener('sendToKitchen', handleNewOrder as EventListener);
    };
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      localStorage.setItem('kitchenOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleReady = (order: KitchenOrder) => {
    // Update order status to ready
    const updatedOrder = { ...order, status: 'ready' as const, readyTime: Date.now() };
    
    // Update in kitchen orders
    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    
    // Send to dispatch
    const dispatchOrder = {
      ...updatedOrder,
      readyTime: Date.now()
    };
    
    // Save to dispatch localStorage
    const existingDispatchOrders = localStorage.getItem('dispatchOrders');
    const dispatchOrders = existingDispatchOrders ? JSON.parse(existingDispatchOrders) : [];
    dispatchOrders.unshift(dispatchOrder);
    localStorage.setItem('dispatchOrders', JSON.stringify(dispatchOrders));
    
    // Dispatch event for real-time update
    const event = new CustomEvent('orderReady', { detail: dispatchOrder });
    window.dispatchEvent(event);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesType = filterType === 'all' || order.orderType === filterType;
      
      // Search filter - search by order number or table number
      const matchesSearch = searchQuery === '' || 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [orders, filterStatus, filterType, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      served: orders.filter(o => o.status === 'served').length,
    };
  }, [orders]);

  return (
    <div className={`min-h-[calc(100vh-8rem)] flex flex-col ${isDarkMode ? 'bg-[#0F1115]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header with Filters */}
      <div className={`px-4 sm:px-6 pt-6 pb-4 border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm sticky top-0 z-20`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} mb-1`}>
              Kitchen Display System
            </h1>
            <p className={`text-sm ${theme.text.tertiary}`}>
              Live order tracking • {filteredOrders.length} active orders
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.text.tertiary}`} size={18} />
              <input
                type="text"
                placeholder="Search invoice and order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.border.main} ${theme.input.background} ${theme.input.text} ${theme.input.placeholder} focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <div className={`px-3 sm:px-4 py-2 rounded-xl ${theme.neutral.card} shadow-sm border ${theme.border.secondary}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Preparing</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {statusCounts.preparing}
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-3 sm:px-4 py-2 rounded-xl ${theme.neutral.card} shadow-sm border ${theme.border.secondary}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Ready</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {statusCounts.ready}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filters */}
          <div className={`flex gap-1 p-1 rounded-xl ${theme.neutral.card} shadow-sm`}>
            {[
              { key: 'all', label: 'All Orders', count: statusCounts.all },
              { key: 'preparing', label: 'Preparing', count: statusCounts.preparing },
              { key: 'ready', label: 'Ready', count: statusCounts.ready },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                  filterStatus === key
                    ? `${theme.primary.main} text-white shadow-sm`
                    : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                {label}
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-semibold ${
                  filterStatus === key
                    ? 'bg-white text-orange-600'
                    : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className={`flex gap-1 p-1 rounded-xl ${theme.neutral.card} shadow-sm`}>
            {[
              { key: 'all', label: 'All Types' },
              { key: 'DineIn', label: 'Dine In' },
              { key: 'TakeAway', label: 'Take Away' },
              { key: 'Delivery', label: 'Delivery' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterType(key as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filterType === key
                    ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-200 text-gray-900 shadow-sm'
                    : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  lg:gap-6">
            {filteredOrders.map(order => (
              <KitchenOrderCard key={order.id} order={order} isDarkMode={isDarkMode} onReady={handleReady} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 ${theme.text.muted}`}>
            <ShoppingBag size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No orders found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplayView;
