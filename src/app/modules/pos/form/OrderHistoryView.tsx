'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Badge } from 'rizzui';
import { CustomSelect } from '../../../../components/CustomSelect';
import Tabs, { TabItem } from '../../../../components/Tabs';
import { OrderActionsDropdown } from '../../../../components/dropdown';
import { mockHistoryOrders } from '../mockData';
import { Clock, Grid, User, Phone, MapPin, ShoppingBag, Calendar, TrendingUp, ChevronDown, ChevronUp, Info, ArrowUp, ArrowDown, ShoppingCart, RotateCcw, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderReceipt } from './OrderReceipt';
import { Order as POSOrder } from '../types';

// History Order interface that matches mockHistoryOrders structure
interface HistoryOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  tableId?: string;
  waiterName?: string;
  customerPhone?: string;
  riderName?: string;
  riderPhone?: string;
  deliveryAddress?: string;
  status: string;
  type: string;
  items?: { name: string; price: number; quantity: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  completedAt: string;
  refundedAt?: string;
  cancellationReason?: string;
  refundReason?: string;
  paymentMethod?: string;
}

interface OrderHistoryViewProps {
  isDarkMode?: boolean;
}

interface FilterFormData {
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ isDarkMode = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all'); // 'all', 'dine-in', 'takeaway', 'delivery'
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showCalendar, setShowCalendar] = useState(false);

  // New state for actions
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<HistoryOrder | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<HistoryOrder | null>(null);
  const [localOrders, setLocalOrders] = useState<HistoryOrder[]>(mockHistoryOrders);

  // Sync with mock data if it changes (optional but good practice)
  useEffect(() => {
    setLocalOrders(mockHistoryOrders);
  }, []);

  const { control, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      dateFrom: '2026-02-13',
      dateTo: '2026-02-13',
    },
  });

  const filters = watch();

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const today = new Date('2026-02-13');
    let from = new Date(today);
    let to = new Date(today);

    switch (period) {
      case 'today':
        break;
      case 'yesterday':
        from.setDate(today.getDate() - 1);
        to.setDate(today.getDate() - 1);
        break;
      case 'week':
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from.setMonth(today.getMonth() - 1);
        break;
      default:
        return;
    }

    setValue('dateFrom', from.toISOString().split('T')[0]);
    setValue('dateTo', to.toISOString().split('T')[0]);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
    setValue('dateFrom', dateStr);
    setValue('dateTo', dateStr);
    setSelectedPeriod('custom');
    setShowCalendar(false);
  };

  // First filter by order type and DATE (for dynamic badges and amounts)
  const dateAndTypeFiltered: HistoryOrder[] = localOrders.filter(order => {
    const matchesOrderType = orderTypeFilter === 'all' || order.type === orderTypeFilter;
    const orderDate = new Date(order.createdAt.split(' ')[0]);
    const fromDate = new Date(filters.dateFrom);
    const toDate = new Date(filters.dateTo);
    const matchesDateRange = orderDate >= fromDate && orderDate <= toDate;
    return matchesOrderType && matchesDateRange;
  });

  // Calculate counts for each status within the selected date range
  const allOrdersCount = dateAndTypeFiltered.length;
  const completedOrdersCount = dateAndTypeFiltered.filter(order => order.status === 'completed').length;
  const cancelledOrdersCount = dateAndTypeFiltered.filter(order => order.status === 'cancelled').length;
  const refundedOrdersCount = dateAndTypeFiltered.filter(order => order.status === 'refunded').length;
  const pendingOrdersCount = dateAndTypeFiltered.filter(order => order.status === 'pending').length;

  // Calculate total amounts for each status within the selected date range
  const calculateTotalAmount = (orders: HistoryOrder[]) =>
    orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

  const allOrdersAmount = calculateTotalAmount(dateAndTypeFiltered);
  const completedOrdersAmount = calculateTotalAmount(dateAndTypeFiltered.filter(o => o.status === 'completed'));
  const cancelledOrdersAmount = calculateTotalAmount(dateAndTypeFiltered.filter(o => o.status === 'cancelled'));
  const refundedOrdersAmount = calculateTotalAmount(dateAndTypeFiltered.filter(o => o.status === 'refunded'));
  const pendingOrdersAmount = calculateTotalAmount(dateAndTypeFiltered.filter(o => o.status === 'pending'));

  // Get current status amount
  const getCurrentStatusAmount = () => {
    switch (activeFilter) {
      case 'completed': return completedOrdersAmount;
      case 'cancelled': return cancelledOrdersAmount;
      case 'refunded': return refundedOrdersAmount;
      case 'pending': return pendingOrdersAmount;
      default: return allOrdersAmount;
    }
  };

  // Action Handlers
  const handleViewDetails = (order: HistoryOrder) => {
    setSelectedOrderForDetails(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrderForDetails(null);
  };

  const handleMarkAsReady = (orderId: string) => {
    const updatedOrders = localOrders.map(order =>
      order.id === orderId ? { ...order, status: 'completed', completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) } : order
    );
    setLocalOrders(updatedOrders);

    if (selectedOrderForDetails?.id === orderId) {
      setSelectedOrderForDetails(prev => prev ? ({ ...prev, status: 'completed' }) : null);
    }

    toast.success('Order marked as completed');
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = localOrders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      setLocalOrders(updatedOrders);

      if (selectedOrderForDetails?.id === orderId) {
        setSelectedOrderForDetails(prev => prev ? ({ ...prev, status: 'cancelled' }) : null);
      }
      toast.error('Order cancelled');
    }
  };

  const handlePrintReceipt = (order: HistoryOrder) => {
    setOrderToPrint(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredOrders = dateAndTypeFiltered.filter(order => {
    const searchLower = filters.search?.toLowerCase();

    const matchesSearch = !searchLower ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      (order.tableId && order.tableId.toLowerCase().includes(searchLower));

    const matchesStatus = activeFilter === 'all' || order.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  // Group orders by status for "All" view (from filtered results)
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');
  const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
  const refundedOrders = filteredOrders.filter(order => order.status === 'refunded');

  // Statistics for selected data (dynamic based on filteredOrders)
  const periodRevenue = filteredOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const totalOrdersPeriod = filteredOrders.length;
  const totalReturns = filteredOrders.filter(o => o.status === 'refunded').length;

  // These could also be dynamic if we had historical context for comparison
  const revenueChange = 4.7;
  const ordersChange = -4.7;
  const returnsChange = 4.7;

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Convert HistoryOrder to POSOrder for OrderDetailsModal
  const convertToPOSOrder = (historyOrder: HistoryOrder | null): POSOrder | null => {
    if (!historyOrder) return null;
    
    return {
      id: historyOrder.id,
      orderNumber: historyOrder.orderNumber,
      items: (historyOrder.items || []).map(item => ({
        product: {
          id: item.name,
          name: item.name,
          price: item.price,
          category: '',
          image: '',
          available: true
        },
        quantity: item.quantity,
        notes: ''
      })),
      total: historyOrder.subtotal,
      discount: historyOrder.discount,
      tax: historyOrder.tax,
      grandTotal: historyOrder.grandTotal,
      paymentMode: (historyOrder.paymentMethod?.toLowerCase() === 'cash' ? 'cash' : 
                    historyOrder.paymentMethod?.toLowerCase() === 'card' ? 'card' : 'online') as 'cash' | 'card' | 'online',
      cashBack: 0,
      tableId: historyOrder.tableId,
      customerName: historyOrder.customerName,
      customerPhone: historyOrder.customerPhone,
      status: historyOrder.status as any,
      type: historyOrder.type as 'dine-in' | 'takeaway' | 'delivery',
      createdAt: historyOrder.createdAt,
      waiterName: historyOrder.waiterName,
      riderName: historyOrder.riderName,
      riderPhone: historyOrder.riderPhone,
      deliveryAddress: historyOrder.deliveryAddress
    };
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-error/10 text-error';
      case 'refunded': return 'bg-warning/10 text-warning';
      case 'pending': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-surface text-textPrimary';
    }
  };

  const OrderCard: React.FC<{ order: HistoryOrder }> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedItems = isExpanded ? order.items : order.items?.slice(0, 3);

    return (
      <div className="p-4 rounded-xl border border-border transition-all hover:shadow-lg flex flex-col bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-textPrimary">
              #{order.orderNumber.split('-').pop()}
            </h3>
            <Badge
              variant="flat"
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusBadgeColor(order.status)}`}
            >
              {order.status}
            </Badge>
          </div>
          <OrderActionsDropdown
            isDarkMode={isDarkMode}
            onViewDetails={() => handleViewDetails(order)}
            onMarkAsReady={() => handleMarkAsReady(order.id)}
            onPrintReceipt={() => handlePrintReceipt(order)}
            onCancelOrder={() => handleCancelOrder(order.id)}
          />
        </div>

        {/* Order Type Badge */}
        <div className="mb-3">
          <Badge
            variant="flat"
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${order.type === 'dine-in' ? 'bg-primary/10 text-primary' :
              order.type === 'takeaway' ? 'bg-secondary/10 text-secondary' :
                'bg-success/10 text-success'
              }`}
          >
            {order.type === 'dine-in' ? '🍽️ Dine-In' : order.type === 'takeaway' ? '📦 Takeaway' : '🛵 Online Order'}
          </Badge>
        </div>

        {/* Items Section */}
        <div className="flex-1 mb-3 pb-3 border-b border-border">
          <div className="grid grid-cols-12 gap-2 mb-2 text-[9px] font-bold uppercase tracking-wider text-textSecondary">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-4 text-right">Price</div>
          </div>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-1.5">
              {displayedItems && displayedItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 text-xs text-textSecondary">
                  <div className="col-span-6 truncate text-textPrimary font-medium">{item.name}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-4 text-right font-semibold">PKR {item.price.toFixed(2)}</div>
                </div>
              ))}
              {order.items.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] text-center italic pt-1 w-full hover:underline text-primary font-bold flex items-center justify-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp size={12} /></>
                  ) : (
                    <>+{order.items.length - 3} more items <ChevronDown size={12} /></>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-center italic py-2 text-textSecondary">No items</div>
          )}
        </div>

        {/* Conditional Fields Based on Order Type */}
        <div className="mb-3 space-y-2 text-xs text-textSecondary">
          {order.type === 'dine-in' && (
            <>
              <div className="flex items-center gap-2">
                <Grid size={14} className="text-primary" />
                <span className="font-medium">Table:</span>
                <span className="text-textPrimary">{order.tableId}</span>
              </div>
              {order.waiterName && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span className="font-medium">Waiter:</span>
                  <span className="text-textPrimary">{order.waiterName}</span>
                </div>
              )}
            </>
          )}

          {order.type === 'takeaway' && (
            <>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span className="font-medium">Customer:</span>
                <span className="text-textPrimary">{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="font-medium">Phone:</span>
                  <span className="text-textPrimary">{order.customerPhone}</span>
                </div>
              )}
            </>
          )}

          {order.type === 'delivery' && (
            <>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span className="font-medium">Customer:</span>
                <span className="text-textPrimary">{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="font-medium">Phone:</span>
                  <span className="text-textPrimary">{order.customerPhone}</span>
                </div>
              )}
              {order.riderName && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-success" />
                  <span className="font-medium">Rider:</span>
                  <span className="text-textPrimary">{order.riderName}</span>
                </div>
              )}
              {order.riderPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-success" />
                  <span className="font-medium">Rider Phone:</span>
                  <span className="text-textPrimary">{order.riderPhone}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <span className="text-textPrimary ml-1">{order.deliveryAddress}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Payment Method */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <span className="font-medium">Payment:</span>
            <span className="text-textPrimary">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
              <Clock size={11} />
              <span>Ordered: {order.createdAt.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="flex items-center  gap-1.5 text-[10px] text-textSecondary">
              <Calendar size={11} />
              <span>
                {order.status === 'completed' ? 'Completed' :
                  order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}: {order.completedAt.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold uppercase text-textSecondary block mb-0.5">Total</span>
            <div className="text-lg font-black text-primary">
              PKR {order.grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderListItem: React.FC<{ order: HistoryOrder }> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedItems = isExpanded ? order.items : order.items?.slice(0, 2);
    const showOrderDetails = orderTypeFilter !== 'all';

    return (
      <div className="px-4 py-4 sm:py-3 border-b border-border transition-all hover:bg-surface/50 bg-surface">
        <div className={`flex flex-col sm:grid ${showOrderDetails ? 'sm:grid-cols-12' : 'sm:grid-cols-10'} gap-3 sm:gap-4 items-start sm:items-center`}>
          {/* Top Row for Mobile (Order #, Time, Status) */}
          <div className="flex items-center justify-between w-full sm:hidden mb-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-bold text-sm text-textPrimary">
                #{order.orderNumber.split('-').pop()}
              </h3>
              <div className="text-[11px] flex items-center gap-1 text-textSecondary">
                <Clock size={11} className="opacity-60" />
                <span>{order.createdAt.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
            <Badge
              variant="flat"
              className={`py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusBadgeColor(order.status)}`}
            >
              {order.status}
            </Badge>
          </div>

          {/* Desktop Order / Time */}
          <div className="hidden sm:flex col-span-2 flex-col gap-0.5">
            <h3 className="font-bold text-sm text-textPrimary">
              #{order.orderNumber.split('-').pop()}
            </h3>
            <div className="text-[11px] flex items-center gap-1 text-textSecondary">
              <Clock size={11} className="opacity-60" />
              <span>{order.createdAt.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="text-[10px] flex items-center gap-1 text-textSecondary mt-1">
              <Calendar size={10} className="opacity-60" />
              <span>
                {order.status === 'completed' ? 'Done' :
                  order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}: {order.completedAt.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>

          {/* Desktop Status */}
          <div className="hidden sm:block col-span-1">
            <Badge
              variant="flat"
              className={`py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusBadgeColor(order.status)}`}
            >
              {order.status}
            </Badge>
          </div>

          {/* Items Column */}
          <div className="col-span-12 sm:col-span-5 w-full">
            <div className="flex flex-col gap-2 sm:gap-1.5">
              {displayedItems && displayedItems.length > 0 ? (
                displayedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-surface/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium text-textPrimary truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-textSecondary">
                      <span className="text-center min-w-[20px]">×{item.quantity}</span>
                      <span className="font-semibold text-right min-w-[60px] text-textPrimary">PKR {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-center italic py-2 text-textSecondary">No items</div>
              )}
              {order.items && order.items.length > 2 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] text-center italic pt-1 w-full hover:underline text-primary font-bold flex items-center justify-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp size={12} /></>
                  ) : (
                    <>+{order.items.length - 2} more items <ChevronDown size={12} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Details - Dynamic based on order type */}
          {showOrderDetails && (
            <div className={`col-span-12 sm:col-span-2 w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50`}>
              <div className="space-y-1 text-xs text-textSecondary">
                {order.type === 'dine-in' && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Grid size={12} className="text-primary" />
                      <span>{order.tableId}</span>
                    </div>
                    {order.waiterName && (
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-primary" />
                        <span className="truncate">{order.waiterName}</span>
                      </div>
                    )}
                  </>
                )}

                {order.type === 'takeaway' && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-primary" />
                      <span className="truncate">{order.customerName}</span>
                    </div>
                    {order.customerPhone && (
                      <div className="text-[10px] text-textSecondary truncate">{order.customerPhone}</div>
                    )}
                  </>
                )}

                {order.type === 'delivery' && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-primary" />
                      <span className="truncate">{order.customerName }</span>
                    </div>
                    {order.customerPhone && (
                      <div className="text-[10px] text-textSecondary truncate">{order.customerPhone}</div>
                    )}
                    {order.riderName && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User size={12} className="text-success" />
                        <span className="truncate text-success">{order.riderName}</span>
                      </div>
                    )}
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-1.5 mt-1">
                        <MapPin size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-[10px] text-textSecondary leading-tight line-clamp-2">
                          {order.deliveryAddress.length > 40
                            ? `${order.deliveryAddress.substring(0, 40)}...`
                            : order.deliveryAddress
                          }
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Payment Method */}
                <div className="pt-2 border-t border-border/30">
                  <span className="text-[10px] font-medium text-textSecondary">Payment: {order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total Amount & Actions */}
          <div className="col-span-12 sm:col-span-2 flex items-center justify-between w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <div className="flex flex-col sm:block">
              <span className="text-[9px] font-bold uppercase text-textSecondary block mb-0.5">Total</span>
              <div className="text-lg font-black text-primary">
                PKR {order.grandTotal.toFixed(2)}
              </div>
            </div>
            <OrderActionsDropdown
              isDarkMode={isDarkMode}
              onViewDetails={() => handleViewDetails(order)}
              onMarkAsReady={() => handleMarkAsReady(order.id)}
              onPrintReceipt={() => handlePrintReceipt(order)}
              onCancelOrder={() => handleCancelOrder(order.id)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersSection = (title: string, orders: HistoryOrder[]) => {
    if (orders.length === 0) return null;

    // Determine column header based on order type filter
    let orderDetailsHeader = 'Order Details';
    const showOrderDetails = orderTypeFilter !== 'all';

    if (orderTypeFilter === 'dine-in') {
      orderDetailsHeader = 'Table / Waiter';
    } else if (orderTypeFilter === 'takeaway') {
      orderDetailsHeader = 'Customer Info';
    } else if (orderTypeFilter === 'delivery') {
      orderDetailsHeader = 'Customer / Address';
    }

    return (
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 text-textPrimary">
          {title}
        </h2>
        {viewMode === 'list' && (
          <div className={`hidden sm:grid ${showOrderDetails ? 'sm:grid-cols-12' : 'sm:grid-cols-10'} gap-4 px-4 mb-2 text-[10px] md:text-xs uppercase tracking-widest text-textSecondary font-bold`}>
            <div className="col-span-2">Order / Time</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-5 pl-5">Items</div>
            {showOrderDetails && <div className="col-span-2">{orderDetailsHeader}</div>}
            <div className="col-span-2 text-right pr-10">Total Amount</div>
          </div>
        )}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {orders.map(order => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const ordersContent = (
    <div className="min-h-[400px]">
      {activeFilter === 'all' ? (
        <>
          {renderOrdersSection('Completed Orders', completedOrders)}
          {renderOrdersSection('Cancelled Orders', cancelledOrders)}
          {renderOrdersSection('Refunded Orders', refundedOrders)}
          {filteredOrders.length === 0 && (
            <p className="text-sm text-center py-8 text-textSecondary">No matching orders</p>
          )}
        </>
      ) : (
        <>
          {renderOrdersSection(activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) + ' Orders', filteredOrders)}
          {filteredOrders.length === 0 && (
            <p className="text-sm text-center py-8 text-textSecondary">No matching orders</p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col bg-background p-3 sm:p-4 lg:p-6">
      {/* Modals and Print Component moved to bottom for z-index */}

      {/* Statistics Dashboard */}
      <div className="bg-surface rounded-3xl border border-border mb-8 shadow-sm flex flex-col lg:flex-row relative">
        {/* Left Sidebar - Period Selector */}
        <div className="w-full lg:w-48  bg-white dark:bg-surface border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 flex flex-row justify-start items-center gap-3 relative group rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-3 text-primary font-bold text-base sm:text-lg hover:opacity-80 transition-all group-hover:scale-105 dark:bg-primary/10 px-4 py-3 rounded-2xl"
          >
            <CalendarDays size={20} className="text-primary flex-shrink-0" />
            <span className="text-primary">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </span>
            <ChevronDown size={16} className={`transition-transform duration-300 flex-shrink-0 ${showCalendar ? 'rotate-180' : ''}`} />
          </button>

          {/* Period Selection Dropdown / Simple Calendar */}
          {showCalendar && (
            <div className="absolute left-6 top-[85%] mt-2 w-60 bg-surface border border-border rounded-2xl shadow-2xl z-[100] p-4 animate-in fade-in zoom-in duration-200">
              <div className="mb-4 pb-3 border-b border-border flex items-center justify-between">
                <span className="font-bold text-sm text-textPrimary">Select Period</span>
                <button onClick={() => setShowCalendar(false)} className="text-textSecondary hover:text-textPrimary transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handlePeriodChange(option.value);
                      setShowCalendar(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs rounded-xl transition-all flex items-center justify-between ${selectedPeriod === option.value
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                      }`}
                  >
                    {option.label}
                    {selectedPeriod === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-textSecondary uppercase mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
                    const isSelected = filters.dateFrom === dateStr;
                    return (
                      <button
                        key={i}
                        onClick={() => handleDateClick(day)}
                        className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-primary text-white font-bold' : 'text-textPrimary hover:bg-primary/20'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Content */}
        <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-0">
          {/* Total Revenue */}
          <div className="flex-1 w-full md:px-10 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-textSecondary font-semibold uppercase tracking-wider">Total Revenue</span>
              <Info size={16} className="text-textSecondary/40 cursor-help" />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
              <span className="text-xl sm:text-3xl font-black text-textPrimary leading-none">
                ${periodRevenue.toLocaleString()}
              </span>
              <div className="flex flex-col items-center sm:items-start mb-1">
                <div className="flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full mb-1">
                  <TrendingUp size={14} className="text-success" />
                  <span className="text-xs font-extrabold text-success">{revenueChange}%</span>
                </div>
                <span className="text-[10px] text-textSecondary font-medium hidden xl:inline sm:whitespace-nowrap">from last week</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-border mx-2" />
          {/* Total Orders */}
          <div className="flex-1 w-full md:px-10 flex flex-col items-center md:items-start border-t md:border-t-0 py-8 md:py-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] sm:text-sm text-textSecondary font-semibold whitespace-nowrap uppercase tracking-wider">Total Orders</span>
              <Info size={16} className="text-textSecondary/40 cursor-help" />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
              <span className="text-xl sm:text-3xl font-black text-textPrimary leading-none">
                {totalOrdersPeriod.toLocaleString()}
              </span>
              <div className="flex flex-col items-center sm:items-start mb-1">
                <div className="flex items-center gap-1.5 bg-error/10 px-2 py-0.5 rounded-full mb-1">
                  <TrendingUp size={14} className="text-error" style={{ transform: 'rotate(180deg)' }} />
                  <span className="text-xs font-extrabold text-error">{Math.abs(ordersChange)}%</span>
                </div>
                <span className="text-[10px] text-textSecondary font-medium hidden xl:inline">from last week</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-border mx-2" />

          {/* Total Returns */}
          <div className="flex-1 w-full md:px-10 flex flex-col items-center md:items-start border-t md:border-t-0 pt-8 md:pt-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] sm:text-sm text-textSecondary font-semibold whitespace-nowrap uppercase tracking-wider">Total Returns</span>
              <Info size={16} className="text-textSecondary/40 cursor-help" />
            </div>
            <div className="flex flex-col  sm:flex-row items-center sm:items-end gap-3 sm:gap-4 md:gap-10">
              <span className="text-xl sm:text-3xl font-black text-textPrimary leading-none">
                {totalReturns.toLocaleString()}
              </span>
              <div className="flex flex-col items-center sm:items-start mb-1">
                <div className="flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full mb-1">
                  <TrendingUp size={14} className="text-success" />
                  <span className="text-xs font-extrabold text-success">{returnsChange}%</span>
                </div>
                <span className="text-[10px] text-textSecondary font-medium hidden xl:inline">from last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border mb-6 shadow-sm bg-surface">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-9 w-full lg:w-auto">
            <h1 className="text-xl sm:text-xl font-bold whitespace-nowrap text-textPrimary">
              Order History
            </h1>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                     bg-gradient-to-r from-primary to-orange-600 backdrop-blur-md 
                    border border-white/20 
                    shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Total Revenue
                </span>
                <span className="text-sm font-black text-white">
                  PKR {getCurrentStatusAmount().toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto ml-auto">
            <div className="w-full sm:w-64">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type="text"
                      placeholder="Search orders..."
                      className="w-full px-4 py-2 pr-10 text-sm rounded-lg border border-border bg-surface text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <Controller
                name="dateFrom"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              <Controller
                name="dateTo"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              />
            </div>
            <div className="flex items-center p-1 rounded-lg border border-border bg-surface">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs with Order Type Select */}
        <div className="w-full">
          <Tabs
            variant="pills"
            size="sm"
            isDarkMode={isDarkMode}
            onTabChange={(tabId) => setActiveFilter(tabId)}
            defaultActiveTab={activeFilter}
            headerRight={
              <div className="w-64">
                <CustomSelect
                  options={[
                    { value: 'all', label: 'All Orders' },
                    { value: 'dine-in', label: 'Dine-In Orders' },
                    { value: 'takeaway', label: 'Takeaway Orders' },
                    { value: 'delivery', label: 'Online Orders' },
                  ]}
                  value={orderTypeFilter}
                  onChange={(selected) => setOrderTypeFilter(selected?.value || 'all')}
                  isDarkMode={isDarkMode}
                  placeholder="Select Order Type..."
                />
              </div>
            }
            items={[
              { id: 'all', name: 'All Status', badge: allOrdersCount, content: ordersContent },
              { id: 'pending', name: 'Pending', badge: pendingOrdersCount, content: ordersContent },
              { id: 'completed', name: 'Completed', badge: completedOrdersCount, content: ordersContent },
              { id: 'cancelled', name: 'Cancelled', badge: cancelledOrdersCount, content: ordersContent },
              { id: 'refunded', name: 'Refunded', badge: refundedOrdersCount, content: ordersContent },
            ]}
          />
        </div>
      </div>

      {/* Modals and Print Component */}
      <OrderDetailsModal
        isOpen={!!selectedOrderForDetails}
        onClose={handleCloseDetails}
        order={convertToPOSOrder(selectedOrderForDetails)}
        isDarkMode={isDarkMode}
        onPrint={() => selectedOrderForDetails && handlePrintReceipt(selectedOrderForDetails)}
        onMarkAsReady={() => selectedOrderForDetails && handleMarkAsReady(selectedOrderForDetails.id)}
        onCancelOrder={() => selectedOrderForDetails && handleCancelOrder(selectedOrderForDetails.id)}
      />

      <OrderReceipt order={orderToPrint} branchInfo={{ name: 'Main Branch', location: 'M.A Jinnah road Okara', phone: '+92 300 1234567' }} />
    </div>
  );
};
