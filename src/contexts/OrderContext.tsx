import React, { createContext, useState, useCallback, useEffect } from 'react';
import { notify } from '../utils/toast';

export interface OrderReadyPayload {
  orderId: string;
  orderNumber: number;
  orderType: 'DineIn' | 'TakeAway' | 'Delivery';
  customerName: string;
  readyTime: number;
  tableNumber?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  deals?: Array<{ name: string; items: string[]; price: number }>;
  waiterName?: string;
  customerPhone?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  grandTotal?: number;
}

interface OrderContextType {
  orders: OrderReadyPayload[];
  addReadyOrder: (order: OrderReadyPayload) => void;
  removeOrder: (orderId: string) => void;
  isRealTimeMode: boolean;
  setIsRealTimeMode: (mode: boolean) => void;
}

export const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderReadyPayload[]>([]);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);

  const addReadyOrder = useCallback((order: OrderReadyPayload) => {
    setOrders(prev => {
      // Avoid duplicates
      if (prev.find(o => o.orderId === order.orderId)) {
        return prev;
      }
      return [order, ...prev];
    });

    // Play notification sound
    playNotificationSound();
    
    // Show toast notification
    notify.success(`🔔 New Order Ready: #${order.orderNumber}`);
  }, []);

  // Real-time listener (WebSocket/API)
  useEffect(() => {
    if (!isRealTimeMode) return;

    let ws: WebSocket | null = null;

    try {
      // Example: WebSocket connection for real-time updates
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${window.location.host}/api/ws`;
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ Real-time connection established');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ORDER_READY') {
            addReadyOrder(data.payload);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('🔌 Real-time connection closed');
      };
    } catch (error) {
      console.error('Real-time connection failed:', error);
    }

    // Return cleanup function
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [isRealTimeMode, addReadyOrder]);

  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addReadyOrder, removeOrder, isRealTimeMode, setIsRealTimeMode }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = React.useContext(OrderContext);
  if (!context) throw new Error('OrderContext must be used within OrderProvider');
  return context;
};

// Helper function to play notification sound
const playNotificationSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    // const audio = new Audio('/order_ready.mp3'); // Use local file for better performance
    audio.volume = 0.7;
    audio.play().catch(err => console.log('Audio play failed:', err));
  } catch (error) {
    console.error('Notification sound error:', error);
  }
};
