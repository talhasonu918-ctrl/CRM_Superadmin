import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users,
  CreditCard, Truck, Package, Star, BarChart3, Settings,
  History, MonitorPlay, Receipt, DollarSign, Bike, Grid3x3
} from 'lucide-react';
import { ROUTES, BASE_ROUTES } from './constants';

export interface NavigationItem {
  name: string;
  baseHref: string;
  getHref: (company: string) => string;
  icon: any;
  description?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    baseHref: BASE_ROUTES.DASHBOARD,
    getHref: (company: string) => ROUTES.DASHBOARD(company),
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'POS',
    baseHref: BASE_ROUTES.POS,
    getHref: (company: string) => ROUTES.POS(company),
    icon: ShoppingBag,
    description: 'Point of Sale system'
  },
  {
    name: 'Order History',
    baseHref: BASE_ROUTES.ORDER_HISTORY,
    getHref: (company: string) => ROUTES.ORDER_HISTORY(company),
    icon: History,
    description: 'Past orders and history'
  },
  {
    name: 'Online Orders',
    baseHref: BASE_ROUTES.ONLINE_ORDERS,
    getHref: (company: string) => ROUTES.ONLINE_ORDERS(company),
    icon: Truck,
    description: 'Online order management'
  },
  {
    name: 'Inventory',
    baseHref: BASE_ROUTES.INVENTORY,
    getHref: (company: string) => ROUTES.INVENTORY(company),
    icon: Package,
    description: 'Stock and inventory control'
  },
  {
    name: 'Recipe',
    baseHref: BASE_ROUTES.RECIPE,
    getHref: (company: string) => ROUTES.RECIPE(company),
    icon: Receipt,
    description: 'Recipe management'
  },
  {
    name: 'Expenses',
    baseHref: BASE_ROUTES.EXPENSES,
    getHref: (company: string) => ROUTES.EXPENSES(company),
    icon: DollarSign,
    description: 'Expense tracking'
  },
  {
    name: 'Reports',
    baseHref: BASE_ROUTES.REPORTS,
    getHref: (company: string) => ROUTES.REPORTS(company),
    icon: BarChart3,
    description: 'Analytics and reporting'
  },
  {
    name: 'Kitchen Display',
    baseHref: BASE_ROUTES.KITCHEN_DISPLAY,
    getHref: (company: string) => ROUTES.KITCHEN_DISPLAY(company),
    icon: MonitorPlay,
    description: 'Kitchen display system'
  },
  {
    name: 'Dispatch',
    baseHref: BASE_ROUTES.DISPATCH,
    getHref: (company: string) => ROUTES.DISPATCH(company),
    icon: Truck,
    description: 'Dispatch management'
  },
  {
    name: 'Rider Management',
    baseHref: BASE_ROUTES.RIDER_MANAGEMENT,
    getHref: (company: string) => ROUTES.RIDER_MANAGEMENT(company),
    icon: Bike,
    description: 'Delivery rider management'
  },
  {
    name: 'CRM',
    baseHref: BASE_ROUTES.CRM,
    getHref: (company: string) => ROUTES.CRM(company),
    icon: Users,
    description: 'Customer relationship management'
  },
  {
    name: 'Preferences',
    baseHref: BASE_ROUTES.PREFERENCES,
    getHref: (company: string) => ROUTES.PREFERENCES(company),
    icon: Grid3x3,
    description: 'User preferences'
  },
  {
    name: 'Menu',
    // baseHref: BASE_ROUTES.PRODUCT_CATEGORIES,
    baseHref: BASE_ROUTES.MENU,
    getHref: (company: string) => ROUTES.MENU(company),
    icon: UtensilsCrossed,
    description: 'Menu management and items'
  },
  {
    name: 'Settings',
    baseHref: BASE_ROUTES.SETTINGS,
    getHref: (company: string) => ROUTES.SETTINGS(company),
    icon: Settings,
    description: 'System configuration'
  },
];

export const authNavigation: NavigationItem[] = [
  {
    name: 'Login/Register',
    baseHref: '/auth',
    getHref: () => ROUTES.AUTH,
    icon: Users,
    description: 'Authentication'
  },
];