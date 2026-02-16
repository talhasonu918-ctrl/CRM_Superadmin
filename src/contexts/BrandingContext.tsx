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

/**
 * Applies brand colors to CSS variables
 */
export const applyBrandColors = (colors: BrandColors, isDarkMode: boolean = false) => {
    if (typeof document === 'undefined') return;

    const colorMap: Record<string, string> = {
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-accent': colors.accent,
        '--color-success': colors.success,
        '--color-warning': colors.warning,
        '--color-error': colors.error,
    };

    if (!isDarkMode) {
        colorMap['--color-background'] = colors.background;
        colorMap['--color-surface'] = colors.background; // Fallback
        colorMap['--color-text-primary'] = colors.text;
        colorMap['--color-text-secondary'] = colors.textLight;
        colorMap['--color-border'] = colors.textLight + '33'; // Subtle border from text color
    } else {
        // In dark mode, we remove these so the .dark class variables in globals.css can take over
        document.documentElement.style.removeProperty('--color-background');
        document.documentElement.style.removeProperty('--color-surface');
        document.documentElement.style.removeProperty('--color-text-primary');
        document.documentElement.style.removeProperty('--color-text-secondary');
        document.documentElement.style.removeProperty('--color-border');
    }

    Object.entries(colorMap).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(prop, value);
    });
};

/**
 * Applies fonts and favicon
 */
export const applyBrandingAssets = (branding: TenantBranding) => {
    if (typeof document === 'undefined') return;

    // 1. Update Favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (branding.images?.favicon) {
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = branding.images.favicon;
    } else {
        // Force clear favicon by setting it to a transparent pixel
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    // 2. Apply Fonts (Google Fonts)
    if (branding.fonts?.primary) {
        const fontName = branding.fonts.primary.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        const fontId = 'google-font-branding';
        let link = document.getElementById(fontId) as HTMLLinkElement;

        if (!link) {
            link = document.createElement('link');
            link.id = fontId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
        if (link.href !== fontUrl) {
            link.href = fontUrl;
        }

        document.documentElement.style.setProperty('--font-tenant', branding.fonts.primary);
    }
};

export const BrandingProvider: React.FC<{
    children: ReactNode;
    initialConfig?: TenantBranding;
}> = ({
    children,
    initialConfig = tenantConfig
}) => {
        const [config, setConfig] = useState<TenantBranding>(() => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('tenant_branding_v2');
                if (saved) {
                    try {
                        return JSON.parse(saved);
                    } catch (e) {
                        console.error('Branding hydration failed', e);
                    }
                }
            }
            return initialConfig;
        });

        const { isDarkMode } = useTheme();

        useEffect(() => {
            try {
                applyBrandColors(config.colors, isDarkMode);
                applyBrandingAssets(config);
            } catch (error) {
                console.error('Failed to apply branding styles', error);
            }
        }, [config, isDarkMode]);

        const updateConfig = useCallback((newConfig: Partial<TenantBranding>) => {
            setConfig(prev => {
                const updated = { ...prev, ...newConfig };

                // Handle deep merges for specific sections
                if (newConfig.colors) updated.colors = { ...prev.colors, ...newConfig.colors };
                if (newConfig.fonts) updated.fonts = { ...prev.fonts, ...newConfig.fonts };
                if (newConfig.images) updated.images = { ...prev.images, ...newConfig.images };
                if (newConfig.contact) updated.contact = { ...prev.contact, ...newConfig.contact };
                if (newConfig.business) updated.business = { ...prev.business, ...newConfig.business };
                if (newConfig.seo) updated.seo = { ...prev.seo, ...newConfig.seo };
                if (newConfig.features) updated.features = { ...prev.features, ...newConfig.features };
                if (newConfig.socialMedia) updated.socialMedia = { ...prev.socialMedia, ...newConfig.socialMedia };

                return updated;
            });
        }, []);

        const saveConfig = useCallback(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('tenant_branding_v2', JSON.stringify(config));
            }
        }, [config]);

        const value = useMemo(() => ({
            config,
            updateConfig,
            saveConfig
        }), [config, updateConfig, saveConfig]);

        return (
            <BrandingContext.Provider value={value}>
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
