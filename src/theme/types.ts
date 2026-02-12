export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    fontFamily?: string;
}
export interface TenantBranding {
    id: string;
    name: string;
    logo?: string;
    favicon?: string;
    fontFamily?: string;
    light: BrandColors;
    dark: BrandColors;
}
