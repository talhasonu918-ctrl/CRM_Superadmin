import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun, LogOut } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.neutral.background}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 shadow-lg border-r ${theme.neutral.background} ${theme.border.main}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-orange-500">
            <h1 className="text-xl font-bold text-white">Nexus CRM</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 min-h-20 overflow-y-auto custom-scrollbar">
            {navigationItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500'
                      : `${theme.text.secondary} ${theme.neutral.hoverLight}`
                  }`}
                  title={item.description}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle and Logout */}
          <div className={`p-4 border-t space-y-2 ${theme.border.main}`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight}`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${theme.text.secondary} ${theme.neutral.hoverLight}`}
              title="Logout"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}