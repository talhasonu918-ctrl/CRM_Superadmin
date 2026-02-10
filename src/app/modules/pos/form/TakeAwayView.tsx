import React, { useState } from 'react';
import { TakeawayOrder } from '../types';
import { mockTakeawayOrders } from '../mockData';
import { Search, Calendar, Grid, List, Phone, User, ShoppingBag, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { CustomSelect, CustomSelectOption } from '../../../../components/CustomSelect';
import { OrderActionsDropdown } from '../../../../components/dropdown';
import { Badge } from 'rizzui';
import Tabs, { TabItem } from '../../../../components/Tabs';

interface TakeAwayViewProps {
  isDarkMode?: boolean;
}

interface FilterFormData {
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const TakeAwayView: React.FC<TakeAwayViewProps> = ({ isDarkMode = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { control, watch } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      dateFrom: '2026-01-30',
      dateTo: '2026-01-30',
    },
  });

  const filters = watch();

  const filteredOrders = mockTakeawayOrders.filter(order => {
    const searchLower = filters.search?.toLowerCase();
    const searchNormalized = searchLower?.replace(/\s+/g, '');

    const matchesSearch = !searchLower ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      (order.customerPhone && order.customerPhone.replace(/\s+/g, '').includes(searchNormalized || ''));

    const matchesStatus = activeFilter === 'all' || order.status === activeFilter ||
      (activeFilter === 'ready' && order.status === 'ready') ||
      (activeFilter === 'progress' && order.status === 'preparing') ||
      (activeFilter === 'preparing' && order.status === 'preparing') ||
      (activeFilter === 'served' && order.status === 'served') ||
      (activeFilter === 'cancelled' && order.status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  const readyOrders = filteredOrders.filter(order => order.status === 'ready');
  const progressOrders = filteredOrders.filter(order => order.status === 'preparing');
  const servedOrders = filteredOrders.filter(order => order.status === 'served');
  // Calculate accurate grand total from items
  const calculateGrandTotal = (order: TakeawayOrder): number => {
    if (!order.items || order.items.length === 0) return order.grandTotal;

    const itemsTotal = order.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const discount = order.discount || 0;
    const tax = order.tax || 0;

    return itemsTotal - discount + tax;
  };
  const OrderCard: React.FC<{ order: TakeawayOrder }> = ({ order }) => (
    <div className="p-3 rounded-xl border border-border transition-all hover:shadow-lg flex flex-col bg-surface">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-textPrimary">
          {order.orderNumber.split('-').pop()}
        </h3>
        <div className="flex items-center gap-2">
          <Badge
            variant="flat"
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'ready'
              ? 'bg-primary/10 text-primary'
              : order.status === 'preparing'
                ? 'bg-secondary/10 text-secondary'
                : order.status === 'served'
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
              }`}
          >
            {order.status === 'ready' ? 'READY' : order.status}
          </Badge>
          <OrderActionsDropdown
            isDarkMode={isDarkMode}
            onViewDetails={() => console.log('View details', order.id)}
            onMarkAsReady={() => console.log('Mark as ready', order.id)}
            onPrintReceipt={() => console.log('Print receipt', order.id)}
            onCancelOrder={() => console.log('Cancel order', order.id)}
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="flex-1 mb-3 pt-2 border-t border-border">
        <div className="grid grid-cols-4 gap-2 mb-1 text-[10px] font-bold uppercase text-textSecondary">
          <div className="col-span-2">Item</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Price</div>
        </div>
        {order.items && order.items.length > 0 && (
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 text-[11px] text-textSecondary">
                <div className="col-span-2 truncate">{item.product.name}</div>
                <div className="text-center font-medium">{item.quantity}</div>
                <div className="text-right font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer & Footer */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase mb-0.5 text-textSecondary">Customer</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-textPrimary">
              <User size={12} className="opacity-70" />
              <span className="truncate max-w-[100px]">{order.customerName || 'Walk-in'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] mt-0.5 text-textSecondary">
              <Phone size={10} className="opacity-70" />
              <span>{order.customerPhone || 'N/A'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase mb-0.5 text-textSecondary">Total</span>
            <div className="text-sm font-black text-primary">
              ₹{calculateGrandTotal(order).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-textSecondary opacity-70">
          <Clock size={10} />
          <span>{order.pickupTime}</span>
        </div>
      </div>
    </div>
  );

  const OrderListItem: React.FC<{ order: TakeawayOrder }> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedItems = isExpanded ? order.items : order.items?.slice(0, 2);

    return (
      <div className="px-4 py-3 border-b border-border transition-all hover:bg-surface/50 bg-surface">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Order / Time */}
          <div className="col-span-2 flex flex-col gap-0.5">
            <h3 className="font-bold text-sm text-textPrimary">
              {order.orderNumber.split('-').pop()}
            </h3>
            <div className="text-[11px] flex items-center gap-1 text-textSecondary">
              <Clock size={11} className="opacity-60" />
              <span>{order.pickupTime} </span>
            </div>
          </div>

          {/* Status */}
          <div className="col-span-1">
            <Badge
              variant="flat"
              className={`py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'ready'
                ? 'bg-primary/10 text-primary'
                : order.status === 'preparing'
                  ? 'bg-secondary/10 text-secondary'
                  : order.status === 'served'
                    ? 'bg-success/10 text-success'
                    : 'bg-error/10 text-error'
                }`}
            >
              {order.status === 'ready' ? 'READY' : order.status}
            </Badge>
          </div>

          {/* Items Column (Sub-grid 3+1+1 = 5) */}
          <div className="col-span-5">
            <div className="flex flex-col gap-1.5">
              {displayedItems?.map((item, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 text-xs pl-5">
                  <span className="col-span-3 truncate font-medium text-textSecondary">
                    {item.product.name}
                  </span>
                  <span className="col-span-1 text-center font-medium text-textSecondary">
                    {item.quantity}
                  </span>
                  <span className="col-span-1 text-right font-medium text-textSecondary">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items && order.items.length > 2 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] font-bold hover:underline mt-0.5 flex items-center gap-1 text-primary pl-5"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp size={11} /></>
                  ) : (
                    <>+{order.items.length - 2} more... <ChevronDown size={11} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="col-span-2">
            <div className="text-sm font-bold truncate mb-0.5 text-textPrimary">
              {order.customerName || 'Walk-in'}
            </div>
            <div className="text-[11px] font-medium text-textSecondary">
              {order.customerPhone || 'N/A'}
            </div>
          </div>

          {/* Total Amount & Actions */}
          <div className="col-span-2 flex items-center justify-between pl-2">
            <div className="text-lg font-bold text-primary whitespace-nowrap">
              ₹{calculateGrandTotal(order).toFixed(2)}
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

  const ordersContent = (
    <div className="min-h-[400px]">
      {activeFilter === 'all' && (
        <>
          {/* Ready For Pickup */}
          {readyOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-3 text-textPrimary">
                Ready For Pickup
              </h2>
              {viewMode === 'list' && readyOrders.length > 0 && (
                <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                  <div className="col-span-2">Order / Time</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-3 pl-5 ">Item</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-2">Customer Info</div>
                  <div className="col-span-2 text-right pr-10 whitespace-nowrap">Total Amount</div>
                </div>
              )}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {readyOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {readyOrders.map(order => (
                    <OrderListItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* In Progress */}
          {progressOrders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-3 text-textPrimary">
                In Progress
              </h2>
              {viewMode === 'list' && progressOrders.length > 0 && (
                <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                  <div className="col-span-2">Order / Time</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-3 pl-5">Item</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-2">Customer Info</div>
                  <div className="col-span-2 text-right pr-10 whitespace-nowrap">Total Amount</div>
                </div>
              )}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3 lg:gap-4">
                  {progressOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {progressOrders.map(order => (
                    <OrderListItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Served */}
          {servedOrders.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-3 text-textPrimary">
                Served
              </h2>
              {viewMode === 'list' && servedOrders.length > 0 && (
                <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                  <div className="col-span-2">Order / Time</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-3 pl-5">Item</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-2">Customer Info</div>
                  <div className="col-span-2 text-right pr-10 whitespace-nowrap">Total Amount</div>
                </div>
              )}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {servedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {servedOrders.map(order => (
                    <OrderListItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredOrders.length === 0 && (
            <p className="text-sm text-center py-8 text-textSecondary">
              No matching orders
            </p>
          )}
        </>
      )}

      {activeFilter !== 'all' && (
        <>
          {filteredOrders.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-3 text-textPrimary">
                {activeFilter === 'ready' && 'Ready For Pickup'}
                {activeFilter === 'preparing' && 'In Progress'}
                {activeFilter === 'served' && 'Served'}
                {activeFilter === 'cancelled' && 'Cancelled'}
              </h2>
              <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                <div className="col-span-2">Order / Time</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-3 pl-5">Item</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-1 text-right">Price</div>
                <div className="col-span-2">Customer Info</div>
                <div className="col-span-2 text-right pr-10 whitespace-nowrap">Total Amount</div>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {filteredOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredOrders.map(order => (
                    <OrderListItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-center py-8 text-textSecondary">
              No matching orders
            </p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <h1 className="text-xl sm:text-xl font-bold whitespace-nowrap text-textPrimary">
              TakeAway Orders
            </h1>


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
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-surface text-textPrimary text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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

        <div className="w-full">
          <Tabs
            variant="pills"
            size="sm"
            isDarkMode={isDarkMode}
            onTabChange={(tabId) => setActiveFilter(tabId)}
            defaultActiveTab={activeFilter}
            items={[
              { id: 'all', name: 'All Orders', content: ordersContent },
              { id: 'preparing', name: 'Preparing', content: ordersContent },
              { id: 'ready', name: 'Ready', content: ordersContent },
              { id: 'served', name: 'Served', content: ordersContent },
              { id: 'cancelled', name: 'Cancelled', content: ordersContent },
            ]}
          />
        </div>

      </div>
    </div>
  );
};
