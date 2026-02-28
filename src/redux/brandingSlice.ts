import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tenantConfig } from '../config/tenant-color';
import { BrandColors, TenantBranding } from '../theme/types';

interface BrandingState {
	config: TenantBranding;
}

const initialState: BrandingState = {
	config: tenantConfig,
};

const brandingSlice = createSlice({
	name: 'branding',
	initialState,
	reducers: {
		updateConfig(state, action: PayloadAction<Partial<TenantBranding>>) {
			state.config = { ...state.config, ...action.payload };
		},
		saveConfig(state) {
			// No-op for now, could persist to API/localStorage if needed
		},
		applyBrandColors(state, action: PayloadAction<{ colors: BrandColors | undefined; isDarkMode?: boolean }>) {
			// This is a side effect, but for migration, keep the function name
			const { colors, isDarkMode = false } = action.payload;
			if (typeof document === 'undefined' || !colors) return;
			const colorMap: Record<string, string> = {};
			if (colors.primary) colorMap['--color-primary'] = colors.primary;
			if (colors.secondary) colorMap['--color-secondary'] = colors.secondary;
			if (colors.accent) colorMap['--color-accent'] = colors.accent;
			if (colors.success) colorMap['--color-success'] = colors.success;
			if (colors.warning) colorMap['--color-warning'] = colors.warning;
			if (colors.error) colorMap['--color-error'] = colors.error;
			if (!isDarkMode) {
				if (colors.background) {
					colorMap['--color-background'] = colors.background;
					colorMap['--color-surface'] = colors.background;
				}
				if (colors.text) colorMap['--color-text-primary'] = colors.text;
				if (colors.textLight) {
					colorMap['--color-text-secondary'] = colors.textLight;
					colorMap['--color-border'] = colors.textLight + '33';
				}
			} else {
				document.documentElement.style.removeProperty('--color-background');
				document.documentElement.style.removeProperty('--color-surface');
				document.documentElement.style.removeProperty('--color-text-primary');
				document.documentElement.style.removeProperty('--color-text-secondary');
				document.documentElement.style.removeProperty('--color-border');
			}
			Object.entries(colorMap).forEach(([prop, value]) => {
				if (value !== undefined) {
					document.documentElement.style.setProperty(prop, value);
				}
			});
		},
		applyBrandingAssets(state, action: PayloadAction<TenantBranding>) {
			// This is a side effect, but for migration, keep the function name
			const branding = action.payload;
			if (typeof document === 'undefined') return;
			// Favicon and font logic could go here
		},
		syncBrandingFromStorage(state) {
			try {
				if (typeof window === 'undefined') return;
				const savedBranding = localStorage.getItem('tenant_branding_v2');
				if (savedBranding) {
					try {
						state.config = JSON.parse(savedBranding);
					} catch { /* corrupt data - ignore */ }
				}
			} catch { /* iOS private mode - silently fail */ }
		},
	},
});

export const { updateConfig, saveConfig, applyBrandColors, applyBrandingAssets, syncBrandingFromStorage } = brandingSlice.actions;
export default brandingSlice.reducer;
