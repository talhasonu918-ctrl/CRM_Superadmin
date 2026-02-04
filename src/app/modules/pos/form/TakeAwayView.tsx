import React, { useState } from 'react';
import { TakeawayOrder } from '../types';
import { mockTakeawayOrders } from '../mockData';
import { Search, Calendar, Grid, List, Phone, User, ShoppingBag } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { OrderActionsDropdown } from '../../../../components/dropdown';
import { getThemeColors } from '../../../../theme/colors';

interface TakeAwayViewProps {
  isDarkMode?: boolean;
}

interface FilterFormData {
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const TakeAwayView: React.FC<TakeAwayViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'progress' | 'served'>('all');

  const { control, watch } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      dateFrom: '2026-01-30',
      dateTo: '2026-01-30',
    },
  });

  const filters = watch();

  const filteredOrders = mockTakeawayOrders.filter(order => {
    const matchesSearch = !filters.search || 
      order.orderNumber.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = activeFilter === 'all' || 
      (activeFilter === 'ready' && order.status === 'ready') ||
      (activeFilter === 'progress' && order.status === 'preparing') ||
      (activeFilter === 'served' && order.status === 'served');

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
    <div className={`p-4 rounded-lg border transition-all hover:shadow-lg min-h-[280px] flex flex-col ${theme.neutral.card} ${theme.border.secondary}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`font-bold text-base ${theme.text.primary}`}>
             {order.orderNumber.replace('1/30/2026-', '')}
          </h3>
        </div>
        <OrderActionsDropdown 
          isDarkMode={isDarkMode}
          onViewDetails={() => console.log('View details', order.id)}
          onMarkAsReady={() => console.log('Mark as ready', order.id)}
          onPrintReceipt={() => console.log('Print receipt', order.id)}
          onCancelOrder={() => console.log('Cancel order', order.id)}
        />
      </div>
      
      {/* Items List */}
      <div className="space-y-2 mb-3">
        <div className={`flex items-center gap-2 mb-2 ${theme.text.tertiary}`}>
          <ShoppingBag size={14} />
          <span className="text-sm font-medium">{order.items?.length || 0} items</span>
        </div>
        {order.items && order.items.length > 0 && (
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className={`text-xs ${theme.text.tertiary}`}>
                {item.quantity}x {item.product.name} - ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="space-y-2 mb-3 text-sm">
        {order.customerName && (
          <div className={`flex items-center gap-2 ${theme.text.tertiary}`}>
            <User size={14} />
            <span>{order.customerName}</span>
          </div>
        )}
        
        {order.customerPhone && (
          <div className={`flex items-center gap-2 ${theme.text.tertiary}`}>
            <Phone size={14} />
            <span>{order.customerPhone}</span>
          </div>
        )}
      </div>

      {/* Total Price */}
      <div className="text-orange-600 font-bold text-xl mb-2">
        ₹{calculateGrandTotal(order).toFixed(2)}
      </div>

      {/* Pickup Time */}
      <div className={`text-xs mt-auto ${theme.text.muted}`}>
        {order.pickupTime}
      </div>
    </div>
  );

  const OrderListItem: React.FC<{ order: TakeawayOrder }> = ({ order }) => (
    <div className={`p-4 rounded-lg border transition-all hover:shadow-md ${theme.neutral.card} ${theme.border.secondary}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="min-w-[120px]">
            <h3 className={`font-bold text-base ${theme.text.primary}`}>
              {order.orderNumber.replace('1/30/2026-', '')}
            </h3>
          </div>

          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-1 ${theme.text.tertiary}`}>
              <ShoppingBag size={16} />
              <span className="text-sm font-medium">{order.items?.length || 0} items</span>
            </div>
            {order.items && order.items.length > 0 && (
              <div className={`text-xs ${theme.text.tertiary}`}>
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.quantity}x {item.product.name} - ₹{(item.product.price * item.quantity).toFixed(2)}
                    {index < order.items!.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </div>

          {order.customerName && (
            <div className={`flex items-center gap-2 ${theme.text.tertiary}`}>
              <User size={16} />
              <span className="text-sm">{order.customerName}</span>
            </div>
          )}

          {order.customerPhone && (
            <div className={`flex items-center gap-2 ${theme.text.tertiary}`}>
              <Phone size={16} />
              <span className="text-sm">{order.customerPhone}</span>
            </div>
          )}

          <div className="text-orange-600 font-bold text-lg">
            ₹{calculateGrandTotal(order).toFixed(2)}
          </div>

          <div className={`text-sm ${theme.text.muted}`}>
            {order.pickupTime}
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
  );

  return (
    <div className={`h-[calc(100vh-12rem)] flex flex-col ${theme.neutral.background} ${isDarkMode ? '' : 'p-3'}`}>
      {/* Header */}
      <div className="flex items-center  gap-4 mb-6">
        <h1 className={`text-2xl font-bold whitespace-nowrap ${theme.text.primary}`}>
          TakeAway Orders
        </h1>

      
<div className="flex items-center w-full justify-end gap-4 ml-auto">
        {/* Search */}
        <div className="flex-1 max-w-sm">
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={16} />
              <input
                {...field}
                type="text"
                placeholder="Search"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
              />
            </div>
          )}
        />

        </div>
          {/* View Toggle */}
        <div className={`flex gap-1 p-1 border rounded-lg ${theme.neutral.card}`}>
         
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'list'
                ? `${theme.primary.main} text-white shadow-sm`
                : `${theme.text.muted} ${isDarkMode ? 'hover:text-white' : 'hover:bg-gray-200'}`
            }`}
          >
            <List size={16} />
          </button>
           <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'grid'
                ? `${theme.primary.main} text-white shadow-sm`
                : `${theme.text.muted} ${isDarkMode ? 'hover:text-white' : 'hover:bg-gray-200'}`
            }`}
          >
            <Grid size={16} />
          </button>
        </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">

        {/* Date Range and Status Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label className={`text-xs font-medium ${theme.text.tertiary}`}>
                  From
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} pointer-events-none`} size={16} />
                  <input
                    {...field}
                    type="date"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
                  />
                </div>
              </div>
            )}
          />

          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label className={`text-xs font-medium ${theme.text.tertiary}`}>
                  To
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} pointer-events-none`} size={16} />
                  <input
                    {...field}
                    type="date"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
                  />
                </div>
              </div>
            )}
          />

          {/* Status Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setActiveFilter('progress')}
              className={`h-[42px] px-4 py-2 rounded-lg transition-colors font-medium ${
                activeFilter === 'progress' ? 'bg-purple-600 text-white' : isDarkMode ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              InProgress
            </button>
            <button 
              onClick={() => setActiveFilter('served')}
              className={`h-[42px] px-4 py-2 rounded-lg transition-colors font-medium ${
                activeFilter === 'served' ? `${theme.primary.main} text-white` : isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              Served
            </button>
            <button 
              onClick={() => setActiveFilter('all')}
              className={`h-[42px] px-4 py-2 rounded-lg transition-colors font-medium ${
                activeFilter === 'all' 
                  ? `${theme.primary.main} text-white` 
                  : `${theme.neutral.card} ${theme.text.secondary} ${theme.neutral.hover}`
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {activeFilter === 'all' && (
          <>
            {/* Ready For Pickup */}
            {readyOrders.length > 0 && (
              <div className="mb-6 ">
                <h2 className={`text-lg font-bold mb-3 ${theme.text.primary}`}>
                  Ready For Pickup
                </h2>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2">
                    {readyOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
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
                <h2 className={`text-lg font-bold mb-3 ${theme.text.primary}`}>
                  In Progress
                </h2>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2">
                    {progressOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
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
                <h2 className={`text-lg font-bold mb-3 ${theme.text.primary}`}>
                  Served
                </h2>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2">
                    {servedOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {servedOrders.map(order => (
                      <OrderListItem key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {filteredOrders.length === 0 && (
              <p className={`text-sm text-center py-8 ${theme.text.muted}`}>
                No matching orders
              </p>
            )}
          </>
        )}

        {activeFilter !== 'all' && (
          <>
            {filteredOrders.length > 0 ? (
              <div className="mb-6">
                <h2 className={`text-lg font-bold mb-3 ${theme.text.primary}`}>
                  {activeFilter === 'ready' && 'Ready For Pickup'}
                  {activeFilter === 'progress' && 'In Progress'}
                  {activeFilter === 'served' && 'Served'}
                </h2>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2">
                    {filteredOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(order => (
                      <OrderListItem key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className={`text-sm text-center py-8 ${theme.text.muted}`}>
                No matching orders
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
