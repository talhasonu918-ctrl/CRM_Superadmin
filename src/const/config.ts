import { ROUTES, BASE_ROUTES } from './constants';

export interface RouteConfig {
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  component: string;
  layout: 'default' | 'auth' | 'none';
}

export const routeConfigs: Record<string, RouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Dashboard',
    description: 'CRM Dashboard Overview',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [BASE_ROUTES.DASHBOARD]: {
    path: BASE_ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'CRM Dashboard and Analytics',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [BASE_ROUTES.POS]: {
    path: BASE_ROUTES.POS,
    title: 'POS',
    description: 'Point of Sale System',
    requiresAuth: false,
    component: 'POS',
    layout: 'default'
  },
  [BASE_ROUTES.ORDER_HISTORY]: {
    path: BASE_ROUTES.ORDER_HISTORY,
    title: 'Order History',
    description: 'Past Orders and History',
    requiresAuth: false,
    component: 'OrderHistory',
    layout: 'default'
  },
  [BASE_ROUTES.ONLINE_ORDERS]: {
    path: BASE_ROUTES.ONLINE_ORDERS,
    title: 'Online Orders',
    description: 'Online Order Management',
    requiresAuth: false,
    component: 'OnlineOrders',
    layout: 'default'
  },
  [BASE_ROUTES.RECIPE]: {
    path: BASE_ROUTES.RECIPE,
    title: 'Recipe',
    description: 'Recipe Management',
    requiresAuth: false,
    component: 'Recipe',
    layout: 'default'
  },
  [BASE_ROUTES.EXPENSES]: {
    path: BASE_ROUTES.EXPENSES,
    title: 'Expenses',
    description: 'Expense Tracking',
    requiresAuth: false,
    component: 'Expenses',
    layout: 'default'
  },
  [BASE_ROUTES.KITCHEN_DISPLAY]: {
    path: BASE_ROUTES.KITCHEN_DISPLAY,
    title: 'Kitchen Display',
    description: 'Kitchen Display System',
    requiresAuth: false,
    component: 'KitchenDisplay',
    layout: 'default'
  },
  [BASE_ROUTES.DISPATCH]: {
    path: BASE_ROUTES.DISPATCH,
    title: 'Dispatch',
    description: 'Dispatch Management',
    requiresAuth: false,
    component: 'Dispatch',
    layout: 'default'
  },
  [BASE_ROUTES.RIDER_MANAGEMENT]: {
    path: BASE_ROUTES.RIDER_MANAGEMENT,
    title: 'Rider Management',
    description: 'Delivery Rider Management',
    requiresAuth: false,
    component: 'RiderManagement',
    layout: 'default'
  },
  [BASE_ROUTES.CRM]: {
    path: BASE_ROUTES.CRM,
    title: 'CRM',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [BASE_ROUTES.PREFERENCES]: {
    path: BASE_ROUTES.PREFERENCES,
    title: 'Preferences',
    description: 'User Preferences',
    requiresAuth: false,
    component: 'Preferences',
    layout: 'default'
  },
  [BASE_ROUTES.ORDERS]: {
    path: BASE_ROUTES.ORDERS,
    title: 'Orders',
    description: 'Order Management System',
    requiresAuth: false,
    component: 'Orders',
    layout: 'default'
  },
  [BASE_ROUTES.MENU]: {
    path: BASE_ROUTES.MENU,
    title: 'Menu Management',
    description: 'Menu Items and Categories',
    requiresAuth: false,
    component: 'MenuManagement',
    layout: 'default'
  },
  [BASE_ROUTES.PRODUCT_CATEGORIES]: {
    path: BASE_ROUTES.PRODUCT_CATEGORIES,
    title: 'Product Categories',
    description: 'Product Categories Management',
    requiresAuth: false,
    component: 'ProductCategories',
    layout: 'default'
  },
  [BASE_ROUTES.CUSTOMERS]: {
    path: BASE_ROUTES.CUSTOMERS,
    title: 'Customers',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [BASE_ROUTES.PAYMENTS]: {
    path: BASE_ROUTES.PAYMENTS,
    title: 'Payments',
    description: 'Payment Processing and History',
    requiresAuth: false,
    component: 'Payments',
    layout: 'default'
  },
  [BASE_ROUTES.DELIVERY]: {
    path: BASE_ROUTES.DELIVERY,
    title: 'Delivery',
    description: 'Delivery Management System',
    requiresAuth: false,
    component: 'Delivery',
    layout: 'default'
  },
  [BASE_ROUTES.INVENTORY]: {
    path: BASE_ROUTES.INVENTORY,
    title: 'Inventory',
    description: 'Inventory and Stock Management',
    requiresAuth: false,
    component: 'InventoryManagement',
    layout: 'default'
  },
  [BASE_ROUTES.STAFF]: {
    path: BASE_ROUTES.STAFF,
    title: 'Staff Management',
    description: 'Staff and Employee Management',
    requiresAuth: false,
    component: 'StaffManagement',
    layout: 'default'
  },
  [BASE_ROUTES.REVIEWS]: {
    path: BASE_ROUTES.REVIEWS,
    title: 'Reviews',
    description: 'Customer Reviews and Ratings',
    requiresAuth: false,
    component: 'Reviews',
    layout: 'default'
  },
  [BASE_ROUTES.REPORTS]: {
    path: BASE_ROUTES.REPORTS,
    title: 'Reports',
    description: 'Analytics and Business Reports',
    requiresAuth: false,
    component: 'Reports',
    layout: 'default'
  },
  [BASE_ROUTES.SETTINGS]: {
    path: BASE_ROUTES.SETTINGS,
    title: 'Settings',
    description: 'System Configuration and Settings',
    requiresAuth: false,
    component: 'Settings',
    layout: 'default'
  },
  [ROUTES.AUTH]: {
    path: ROUTES.AUTH,
    title: 'Authentication',
    description: 'Login and Registration',
    requiresAuth: false,
    component: 'Auth',
    layout: 'none'
  },
};

export const getRouteConfig = (path: string): RouteConfig | undefined => {
  // Normalize path by removing company segment (e.g. /invextech/dashboard -> /dashboard)
  const normalizedPath = path.replace(/^\/[^/]+/, '');

  // If normalized path is empty but was something like /invextech, treat it as / (though not applicable here)
  return routeConfigs[normalizedPath] || routeConfigs[path];
};

export const getAllRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs);
};

export const getRoutesByLayout = (layout: 'default' | 'auth' | 'none'): RouteConfig[] => {
  return Object.values(routeConfigs).filter(route => route.layout === layout);
};