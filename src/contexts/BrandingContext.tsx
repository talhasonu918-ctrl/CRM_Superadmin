import React, { createContext, useContext, useEffect, ReactNode, useState, useCallback, useMemo } from 'react';
import { BrandColors, TenantBranding } from '../theme/types';
import { tenantConfig } from '../config/tenant-color';
import { useTheme } from './ThemeContext';

interface BrandingContextType {
    config: TenantBranding;
    updateConfig: (newConfig: Partial<TenantBranding>) => void;
    saveConfig: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

/**
 * Robust CSS Variable application
 */
export const applyBrandColors = (colors: BrandColors) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const colorMap: Record<string, string> = {
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-accent': colors.accent,
        '--color-background': colors.background,
        '--color-surface': colors.surface,
        '--color-text-primary': colors.textPrimary,
        '--color-text-secondary': colors.textSecondary,
        '--color-border': colors.border,
        '--color-success': colors.success,
        '--color-warning': colors.warning,
        '--color-error': colors.error,
    };

    Object.entries(colorMap).forEach(([prop, value]) => {
        if (value) root.style.setProperty(prop, value);
    });
};

/**
 * Senior-level dynamic asset application (Fonts & Favicon)
 */
export const applyBrandingAssets = (branding: TenantBranding) => {
    if (typeof document === 'undefined') return;

    // 1. Update Favicon Safely
    if (branding.favicon) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        // Cache-busting favicon update
        const cleanFavicon = branding.favicon.split('?')[0];
        link.href = `${cleanFavicon}?v=${Date.now()}`;
    }

    // 2. Load Google Font Dynamically
    if (branding.fontFamily) {
        // Normalize font name for Google Fonts (e.g., 'poppins' -> 'Poppins')
        const rawFontName = branding.fontFamily.trim();
        const fontName = rawFontName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        const fontId = 'dynamic-branding-google-font';

        let link = document.getElementById(fontId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = fontId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        // Use v1 API for maximum compatibility with font weights
        const newHref = `https://fonts.googleapis.com/css?family=${fontName.replace(/\s+/g, '+')}:300,400,500,600,700,800&display=swap`;
        if (link.href !== newHref) {
            link.href = newHref;
        }

        // Apply via CSS Variables and Body Style with !important for maximum reliability
        // We use the original fontName but ensuring it's properly quoted for CSS
        const cssFontName = fontName.includes(' ') ? `'${fontName}'` : fontName;
        const fontStack = `${cssFontName}, ui-sans-serif, system-ui, -apple-system, sans-serif`;

        const root = document.documentElement;
        root.style.setProperty('--font-tenant', fontStack);

        // Inject a dedicated style tag for absolute global dominance
        const styleId = 'tenant-font-global-override';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `
            html, body, #__next, .rizzui-root { 
                font-family: ${fontStack} !important; 
            }
            * { font-family: inherit; }
            input, button, select, textarea { font-family: ${fontStack} !important; }
        `;
    }
};

export const BrandingProvider: React.FC<{ children: ReactNode; initialConfig?: TenantBranding }> = ({
    children,
    initialConfig = tenantConfig
}) => {
    // 1. Initialize state with strong hydration from localStorage
    const [config, setConfig] = useState<TenantBranding>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tenant_branding');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Senior Smart Hydration:
                    // If the user hasn't explicitly changed the font yet (Inter),
                    // allow the code defaults (TenantConfig) to take precedence.
                    const isOldDefault = parsed.fontFamily === 'Inter' || parsed.light?.fontFamily === 'Inter';
                    const shouldOverride = isOldDefault && initialConfig.fontFamily !== 'Inter';

                    const finalFontFamily = shouldOverride
                        ? initialConfig.fontFamily
                        : (parsed.fontFamily || parsed.light?.fontFamily || parsed.dark?.fontFamily || initialConfig.fontFamily);

                    const finalConfig = {
                        ...initialConfig,
                        ...parsed,
                        light: { ...initialConfig.light, ...parsed.light },
                        dark: { ...initialConfig.dark, ...parsed.dark },
                        fontFamily: finalFontFamily
                    };

                    // Force absolute consistency across all objects
                    if (finalConfig.fontFamily) {
                        finalConfig.light.fontFamily = finalConfig.fontFamily;
                        finalConfig.dark.fontFamily = finalConfig.fontFamily;
                    }

                    if (shouldOverride) {
                        console.log(`%c Branding: Unified Font override triggered -> '${finalConfig.fontFamily}'`, 'color: #f06c22; font-weight: bold;');
                    }

                    return finalConfig;
                } catch (e) {
                    console.error('Branding hydration failed', e);
                }
            }
        }
        return initialConfig;
    });

    const { isDarkMode } = useTheme();

    // 2. Side effect: Application of styles (decoupled from storage)
    useEffect(() => {
        const activeColors = isDarkMode ? config.dark : config.light;
        try {
            applyBrandColors(activeColors);
            // Dynamic Font Priority: Active Theme Font -> Global Config Font -> Fallback
            const activeFont = activeColors.fontFamily || config.fontFamily;
            applyBrandingAssets({ ...config, fontFamily: activeFont });
        } catch (error) {
            console.error('Failed to apply branding styles', error);
        }
    }, [config, isDarkMode]);

    // 3. Side effect: Persistence to localStorage (with validation)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tenant_branding', JSON.stringify(config));
        }
    }, [config]);

    /**
     * Senior update handler: Deep merge support for nested objects (light/dark)
     * Now with Unified Font Support!
     */
    const updateConfig = useCallback((newConfig: Partial<TenantBranding>) => {
        setConfig(prev => {
            const updated = { ...prev };

            // 1. Handle root level attributes
            if (newConfig.name !== undefined) updated.name = newConfig.name;
            if (newConfig.favicon !== undefined) updated.favicon = newConfig.favicon;
            if (newConfig.logo !== undefined) updated.logo = newConfig.logo;

            // 2. Handle nested theme objects (colors, etc.)
            if (newConfig.light) {
                updated.light = { ...prev.light, ...newConfig.light };
            }
            if (newConfig.dark) {
                updated.dark = { ...prev.dark, ...newConfig.dark };
            }

            // 3. Absolute Font Synchronization (The "Hammer" Approach)
            // Identify the single source of truth for font in this update
            const winningFont = newConfig.fontFamily ||
                newConfig.light?.fontFamily ||
                newConfig.dark?.fontFamily ||
                updated.fontFamily;

            if (winningFont) {
                updated.fontFamily = winningFont;
                updated.light.fontFamily = winningFont;
                updated.dark.fontFamily = winningFont;
            }

            return updated;
        });
    }, []);

    const saveConfig = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tenant_branding', JSON.stringify(config));
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
