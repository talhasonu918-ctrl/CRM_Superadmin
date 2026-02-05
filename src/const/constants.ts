// Route constants and definitions
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  POS: '/pos',
  ORDER_HISTORY: '/order-history',
  ONLINE_ORDERS: '/online-orders',
  INVENTORY: '/inventory',
  RECIPE: '/recipe',
  EXPENSES: '/expenses',
  REPORTS: '/reports',
  KITCHEN_DISPLAY: '/kitchen-display',
  DISPATCH: '/dispatch',
  RIDER_MANAGEMENT: '/rider-management',
  CRM: '/crm',
  PREFERENCES: '/preferences',
  MENU: '/menu',
  PRODUCT_CATEGORIES: '/product-categories',
  SETTINGS: '/settings',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  PAYMENTS: '/payments',
  DELIVERY: '/delivery',
  STAFF: '/staff',
  REVIEWS: '/reviews',
  AUTH: '/auth',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];