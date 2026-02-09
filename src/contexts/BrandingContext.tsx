import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { BrandColors, TenantBranding } from '../theme/types';
import { tenantConfig } from '../config/tenant-color';
import { useTheme } from './ThemeContext';

interface BrandingContextType {
    config: TenantBranding;
    updateConfig: (newConfig: Partial<TenantBranding>) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const applyBrandColors = (colors: BrandColors) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
};

export const BrandingProvider: React.FC<{ children: ReactNode; initialConfig?: TenantBranding }> = ({
    children,
    initialConfig = tenantConfig
}) => {
    const [config, setConfig] = useState<TenantBranding>(initialConfig);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const activeColors = isDarkMode ? config.dark : config.light;
        applyBrandColors(activeColors);
    }, [config, isDarkMode]);

    const updateConfig = (newConfig: Partial<TenantBranding>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    return (
        <BrandingContext.Provider value={{ config, updateConfig }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
