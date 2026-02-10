import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun, LogOut, ChevronLeft, ChevronRight, Menu, X, Bell, MapPin, ChevronDown, Search, MessageSquare, ShoppingCart, Maximize, Minimize } from 'lucide-react';
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { CgMaximizeAlt } from "react-icons/cg";
import { navigationItems } from '../const';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');

  // Mock data for branches
  const branches = [
    { id: 1, name: 'Main Branch', location: 'M.A Jinnah road Okara' },
    { id: 2, name: 'Lahore Branch', location: 'Gulberg town Lahore ' },
    { id: 3, name: 'Multan Brnach', location: 'Kot Town Multan' },
    { id: 4, name: 'Islamabad Branch', location: 'Sector 3 ISlamabad' },
  ];

  // Mock data for notifications
  const notifications = [
    { id: 1, title: 'New Order #1234', message: 'Order received from John Doe', time: '2 min ago', unread: true },
    { id: 2, title: 'Low Stock Alert', message: 'Pizza dough running low', time: '15 min ago', unread: true },
    { id: 3, title: 'New Review', message: '5-star review from customer', time: '1 hour ago', unread: false },
    { id: 4, title: 'Payment Received', message: 'Payment of $150 confirmed', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName);
    setIsBranchDropdownOpen(false);
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
          <h1 className="text-lg font-bold text-white">{isCollapsed ? 'I' : 'Invex Food'}</h1>
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
            <h1 className="md:hidden text-lg font-bold text-slate-800 dark:text-white">Invex Food </h1>

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
              {isFullscreen ? <LuMinimize className="w-6 h-6 text-orange-500 " /> : <LuMaximize className="w-6 h-6 text-orange-500" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsBranchDropdownOpen(false);
                }}
                className="relative w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 dark:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-500/20 transition-colors"
              >
                <Bell className="w-5 h-5 text-black dark:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-border z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{unreadCount} unread messages</p>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${notif.unread ? 'bg-pink-50/50 dark:bg-pink-500/5' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-pink-500' : 'bg-slate-300'}`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-slate-800 dark:text-white">{notif.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
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
            {/* <button className="hidden md:flex relative w-10 h-10 rounded-full items-center justify-center bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-500/20 transition-colors">
              <MessageSquare className="w-5 h-5 text-pink-500" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button> */}

            {/* Cart - Hidden on small screens */}
            {/* <button className="hidden md:flex relative w-10 h-10 rounded-full items-center justify-center bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-500/20 transition-colors">
              <ShoppingCart className="w-5 h-5 text-pink-500" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
            <h1 className="text-lg font-bold text-white">Invex Food</h1>
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
                  onClick={closeMobileMenu}
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
              onClick={toggleTheme}
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
    </div>
  );
}