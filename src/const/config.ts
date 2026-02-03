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
    title: 'Dashboard - Nexus CRM',
    description: 'CRM Dashboard Overview',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard - Nexus CRM',
    description: 'CRM Dashboard and Analytics',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  [ROUTES.POS]: {
    path: ROUTES.POS,
    title: 'POS - Nexus CRM',
    description: 'Point of Sale System',
    requiresAuth: false,
    component: 'POS',
    layout: 'default'
  },
  [ROUTES.ORDER_HISTORY]: {
    path: ROUTES.ORDER_HISTORY,
    title: 'Order History - Nexus CRM',
    description: 'Past Orders and History',
    requiresAuth: false,
    component: 'OrderHistory',
    layout: 'default'
  },
  [ROUTES.ONLINE_ORDERS]: {
    path: ROUTES.ONLINE_ORDERS,
    title: 'Online Orders - Nexus CRM',
    description: 'Online Order Management',
    requiresAuth: false,
    component: 'OnlineOrders',
    layout: 'default'
  },
  [ROUTES.RECIPE]: {
    path: ROUTES.RECIPE,
    title: 'Recipe - Nexus CRM',
    description: 'Recipe Management',
    requiresAuth: false,
    component: 'Recipe',
    layout: 'default'
  },
  [ROUTES.EXPENSES]: {
    path: ROUTES.EXPENSES,
    title: 'Expenses - Nexus CRM',
    description: 'Expense Tracking',
    requiresAuth: false,
    component: 'Expenses',
    layout: 'default'
  },
  [ROUTES.KITCHEN_DISPLAY]: {
    path: ROUTES.KITCHEN_DISPLAY,
    title: 'Kitchen Display - Nexus CRM',
    description: 'Kitchen Display System',
    requiresAuth: false,
    component: 'KitchenDisplay',
    layout: 'default'
  },
  [ROUTES.DISPATCH]: {
    path: ROUTES.DISPATCH,
    title: 'Dispatch - Nexus CRM',
    description: 'Dispatch Management',
    requiresAuth: false,
    component: 'Dispatch',
    layout: 'default'
  },
  [ROUTES.RIDER_MANAGEMENT]: {
    path: ROUTES.RIDER_MANAGEMENT,
    title: 'Rider Management - Nexus CRM',
    description: 'Delivery Rider Management',
    requiresAuth: false,
    component: 'RiderManagement',
    layout: 'default'
  },
  [ROUTES.CRM]: {
    path: ROUTES.CRM,
    title: 'CRM - Nexus CRM',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [ROUTES.PREFERENCES]: {
    path: ROUTES.PREFERENCES,
    title: 'Preferences - Nexus CRM',
    description: 'User Preferences',
    requiresAuth: false,
    component: 'Preferences',
    layout: 'default'
  },
  [ROUTES.ORDERS]: {
    path: ROUTES.ORDERS,
    title: 'Orders - Nexus CRM',
    description: 'Order Management System',
    requiresAuth: false,
    component: 'Orders',
    layout: 'default'
  },
  [ROUTES.MENU]: {
    path: ROUTES.MENU,
    title: 'Menu Management - Nexus CRM',
    description: 'Menu Items and Categories',
    requiresAuth: false,
    component: 'MenuManagement',
    layout: 'default'
  },
  [ROUTES.CUSTOMERS]: {
    path: ROUTES.CUSTOMERS,
    title: 'Customers - Nexus CRM',
    description: 'Customer Relationship Management',
    requiresAuth: false,
    component: 'CustomerCRM',
    layout: 'default'
  },
  [ROUTES.PAYMENTS]: {
    path: ROUTES.PAYMENTS,
    title: 'Payments - Nexus CRM',
    description: 'Payment Processing and History',
    requiresAuth: false,
    component: 'Payments',
    layout: 'default'
  },
  [ROUTES.DELIVERY]: {
    path: ROUTES.DELIVERY,
    title: 'Delivery - Nexus CRM',
    description: 'Delivery Management System',
    requiresAuth: false,
    component: 'Delivery',
    layout: 'default'
  },
  [ROUTES.INVENTORY]: {
    path: ROUTES.INVENTORY,
    title: 'Inventory - Nexus CRM',
    description: 'Inventory and Stock Management',
    requiresAuth: false,
    component: 'InventoryManagement',
    layout: 'default'
  },
  [ROUTES.STAFF]: {
    path: ROUTES.STAFF,
    title: 'Staff Management - Nexus CRM',
    description: 'Staff and Employee Management',
    requiresAuth: false,
    component: 'StaffManagement',
    layout: 'default'
  },
  [ROUTES.REVIEWS]: {
    path: ROUTES.REVIEWS,
    title: 'Reviews - Nexus CRM',
    description: 'Customer Reviews and Ratings',
    requiresAuth: false,
    component: 'Reviews',
    layout: 'default'
  },
  [ROUTES.REPORTS]: {
    path: ROUTES.REPORTS,
    title: 'Reports - Nexus CRM',
    description: 'Analytics and Business Reports',
    requiresAuth: false,
    component: 'Reports',
    layout: 'default'
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings - Nexus CRM',
    description: 'System Configuration and Settings',
    requiresAuth: false,
    component: 'Settings',
    layout: 'default'
  },
  [ROUTES.AUTH]: {
    path: ROUTES.AUTH,
    title: 'Authentication - Nexus CRM',
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