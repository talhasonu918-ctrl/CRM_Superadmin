// Route constants and definitions
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',

  // Company-based routes (functions)
  DASHBOARD: (company: string) => `/${company}/dashboard`,
  POS: (company: string) => `/${company}/pos`,
  ORDER_HISTORY: (company: string) => `/${company}/order-history`,
  ONLINE_ORDERS: (company: string) => `/${company}/online-orders`,
  INVENTORY: (company: string) => `/${company}/inventory`,
  RECIPE: (company: string) => `/${company}/recipe`,
  EXPENSES: (company: string) => `/${company}/expenses`,
  REPORTS: (company: string) => `/${company}/reports`,
  KITCHEN_DISPLAY: (company: string) => `/${company}/kitchen-display`,
  DISPATCH: (company: string) => `/${company}/dispatch`,
  RIDER_MANAGEMENT: (company: string) => `/${company}/rider-management`,
  CRM: (company: string) => `/${company}/crm`,
  PREFERENCES: (company: string) => `/${company}/preferences`,
  MENU: (company: string) => `/${company}/menu`,
  PRODUCT_CATEGORIES: (company: string) => `/${company}/product-categories`,
  SETTINGS: (company: string) => `/${company}/settings`,
  ORDERS: (company: string) => `/${company}/orders`,
  CUSTOMERS: (company: string) => `/${company}/customers`,
  PAYMENTS: (company: string) => `/${company}/payments`,
  DELIVERY: (company: string) => `/${company}/delivery`,
  STAFF: (company: string) => `/${company}/staff`,
  REVIEWS: (company: string) => `/${company}/reviews`,
} as const;

// Base routes for path matching (no company segment)
export const BASE_ROUTES = {
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
} as const;

export type RouteKey = keyof typeof ROUTES;
