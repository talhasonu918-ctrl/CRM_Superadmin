import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
	isDarkMode: boolean;
}

const getInitialTheme = (): boolean => {
	if (typeof window !== 'undefined') {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return savedTheme === 'dark' || (!savedTheme && prefersDark);
	}
	return false;
};

const initialState: ThemeState = {
	isDarkMode: false, // Will be set on client
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
		syncThemeFromStorage(state) {
			if (typeof window !== 'undefined') {
				const savedTheme = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				state.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
				if (state.isDarkMode) {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		},
	},
});

export const { setDarkMode, toggleTheme, syncThemeFromStorage } = themeSlice.actions;
export default themeSlice.reducer;
