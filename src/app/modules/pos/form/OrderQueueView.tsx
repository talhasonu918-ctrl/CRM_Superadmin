
import React, { useState } from 'react';
import { Order } from '../types';
import { mockQueueOrders } from '../mockData';
import { Search, Calendar, Grid, List, Phone, User, ShoppingBag, Clock, ChevronDown, ChevronUp, Printer, MapPin, Bike, Smartphone } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

import { CustomSelect, CustomSelectOption } from '../../../../components/CustomSelect';
import { OrderActionsDropdown } from '../../../../components/dropdown';
import { Badge } from 'rizzui';
import Tabs, { TabItem } from '../../../../components/Tabs';

interface OrderQueueViewProps {
  isDarkMode?: boolean;
}

interface FilterFormData {
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const OrderQueueView: React.FC<OrderQueueViewProps> = ({ isDarkMode = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all'); // 'all', 'dine-in', 'takeaway', 'delivery'

  const { control, watch } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      dateFrom: '2026-01-30',
      dateTo: '2026-01-30',
    },
  });

  const filters = watch();

  // First filter by order type only (for badge counts)
  const orderTypeFiltered = mockQueueOrders.filter(order =>
    orderTypeFilter === 'all' || order.type === orderTypeFilter
  );

  // Calculate counts for each status (not affected by search or active filter)
  const allOrdersCount = orderTypeFiltered.length;
  const pendingOrdersCount = orderTypeFiltered.filter(order => order.status === 'pending').length;
  const preparingOrdersCount = orderTypeFiltered.filter(order => order.status === 'preparing').length;
  const readyOrdersCount = orderTypeFiltered.filter(order => order.status === 'ready').length;
  const servedOrdersCount = orderTypeFiltered.filter(order => order.status === 'served').length;
  const cancelledOrdersCount = orderTypeFiltered.filter(order => order.status === 'cancelled').length;

  // Calculate total amounts for each status
  const calculateTotalAmount = (orders: typeof mockQueueOrders) =>
    orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

  const allOrdersAmount = calculateTotalAmount(orderTypeFiltered);
  const pendingOrdersAmount = calculateTotalAmount(orderTypeFiltered.filter(o => o.status === 'pending'));
  const preparingOrdersAmount = calculateTotalAmount(orderTypeFiltered.filter(o => o.status === 'preparing'));
  const readyOrdersAmount = calculateTotalAmount(orderTypeFiltered.filter(o => o.status === 'ready'));
  const servedOrdersAmount = calculateTotalAmount(orderTypeFiltered.filter(o => o.status === 'served'));
  const cancelledOrdersAmount = calculateTotalAmount(orderTypeFiltered.filter(o => o.status === 'cancelled'));

  // Get current status amount
  const getCurrentStatusAmount = () => {
    switch (activeFilter) {
      case 'pending': return pendingOrdersAmount;
      case 'preparing': return preparingOrdersAmount;
      case 'ready': return readyOrdersAmount;
      case 'served': return servedOrdersAmount;
      case 'cancelled': return cancelledOrdersAmount;
      default: return allOrdersAmount;
    }
  };
  const filteredOrders = mockQueueOrders.filter(order => {
    const searchLower = filters.search?.toLowerCase();
    const searchNormalized = searchLower?.replace(/\s+/g, '');

    const matchesSearch = !searchLower ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      (order.tableId && order.tableId.toLowerCase().includes(searchLower));

    const matchesStatus = activeFilter === 'all' || order.status === activeFilter;

    const matchesOrderType = orderTypeFilter === 'all' || order.type === orderTypeFilter;

    return matchesSearch && matchesStatus && matchesOrderType;
  });

  // Group orders by status for "All" view (from filtered results)
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const preparingOrders = filteredOrders.filter(order => order.status === 'preparing');
  const readyOrders = filteredOrders.filter(order => order.status === 'ready');
  const servedOrders = filteredOrders.filter(order => order.status === 'served');
  const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-primary/10 text-primary';
      case 'preparing': return 'bg-secondary/10 text-secondary';
      case 'served': return 'bg-success/10 text-success';
      case 'pending': return 'bg-primary/10 text-primary';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-surface text-textPrimary';
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
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
            onViewDetails={() => console.log('View details', order.id)}
            onMarkAsReady={() => console.log('Mark as ready', order.id)}
            onPrintReceipt={() => console.log('Print receipt', order.id)}
            onCancelOrder={() => console.log('Cancel order', order.id)}
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
                  <div className="col-span-6 truncate font-medium">{item.product.name}</div>
                  <div className="col-span-2 text-center font-bold">{item.quantity}</div>
                  <div className="col-span-4 text-right font-bold">PKR {(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              {order.items.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] text-center italic pt-1 w-full hover:underline text-primary font-bold flex items-center justify-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp size={10} /></>
                  ) : (
                    <>+{order.items.length - 3} more items... <ChevronDown size={10} /></>
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
                <span className="font-medium text-textSecondary">Table:</span>
                <span className="font-bold">{order.tableId || 'N/A'}</span>
              </div>
              {order.waiterName && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span className="font-medium text-textSecondary">Waiter:</span>
                  <span className="font-bold">{order.waiterName}</span>
                </div>
              )}
            </>
          )}

          {order.type === 'takeaway' && (
            <>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span className="font-medium text-textSecondary">Customer:</span>
                <span className="font-bold">{order.customerName || 'Walk-in'}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="font-medium text-textSecondary">Phone:</span>
                  <span className="font-bold">{order.customerPhone}</span>
                </div>
              )}
            </>
          )}

          {order.type === 'delivery' && (
            <>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span className="font-medium text-textSecondary">Customer:</span>
                <span className="font-bold">{order.customerName || 'N/A'}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="font-medium text-textSecondary">Phone:</span>
                  <span className="font-bold">{order.customerPhone}</span>
                </div>
              )}
              {order.riderName && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-success" />
                  <span className="font-medium text-textSecondary">Rider:</span>
                  <span className="font-bold">{order.riderName}</span>
                </div>
              )}
              {order.riderPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-success" />
                  <span className="font-medium text-textSecondary">Rider Phone:</span>
                  <span className="font-bold">{order.riderPhone}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-primary mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium text-textSecondary">Address:</span>
                    <p className="font-bold text-xs leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
            <Clock size={11} />
            <span>{order.createdAt.split(' ').slice(1).join(' ')}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold uppercase text-textSecondary block mb-0.5">Total</span>
            <div className="text-lg font-black text-primary">
              ₹{order.grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderListItem: React.FC<{ order: Order }> = ({ order }) => {
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
              {order.orderNumber.split('-').pop()}
            </h3>
            <div className="text-[11px] flex items-center gap-1 text-textSecondary">
              <Clock size={11} className="opacity-60" />
              <span>{order.createdAt.split(' ').slice(1).join(' ')}</span>
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
                <>
                  {displayedItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-6 sm:grid-cols-5 gap-2 text-xs pl-0 sm:pl-5">
                      <span className="col-span-3 truncate font-medium text-textSecondary">
                        {item.product.name}
                      </span>
                      <span className="col-span-1 text-center font-medium text-textSecondary">
                        {item.quantity}
                      </span>
                      <span className="col-span-2 sm:col-span-1 text-right font-medium text-textSecondary">
                        PKR {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {order.items && order.items.length > 2 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-[11px] font-bold hover:underline mt-0.5 flex items-center gap-1 text-primary pl-0 sm:pl-5"
                    >
                      {isExpanded ? (
                        <>Show less <ChevronUp size={11} /></>
                      ) : (
                        <>+{order.items.length - 2} more... <ChevronDown size={11} /></>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="text-[11px] italic pl-0 sm:pl-5 text-textSecondary">No Items</div>
              )}
            </div>
          </div>

          {/* Order Details - Dynamic based on order type */}
          {showOrderDetails && (
            <div className={`col-span-12 sm:col-span-2 w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50`}>
              <div className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-textSecondary mb-1.5 ">Details:</div>
              {order.type === 'dine-in' && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="text-sm font-bold text-textPrimary">
                    Table: {order.tableId || 'N/A'}
                  </div>
                  {order.waiterName && (
                    <div className="text-[11px] font-medium text-textSecondary">
                      {order.waiterName}
                    </div>
                  )}
                </div>
              )}

              {order.type === 'takeaway' && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="text-sm font-bold text-textPrimary">
                    {order.customerName || 'Walk-in'}
                  </div>
                  <div className="text-[11px] font-medium text-textSecondary">
                    {order.customerPhone || 'N/A'}
                  </div>
                </div>
              )}

              {order.type === 'delivery' && (
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-0.5">
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-textPrimary">
                      {order.customerName || 'N/A'}
                    </div>
                    <div className="text-[11px] flex items-center gap-1.5 text-textSecondary">
                      <Phone size={11} className="text-primary" />
                      <span>{order.customerPhone || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {order.deliveryAddress && (
                      <div className="text-[11px] flex items-center gap-1.5 text-textSecondary">
                        <MapPin size={11} className="text-primary flex-shrink-0" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    )}
                    {(order.riderName || order.riderPhone) && (
                      <div className="flex items-center gap-3">
                        {order.riderName && (
                          <div className="text-[11px] flex items-center gap-1 text-textSecondary">
                            <Bike size={11} className="text-success" />
                            <span>{order.riderName}</span>
                          </div>
                        )}
                        {order.riderPhone && (
                          <div className="text-[11px] flex items-center gap-1 text-success font-medium">
                            <Smartphone size={11} className="text-success" />
                            <span>{order.riderPhone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Total Amount & Actions */}
          <div className="col-span-12 sm:col-span-2 flex items-center justify-between w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <div className="flex flex-col sm:block">
              <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-textSecondary mb-0.5">Total Amount</span>
              <div className="text-lg font-black text-primary">
                PKR {order.grandTotal.toFixed(2)}
              </div>
            </div>
            <OrderActionsDropdown
              isDarkMode={isDarkMode}
              onViewDetails={() => console.log('View details', order.id)}
              onMarkAsReady={() => console.log('Mark as ready', order.id)}
              onPrintReceipt={() => console.log('Print receipt', order.id)}
              onCancelOrder={() => console.log('Cancel order', order.id)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersSection = (title: string, orders: Order[]) => {
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
            <div className="col-span-5 pl-5">Items (Item / Qty / Price)</div>
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
          {renderOrdersSection('Pending', pendingOrders)}
          {renderOrdersSection('In Progress', preparingOrders)}
          {renderOrdersSection('Ready', readyOrders)}
          {renderOrdersSection('Served', servedOrders)}
          {renderOrdersSection('Cancelled', cancelledOrders)}
          {filteredOrders.length === 0 && (
            <p className="text-sm text-center py-8 text-textSecondary">No matching orders</p>
          )}
        </>
      ) : (
        <>
          {renderOrdersSection(activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1), filteredOrders)}
          {filteredOrders.length === 0 && (
            <p className="text-sm text-center py-8 text-textSecondary">No matching orders</p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col bg-background p-3 sm:p-4 lg:p-6">
      {/* Header Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border mb-6 shadow-sm bg-surface">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row  items-start sm:items-center gap-3 sm:gap-9 w-full lg:w-auto">
            <h1 className="text-xl sm:text-xl font-bold whitespace-nowrap text-textPrimary">
              Current Orders
            </h1>
            {/* Total Amount Badge */}
            {/* <div className="flex items-center border-8 gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-orange-600 shadow-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Total Amount</span>
                <span className="text-lg font-bold text-white">PKR {getCurrentStatusAmount().toFixed(2)}</span>
              </div>
            </div> */}


            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                 bg-gradient-to-r from-primary to-orange-600 backdrop-blur-md 
                border border-white/20 
                shadow-md">
              <ShoppingBag className="w-4 h-4 text-white" />

              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-medium text-white uppercase tracking-wide">
                  Total
                </span>
                <span className="text-sm font-semibold text-white">
                  PKR {getCurrentStatusAmount().toFixed(2)}
                </span>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto ml-auto">
            {/* Search */}
            <div className="w-full sm:w-64">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" size={16} />
                    <input
                      {...field}
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-surface text-sm text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <Controller
                name="dateFrom"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" size={16} />
                    <input
                      {...field}
                      type="date"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-surface text-[10px] sm:text-xs text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              />
              <Controller
                name="dateTo"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-[10px] sm:text-xs text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              />
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg border border-border bg-surface">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${viewMode === 'list'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surface/10'
                  }`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${viewMode === 'grid'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surface/10'
                  }`}
              >
                <Grid size={14} />
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
              { id: 'preparing', name: 'Preparing', badge: preparingOrdersCount, content: ordersContent },
              { id: 'ready', name: 'Ready', badge: readyOrdersCount, content: ordersContent },
              { id: 'served', name: 'Served', badge: servedOrdersCount, content: ordersContent },
              { id: 'cancelled', name: 'Cancelled', badge: cancelledOrdersCount, content: ordersContent },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
