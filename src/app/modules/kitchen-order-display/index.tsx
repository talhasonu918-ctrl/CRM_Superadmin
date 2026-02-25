import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Printer, CheckCircle, User, ShoppingBag, Star, Search } from 'lucide-react';
import { getThemeColors } from '../../../theme/colors';
import { useBranding } from '../../../contexts/BrandingContext';
import { useOrderContext } from '../../../contexts/OrderContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { FaArrowLeftLong } from "react-icons/fa6";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  completed: boolean;
  addedAt?: number;
}

interface Deal {
  id: string;
  name: string;
  items: string[];
  price: number;
  completed: boolean;
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
  customerAddress?: string;
  timestamp?: number;
  subCategories?: string[]; // Added for filtering
  subtotal?: number;
  tax?: number;
  discount?: number;
  grandTotal?: number;
}

interface KDSProfile {
  id: string;
  name: string;
  subCategories: string[];
  orderTypes: string[];
  users: string[];
  createdAt: number;
}

interface KitchenDisplayViewProps {
  isDarkMode?: boolean;
  activeProfile?: KDSProfile | null;
  onBackToTable?: () => void;
}

// Mock data matching the image design - Initial orders
const initialMockOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: '# 115',
    tableNumber: 'G11',
    orderType: 'DineIn',
    waiterName: 'Ahmed Ali',
    elapsedTime: '00:05',
    status: 'preparing',
    timestamp: Date.now() - 5 * 1000,
    subCategories: ['BROAST', 'Fries & Nuggets-FRIES'],
    items: [
      { id: '1', name: 'Grilled Chicken', quantity: 2, price: 750, completed: false, addedAt: Date.now() - 5 * 1000 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 450, completed: true, addedAt: Date.now() - 5 * 1000 },
      { id: '3', name: 'French Fries', quantity: 3, price: 250, completed: false, addedAt: Date.now() - 2 * 1000 },
    ],
    deals: [
      {
        id: 'd1',
        name: 'Family Deal',
        items: ['2x Pizza', '1x Pasta', '4x Drinks'],
        price: 2500,
        completed: false
      }
    ],
    subtotal: 3950,
    tax: 632,
    discount: 0,
    grandTotal: 4582
  },
  {
    id: '2',
    orderNumber: '# 114',
    tableNumber: 'F8',
    orderType: 'DineIn',
    waiterName: 'Sara Khan',
    elapsedTime: '01:00',
    status: 'preparing',
    timestamp: Date.now() - 60 * 1000,
    subCategories: ['BURGER', 'Fries & Nuggets-WINGS'],
    items: [
      { id: '1', name: 'Beef Burger', quantity: 2, price: 450, completed: true, addedAt: Date.now() - 60 * 1000 },
      { id: '2', name: 'Chicken Wings', quantity: 1, price: 580, completed: false, addedAt: Date.now() - 30 * 1000 },
    ],
    subtotal: 1480,
    tax: 236.8,
    discount: 0,
    grandTotal: 1716.8
  },
  {
    id: '3',
    orderNumber: '# 113',
    tableNumber: 'G3',
    orderType: 'DineIn',
    waiterName: 'Hassan Raza',
    elapsedTime: '02:00',
    status: 'ready',
    timestamp: Date.now() - 120 * 1000,
    subCategories: ['PIZZA-TRADITIONAL'],
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, price: 900, completed: true, addedAt: Date.now() - 120 * 1000 },
    ],
    subtotal: 900,
    tax: 144,
    discount: 0,
    grandTotal: 1044
  },


  {
    id: '4',
    orderNumber: '# 116',
    tableNumber: 'A3',
    orderType: 'DineIn',
    waiterName: 'Usman Khan',
    elapsedTime: '00:12',
    status: 'ready',
    timestamp: Date.now() - 12 * 60 * 1000,
    subCategories: ['BURGER', 'Fries & Nuggets-WINGS', 'DRINKS-BEVERAGES'],
    items: [
      { id: '1', name: 'Zinger Burger', quantity: 2, price: 420, completed: true, addedAt: Date.now() - 12 * 60 * 1000 },
      { id: '2', name: 'Chicken Nuggets', quantity: 1, price: 350, completed: true, addedAt: Date.now() - 10 * 60 * 1000 },
      { id: '3', name: 'Pepsi 500ml', quantity: 2, price: 120, completed: true, addedAt: Date.now() - 8 * 60 * 1000 },
    ],
    deals: [
      {
        id: 'd2',
        name: 'Snack Combo',
        items: ['2x Zinger Burger', '1x Nuggets', '2x Pepsi'],
        price: 1200,
        completed: true
      }
    ],
    subtotal: 2630,
    tax: 420.8,
    discount: 0,
    grandTotal: 3050.8
  },

  {
    id: '5',
    orderNumber: '# 117',
    tableNumber: 'C7',
    orderType: 'Delivery',
    waiterName: 'Hassan Raza',
    elapsedTime: '00:03',
    status: 'preparing',
    timestamp: Date.now() - 3 * 60 * 1000,
    subCategories: ['PIZZA-SPECIAL', 'DEALS', 'DRINKS-BEVERAGES'],
    items: [
      { id: '1', name: 'BBQ Pizza Large', quantity: 1, price: 1450, completed: false, addedAt: Date.now() - 3 * 60 * 1000 },
      { id: '2', name: 'Garlic Bread', quantity: 2, price: 180, completed: false, addedAt: Date.now() - 2 * 60 * 1000 },
      { id: '3', name: 'Mint Margarita', quantity: 1, price: 250, completed: false, addedAt: Date.now() - 1 * 60 * 1000 },
    ],
    deals: [
      {
        id: 'd3',
        name: 'Weekend Special',
        items: ['1x BBQ Pizza Large', '2x Garlic Bread', '1x Mint Margarita'],
        price: 1800,
        completed: false
      }
    ],
    subtotal: 3860,
    tax: 617.6,
    discount: 0,
    grandTotal: 4477.6
  },

  {
    id: '6',
    orderNumber: '# 118',
    tableNumber: 'G12',
    orderType: 'TakeAway',
    waiterName: 'Ahmed Ali',
    elapsedTime: '00:01',
    status: 'preparing',
    timestamp: Date.now() - 1 * 60 * 1000,
    subCategories: ['Fries & Nuggets-WINGS', 'Fries & Nuggets-FRIES'],
    items: [
      { id: '1', name: 'Chicken Wings', quantity: 2, price: 580, completed: false, addedAt: Date.now() - 1 * 60 * 1000 },
      { id: '2', name: 'Potato Wedges', quantity: 1, price: 300, completed: false, addedAt: Date.now() - 1 * 60 * 1000 },
    ],
    subtotal: 1460,
    tax: 233.6,
    discount: 0,
    grandTotal: 1693.6
  }


];

const KitchenOrderCard: React.FC<{ order: KitchenOrder; isDarkMode: boolean; onReady: (order: KitchenOrder) => void; onPrint: (order: KitchenOrder) => void }> = ({ order, isDarkMode, onReady, onPrint }) => {
  const theme = getThemeColors(isDarkMode);
  const [itemStates, setItemStates] = useState(order.items);
  const [dealStates, setDealStates] = useState(order.deals || []);
  const [dealsExpanded, setDealsExpanded] = useState(true);

  // Base budget of 25 minutes
  const totalBudgetSecs = 25 * 60;

  // Calculate master remaining time synchronized with order start
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const elapsed = order.timestamp ? Math.floor((Date.now() - order.timestamp) / 1000) : 0;
    return Math.max(0, totalBudgetSecs - elapsed);
  });

  // Master countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS with safety
  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleItemComplete = (itemId: string) => {
    setItemStates(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const toggleDealComplete = (dealId: string) => {
    setDealStates(prev => prev.map(deal =>
      deal.id === dealId ? { ...deal, completed: !deal.completed } : deal
    ));
  };

  const completedItems = itemStates.filter(item => item.completed).length;
  const totalItems = itemStates.length;
  const completedDeals = dealStates.filter(deal => deal.completed).length;
  const totalDeals = dealStates.length;
  const isAllCompleted = completedItems === totalItems && completedDeals === totalDeals;

  const getBadgeColor = () => {
    switch (order.orderType) {
      case 'DineIn': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'TakeAway': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Delivery': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col min-h-[320px] max-h-[420px] border-2 ${theme.neutral.card} ${theme.border.main} ${theme.text.primary} shadow-md hover:shadow-lg`}>
      <div className="absolute inset-0 opacity-[0.02] rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-black">{order.orderNumber}</span>
          <span className="text-lg font-black text-gray-400 dark:text-gray-600">|</span>
          <span className="text-lg font-bold">{order.tableNumber}</span>
          <span className="text-lg font-black text-gray-400 dark:text-gray-600">|</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${getBadgeColor()}`}>{order.orderType}</span>
        </div>

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

      <div className="relative z-10 flex-1 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={12} className={theme.text.tertiary} />
          <span className={`text-xs font-bold ${theme.text.tertiary}`}>ITEMS ({completedItems}/{totalItems})</span>
        </div>

        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
          {itemStates.map((item) => {
            // Logic: 10 minutes budget per item, starting from when it was added
            const itemBudgetSecs = 10 * 60;
            const now = Date.now();
            const itemStartTime = item.addedAt || order.timestamp || now;
            const elapsed = Math.floor((now - itemStartTime) / 1000);
            const remaining = Math.max(0, itemBudgetSecs - elapsed);
            const itemTimeStr = formatTime(remaining);

            const isLateAddition = order.timestamp && item.addedAt && (item.addedAt - order.timestamp > 7 * 60 * 1000);

            return (
              <button
                key={item.id}
                onClick={() => toggleItemComplete(item.id)}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all ${item.completed
                  ? `${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} opacity-70`
                  : isLateAddition
                    ? `${isDarkMode ? 'bg-orange-500/20 border-orange-500/50' : 'bg-orange-50 border-orange-200'} animate-pulse ring-2 ring-orange-500/20`
                    : `${isDarkMode ? 'bg-gray-800/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`
                  }`}
              >
                <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-orange-500 border-orange-500' : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
                  }`}>
                  {item.completed && <CheckCircle size={10} className="text-white" />}
                </div>
                <div className="flex items-center justify-between flex-1">
                  <span className={`text-[14px] font-bold text-left ${item.completed ? 'line-through text-gray-400 font-normal' : ''}`}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {!item.completed && (
                      <span className={`text-[11px] font-mono font-bold ${remaining < 60 ? 'text-red-500 animate-pulse' : isLateAddition ? 'text-orange-600' : 'text-gray-500'}`}>
                        {itemTimeStr}
                      </span>
                    )}
                    <span className={`text-xs font-black px-2 py-0.5 min-w-[24px] text-center rounded ${item.completed ? 'opacity-50' : isLateAddition ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                      {item.quantity}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
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
              <svg className={`w-3 h-3 transition-transform ${dealsExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dealsExpanded && (
              <div className="space-y-2">
                {dealStates.map((deal, idx) => (
                  <button
                    key={deal.id || idx}
                    onClick={() => toggleDealComplete(deal.id)}
                    className={`w-full text-left rounded-xl p-3 border-l-4 transition-all ${deal.completed
                      ? `border-green-500 ${isDarkMode ? 'bg-green-500/5 opacity-70' : 'bg-green-50/50'}`
                      : `border-yellow-400 ${isDarkMode ? 'bg-yellow-400/5' : 'bg-yellow-50/50'}`
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight ${deal.completed ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-950'
                          }`}>
                          DEAL
                        </span>
                        <span className={`text-[13px] font-black ${theme.text.primary} ${deal.completed ? 'line-through text-gray-400 font-normal' : ''}`}>
                          {deal.name}
                        </span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${deal.completed ? 'bg-green-500 border-green-500' : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
                        }`}>
                        {deal.completed && <CheckCircle size={10} className="text-white" />}
                      </div>
                    </div>
                    <div className={`text-[11px] font-bold pl-1 flex flex-wrap gap-x-2 gap-y-1 ${deal.completed ? 'text-gray-400/60' : theme.text.tertiary}`}>
                      {deal.items.map((it, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span>•</span>}
                          {it}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 mt-auto pt-3">
        <button
          onClick={() => onPrint(order)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all font-bold text-xs ${theme.border.main} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${theme.text.primary}`}>
          <Printer size={14} /> Print
        </button>
        <button
          onClick={() => onReady(order)}
          disabled={!isAllCompleted}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all ${isAllCompleted ? 'bg-primary text-white hover:bg-primary/10 cursor-pointer shadow-md' : `border-2 ${theme.border.main} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${theme.text.primary} opacity-50 cursor-not-allowed`
            }`}
        >
          <CheckCircle size={14} /> Ready
        </button>
      </div>

      {order.status === 'ready' && (
        <div className="absolute top-3 left-3 w-3 h-3 bg-green-400 rounded-full animate-pulse ring-4 ring-green-400/30" />
      )}
    </div>
  );
};
export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({ isDarkMode = false, activeProfile: propActiveProfile, onBackToTable }) => {
  const { config } = useBranding();
  const { addReadyOrder } = useOrderContext();
  const { addNotification } = useNotifications();
  const theme = getThemeColors(isDarkMode);
  const [activeKDSProfile, setActiveKDSProfile] = useState<KDSProfile | null>(propActiveProfile || null);
  const [orders, setOrders] = useState<KitchenOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('kitchenOrders');
      if (savedOrders) return JSON.parse(savedOrders);
    }
    return initialMockOrders;
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'preparing' | 'ready' | 'served'>('all');
  const [filterType, setFilterType] = useState<'all' | 'DineIn' | 'TakeAway' | 'Delivery'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [printOrder, setPrintOrder] = useState<KitchenOrder | null>(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  // Update active profile when prop changes
  useEffect(() => {
    setActiveKDSProfile(propActiveProfile || null);
  }, [propActiveProfile]);

  const branches = [
    { id: 1, name: 'Main Branch', location: 'M.A Jinnah road Okara', phone: '+92 300 1234567' },
    { id: 2, name: 'Lahore Branch', location: 'Gulberg town Lahore', phone: '+92 321 7654321' },
    { id: 3, name: 'Multan Branch', location: 'Kot Town Multan', phone: '+92 333 9876543' },
    { id: 4, name: 'Islamabad Branch', location: 'Sector 3 Islamabad', phone: '+92 345 5432109' },
  ];

  const [branchInfo, setBranchInfo] = useState({ name: 'Main Branch', phone: '+92 300 1234567' });

  useEffect(() => {
    const savedBranch = localStorage.getItem('activeBranch') || 'Main Branch';
    const foundBranch = branches.find((b: { id: number; name: string; location: string; phone: string }) => b.name === savedBranch);
    if (foundBranch) {
      setBranchInfo({ name: foundBranch.name, phone: foundBranch.phone });
    }
  }, []);

  useEffect(() => {
    if (shouldPrint && printOrder) {
      setShouldPrint(false);
      // Use requestAnimationFrame to ensure DOM is painted
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.print();
        }, 300);
      });
    }
  }, [shouldPrint, printOrder]);

  useEffect(() => {
    const handleNewOrder = (event: CustomEvent<KitchenOrder>) => {
      const newOrder = event.detail;
      setOrders(prev => {
        const updatedOrders = [newOrder, ...prev];
        localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    };
    window.addEventListener('sendToKitchen', handleNewOrder as EventListener);
    return () => window.removeEventListener('sendToKitchen', handleNewOrder as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      localStorage.setItem('kitchenOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleReady = (order: KitchenOrder) => {
    const updatedOrder = { ...order, status: 'ready' as const, readyTime: Date.now() };
    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    const existingDispatchOrders = localStorage.getItem('dispatchOrders');
    const dispatchOrders = existingDispatchOrders ? JSON.parse(existingDispatchOrders) : [];
    dispatchOrders.unshift(updatedOrder);
    localStorage.setItem('dispatchOrders', JSON.stringify(dispatchOrders));
    window.dispatchEvent(new CustomEvent('orderReady', { detail: updatedOrder }));

    // Add to OrderContext for real-time notification
    addReadyOrder({
      orderId: order.id,
      orderNumber: parseInt(order.orderNumber.replace('#', '')),
      orderType: order.orderType as 'DineIn' | 'TakeAway' | 'Delivery',
      customerName: order.customerName || 'Guest',
      readyTime: updatedOrder.readyTime,
      tableNumber: order.tableNumber,
      waiterName: order.waiterName,
      customerPhone: order.customerPhone,
      items: order.items.map(item => ({ 
        name: item.name, 
        quantity: item.quantity,
        price: item.price || 0 
      })),
      deals: order.deals?.map(deal => ({
        name: deal.name,
        items: deal.items,
        price: deal.price
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      grandTotal: order.grandTotal,
    });

    // Add KDS Notification
    addNotification({
      title: 'KDS: Order Ready',
      message: `Order ${order.orderNumber} is now ready in the kitchen.`,
      type: 'kds',
      orderDetails: {
        orderId: order.orderNumber,
        customerName: order.customerName || 'Guest',
        phoneNumber: order.customerPhone || 'N/A',
        address: order.orderType === 'DineIn' ? `Table ${order.tableNumber}` : order.orderType,
        orderDate: new Date().toLocaleDateString(),
        orderTime: new Date().toLocaleTimeString(),
        totalAmount: order.grandTotal || 0,
        items: [
          ...order.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          ...(order.deals?.map(deal => ({ name: `[DEAL] ${deal.name}`, quantity: 1, price: deal.price })) || [])
        ]
      }
    });
  };

  const handlePrint = (order: KitchenOrder) => {
    setPrintOrder(order);
    setShouldPrint(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // KDS Profile filtering
      if (activeKDSProfile) {
        // Filter by order types defined in KDS profile
        if (activeKDSProfile.orderTypes.length > 0 && !activeKDSProfile.orderTypes.includes(order.orderType)) {
          return false;
        }

        // Filter by subcategories - check if order has any items from allowed subcategories
        if (activeKDSProfile.subCategories.length > 0 && order.subCategories) {
          const hasMatchingSubCategory = order.subCategories.some(subCat =>
            activeKDSProfile.subCategories.includes(subCat)
          );
          if (!hasMatchingSubCategory) {
            return false;
          }
        }
      }

      // Regular filters
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesType = filterType === 'all' || order.orderType === filterType;
      const matchesSearch = searchQuery === '' ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [orders, filterStatus, filterType, searchQuery, activeKDSProfile]);

  const statusCounts = useMemo(() => ({
    all: orders.length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  }), [orders]);

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            height: auto !important;
          }
          body * {
            visibility: hidden;
          }
          #kitchen-print-content, #kitchen-print-content * {
            visibility: visible;
          }
          #kitchen-print-content {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            display: block !important;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 4mm !important;
            color: #000 !important;
            background: #fff !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .thermal-header {
            text-align: center;
            margin-bottom: 8px;
          }
          .thermal-brand {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 4px;
          }
          .thermal-branch {
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .thermal-location {
            font-size: 12px;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }
          .thermal-divider {
            border-top: 1px dashed #000;
            margin: 6px 0;
          }
          .thermal-info-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            line-height: 1.5;
          }
          .thermal-info-label {
            width: 45%;
            text-align: left;
          }
          .thermal-info-value {
            width: 55%;
            text-align: right;
          }
          .thermal-table-header {
            display: grid;
            grid-template-columns: 1fr 15% 25%;
            font-size: 11px;
            font-weight: bold;
            margin-top: 8px;
            margin-bottom: 4px;
          }
          .thermal-table-row {
            display: grid;
            grid-template-columns: 1fr 15% 25%;
            font-size: 11px;
            line-height: 1.6;
          }
          .thermal-item-name {
            text-align: left;
            word-wrap: break-word;
          }
          .thermal-qty {
            text-align: center;
          }
          .thermal-deal-section {
            margin-top: 8px;
            padding: 4px 0;
          }
          .thermal-deal-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .thermal-deal-item {
            font-size: 10px;
            margin-left: 8px;
            line-height: 1.4;
          }
          .thermal-footer {
            text-align: center;
            font-size: 11px;
            margin-top: 8px;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className={`min-h-[calc(100vh-8rem)] flex flex-col ${isDarkMode ? 'bg-[#0F1115]' : 'bg-gradient-to-br from-gray-50 to-gray-100'} no-print`}>
        <div className={`px-4 sm:px-6 pt-6 pb-4 border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm sticky top-0 z-20`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-4">
                {activeKDSProfile && (
                  <button
                    onClick={() => {
                      if (onBackToTable) {
                        onBackToTable();
                      } else {
                        localStorage.removeItem('activeKDSProfile');
                        window.location.reload();
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full transition-all border ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
                      } text-xs font-bold flex items-center gap-2 shadow-sm`}
                  >
                    <span><FaArrowLeftLong/></span> Back to KDS List
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.text.primary}`}>
                    Kitchen Display System {activeKDSProfile && <span className="opacity-40 font-medium">| {activeKDSProfile.name}</span>}
                  </h1>
                  <button
                    onClick={() => {
                      localStorage.removeItem('kitchenOrders');
                      localStorage.removeItem('dispatchOrders');
                      window.location.reload();
                    }}
                    className="text-[9px] font-black px-2 py-1 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors uppercase tracking-widest border border-red-500/20"
                  >
                    Reset System Data
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className={`text-xs sm:text-sm font-medium ${theme.text.tertiary}`}>
                  Live order tracking • {filteredOrders.length} active orders
                </p>
                {activeKDSProfile && activeKDSProfile.subCategories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-black tracking-widest ${theme.text.muted}`}>Filtering:</span>
                    {activeKDSProfile.subCategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border shadow-sm ${isDarkMode
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                          : 'bg-purple-50 border-purple-100 text-purple-600'
                          }`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.text.tertiary}`} size={16} />
                <input
                  type="text"
                  placeholder="Search invoice and order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${theme.border.main} ${theme.input.background} ${theme.input.text} ${theme.input.placeholder} focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all`}
                />
              </div>

              <div className="flex gap-2">
                <div className={`flex flex-col items-center min-w-[70px] px-3 py-1.5 rounded-xl ${theme.neutral.card} border ${theme.border.secondary} shadow-sm group hover:border-purple-500/30 transition-all`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary}`}>Preparing</span>
                  </div>
                  <span className={`text-xl font-black ${theme.text.primary}`}>{statusCounts.preparing}</span>
                </div>
           <div className={`flex flex-col items-center min-w-[70px] px-3 py-1.5 rounded-xl ${theme.neutral.card} border ${theme.border.secondary} shadow-sm group hover:border-green-500/30 transition-all`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary}`}>Ready</span>
                  </div>
                  <span className={`text-xl font-black ${theme.text.primary}`}>{statusCounts.ready}</span>
                </div>
              </div>
            </div>
          </div>
     <div className="flex flex-wrap gap-2">
            <div className={`flex gap-1 p-1 rounded-xl ${theme.neutral.card} shadow-sm`}>
              {['all', 'preparing', 'ready'].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === key
                    ? `${theme.primary.main} text-white shadow-sm`
                    : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
                    }`}
                >
                  {key === 'all' ? 'All Orders' : key.charAt(0).toUpperCase() + key.slice(1)}
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-semibold ${filterStatus === key ? 'bg-white text-orange-600' : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {statusCounts[key as keyof typeof statusCounts]}
                  </span>
                </button>
              ))}
            </div>
            <div className={`flex gap-1 p-1 rounded-xl ${theme.neutral.card} shadow-sm`}>
              {['all', 'DineIn', 'TakeAway', 'Delivery'].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterType === key
                    ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-200 text-gray-900 shadow-sm'
                    : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
                    }`}   >
                  {key === 'all' ? 'All Types' : key.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filteredOrders.map(order => <KitchenOrderCard key={order.id} order={order} isDarkMode={isDarkMode} onReady={handleReady} onPrint={handlePrint} />)}
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

      {/* Print Section - Hidden on Screen, Visible on Print */}
      {printOrder && (
        <div id="kitchen-print-content" className="print-only">
          <div className="thermal-header">
            <div className="thermal-brand">{(config.name || 'Invex Food').toUpperCase()}</div>
            <div className="thermal-branch">{branchInfo.name.toUpperCase()}</div>
            <div className="thermal-location">{branches.find((b: { id: number; name: string; location: string; phone: string }) => b.name === branchInfo.name)?.location}</div>
            <div className="thermal-branch">KITCHEN ORDER</div>
          </div>
          <div className="thermal-divider"></div>
      <div className="thermal-info-row">
            <div className="thermal-info-label"></div>
            <div className="thermal-info-value">{date} {time}</div>
          </div>

          <div className="thermal-info-row">
            <div className="thermal-info-label">ORDER NO</div>
            <div className="thermal-info-value">{printOrder.orderNumber}</div>
          </div>

          <div className="thermal-info-row">
            <div className="thermal-info-label">TABLE NO</div>
            <div className="thermal-info-value">{printOrder.tableNumber}</div>
          </div>

          <div className="thermal-info-row">
            <div className="thermal-info-label">ORDER TYPE</div>
            <div className="thermal-info-value">{printOrder.orderType.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>

          <div className="thermal-info-row">
            <div className="thermal-info-label">WAITER</div>
            <div className="thermal-info-value">{printOrder.waiterName}</div>
          </div>

          {printOrder.customerName && (
            <div className="thermal-info-row">
              <div className="thermal-info-label">CUSTOMER</div>
              <div className="thermal-info-value">{printOrder.customerName}</div>
            </div>
          )}

          {printOrder.customerPhone && (
            <div className="thermal-info-row">
              <div className="thermal-info-label"></div>
              <div className="thermal-info-value" style={{ fontSize: '10px' }}>{printOrder.customerPhone}</div>
            </div>
          )}

          {printOrder.orderType === 'Delivery' && printOrder.customerAddress && (
            <div className="thermal-info-row">
              <div className="thermal-info-label">ADDRESS</div>
              <div className="thermal-info-value" style={{ fontSize: '10px' }}>{printOrder.customerAddress}</div>
            </div>
          )}

          <div className="thermal-divider"></div>

          <div className="thermal-table-header">
            <div className="thermal-item-name">Item</div>
            <div className="thermal-qty">Qty</div>
            <div className="thermal-item-name">Status</div>
          </div>

          {printOrder.items.map((item, idx) => (
            <div key={idx} className="thermal-table-row">
              <div className="thermal-item-name">{item.name}</div>
              <div className="thermal-qty">{item.quantity}</div>
              <div className="thermal-item-name">{item.completed ? '✓ Done' : 'Pending'}</div>
            </div>
          ))}

          {printOrder.deals && printOrder.deals.length > 0 && (
            <>
              <div className="thermal-divider"></div>
              <div className="thermal-deal-section">
                <div className="thermal-deal-title">DEALS:</div>
                {printOrder.deals.map((deal, idx) => (
                  <div key={idx}>
                    <div className="thermal-deal-title">• {deal.name} {deal.completed ? '✓' : ''}</div>
                    {deal.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="thermal-deal-item">- {item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="thermal-divider"></div>

          <div className="thermal-info-row" style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '6px' }}>
            <div className="thermal-info-label">STATUS</div>
            <div className="thermal-info-value">{printOrder.status.toUpperCase()}</div>
          </div>

          <div className="thermal-footer">
            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>KITCHEN COPY</div>
            <div style={{ marginTop: '4px', fontSize: '10px' }}>Printed: {date} {time}</div>
          </div>

          <div className="thermal-divider" style={{ marginTop: '8px' }}></div>
        </div>
      )}
    </>
  );
};

export default KitchenDisplayView;
