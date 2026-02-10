import { TenantBranding } from '../theme/types';

export const tenantConfig: TenantBranding = {
  id: 'HotNYum',
  name: 'HotNYum',
  logo: '/logos/invextech.png', // Assuming a path or placeholder
  light: {
    primary: '#f06c22',
    secondary: '#04341c',
    accent: '#f1c812',
    background: '#f8fafc',
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
  },
  dark: {
    primary: '#f06c22',
    secondary: '#04341c',
    accent: '#f1c812',
    background: '#0b1120',
    surface: '#111827',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#1f2937',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#ef4444',
  }
};
