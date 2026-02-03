
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users,
  CreditCard, Truck, Star, Package,
  UserCircle, BarChart3, Settings, Bell,
  Search, LogOut, Moon, Sun, Menu,
  History, MonitorPlay, Receipt, DollarSign, Bike, Grid3x3
} from 'lucide-react';
import { ViewType } from '../lib/types';
import { getThemeColors } from '../theme/colors';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentView, onViewChange, onLogout, isDarkMode, toggleTheme 
}) => {
  const theme = getThemeColors(isDarkMode);
  
  const menuItems: { id: ViewType; icon: any; label: string; badge?: number }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pos', icon: ShoppingBag, label: 'POS' },
    { id: 'order-history', icon: History, label: 'Order History' },
    { id: 'online-orders', icon: Truck, label: 'Online Orders' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'recipe', icon: Receipt, label: 'Recipe' },
    { id: 'expenses', icon: DollarSign, label: 'Expenses' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'kitchen-display', icon: MonitorPlay, label: 'Kitchen Display' },
    { id: 'dispatch', icon: Truck, label: 'Dispatch' },
    { id: 'rider-management', icon: Bike, label: 'Rider Management' },
    { id: 'crm', icon: Users, label: 'CRM' },
    { id: 'preferences', icon: Grid3x3, label: 'Preferences' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`flex min-h-screen ${theme.neutral.background} ${theme.text.primary} transition-colors duration-300 font-sans antialiased`}>
      {/* Sidebar */}
      <aside className={`w-64 bg-[#2C3E50] hidden lg:flex flex-col sticky top-0 h-screen z-40 transition-all shadow-sm`}>
        <div className={`h-20 flex items-center justify-center border-b ${theme.border.secondary}`}>
          <div className="flex items-center gap-1">
            <div className="w-8 h-0.5 bg-white"></div>
            <span className="font-bold text-xl text-white tracking-[0.3em]">VINC</span>
            <div className="w-8 h-0.5 bg-white"></div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-0.5 mt-4 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50 hover:scrollbar-thumb-slate-500">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={`${item.id}-${item.label}`}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : `${theme.text.tertiary} hover:text-white hover:bg-white/5`
                }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="font-normal text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg transition-all text-sm font-medium ${theme.button.primary}`}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 border-b ${theme.border.main} ${theme.neutral.backgroundSecondary} flex items-center justify-between px-10 sticky top-0 z-30 backdrop-blur-md`}>
          <div className="flex items-center gap-4">
            <button className={`lg:hidden p-2 ${theme.text.tertiary} ${theme.neutral.hover} transition-colors`}>
              <Menu size={20} />
            </button>
            <div className="relative w-72 hidden md:block">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.text.tertiary}`} />
              <input 
                type="text" 
                placeholder="Search orders, menu..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border-transparent transition-all outline-none ${theme.input.background} ${theme.input.backgroundFocus}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme.neutral.card} ${theme.neutral.hover}`}
              >
                {isDarkMode ? <Sun size={18} className={theme.primary.darkText} /> : <Moon size={18} className={theme.text.tertiary} />}
              </button>
              <button className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all ${theme.neutral.card} ${theme.neutral.hover}`}>
                <Bell size={18} className={theme.text.tertiary} />
                <span className={`absolute top-2.5 right-2.5 w-2 h-2 ${theme.primary.main} rounded-full ring-2 ${theme.neutral.background}`}></span>
              </button>
            </div>

            <div className={`h-6 w-[1px] ${theme.border.main} mx-2`}></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Orlando Laurentius</p>
                <p className={`text-[10px] ${theme.text.tertiary} font-bold uppercase tracking-wider mt-1`}>Super Admin</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Orlando+L&background=FF6B35&color=fff" 
                alt="Profile" 
                className={`w-9 h-9 rounded-xl object-cover ring-2 ${theme.border.secondary} group-hover:ring-orange-500/50 transition-all`}
              />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
