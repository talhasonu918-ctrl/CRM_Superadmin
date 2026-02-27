import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
	isDarkMode: boolean;
}

const initialState: ThemeState = {
	isDarkMode: false, // deterministic on server; hydrated on client
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setDarkMode(state, action: PayloadAction<boolean>) {
			state.isDarkMode = action.payload;
			if (typeof window !== 'undefined') {
				if (action.payload) {
					document.documentElement.classList.add('dark');
					localStorage.setItem('theme', 'dark');
				} else {
					document.documentElement.classList.remove('dark');
					localStorage.setItem('theme', 'light');
				}
			}
		},
		toggleTheme(state) {
			state.isDarkMode = !state.isDarkMode;
			if (typeof window !== 'undefined') {
				if (state.isDarkMode) {
					document.documentElement.classList.add('dark');
					localStorage.setItem('theme', 'dark');
				} else {
					document.documentElement.classList.remove('dark');
					localStorage.setItem('theme', 'light');
				}
			}
		},
	},
});

export const { setDarkMode, toggleTheme } = themeSlice.actions;

// Client-side hydrator: run on mount to read localStorage / matchMedia and apply DOM changes.
export const hydrateTheme = () => (dispatch: any) => {
	if (typeof window === 'undefined') return;
	try {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
		const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

		// apply DOM class
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}

		dispatch(setDarkMode(isDark));
	} catch (e) {
		// swallow errors on hydration
		// leave theme as default
	}
};

export default themeSlice.reducer;
