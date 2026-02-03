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
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  createdAt: string;
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
