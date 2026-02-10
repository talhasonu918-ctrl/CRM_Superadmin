import { TenantBranding } from '../theme/types';

export const tenantConfig: TenantBranding = {
   light: {
  primary: '#f06c22',       
  secondary: '#04341c',     
  accent: '#f1c812',         

  background: '#f8fafc',     // Soft light gray
  surface: '#ffffff',        // Cards / modals

  textPrimary: '#0f172a',    // Slate-900
  textSecondary: '#475569',  // Slate-600

  border: '#e2e8f0',         // Subtle borders

  success: '#16a34a',
  warning: '#f59e0b',
  error: '#dc2626',
}
,
   dark: {
 primary: '#f06c22',       
  secondary: '#04341c',     
  accent: '#f1c812',         

  background: '#0b1120',     // Deep navy (less harsh than black)
  surface: '#111827',        // Card background

  textPrimary: '#f8fafc',    // Near white
  textSecondary: '#94a3b8',  // Muted gray

  border: '#1f2937',         // Dark subtle border

  success: '#22c55e',
  warning: '#fbbf24',
  error: '#ef4444',
}

};
