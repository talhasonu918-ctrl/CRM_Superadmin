import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Clock, Truck, CheckCircle, User, ShoppingBag, Package, Star, Search, LayoutGrid, List, ChevronDown, ChevronUp, MapPin, Phone, Printer, MoreVertical, CheckSquare, Square, Volume2, Bell, UserPlus, Send } from 'lucide-react';
import { getThemeColors } from '../../../theme/colors';
import { Badge, ActionIcon, Avatar } from 'rizzui';
import { DispatchOrder, initialMockDispatchOrders, mockRiders } from '../pos/mockData';
import { Rider } from '../pos/types';
import { notify } from '../../../utils/toast';
import { useOrderContext, OrderReadyPayload } from '../../../contexts/OrderContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAgingColor } from './hooks/useAgingColor';
import { DispatchOrderCard } from './components/DispatchOrderCard';
import { DispatchTableRow } from './components/DispatchTableRow';
import { OrderReceipt } from '../pos/form/OrderReceipt';

interface DispatchViewProps {
  isDarkMode?: boolean;
}

const DispatchView: React.FC<DispatchViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const { orders: readyOrders, removeOrder: removeFromContext, isRealTimeMode, setIsRealTimeMode } = useOrderContext();
  const { addNotification } = useNotifications();
  
  const [orders, setOrders] = useState<DispatchOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('dispatchOrders');
      if (savedOrders) return JSON.parse(savedOrders);
    }
    return initialMockDispatchOrders;
  });
  
  const [filterType, setFilterType] = useState<'all' | 'DineIn' | 'TakeAway' | 'Delivery'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [printingOrder, setPrintingOrder] = useState<any>(null);
  
  const lastOrderCount = useRef(orders.length);

  const handlePrint = (order: DispatchOrder) => {
    // Calculate totals if missing from mock data
    const calculatedSubtotal = order.subtotal || order.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    const calculatedTax = order.tax || (calculatedSubtotal * 0.16); // 16% as default if missing
    const calculatedGrandTotal = order.grandTotal || (calculatedSubtotal + calculatedTax - (order.discount || 0));

    // Map DispatchOrder to the format expected by OrderReceipt
    const receiptOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      tableId: order.tableNumber !== '-' ? order.tableNumber : undefined,
      waiterName: order.waiterName,
      customerPhone: order.customerPhone,
      status: 'Ready', 
      type: order.orderType,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price || 0, 
        quantity: item.quantity
      })),
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      discount: order.discount || 0,
      grandTotal: calculatedGrandTotal,
      createdAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)}`,
      completedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)}`,
    };

    setPrintingOrder(receiptOrder);
    
    // Use a small timeout to ensure state is updated before triggering print
    setTimeout(() => {
      window.print();
      // Clear after printing starts
      setTimeout(() => setPrintingOrder(null), 1000);
    }, 100);
  };

  // Sync ready orders from OrderContext to dispatch orders
  useEffect(() => {
    readyOrders.forEach(readyOrder => {
      if (!orders.find(o => o.id === readyOrder.orderId)) {
        const newDispatchOrder: DispatchOrder = {
          id: readyOrder.orderId,
          orderNumber: String(readyOrder.orderNumber),
          orderType: readyOrder.orderType,
          customerName: readyOrder.customerName,
          waiterName: readyOrder.waiterName || 'Staff',
          customerPhone: readyOrder.customerPhone,
          readyTime: readyOrder.readyTime,
          status: 'ready',
          tableNumber: readyOrder.tableNumber || '-',
          items: readyOrder.items.map((item, idx) => ({
            id: `${readyOrder.orderId}-item-${idx}`,
            name: item.name,
            quantity: item.quantity,
            price: item.price || 0,
            completed: false,
          })),
          subtotal: readyOrder.subtotal,
          tax: readyOrder.tax,
          discount: readyOrder.discount,
          grandTotal: readyOrder.grandTotal,
          elapsedTime: '0m',
          deals: [],
          riderId: undefined,
          riderName: undefined,
        };
        setOrders(prev => [newDispatchOrder, ...prev]);

        // Add Dispatch Notification (New Arrival)
        addNotification({
          title: 'Dispatch: New Order Incoming',
          message: `Order #${readyOrder.orderNumber} is ready for dispatch.`,
          type: 'dispatch',
          orderDetails: {
            orderId: String(readyOrder.orderNumber),
            customerName: readyOrder.customerName,
            phoneNumber: readyOrder.customerPhone || 'N/A',
            address: readyOrder.tableNumber === '-' ? readyOrder.orderType : `Table ${readyOrder.tableNumber}`,
            orderDate: new Date().toLocaleDateString(),
            orderTime: new Date().toLocaleTimeString(),
            totalAmount: readyOrder.grandTotal || 0,
            items: readyOrder.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
          }
        });
      }
    });
  }, [readyOrders]);

  // Sound Notification Effect (for Mock data additions)
  useEffect(() => {
    if (orders.length > lastOrderCount.current) {
      const newOrder = orders[0];
      // Only play sound if not from real-time (avoids double sound)
      if (!isRealTimeMode) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => console.log('Audio play failed'));
        notify.success(`New Order Ready: ${newOrder.orderNumber}`);
      }
    }
    lastOrderCount.current = orders.length;
  }, [orders, isRealTimeMode]);

  // Auto-Refresh & New Order Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dispatchOrders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length !== orders.length) setOrders(parsed);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [orders.length]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedOrderIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedOrderIds(newSelected);
  };

  const handleRiderAssign = (orderId: string, rider: Rider) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, riderId: rider.id, riderName: rider.name } : o);
      localStorage.setItem('dispatchOrders', JSON.stringify(updated));
      
      const updatedOrder = updated.find(o => o.id === orderId);
      if (updatedOrder) {
        // Add Rider Assignment Notification
        addNotification({
          title: 'Dispatch: Rider Assigned',
          message: `${rider.name} has been assigned to Order #${updatedOrder.orderNumber}.`,
          type: 'dispatch',
          orderDetails: {
            orderId: updatedOrder.orderNumber,
            customerName: updatedOrder.customerName || 'Guest',
            phoneNumber: updatedOrder.customerPhone || 'N/A',
            address: updatedOrder.tableNumber === '-' ? updatedOrder.orderType : `Table ${updatedOrder.tableNumber}`,
            orderDate: new Date().toLocaleDateString(),
            orderTime: new Date().toLocaleTimeString(),
            totalAmount: updatedOrder.grandTotal || 0,
            items: updatedOrder.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
          }
        });
      }
      
      return updated;
    });
    notify.success(`${rider.name} assigned to order`);
  };

  const handleBulkDispatch = () => {
    const idsToDispatch = Array.from(selectedOrderIds);
    // Directly update state once for better performance
    setOrders(prev => {
      const updated = prev.filter(o => !selectedOrderIds.has(o.id));
      localStorage.setItem('dispatchOrders', JSON.stringify(updated));
      return updated;
    });
    setSelectedOrderIds(new Set());
    
    // Remove from context if they came from real-time
    idsToDispatch.forEach(id => removeFromContext(id));
    
    notify.success(`${idsToDispatch.length} orders dispatched together`);
  };

  const handleDispatch = (orderId: string) => {
    setOrders(prev => {
      const orderToDispatch = prev.find(o => o.id === orderId);
      if (orderToDispatch) {
        addNotification({
          title: 'Dispatch: Out for Delivery',
          message: `Order #${orderToDispatch.orderNumber} is now out for delivery.`,
          type: 'dispatch',
          orderDetails: {
            orderId: orderToDispatch.orderNumber,
            customerName: orderToDispatch.customerName || 'Guest',
            phoneNumber: orderToDispatch.customerPhone || 'N/A',
            address: orderToDispatch.tableNumber === '-' ? orderToDispatch.orderType : `Table ${orderToDispatch.tableNumber}`,
            orderDate: new Date().toLocaleDateString(),
            orderTime: new Date().toLocaleTimeString(),
            totalAmount: orderToDispatch.grandTotal || 0,
            items: orderToDispatch.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
          }
        });
      }

      const updatedOrders = prev.map(order => 
        order.id === orderId ? { ...order, status: 'dispatched' as const } : order
      );
      localStorage.setItem('dispatchOrders', JSON.stringify(updatedOrders));
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
  
  const readyOrdersCount = orders.filter(o => o.status === 'ready').length;

  const ListView = (
    <div className={`rounded-xl border ${theme.border.main} overflow-hidden shadow-sm mt-6 ${isDarkMode ? 'bg-gray-900/30' : 'bg-white'}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className={`border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
              <th className="px-4 py-3 w-12 text-center">
                 <button onClick={() => {
                   if (selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0) setSelectedOrderIds(new Set());
                   else setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)));
                 }} className="text-primary">
                   {selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare size={20} fill="currentColor" className="text-white bg-primary rounded" /> : <Square size={20} className="opacity-30" />}
                 </button>
              </th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Order Info</th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Customer/Server</th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Items Ready</th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Aging</th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Status / Rider</th>
              <th className={`px-4 py-3 text-xs uppercase tracking-widest ${theme.text.tertiary}`}>Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {filteredOrders.map(order => (
              <DispatchTableRow 
                key={order.id} 
                order={order} 
                isDarkMode={isDarkMode} 
                onDispatch={handleDispatch}
                onSelect={toggleSelect}
                isSelected={selectedOrderIds.has(order.id)}
                isExpanded={expandedOrderId === order.id}
                onExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                onRiderAssign={handleRiderAssign}
                onPrint={handlePrint}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`min-h-[calc(100vh-8rem)] flex flex-col ${isDarkMode ? 'bg-[#0F1115]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 pt-6 pb-4 border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm sticky top-0 z-20`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-primary/20 text-primary' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                <Bell size={24} className="animate-swing" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} mb-1 tracking-tight`}>
                  Dispatch Center
                </h1>
                <p className={`text-sm ${theme.text.tertiary} flex items-center gap-2`}>
                  <Volume2 size={14} className="text-green-500" />
                  Live Kitchen Feed • {readyOrdersCount} Orders Pending
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:flex-1 lg:max-w-2xl">
            {/* Search Bar grouped with Stats */}
            <div className="flex-1">
              <div className="relative group">
                <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary ${theme.text.tertiary}`} size={18} />
                <input
                  type="text"
                  placeholder="Invoice, Order #, Table or Customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 transition-all ${theme.border.main} ${theme.input.background} ${theme.input.text} ${theme.input.placeholder} focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-semibold`}
                />
              </div>
            </div>

            {/* Quick Stats - grouped with search for same row on sm */}
            <div className={`flex shrink-0 px-5 py-2.5 rounded-2xl ${isDarkMode ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-primary/10 text-primary shadow-sm border'}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-30" />
                </div>
                <div className="flex flex-col">
                  <div className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-70`}>Total Ready</div>
                  <div className={`text-xl font-black leading-none`}>{readyOrdersCount}</div>
                </div>
              </div>
            </div>

            {/* Mode Toggle Button */}
            {/* <button
              onClick={() => setIsRealTimeMode(!isRealTimeMode)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                isRealTimeMode
                  ? `${isDarkMode ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'bg-blue-100 border border-blue-300 text-blue-700'}`
                  : `${isDarkMode ? 'bg-gray-700 border border-gray-600 text-gray-300' : 'bg-gray-200 border border-gray-300 text-gray-700'}`
              }`}
              title={isRealTimeMode ? 'Switch to Mock Data' : 'Switch to Real-Time'}
            >
              <span className="text-lg">{isRealTimeMode ? '🔴' : '⚪'}</span>
              <span className="hidden sm:inline">{isRealTimeMode ? 'Real-Time' : 'Mock Data'}</span>
            </button> */}
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <div className="flex gap-2.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hidden">
            {(['all', 'DineIn', 'TakeAway', 'Delivery'] as const).map((type) => {
              const label = type === 'all' ? 'All' : type === 'DineIn' ? 'Dine In' : type === 'TakeAway' ? 'Takeaway' : 'Delivery';
              const Icon = type === 'all' ? Package : type === 'DineIn' ? User : type === 'TakeAway' ? ShoppingBag : Truck;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest border-2 flex items-center gap-2 ${
                    filterType === type
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 border-primary scale-105 z-10'
                      : `${theme.neutral.card} ${theme.text.secondary} ${theme.border.main} hover:border-primary/30 hover:bg-primary/5`
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>

          <div className={`flex items-center p-1.5 rounded-2xl border-2 ${theme.border.main} bg-background/50 shrink-0 shadow-inner`}>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' 
                        ? 'bg-primary text-white shadow-lg' 
                        : `${theme.text.tertiary} hover:bg-gray-200/50 dark:hover:bg-gray-800/50`
                    }`}
                >
                    <List size={20} />
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'grid' 
                        ? 'bg-primary text-white shadow-lg' 
                        : `${theme.text.tertiary} hover:bg-gray-200/50 dark:hover:bg-gray-800/50`
                    }`}
                >
                    <LayoutGrid size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedOrderIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <div className={`px-6 py-4 rounded-3xl shadow-2xl border-2 flex items-center gap-6 ${isDarkMode ? 'bg-[#1C1F26] border-primary/30 text-white' : 'bg-white border-primary/20 text-gray-900'}`}>
            <div className="flex flex-col">
              <span className="text-sm font-black">{selectedOrderIds.size} Orders Selected</span>
              <span className="text-[10px] opacity-60 uppercase font-bold tracking-widest">Bulk Fulfillment Mode</span>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBulkDispatch}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send size={16} />
                Bulk Dispatch
              </button>
              <button 
                onClick={() => setSelectedOrderIds(new Set())}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {filteredOrders.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-24">
              {filteredOrders.map(order => (
                <DispatchOrderCard 
                  key={order.id} 
                  order={order} 
                  isDarkMode={isDarkMode} 
                  onDispatch={handleDispatch}
                  onSelect={toggleSelect}
                  isSelected={selectedOrderIds.has(order.id)}
                  onRiderAssign={handleRiderAssign}
                  onPrint={handlePrint}
                />
              ))}
            </div>
          ) : ListView
        ) : (
          <div className={`flex flex-col items-center justify-center py-32 ${theme.text.muted}`}>
            <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'} flex items-center justify-center mb-8 relative`}>
              <Truck size={64} className="opacity-20" />
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-spin-slow" />
            </div>
            <p className="text-2xl font-black tracking-tight mb-2">Zero Orders Ready</p>
            <p className="text-sm font-medium opacity-60 max-w-xs text-center">Your kitchen is hard at work. New orders will appear here automatically.</p>
          </div>
        )}
      </div>

      {/* Printing Component (Hidden from UI, visible for Print) */}
      {printingOrder && (
        <OrderReceipt order={printingOrder} />
      )}
      
      <style jsx global>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DispatchView;
