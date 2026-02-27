import React, { createContext, useContext, useEffect, ReactNode, useState, useCallback, useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { BrandColors, TenantBranding } from '../theme/types';
import { tenantConfig } from '../config/tenant-color';

interface BrandingContextType {
    config: TenantBranding;
    updateConfig: (newConfig: Partial<TenantBranding>) => void;
    saveConfig: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};

export const BrandingProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [config, setConfig] = useState<TenantBranding>(tenantConfig);

    const updateConfig = useCallback((newConfig: Partial<TenantBranding>) => {
        setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
    }, []);

    const saveConfig = useCallback(() => {
        localStorage.setItem('brandingConfig', JSON.stringify(config));
    }, [config]);

    useEffect(() => {
        const savedConfig = localStorage.getItem('brandingConfig');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    }, []);

    const value = useMemo(() => ({ config, updateConfig, saveConfig }), [config, updateConfig, saveConfig]);

    return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};
