// POS Module Type Definitions

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMode: 'cash' | 'card' | 'online';
  cashBack: number;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  createdAt: string;
  // Dine-in specific fields
  waiterName?: string;
  // Delivery/Online specific fields
  riderName?: string;
  riderPhone?: string;
  deliveryAddress?: string;
}

export interface Table {
  id: string;
  number: string;
  floor: 'ground' | 'first';
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'booked';
  currentOrderId?: string;
  position?: { x: number; y: number };
}

export type OrderStatus = 'ready' | 'progress' | 'served';

export interface TakeawayOrder extends Order {
  pickupTime?: string;
  customerPhone?: string;
}

export interface ActiveTask {
  orderNumber: string;
  itemsCount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'received';
  items?: CartItem[];
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  cnic?: string;
  avatar?: string;
  vehicleType: 'bike' | 'cycle' | 'others';
  vehicleNumber?: string;
  cityArea: string;
  joiningDate: string;
  status: 'available' | 'busy' | 'offline' | 'on-break';
  accountStatus: 'active' | 'inactive' | 'blocked';
  currentOrders: number;
  activeTask?: ActiveTask;
  rating: number;
  performance: {
    avgDeliveryTime: string;
    completedOrders: number;
    completedToday: number;
    cancelledOrders: number;
    complaints: number;
  };
  earnings: {
    total: number;
    perOrderRate: number;
    tips: number;
    bonus: number;
    penalty: number;
    cashCollected: number;
    netPayable: number;
  };
  attendance: {
    shiftStart: string;
    shiftEnd: string;
    totalHours: number;
    lateCheckIn: boolean;
    isPresent: boolean;
  };
}
