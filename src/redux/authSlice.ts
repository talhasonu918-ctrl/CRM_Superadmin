import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import * as authApi from '../api/auth';

interface AuthState {
	isAuthenticated: boolean;
	loading: boolean;
	user: any | null;
}

const initialState: AuthState = {
	isAuthenticated: typeof window !== 'undefined' && JSON.parse(localStorage.getItem('isAuthenticated') || 'false'),
	loading: false,
	user: typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null'),
};

// Async thunks for login and signup
export const login = createAsyncThunk(
	'auth/login',
	async (payload: { email: string; password?: string; fullName?: string }, { rejectWithValue }) => {
		try {
			let result;
			if (payload.fullName) {
				// Use the new grant-access flow
				// result = await authApi.grantAccess({ email: payload.email, fullName: payload.fullName });
			} else {
				// Use the standard password login flow
				// result = await authApi.login({ email: payload.email, password: payload.password! });
			}

			// Simulate successful login for demonstration
			const userData = { email: payload.email, name: payload.fullName || 'User' };
			localStorage.setItem('isAuthenticated', 'true');
			localStorage.setItem('user', JSON.stringify(userData));
			return userData;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
		}
	}
);

export const signup = createAsyncThunk(
	'auth/signup',
	async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
		try {
			// This could be updated to real API signup if available
			localStorage.setItem('isAuthenticated', 'true');
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
			localStorage.removeItem('isAuthenticated');
			localStorage.removeItem('user');
			// authApi.logout(); // Call the API logout as well
		},
		checkAuth(state) {
			const authStatus = localStorage.getItem('isAuthenticated');
			const savedUser = localStorage.getItem('user');
			state.isAuthenticated = authStatus === 'true';
			state.user = savedUser ? JSON.parse(savedUser) : null;
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
