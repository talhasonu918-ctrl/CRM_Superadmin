import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users,
  CreditCard, Truck, Package, Star, BarChart3, Settings,
  History, MonitorPlay, Receipt, DollarSign, Bike, Grid3x3
} from 'lucide-react';
import { ROUTES } from './constants';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'POS',
    href: ROUTES.POS,
    icon: ShoppingBag,
    description: 'Point of Sale system'
  },
  {
    name: 'Order History',
    href: ROUTES.ORDER_HISTORY,
    icon: History,
    description: 'Past orders and history'
  },
  {
    name: 'Online Orders',
    href: ROUTES.ONLINE_ORDERS,
    icon: Truck,
    description: 'Online order management'
  },
  {
    name: 'Inventory',
    href: ROUTES.INVENTORY,
    icon: Package,
    description: 'Stock and inventory control'
  },
  {
    name: 'Recipe',
    href: ROUTES.RECIPE,
    icon: Receipt,
    description: 'Recipe management'
  },
  {
    name: 'Expenses',
    href: ROUTES.EXPENSES,
    icon: DollarSign,
    description: 'Expense tracking'
  },
  {
    name: 'Reports',
    href: ROUTES.REPORTS,
    icon: BarChart3,
    description: 'Analytics and reporting'
  },
  {
    name: 'Kitchen Display',
    href: ROUTES.KITCHEN_DISPLAY,
    icon: MonitorPlay,
    description: 'Kitchen display system'
  },
  {
    name: 'Dispatch',
    href: ROUTES.DISPATCH,
    icon: Truck,
    description: 'Dispatch management'
  },
  {
    name: 'Rider Management',
    href: ROUTES.RIDER_MANAGEMENT,
    icon: Bike,
    description: 'Delivery rider management'
  },
  {
    name: 'CRM',
    href: ROUTES.CRM,
    icon: Users,
    description: 'Customer relationship management'
  },
  {
    name: 'Preferences',
    href: ROUTES.PREFERENCES,
    icon: Grid3x3,
    description: 'User preferences'
  },
  {
    name: 'Menu',
    href: ROUTES.PRODUCT_CATEGORIES,
    icon: UtensilsCrossed,
    description: 'Menu management and items'
  },
  {
    name: 'Settings',
    href: ROUTES.SETTINGS,
    icon: Settings,
    description: 'System configuration'
  },
];

export const authNavigation: NavigationItem[] = [
  {
    name: 'Login/Register',
    href: ROUTES.AUTH,
    icon: Users,
    description: 'Authentication'
  },
];