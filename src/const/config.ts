import { ROUTES } from './constants';

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
    title: 'Dashboard - Invex Food',
    description: 'CRM Dashboard Overview',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard - Invex Food',
    description: 'CRM Dashboard and Analytics',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [ROUTES.POS]: {
    path: ROUTES.POS,
    title: 'POS - Invex Food',
    description: 'Point of Sale System',
    requiresAuth: false,
    component: 'POS',
    layout: 'default'
  },
  [ROUTES.ORDER_HISTORY]: {
    path: ROUTES.ORDER_HISTORY,
    title: 'Order History - Invex Food',
    description: 'Past Orders and History',
    requiresAuth: false,
    component: 'OrderHistory',
    layout: 'default'
  },
  [ROUTES.ONLINE_ORDERS]: {
    path: ROUTES.ONLINE_ORDERS,
    title: 'Online Orders - Invex Food',
    description: 'Online Order Management',
    requiresAuth: false,
    component: 'OnlineOrders',
    layout: 'default'
  },
  [ROUTES.RECIPE]: {
    path: ROUTES.RECIPE,
    title: 'Recipe - Invex Food',
    description: 'Recipe Management',
    requiresAuth: false,
    component: 'Recipe',
    layout: 'default'
  },
  [ROUTES.EXPENSES]: {
    path: ROUTES.EXPENSES,
    title: 'Expenses - Invex Food',
    description: 'Expense Tracking',
    requiresAuth: false,
    component: 'Expenses',
    layout: 'default'
  },
  [ROUTES.KITCHEN_DISPLAY]: {
    path: ROUTES.KITCHEN_DISPLAY,
    title: 'Kitchen Display - Invex Food',
    description: 'Kitchen Display System',
    requiresAuth: false,
    component: 'KitchenDisplay',
    layout: 'default'
  },
  [ROUTES.DISPATCH]: {
    path: ROUTES.DISPATCH,
    title: 'Dispatch - Invex Food',
    description: 'Dispatch Management',
    requiresAuth: false,
    component: 'Dispatch',
    layout: 'default'
  },
  [ROUTES.RIDER_MANAGEMENT]: {
    path: ROUTES.RIDER_MANAGEMENT,
    title: 'Rider Management - Invex Food',
    description: 'Delivery Rider Management',
    requiresAuth: false,
    component: 'RiderManagement',
    layout: 'default'
  },
  [ROUTES.CRM]: {
    path: ROUTES.CRM,
    title: 'CRM - Invex Food',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [ROUTES.PREFERENCES]: {
    path: ROUTES.PREFERENCES,
    title: 'Preferences - Invex Food',
    description: 'User Preferences',
    requiresAuth: false,
    component: 'Preferences',
    layout: 'default'
  },
  [ROUTES.ORDERS]: {
    path: ROUTES.ORDERS,
    title: 'Orders - Invex Food',
    description: 'Order Management System',
    requiresAuth: false,
    component: 'Orders',
    layout: 'default'
  },
  [ROUTES.MENU]: {
    path: ROUTES.MENU,
    title: 'Menu Management - Invex Food',
    description: 'Menu Items and Categories',
    requiresAuth: false,
    component: 'MenuManagement',
    layout: 'default'
  },
  [ROUTES.CUSTOMERS]: {
    path: ROUTES.CUSTOMERS,
    title: 'Customers - Invex Food',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [ROUTES.PAYMENTS]: {
    path: ROUTES.PAYMENTS,
    title: 'Payments - Invex Food',
    description: 'Payment Processing and History',
    requiresAuth: false,
    component: 'Payments',
    layout: 'default'
  },
  [ROUTES.DELIVERY]: {
    path: ROUTES.DELIVERY,
    title: 'Delivery - Invex Food',
    description: 'Delivery Management System',
    requiresAuth: false,
    component: 'Delivery',
    layout: 'default'
  },
  [ROUTES.INVENTORY]: {
    path: ROUTES.INVENTORY,
    title: 'Inventory - Invex Food',
    description: 'Inventory and Stock Management',
    requiresAuth: false,
    component: 'InventoryManagement',
    layout: 'default'
  },
  [ROUTES.STAFF]: {
    path: ROUTES.STAFF,
    title: 'Staff Management - Invex Food',
    description: 'Staff and Employee Management',
    requiresAuth: false,
    component: 'StaffManagement',
    layout: 'default'
  },
  [ROUTES.REVIEWS]: {
    path: ROUTES.REVIEWS,
    title: 'Reviews - Invex Food',
    description: 'Customer Reviews and Ratings',
    requiresAuth: false,
    component: 'Reviews',
    layout: 'default'
  },
  [ROUTES.REPORTS]: {
    path: ROUTES.REPORTS,
    title: 'Reports - Invex Food',
    description: 'Analytics and Business Reports',
    requiresAuth: false,
    component: 'Reports',
    layout: 'default'
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings - Invex Food',
    description: 'System Configuration and Settings',
    requiresAuth: false,
    component: 'Settings',
    layout: 'default'
  },
  [ROUTES.AUTH]: {
    path: ROUTES.AUTH,
    title: 'Authentication - Invex Food',
    description: 'Login and Registration',
    requiresAuth: false,
    component: 'Auth',
    layout: 'none'
  },
};

export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return routeConfigs[path];
};

export const getAllRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs);
};

export const getRoutesByLayout = (layout: 'default' | 'auth' | 'none'): RouteConfig[] => {
  return Object.values(routeConfigs).filter(route => route.layout === layout);
};