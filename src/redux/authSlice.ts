import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================
// Safe localStorage helper - works on iOS, Android, Chrome
// Handles private browsing, QuotaExceededError, and SSR
// ============================================================
const safeStorage = {
	get: (key: string): string | null => {
		try {
			if (typeof window === 'undefined') return null;
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set: (key: string, value: string): void => {
		try {
			if (typeof window === 'undefined') return;
			localStorage.setItem(key, value);
		} catch {
			// Silently fail on iOS private browsing
		}
	},
	remove: (key: string): void => {
		try {
			if (typeof window === 'undefined') return;
			localStorage.removeItem(key);
		} catch {
			// Silently fail
		}
	},
};

interface AuthState {
	isAuthenticated: boolean;
	loading: boolean;
	user: any | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	loading: true,
	user: null,
};

export const login = createAsyncThunk(
	'auth/login',
	async (payload: { email: string; password?: string; fullName?: string }, { rejectWithValue }) => {
		try {
			const userData = { email: payload.email, name: payload.fullName || 'User' };
			safeStorage.set('isAuthenticated', 'true');
			safeStorage.set('user', JSON.stringify(userData));
			return userData;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Login failed');
		}
	}
);

export const signup = createAsyncThunk(
	'auth/signup',
	async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
		try {
			safeStorage.set('isAuthenticated', 'true');
			return true;
		} catch (error) {
			return rejectWithValue(false);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.isAuthenticated = false;
			state.user = null;
			state.loading = false;
			safeStorage.remove('isAuthenticated');
			safeStorage.remove('user');
			safeStorage.remove('lastCompany');
		},
		checkAuth(state) {
			const authStatus = safeStorage.get('isAuthenticated');
			const savedUser = safeStorage.get('user');

			state.isAuthenticated = authStatus === 'true';

			if (savedUser) {
				try {
					state.user = JSON.parse(savedUser);
				} catch {
					state.user = null;
					state.isAuthenticated = false;
				}
			} else {
				state.user = null;
			}

			// Always set loading false - CRITICAL for iOS
			state.loading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.user = action.payload;
				state.loading = false;
			})
			.addCase(login.rejected, (state) => {
				state.isAuthenticated = false;
				state.user = null;
				state.loading = false;
			})
			.addCase(signup.pending, (state) => {
				state.loading = true;
			})
			.addCase(signup.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.loading = false;
			})
			.addCase(signup.rejected, (state) => {
				state.isAuthenticated = false;
				state.loading = false;
			});
	},
});
export const { logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
