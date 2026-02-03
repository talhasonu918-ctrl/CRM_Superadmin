
export enum AuthMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}

export type ViewType = 
  | 'dashboard' 
  | 'pos'
  | 'order-history'
  | 'online-orders'
  | 'inventory'
  | 'recipe'
  | 'expenses'
  | 'reports'
  | 'kitchen-display'
  | 'dispatch'
  | 'rider-management'
  | 'crm'
  | 'preferences'
  | 'menu' 
  | 'settings'
  | 'orders' 
  | 'customers' 
  | 'payments' 
  | 'delivery' 
  | 'staff' 
  | 'reviews';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERY' | 'DELIVERED' | 'CANCELLED';

export type Order = {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  customer: string;
  status: OrderStatus;
  payment: 'PAID' | 'UNPAID' | 'REFUNDED';
  method: 'COD' | 'ONLINE';
  time: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: 'Pizza' | 'Burger' | 'Drinks' | 'Dessert' | 'Sides';
  price: number;
  description: string;
  image: string;
  available: boolean;
  stock: number;
  // Added rating property to support menu catalog UI
  rating: number;
};

// Added missing InventoryItem type
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW' | 'OUT_OF_STOCK';
};

export type StaffRole = 'ADMIN' | 'MANAGER' | 'CHEF' | 'DELIVERY';

export type Tenant = {
  id: string;
  name: string;
  type: 'RESTAURANT' | 'GHOST_KITCHEN' | 'FRANCHISE';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  created_at: string;
  revenue: number;
  location: string;
};
