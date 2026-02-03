/**
 * Centralized Color & Theme Configuration
 * 
 * This file contains all colors and font styles used throughout the application.
 * Modify colors here to instantly change the entire website's theme.
 * 
 * @usage
 * ```tsx
 * import { colors, fonts, getThemeColors } from '@/theme/colors';
 * 
 * // Use in component
 * const { primary, neutral, status } = getThemeColors(isDarkMode);
 * className={primary.main} // 'bg-orange-500'
 * className={neutral.background} // 'bg-white' or 'bg-[#16191F]' in dark mode
 * ```
 */

// ==================== PRIMARY COLORS ====================
export const primaryColors = {
  // Main brand color - Orange
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316', // Main primary color
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
} as const;

// ==================== SECONDARY COLORS ====================
export const secondaryColors = {
  // Purple accent color
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea', // Main secondary color
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
} as const;

// ==================== NEUTRAL COLORS ====================
export const neutralColors = {
  // Gray scale for UI elements
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
} as const;

// ==================== STATUS COLORS ====================
export const statusColors = {
  success: {
    light: '#dcfce7',
    main: '#22c55e',
    dark: '#16a34a',
    text: {
      light: '#166534',
      dark: '#86efac',
    },
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626',
    text: {
      light: '#991b1b',
      dark: '#fca5a5',
    },
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
    text: {
      light: '#92400e',
      dark: '#fcd34d',
    },
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#2563eb',
    text: {
      light: '#1e40af',
      dark: '#93c5fd',
    },
  },
} as const;

// ==================== DARK MODE SPECIFIC ====================
export const darkModeColors = {
  // Dark backgrounds
  background: {
    primary: '#0F1115',
    secondary: '#16191F',
    tertiary: '#1A1E26',
    card: '#16191F',
  },
  // Dark borders
  border: {
    primary: '#334155',
    secondary: '#475569',
    subtle: '#1e293b',
  },
  // Dark text
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
  },
} as const;

// ==================== LIGHT MODE SPECIFIC ====================
export const lightModeColors = {
  // Light backgrounds
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    card: '#ffffff',
  },
  // Light borders
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    subtle: '#f1f5f9',
  },
  // Light text
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
    muted: '#94a3b8',
  },
} as const;

// ==================== FONT CONFIGURATION ====================
export const fonts = {
  // Font families
  family: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  // Font sizes
  size: {
    xs: '0.625rem',   // 10px
    sm: '0.75rem',    // 12px
    base: '0.875rem', // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  // Font weights
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  // Letter spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ==================== THEME GETTER FUNCTION ====================
/**
 * Get theme-aware color classes based on dark/light mode
 * @param isDarkMode - Whether dark mode is enabled
 * @returns Object containing all themed color utilities
 */
export const getThemeColors = (isDarkMode: boolean) => {
  const mode = isDarkMode ? 'dark' : 'light';
  const modeColors = isDarkMode ? darkModeColors : lightModeColors;

  return {
    // Primary brand colors
    primary: {
      main: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      text: 'text-orange-500',
      textHover: 'hover:text-orange-600',
      border: 'border-orange-500',
      focus: 'focus:border-orange-500',
      ring: 'focus:ring-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      shadow: 'shadow-orange-500/20',
      light: 'bg-orange-50',
      lightHover: 'hover:bg-orange-50',
      dark: 'bg-orange-600',
      darkText: isDarkMode ? 'text-orange-400' : 'text-orange-600',
    },
    // Secondary colors
    secondary: {
      main: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
      textHover: 'hover:text-purple-700',
      border: 'border-purple-600',
      gradient: 'from-purple-600 to-purple-700',
    },
    // Neutral/Background colors
    neutral: {
      background: isDarkMode ? 'bg-[#0F1115]' : 'bg-white',
      backgroundSecondary: isDarkMode ? 'bg-[#16191F]' : 'bg-slate-50',
      backgroundTertiary: isDarkMode ? 'bg-[#1A1E26]' : 'bg-slate-100',
      card: isDarkMode ? 'bg-[#16191F]' : 'bg-white',
      hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      hoverLight: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
      active: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    },
    // Border colors
    border: {
      main: isDarkMode ? 'border-slate-800' : 'border-slate-100',
      secondary: isDarkMode ? 'border-slate-700' : 'border-slate-200',
      tertiary: isDarkMode ? 'border-gray-700' : 'border-gray-300',
      input: isDarkMode ? 'border-slate-700' : 'border-gray-300',
      inputFocus: isDarkMode ? 'focus:border-orange-500' : 'focus:border-orange-500',
      subtle: isDarkMode ? 'border-slate-800' : 'border-slate-50',
    },
    // Text colors
    text: {
      primary: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      secondary: isDarkMode ? 'text-slate-400' : 'text-slate-500',
      tertiary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-500' : 'text-gray-400',
      heading: isDarkMode ? 'text-white' : 'text-slate-900',
      inverse: isDarkMode ? 'text-slate-900' : 'text-white',
    },
    // Input/Form colors
    input: {
      background: isDarkMode ? 'bg-slate-800' : 'bg-slate-50',
      backgroundFocus: isDarkMode ? 'focus:bg-slate-800' : 'focus:bg-white',
      border: isDarkMode ? 'border-slate-700' : 'border-slate-100',
      borderHover: isDarkMode ? 'hover:border-slate-600' : 'hover:border-slate-200',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      placeholder: isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400',
    },
    // Status colors
    status: {
      success: {
        bg: isDarkMode ? 'bg-green-900' : 'bg-green-100',
        text: isDarkMode ? 'text-green-200' : 'text-green-800',
        hover: isDarkMode ? 'hover:bg-green-900/20' : 'hover:bg-green-50',
        main: 'text-green-600',
      },
      error: {
        bg: isDarkMode ? 'bg-red-900' : 'bg-red-100',
        text: isDarkMode ? 'text-red-200' : 'text-red-800',
        hover: isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50',
        main: 'text-red-500',
        border: 'border-red-500',
      },
      warning: {
        bg: isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100',
        text: isDarkMode ? 'text-yellow-200' : 'text-yellow-800',
        hover: isDarkMode ? 'hover:bg-yellow-900/20' : 'hover:bg-yellow-50',
        main: 'text-yellow-600',
      },
      info: {
        bg: isDarkMode ? 'bg-blue-900' : 'bg-blue-100',
        text: isDarkMode ? 'text-blue-200' : 'text-blue-800',
        hover: isDarkMode ? 'hover:bg-blue-900/20' : 'hover:bg-blue-50',
        main: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      },
    },
    // Table status colors
    table: {
      occupied: {
        gradient: 'from-orange-500 to-orange-600',
        text: 'text-white',
        shadow: 'shadow-lg shadow-orange-500/30',
        border: 'border-orange-400',
      },
      available: {
        bg: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-gray-100 to-gray-200',
        text: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        icon: isDarkMode ? 'text-gray-500' : 'text-gray-400',
        border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
      },
      reserved: {
        bg: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-gray-200 to-gray-300',
        text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
        icon: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        border: isDarkMode ? 'border-gray-600' : 'border-gray-400',
      },
    },
    // Button styles
    button: {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20',
      secondary: isDarkMode 
        ? 'border border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border border-gray-300 hover:bg-gray-100 text-gray-700',
      outline: isDarkMode
        ? 'border border-slate-600 hover:bg-slate-700 text-slate-300'
        : 'border border-slate-500 hover:bg-slate-500 hover:text-white text-slate-700',
    },
    // Dropdown/Menu colors
    dropdown: {
      bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      item: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      itemHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      danger: 'text-red-500',
    },
    // Shadow utilities
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      inner: 'shadow-inner',
    },
    // Raw color values for custom styling
    raw: {
      primary: primaryColors,
      secondary: secondaryColors,
      neutral: neutralColors,
      status: statusColors,
      mode: modeColors,
    },
  };
};

// ==================== CSS VARIABLE EXPORTS ====================
/**
 * Generate CSS variables for theme colors
 * Can be used in global CSS or styled-components
 */
export const generateCSSVariables = (isDarkMode: boolean) => {
  const modeColors = isDarkMode ? darkModeColors : lightModeColors;
  
  return {
    '--color-primary': primaryColors[500],
    '--color-primary-hover': primaryColors[600],
    '--color-secondary': secondaryColors[600],
    '--color-background': modeColors.background.primary,
    '--color-background-secondary': modeColors.background.secondary,
    '--color-text-primary': modeColors.text.primary,
    '--color-text-secondary': modeColors.text.secondary,
    '--color-border': modeColors.border.primary,
  };
};

// ==================== EXPORTS ====================
export const colors = {
  primary: primaryColors,
  secondary: secondaryColors,
  neutral: neutralColors,
  status: statusColors,
  darkMode: darkModeColors,
  lightMode: lightModeColors,
} as const;

export default {
  colors,
  fonts,
  getThemeColors,
  generateCSSVariables,
};
