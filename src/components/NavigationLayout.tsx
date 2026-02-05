import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { navigationItems } from '../const';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../theme/colors';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = getThemeColors(isDarkMode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${theme.neutral.background}`}>
      {/* Mobile Header with Hamburger */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-orange-500 z-50 shadow-lg`}>
        <h1 className="text-xl font-bold text-white">Nexus CRM</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-orange-600 p-2 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 shadow-lg transition-all duration-300 overflow-hidden z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} 
        w-64
        ${theme.neutral.background} ${theme.border.main}`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4 bg-orange-500">
            <h1 className="text-xl font-bold text-white">{isCollapsed ? 'N' : 'Nexus CRM'}</h1>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-orange-600 p-1 rounded"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Header inside sidebar */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-orange-500">
            <h1 className="text-xl font-bold text-white">Nexus CRM</h1>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'lg:px-2' : 'lg:px-4'} px-4 py-6 space-y-2 min-h-20 overflow-y-auto custom-scrollbar scrollbar-thin `}>
            {navigationItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? `bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ${isCollapsed ? 'lg:border-l-0' : 'lg:border-l-4'} border-l-4 border-orange-500`
                      : `${theme.text.secondary} ${theme.neutral.hoverLight}`
                    } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={item.description}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'}`} />
                  <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle and Logout */}
          <div className={`${isCollapsed ? 'lg:p-2' : 'lg:p-4'} p-4 border-t space-y-2 ${theme.border.main}`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight} ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className={`w-5 h-5 flex-shrink-0`} /> : <Moon className={`w-5 h-5 flex-shrink-0`} />}
              <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight} ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
              title="Logout"
            >
              <LogOut className={`w-5 h-5 flex-shrink-0`} />
              <span className={`ml-3 ${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 pt-16 lg:pt-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <main className=" sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}