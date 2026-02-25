import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Moon, Sun, LogOut, ChevronLeft, ChevronRight, Menu, X, Bell, MapPin, 
  ChevronDown, Search, MessageSquare, ShoppingCart, Maximize, Minimize, 
  Package, User, Phone, Home, Truck, UtensilsCrossed, AlertCircle, Star, CreditCard 
} from 'lucide-react';
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { CgMaximizeAlt } from "react-icons/cg";
import { navigationItems } from '../const';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useBranding } from '../contexts/BrandingContext';
import { useNotifications } from '../contexts/NotificationContext';
import { ReusableModal } from './ReusableModal';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleTheme } from '../redux/themeSlice';
import { logout } from '../redux/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const config = useAppSelector((state) => state.branding.config);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Load branch from localStorage on mount
  React.useEffect(() => {
    const savedBranch = localStorage.getItem('activeBranch');
    if (savedBranch) {
      setSelectedBranch(savedBranch);
    }
  }, []);

  // Mock data for branches
  const branches = [
    { id: 1, name: 'Main Branch', location: 'M.A Jinnah road Okara', phone: '+92 300 1234567' },
    { id: 2, name: 'Lahore Branch', location: 'Gulberg town Lahore', phone: '+92 321 7654321' },
    { id: 3, name: 'Multan Brnach', location: 'Kot Town Multan', phone: '+92 333 9876543' },
    { id: 4, name: 'Islamabad Branch', location: 'Sector 3 ISlamabad', phone: '+92 345 5432109' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName);
    localStorage.setItem('activeBranch', branchName);
    setIsBranchDropdownOpen(false);
  };

  const handleNotificationClick = (notif: any) => {
    if (notif.orderDetails) {
      setSelectedOrder({ ...notif.orderDetails, notifType: notif.type });
      setIsOrderModalOpen(true);
      markAsRead(notif.id);
      setIsNotificationOpen(false);
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden bg-background text-textPrimary`}>
      {/* Top Header - Integrated with sidebar */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center z-50">
        {/* Left Section - Orange background matching sidebar (Desktop) */}
        <div className={`hidden lg:flex items-center justify-between h-16 px-4 bg-primary transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          <h1 className="text-lg font-bold text-white max-w-[180px] truncate" title={config.name || 'Invex Food'}>{isCollapsed ? (config.name ? config.name.charAt(0) : 'I') : (config.name || 'Invex Food')}</h1>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:opacity-90 p-1 rounded"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Right Section - White background */}
        <div className={`flex-1 h-16 flex items-center  justify-between px-4 lg:px-6 bg-white dark:bg-surface border-b border-border shadow-sm`}>
          {/* Left Section - Logo/Menu and Search */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-textPrimary hover:opacity-90 p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo - Hidden on small screens and large screens (shown in orange section on lg) */}
            {/* <div className="hidden md:flex lg:hidden items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Sg</span>
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">Sego</span>
            </div> */}

            {/* Page Title - Mobile */}
            <h1 className="md:hidden text-lg font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{config.name || 'Invex Food'}</h1>

            {/* Search Bar - Desktop */}
            {/* <div className="hidden xl:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-80 pl-10 pr-4 py-2 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div> */}
          </div>
          {/* Right Section - Notifications, Messages, Cart, Branch Selector, Profile */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center  dark:bg-slate-800  transition-colors  text-slate-600 dark:text-slate-300"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <LuMinimize className="w-6 h-6 text-primary " /> : <LuMaximize className="w-6 h-6 text-primary" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsBranchDropdownOpen(false);
                }}
                className="relative w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-secondary/10 hover:bg-secondary/20 dark:hover:bg-secondary/20 transition-colors"
              >
                <Bell className="w-5 h-5 text-black dark:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <div className="fixed md:absolute right-4 md:right-0 inset-x-4 md:inset-auto mt-2 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border z-50 max-h-[80vh] md:max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-border sticky top-0 bg-white dark:bg-slate-800 z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{unreadCount} unread messages</p>
                            {unreadCount > 0 && (
                              <>
                                <span className="text-slate-300">•</span>
                                <button 
                                  onClick={markAllAsRead}
                                  className="text-[11px] font-bold text-primary hover:underline"
                                >
                                  Mark all as read
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-l-4 ${notif.unread ? 'bg-primary/5 dark:bg-primary/10 border-primary' : 'border-transparent'
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                              notif.type === 'order' ? 'bg-blue-100 text-blue-600' :
                              notif.type === 'kds' ? 'bg-orange-100 text-orange-600' :
                              notif.type === 'dispatch' ? 'bg-purple-100 text-purple-600' :
                              notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                              notif.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                              notif.type === 'payment' ? 'bg-green-100 text-green-600' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {notif.type === 'order' && <Package className="w-5 h-5" />}
                              {notif.type === 'kds' && <UtensilsCrossed className="w-5 h-5" />}
                              {notif.type === 'dispatch' && <Truck className="w-5 h-5" />}
                              {notif.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                              {notif.type === 'review' && <Star className="w-5 h-5" />}
                              {notif.type === 'payment' && <CreditCard className="w-5 h-5" />}
                              {!['order', 'kds', 'dispatch', 'alert', 'review', 'payment'].includes(notif.type) && <Bell className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{notif.title}</h4>
                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>

                              {/* Order Details Preview */}
                              {notif.orderDetails && (
                                <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/50 space-y-2">
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <User className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 font-semibold truncate">{notif.orderDetails.customerName}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{notif.orderDetails.phoneNumber}</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-[11px]">
                                    <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-500 leading-tight">{notif.orderDetails.address}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages - Hidden on small screens */}
            {/* <button className="hidden md:flex relative w-10 h-10 rounded-full items-center justify-center bg-secondary/10 dark:bg-secondary/10 hover:bg-secondary/20 dark:hover:bg-secondary/20 transition-colors">
              <MessageSquare className="w-5 h-5 text-secondary" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button> */}

            {/* Cart - Hidden on small screens */}
            {/* <button className="hidden md:flex relative w-10 h-10 rounded-full items-center justify-center bg-secondary/10 dark:bg-secondary/10 hover:bg-secondary/20 dark:hover:bg-secondary/20 transition-colors">
              <ShoppingCart className="w-5 h-5 text-secondary" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button> */}

            {/* Branch Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setIsBranchDropdownOpen(!isBranchDropdownOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-border"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline">{selectedBranch}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {/* Branch Dropdown Menu */}
              {isBranchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBranchDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border z-50">
                    <div className="p-3 border-b border-border">
                      <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Select Branch</h3>
                    </div>
                    <div className="py-2">
                      {branches.map((branch) => (
                        <button
                          key={branch.id}
                          onClick={() => handleBranchSelect(branch.name)}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedBranch === branch.name ? 'bg-primary/5 dark:bg-primary/10' : ''
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className={`w-4 h-4 ${selectedBranch === branch.name ? 'text-primary' : 'text-slate-400'}`} />
                            <div>
                              <p className={`text-sm font-medium ${selectedBranch === branch.name ? 'text-primary' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                {branch.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{branch.location}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            {/* <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">Brian Lee</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=Brian+Lee&background=1e293b&color=fff"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity mt-16"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-16 inset-y-0 left-0 shadow-lg transition-all duration-300 overflow-hidden z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} 
        w-64
        bg-surface border-r border-border`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header inside sidebar */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-primary border-b border-border">
            <h1 className="text-lg font-bold text-white">{config.name || 'Invex Food'}</h1>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'lg:px-2' : 'lg:px-4'} px-4 py-6 space-y-2 min-h-20 overflow-y-auto custom-scrollbar scrollbar-thin `}>
            {navigationItems.map((item) => {
              const company = router.query.company as string || 'default';
              const href = item.getHref(company);
              const isActive = router.asPath === href;
              return (
                <Link
                  key={item.name}
                  href={href}
                  onClick={() => {
                    closeMobileMenu();
                    // If clicking Kitchen Display while already on that page, dispatch reset event
                    if (isActive && href === '/kitchen-display') {
                      window.dispatchEvent(new Event('resetKitchenDisplay'));
                    }
                  }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? `bg-primary/10 text-primary ${isCollapsed ? 'lg:border-l-0' : 'lg:border-l-4'} border-l-4 border-primary`
                    : `text-textSecondary hover:bg-surface/10`
                    } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={item.description}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
                  <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle and Logout */}
          <div className={`${isCollapsed ? 'lg:p-2' : 'lg:p-4'} p-4 border-t border-border space-y-2`}>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-textSecondary hover:bg-surface/10 ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0 text-warning" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-textSecondary hover:bg-surface/10 ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
              title="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 pt-16 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Order Details Modal */}
      <ReusableModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Details"
        size="lg"
        isDarkMode={isDarkMode}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 mb-1">Order ID</p>
                <p className="text-xl font-black text-primary">{selectedOrder.orderId}</p>
              </div>
              <div className="sm:text-right bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 mb-1">Date & Time</p>
                <div className="flex flex-col sm:items-end">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedOrder.orderDate}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{selectedOrder.orderTime}</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Customer Information
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Name</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedOrder.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedOrder.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Delivery Address</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Order Items
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border overflow-hidden">
                <div className="divide-y divide-border/50">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">PKR {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 border-t-2 border-slate-300 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Total Amount</p>
                    <p className="text-lg font-black text-primary">PKR {selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="flex-1 order-2 sm:order-1 px-4 py-3 rounded-xl font-bold transition-all bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
              <button
                className="flex-1 order-1 sm:order-2 px-4 py-3 bg-primary hover:bg-orange-600 text-white rounded-xl font-black transition-all shadow-md active:scale-95"
              >
                View Full Order
              </button>
            </div>
          </div>
        )}
      </ReusableModal>
    </div>
  );
}