import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tenantConfig } from '../config/tenant-color';
import { TenantBranding } from '../theme/types';

interface CompanyState {
	company: string | null;
	companyDetails: TenantBranding | null;
	isLoading: boolean;
}

const initialState: CompanyState = {
	company: null,
	companyDetails: tenantConfig,
	isLoading: true,
};

const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		setCompany(state, action: PayloadAction<string>) {
			state.company = action.payload;
			if (typeof window !== 'undefined' && action.payload !== 'auth') {
				localStorage.setItem('lastCompany', action.payload);
			}
		},
		setCompanyDetails(state, action: PayloadAction<TenantBranding>) {
			state.companyDetails = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
		syncCompanyFromUrl(state, action: PayloadAction<{ company?: string; asPath?: string }>) {
			// Simulate the logic from the context
			let activeId = action.payload.company || null;
			if (!activeId && action.payload.asPath) {
				const pathSegments = action.payload.asPath.split('?')[0].split('/').filter(Boolean);
				activeId = pathSegments[0];
			}
			if (!activeId && typeof window !== 'undefined') {
				activeId = localStorage.getItem('lastCompany') || tenantConfig.id;
			}
			if (activeId) {
				state.company = activeId;
				if (typeof window !== 'undefined' && activeId !== 'auth') {
					localStorage.setItem('lastCompany', activeId);
				}
			}
			state.companyDetails = tenantConfig;
			state.isLoading = false;
		},
	},
});

export const { setCompany, setCompanyDetails, setLoading, syncCompanyFromUrl } = companySlice.actions;
export default companySlice.reducer;
