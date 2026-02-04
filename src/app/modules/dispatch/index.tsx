import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Truck, CheckCircle, User, ShoppingBag, Package, Star, Search } from 'lucide-react';
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

export interface DispatchOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DineIn' | 'TakeAway' | 'Delivery';
  waiterName: string;
  elapsedTime: string;
  items: OrderItem[];
  deals?: Deal[];
  status: 'ready' | 'dispatched';
  customerName?: string;
  customerPhone?: string;
  timestamp?: number;
  readyTime?: number;
}

interface DispatchViewProps {
  isDarkMode?: boolean;
}

// Initial mock data for dispatch orders
const initialMockDispatchOrders: DispatchOrder[] = [
  {
    id: 'dispatch-1',
    orderNumber: '# 243',
    tableNumber: 'G3',
    orderType: 'DineIn',
    waiterName: 'POS System',
    elapsedTime: '23:20',
    status: 'ready',
    timestamp: Date.now() - 23 * 60 * 1000,
    readyTime: Date.now() - 5 * 60 * 1000,
    items: [
      { id: '1', name: 'EXTREME DEAL', quantity: 1, completed: true },
    ],
  },
  {
    id: 'dispatch-2',
    orderNumber: '# 115',
    tableNumber: 'G11',
    orderType: 'DineIn',
    waiterName: 'Ahmed Ali',
    elapsedTime: '23:20',
    status: 'ready',
    timestamp: Date.now() - 23 * 60 * 1000,
    readyTime: Date.now() - 3 * 60 * 1000,
    items: [
      { id: '1', name: 'Grilled Chicken', quantity: 2, completed: true },
      { id: '2', name: 'Caesar Salad', quantity: 1, completed: true },
      { id: '3', name: 'French Fries', quantity: 3, completed: true },
    ],
    deals: [
      {
        name: 'Family Deal',
        items: ['2x Pizza', '1x Pasta', '4x Drinks']
      }
    ]
  },
  {
    id: 'dispatch-3',
    orderNumber: '# 114',
    tableNumber: 'F8',
    orderType: 'DineIn',
    waiterName: 'Sara Khan',
    elapsedTime: '23:20',
    status: 'ready',
    timestamp: Date.now() - 23 * 60 * 1000,
    readyTime: Date.now() - 8 * 60 * 1000,
    items: [
      { id: '1', name: 'Beef Burger', quantity: 2, completed: true },
      { id: '2', name: 'Chicken Wings', quantity: 1, completed: true },
      { id: '3', name: 'Onion Rings', quantity: 2, completed: true },
      { id: '4', name: 'Coca Cola', quantity: 2, completed: true },
    ],
  },
  {
    id: 'dispatch-4',
    orderNumber: '# 112',
    tableNumber: 'TKA-001',
    orderType: 'TakeAway',
    waiterName: 'Fatima Sheikh',
    elapsedTime: '15:28',
    status: 'ready',
    timestamp: Date.now() - 15 * 60 * 1000,
    readyTime: Date.now() - 2 * 60 * 1000,
    customerName: 'Muhammad Usman',
    customerPhone: '+92 300 1234567',
    items: [
      { id: '1', name: 'Loaded Fries', quantity: 1, completed: true },
      { id: '2', name: 'HNY SPECIAL PIZZA', quantity: 1, completed: true },
      { id: '3', name: 'Pizza Sandwich', quantity: 2, completed: true },
      { id: '4', name: 'PAK DRINK', quantity: 1, completed: true },
    ],
    deals: [
      {
        name: 'Student Deal',
        items: ['2x Crunch Craze Zinger', '2x PAK DRINK']
      }
    ]
  },
  {
    id: 'dispatch-5',
    orderNumber: '# 108',
    tableNumber: 'TKA-002',
    orderType: 'TakeAway',
    waiterName: 'Ahmed Ali',
    elapsedTime: '12:15',
    status: 'ready',
    timestamp: Date.now() - 12 * 60 * 1000,
    readyTime: Date.now() - 4 * 60 * 1000,
    customerName: 'Ali Hassan',
    customerPhone: '+92 333 5554444',
    items: [
      { id: '1', name: 'Beef Burger', quantity: 2, completed: true },
      { id: '2', name: 'Chicken Wings', quantity: 3, completed: true },
      { id: '3', name: 'French Fries', quantity: 2, completed: true },
      { id: '4', name: 'Coca Cola', quantity: 4, completed: true },
    ],
  },
  {
    id: 'dispatch-6',
    orderNumber: '# 105',
    tableNumber: 'DEL-001',
    orderType: 'Delivery',
    waiterName: 'Hassan Raza',
    elapsedTime: '18:42',
    status: 'ready',
    timestamp: Date.now() - 18 * 60 * 1000,
    readyTime: Date.now() - 6 * 60 * 1000,
    customerName: 'Ayesha Khan',
    customerPhone: '+92 321 9876543',
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 2, completed: true },
      { id: '2', name: 'BBQ Wings', quantity: 1, completed: true },
      { id: '3', name: 'Garlic Bread', quantity: 2, completed: true },
      { id: '4', name: 'Pepsi', quantity: 4, completed: true },
    ],
  },
  {
    id: 'dispatch-7',
    orderNumber: '# 102',
    tableNumber: 'DEL-002',
    orderType: 'Delivery',
    waiterName: 'Sara Khan',
    elapsedTime: '21:30',
    status: 'ready',
    timestamp: Date.now() - 21 * 60 * 1000,
    readyTime: Date.now() - 10 * 60 * 1000,
    customerName: 'Bilal Ahmed',
    customerPhone: '+92 345 1112233',
    items: [
      { id: '1', name: 'Chicken Tikka Pizza', quantity: 1, completed: true },
      { id: '2', name: 'Spicy Wings', quantity: 2, completed: true },
      { id: '3', name: 'Coleslaw', quantity: 1, completed: true },
    ],
    deals: [
      {
        name: 'Dinner Deal',
        items: ['1x Large Pizza', '6x Wings', '2x Drinks']
      }
    ]
  },
];

// Dispatch Order Card Component
const DispatchOrderCard: React.FC<{ order: DispatchOrder; isDarkMode: boolean; onDispatch: (id: string) => void }> = ({ order, isDarkMode, onDispatch }) => {
  const theme = getThemeColors(isDarkMode);
  const [dealsExpanded, setDealsExpanded] = useState(false);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

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
    <div className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col border-2 ${theme.neutral.card} ${theme.border.main} ${theme.text.primary} shadow-md hover:shadow-xl`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-base font-bold ${theme.text.primary}`}>{order.orderNumber}</span>
          <span className="text-base font-black text-gray-400 dark:text-gray-600">|</span>
          <span className={`text-base font-bold ${theme.text.primary}`}>{order.tableNumber}</span>
          <span className="text-base font-black text-gray-400 dark:text-gray-600">|</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeColor()}`}>
            {order.orderType}
          </span>
        </div>
        
        {/* Status & Items Count */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={14} />
            <span className="text-xs font-medium">Ready For Pickup</span>
          </div>
          <span className={`text-xs font-semibold ${theme.text.tertiary}`}>({totalItems} items)</span>
        </div>
      </div>

      {/* Customer Info */}
      {(order.customerName || order.customerPhone) && (
        <div className={`relative z-10 mb-3 p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
          <div className={`text-xs font-semibold mb-1 ${theme.text.secondary}`}>Walk-in Customer</div>
          {order.customerName && (
            <div className={`text-xs font-medium ${theme.text.primary}`}>{order.customerName}</div>
          )}
          {order.customerPhone && (
            <div className={`text-xs ${theme.text.tertiary}`}>{order.customerPhone}</div>
          )}
        </div>
      )}

      {/* Items List */}
      <div className="relative z-10 flex-1 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={12} className={theme.text.tertiary} />
          <span className={`text-xs font-bold ${theme.text.tertiary}`}>ITEMS ({totalItems})</span>
        </div>
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
          {order.items.map(item => (
            <div key={item.id} className={`flex items-center gap-2 p-1.5 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} opacity-70`}>
              <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 bg-orange-500 border-orange-500">
                <CheckCircle size={10} className="text-white" />
              </div>
              <span className="text-xs font-medium text-left flex-1 line-through">
                {item.quantity}x {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals */}
      {order.deals && order.deals.length > 0 && (
        <div className="relative z-10 mb-3">
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
              {order.deals.map((deal, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-yellow-50 border border-yellow-200'}`}>
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

      {/* Dispatch Button */}
      <button
        onClick={() => onDispatch(order.id)}
        className={`relative z-10 w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${theme.button.primary}`}
      >
        Dispatch
      </button>
    </div>
  );
};

const DispatchView: React.FC<DispatchViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [orders, setOrders] = useState<DispatchOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('dispatchOrders');
      if (savedOrders) {
        return JSON.parse(savedOrders);
      }
    }
    return initialMockDispatchOrders;
  });
  const [filterType, setFilterType] = useState<'all' | 'DineIn' | 'TakeAway' | 'Delivery'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Listen for new ready orders from Kitchen Display
  useEffect(() => {
    const handleReadyOrder = (event: CustomEvent<DispatchOrder>) => {
      const newOrder = event.detail;
      setOrders(prev => {
        const updatedOrders = [newOrder, ...prev];
        localStorage.setItem('dispatchOrders', JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    };

    window.addEventListener('orderReady', handleReadyOrder as EventListener);

    return () => {
      window.removeEventListener('orderReady', handleReadyOrder as EventListener);
    };
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      localStorage.setItem('dispatchOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleDispatch = (orderId: string) => {
    setOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId ? { ...order, status: 'dispatched' as const } : order
      );
      localStorage.setItem('dispatchOrders', JSON.stringify(updatedOrders));
      
      // Remove dispatched orders after a delay
      setTimeout(() => {
        setOrders(current => {
          const filtered = current.filter(o => o.id !== orderId);
          localStorage.setItem('dispatchOrders', JSON.stringify(filtered));
          return filtered;
        });
      }, 1000);
      
      return updatedOrders;
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesType = filterType === 'all' || order.orderType === filterType;
      const matchesSearch = searchQuery === '' || 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [orders, filterType, searchQuery]);
       

  const readyOrders = orders.filter(o => o.status === 'ready').length;

  return (
    <div className={`min-h-[calc(100vh-8rem)] flex flex-col ${isDarkMode ? 'bg-[#0F1115]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 pt-6 pb-4 border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm sticky top-0 z-20`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} mb-1`}>
              Dispatch
            </h1>
            <p className={`text-sm ${theme.text.tertiary}`}>
              Ready for pickup • {readyOrders} active orders
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
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Ready For Pickup</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>{readyOrders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'DineIn', 'TakeAway', 'Delivery'] as const).map((type) => {
              const label = type === 'all' ? 'All Types' : type === 'DineIn' ? 'Dine In' : type === 'TakeAway' ? 'Take Away' : 'Delivery';
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterType === type
                      ? 'bg-orange-500 text-white shadow-md'
                      : `${theme.neutral.card} ${theme.text.secondary} hover:bg-orange-100 dark:hover:bg-orange-900/20`
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredOrders.map(order => (
              <DispatchOrderCard 
                key={order.id} 
                order={order} 
                isDarkMode={isDarkMode} 
                onDispatch={handleDispatch}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 ${theme.text.muted}`}>
            <Truck size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No orders ready for dispatch</p>
            <p className="text-sm mt-2">Orders will appear here when marked as ready in Kitchen Display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchView;
