import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useThemeDetector } from '../utils/themes/useThemeDetector.ts';

const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

export type ThemeType = typeof THEME_DARK | typeof THEME_LIGHT;

interface ThemeContextType {
	theme: ThemeType;
	isAuto: boolean;
	setTheme: (value: ThemeType) => void;
	setAutoTheme: (value: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: THEME_LIGHT,
	isAuto: false,
	setTheme: () => {},
	setAutoTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const isDarkTheme = useThemeDetector();
	const initialTheme = isDarkTheme ? THEME_DARK : THEME_LIGHT;
	const [theme, setCurrentTheme] = useState<ThemeType>(initialTheme);
	const [isAuto, setAutoTheme] = useState<boolean>(true);

	const applyTheme = (theme: ThemeType, isDarkTheme: boolean, auto: boolean) => {
		const appliedTheme = auto ? (isDarkTheme ? THEME_DARK : THEME_LIGHT) : theme;
		document.documentElement.setAttribute('data-theme', appliedTheme);
		console.log(`Applied theme: ${appliedTheme}`);
	};

	const setTheme = useCallback((newTheme: ThemeType) => {
		setCurrentTheme(newTheme);
		applyTheme(newTheme, isDarkTheme, isAuto);
	}, [isAuto, isDarkTheme]);

	useEffect(() => {
		console.log('ThemeProvider useEffect - theme:', theme, 'isDarkTheme:', isDarkTheme);
		applyTheme(theme, isDarkTheme, isAuto);
	}, [theme, isDarkTheme, isAuto]);

	// Update theme when `isDarkTheme` changes and `isAuto` is true
	useEffect(() => {
		if (isAuto) {
			const newTheme = isDarkTheme ? THEME_DARK : THEME_LIGHT;
			setCurrentTheme(newTheme);
			applyTheme(newTheme, isDarkTheme, isAuto);
		}
	}, [isDarkTheme, isAuto]);

	return (
		<ThemeContext.Provider value={{ theme, isAuto, setTheme, setAutoTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
