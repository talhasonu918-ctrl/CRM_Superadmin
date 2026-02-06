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
    sans: "'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
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
  return {
    // Primary brand colors
    primary: {
      main: 'bg-primary',
      hover: 'hover:opacity-90',
      text: 'text-primary',
      textHover: 'hover:opacity-90',
      border: 'border-primary',
      focus: 'focus:border-primary',
      ring: 'focus:ring-primary',
      gradient: 'from-primary to-primary/80',
      shadow: 'shadow-primary/20',
      light: 'bg-primary/10',
      lightHover: 'hover:bg-primary/20',
      dark: 'bg-primary',
      darkText: 'text-primary',
    },
    // Secondary colors
    secondary: {
      main: 'bg-secondary',
      hover: 'hover:opacity-90',
      text: 'text-secondary',
      textHover: 'hover:opacity-90',
      border: 'border-secondary',
      gradient: 'from-secondary to-secondary/80',
    },
    // Neutral/Background colors
    neutral: {
      background: 'bg-background',
      backgroundSecondary: 'bg-surface/50',
      backgroundTertiary: 'bg-surface/80',
      card: 'bg-surface',
      hover: 'hover:bg-surface/10',
      hoverLight: 'hover:bg-surface/5',
      active: 'bg-surface/20',
    },
    // Border colors
    border: {
      main: 'border-border',
      secondary: 'border-border/80',
      tertiary: 'border-border/60',
      input: 'border-border',
      inputFocus: 'focus:border-primary',
      subtle: 'border-border/40',
    },
    // Text colors
    text: {
      primary: 'text-textPrimary',
      secondary: 'text-textSecondary',
      tertiary: 'text-textSecondary/80',
      muted: 'text-textSecondary/60',
      heading: 'text-textPrimary',
      inverse: isDarkMode ? 'text-background' : 'text-surface',
    },
    // Input/Form colors
    input: {
      background: 'bg-surface',
      backgroundFocus: 'focus:bg-surface',
      border: 'border-border',
      borderHover: 'hover:border-primary/50',
      text: 'text-textPrimary',
      placeholder: 'placeholder-textSecondary/50',
    },
    // Status colors
    status: {
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        hover: 'hover:bg-success/20',
        main: 'text-success',
      },
      error: {
        bg: 'bg-error/10',
        text: 'text-error',
        hover: 'hover:bg-error/20',
        main: 'text-error',
        border: 'border-error',
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        hover: 'hover:bg-warning/20',
        main: 'text-warning',
      },
      info: {
        bg: 'bg-accent/10',
        text: 'text-accent',
        hover: 'hover:bg-accent/20',
        main: 'text-accent',
      },
    },
    // Table status colors
    table: {
      occupied: {
        gradient: 'from-primary to-primary/80',
        text: 'text-surface',
        shadow: 'shadow-lg shadow-primary/30',
        border: 'border-primary/50',
      },
      available: {
        bg: 'from-surface/50 to-surface',
        text: 'text-textSecondary',
        icon: 'text-textSecondary/50',
        border: 'border-border',
      },
      reserved: {
        bg: 'from-surface/80 to-surface',
        text: 'text-textPrimary',
        icon: 'text-textSecondary/80',
        border: 'border-border',
      },
    },
    // Button styles
    button: {
      primary: 'bg-primary text-white hover:opacity-90 shadow-md ring-1 ring-transparent focus:ring-primary/20',
      secondary: 'border border-border hover:bg-surface/10 text-textSecondary',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    },
    // Dropdown/Menu colors
    dropdown: {
      bg: 'bg-surface',
      border: 'border-border',
      item: 'text-textSecondary',
      itemHover: 'hover:bg-surface/10',
      danger: 'text-error',
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
    // Raw values are now CSS variables
    raw: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      neutral: 'var(--color-border)',
      status: {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-accent)',
      },
      mode: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text-primary)',
        border: 'var(--color-border)',
      },
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
