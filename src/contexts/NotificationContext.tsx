import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { mockNotifications } from '../app/modules/pos/mockData';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: string;
  orderDetails?: {
    orderId: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    orderDate: string;
    orderTime: string;
    totalAmount: number;
    items: Array<{ name: string; quantity: number; price: number; status?: string }>;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications as Notification[]);

  const addNotification = useCallback((newNotif: Omit<Notification, 'id' | 'time' | 'unread'>) => {
    const notification: Notification = {
      ...newNotif,
      id: Date.now(),
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
