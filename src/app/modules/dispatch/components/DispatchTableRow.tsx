import React from 'react';
import { Check, CheckSquare, Square, ShoppingBag, Clock, Phone, User, Printer, ChevronUp, ChevronDown } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';
import { DispatchOrder } from '../../pos/mockData';
import { Rider } from '../../pos/types';
import { useAgingColor } from '../hooks/useAgingColor';
import { RiderSelect } from './RiderSelect';

export interface DispatchTableRowProps {
  order: DispatchOrder;
  isDarkMode: boolean;
  onDispatch: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onRiderAssign: (orderId: string, rider: Rider) => void;
  onPrint: (order: DispatchOrder) => void;
}

export const DispatchTableRow: React.FC<DispatchTableRowProps> = ({ 
  order, 
  isDarkMode, 
  onDispatch, 
  onSelect, 
  isSelected, 
  isExpanded, 
  onExpand, 
  onRiderAssign,
  onPrint
}) => {
  const theme = getThemeColors(isDarkMode);
  const agingClassName = useAgingColor(order.readyTime);

  const formatReadyTime = (ms: number) => {
    const mins = Math.floor((Date.now() - ms) / 60000);
    return mins === 0 ? 'Just now' : `${mins}m ago`;
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
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
    <>
      <tr className={`${isDarkMode ? 'hover:bg-gray-800/20' : 'hover:bg-gray-50'} transition-colors ${isSelected ? (isDarkMode ? 'bg-primary/10' : 'bg-primary/5') : ''}`}>
        <td className="px-4 py-4 text-center">
          <button onClick={() => onSelect(order.id)} className="text-primary">
            {isSelected ? (
              <CheckSquare size={20} fill="currentColor" className="text-white bg-primary rounded" />
            ) : (
              <Square size={20} className="opacity-30" />
            )}
          </button>
        </td>

        <td className="px-4 py-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-bold ${theme.text.primary}`}>{order.orderNumber}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadgeColor(order.orderType)}`}>
                {order.orderType}
              </span>
            </div>
            {order.tokenNumber ? (
              <div className={`text-xs font-black text-primary`}>Token: {order.tokenNumber}</div>
            ) : order.orderType === 'DineIn' ? (
              <div className={`text-xs font-medium ${theme.text.tertiary}`}>Table: {order.tableNumber}</div>
            ) : null}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <User size={14} className={theme.text.tertiary} />
              <span className={`text-sm font-medium ${theme.text.secondary}`}>
                {order.customerName || order.waiterName}
              </span>
            </div>
            {order.customerPhone && (
              <div className="flex items-center gap-2 mt-1">
                <Phone size={12} className="text-green-500" />
                <span className={`text-[10px] ${theme.text.tertiary}`}>{order.customerPhone}</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-4 py-4">
          <div 
            className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={onExpand}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag size={14} className="text-green-500" />
              <span className={`text-xs font-bold ${theme.text.primary}`}>
                {order.items.length} Items {order.deals && order.deals.length > 0 && `+ ${order.deals.length} Deal(s)`}
              </span>
              {isExpanded ? (
                <ChevronUp size={12} className={theme.text.tertiary} />
              ) : (
                <ChevronDown size={12} className={theme.text.tertiary} />
              )}
            </div>
          </div>
        </td>

        <td className="px-4 py-4">
          <div className={`flex items-center gap-1.5 text-xs ${agingClassName}`}>
            <Clock size={14} />
            {formatReadyTime(order.readyTime)}
          </div>
        </td>

        <td className="px-4 py-4">
          {order.orderType === 'Delivery' ? (
            <div className="relative z-[50]">
              <RiderSelect
                currentRiderId={order.riderId}
                isDarkMode={isDarkMode}
                onAssign={(rider) => onRiderAssign(order.id, rider)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Ready
            </div>
          )}
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDispatch(order.id)}
              disabled={order.orderType === 'Delivery' && !order.riderId}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 ${theme.button.primary}`}
            >
              Dispatch
            </button>
            <button 
              className={`p-2 rounded-lg ${theme.text.tertiary} hover:opacity-70 transition-opacity`}
              onClick={(e) => { e.stopPropagation(); onPrint(order); }}
            >
              <Printer size={16} />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={7} className={`px-8 py-4 ${isDarkMode ? 'bg-gray-800/10' : 'bg-gray-50/50'}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
              {order.items.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg border ${theme.border.secondary}`}>
                  <span className="text-xs font-medium">{item.quantity}x {item.name}</span>
                  <Check size={14} className="text-green-500" />
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
