import React, { useState } from 'react';
import { Clock, User, Phone, Printer, CheckCircle, ShoppingBag, CheckSquare, Square, Send } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';
import { DispatchOrder } from '../../pos/mockData';
import { Rider } from '../../pos/types';
import { useAgingColor } from '../hooks/useAgingColor';
import { RiderSelect } from './RiderSelect';

export interface DispatchOrderCardProps {
  order: DispatchOrder;
  isDarkMode: boolean;
  onDispatch: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onRiderAssign: (orderId: string, rider: Rider) => void;
  onPrint: (order: DispatchOrder) => void;
}

export const DispatchOrderCard: React.FC<DispatchOrderCardProps> = ({ 
  order, 
  isDarkMode, 
  onDispatch, 
  onSelect, 
  isSelected, 
  onRiderAssign,
  onPrint
}) => {
  const theme = getThemeColors(isDarkMode);
  const [isSelectingRider, setIsSelectingRider] = useState(false);
  const agingClassName = useAgingColor(order.readyTime);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatReadyTime = (ms: number) => {
    const mins = Math.floor((Date.now() - ms) / 60000);
    return mins === 0 ? 'Just now' : `${mins}m ago`;
  };

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
    <div className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col border-2 ${isSelected ? 'border-primary ring-4 ring-primary/10 shadow-xl' : `${theme.neutral.card} ${theme.border.main}`} ${theme.text.primary} shadow-md hover:shadow-xl ${isSelectingRider ? 'z-[50]' : 'z-10'}`}>
      {/* Selection Checkbox */}
      <button 
        onClick={() => onSelect(order.id)}
        className="absolute top-4 right-4 z-20 text-primary transition-transform active:scale-90"
      >
        {isSelected ? <CheckSquare size={20} fill="currentColor" className="text-white bg-primary rounded" /> : <Square size={20} className="opacity-30 group-hover:opacity-100" />}
      </button>

      {/* Aging Timer Indicator */}
      <div className="absolute top-12 right-4 z-20 flex flex-col items-end">
        <div className={`flex items-center gap-1 text-[10px] uppercase tracking-tighter ${agingClassName}`}>
          <Clock size={10} />
          {formatReadyTime(order.readyTime)}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-3 pr-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-base font-bold ${theme.text.primary}`}>{order.orderNumber}</span>
          {order.orderType === 'DineIn' && order.tableNumber !== '-' && (
            <>
              <span className="text-base font-black text-gray-400 dark:text-gray-600">|</span>
              <span className={`px-2 py-0.5 rounded-lg text-sm font-black ${isDarkMode ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                Table: {order.tableNumber}
              </span>
            </>
          )}
          {order.tokenNumber && (
            <>
              <span className="text-base font-black text-gray-400 dark:text-gray-600">|</span>
              <span className={`px-3 py-1 rounded-xl text-lg font-black animate-bounce shadow-sm ${isDarkMode ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                {order.tokenNumber}
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getBadgeColor()}`}>
            {order.orderType}
          </span>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={12} />
            <span className="text-[10px] font-bold">READY</span>
          </div>
        </div>
      </div>

      {/* Customer Info & Actions */}
      <div className={`relative z-10 mb-3 p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <User size={12} className={theme.text.tertiary} />
            <span className={`text-xs font-bold ${theme.text.primary}`}>{order.customerName || order.waiterName || 'Guest'}</span>
          </div>
          {order.customerPhone && (
            <div className="flex items-center gap-2">
              <Phone size={10} className={theme.text.tertiary} />
              <span className={`text-[10px] ${theme.text.tertiary}`}>{order.customerPhone}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {order.customerPhone && (
            <button 
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              title="Call Customer"
              onClick={(e) => { e.stopPropagation(); window.open(`tel:${order.customerPhone}`); }}
            >
              <Phone size={14} />
            </button>
          )}
          <button 
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} 
            title="Reprint"
            onClick={(e) => { e.stopPropagation(); onPrint(order); }}
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Rider Section (Only for Delivery) */}
      {order.orderType === 'Delivery' && (
        <div className="relative z-30 mb-3">
          <RiderSelect 
            currentRiderId={order.riderId} 
            isDarkMode={isDarkMode} 
            onAssign={(rider) => onRiderAssign(order.id, rider)} 
            onToggle={setIsSelectingRider}
          />
        </div>
      )}

      {/* Items List */}
      <div className="relative z-0 flex-1 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={12} className={theme.text.tertiary} />
          <span className={`text-xs font-bold ${theme.text.tertiary}`}>ITEMS ({totalItems})</span>
        </div>
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
          {order.items.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200/50'}`}>
              <span className="text-xs font-medium truncate flex-1 pr-2">
                {item.quantity}x {item.name}
              </span>
              <CheckCircle size={12} className="text-green-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Button */}
      <button
        onClick={() => onDispatch(order.id)}
        disabled={order.orderType === 'Delivery' && !order.riderId}
        className={`relative z-0 w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          order.orderType === 'Delivery' && !order.riderId 
            ? 'bg-gray-400 text-white' 
            : theme.button.primary
        }`}
      >
        <Send size={16} />
        {order.orderType === 'Delivery' && !order.riderId ? 'Assign Rider First' : 'Dispatch Now'}
      </button>
    </div>
  );
};
