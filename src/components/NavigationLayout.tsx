import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${theme.neutral.background}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 shadow-lg border-r transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-20' : 'w-64'} ${theme.neutral.background} ${theme.border.main}`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between h-16 px-4 bg-orange-500">
            <h1 className="text-xl font-bold text-white">{isCollapsed ? 'N' : 'Nexus CRM'}</h1>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-orange-600 p-1 rounded"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 min-h-20 overflow-y-auto custom-scrollbar`}>
            {navigationItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? `bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ${isCollapsed ? '' : 'border-l-4 border-orange-500'}`
                      : `${theme.text.secondary} ${theme.neutral.hoverLight}`
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={isCollapsed ? item.description : item.description}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'}`} />
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle and Logout */}
          <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t space-y-2 ${theme.border.main}`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight} ${isCollapsed ? 'justify-center px-2' : ''}`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className={`w-5 h-5 ${isCollapsed ? 'text-gray-600 dark:text-gray-300' : ''}`} /> : <Moon className={`w-5 h-5 ${isCollapsed ? 'text-gray-600 dark:text-gray-300' : ''}`} />}
              {!isCollapsed && <span className="ml-3">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight} ${isCollapsed ? 'justify-center px-2' : ''}`}
              title="Logout"
            >
              <LogOut className={`w-5 h-5 ${isCollapsed ? 'text-gray-600 dark:text-gray-300' : ''}`} />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}