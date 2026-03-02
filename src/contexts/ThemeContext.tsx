import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// Safe localStorage helper - works on iOS private mode, Android, Chrome
const safeGet = (key: string): string | null => {
  try { return typeof window !== 'undefined' ? localStorage.getItem(key) : null; } catch { return null; }
};
const safeSet = (key: string, value: string): void => {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, value); } catch { /* iOS private */ }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      // Safe localStorage + safe window.matchMedia for iOS Safari compatibility
      const savedTheme = safeGet('theme');
      let prefersDark = false;
      try {
        prefersDark = typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch { prefersDark = false; }

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch { /* silently fail on iOS */ }
  }, []);
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      safeSet('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      safeSet('theme', 'light');
    }
  };

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
  };
 return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};