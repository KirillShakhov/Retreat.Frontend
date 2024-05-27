import { useEffect, useState } from 'react';

export const useThemeDetector = (): boolean => {
	const getCurrentTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

	const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme);

	useEffect(() => {
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

		const handleThemeChange = (e: MediaQueryListEvent) => {
			console.log(`Theme changed: ${e.matches ? 'Dark' : 'Light'}`);
			setIsDarkTheme(e.matches);
		};

		matchMedia.addEventListener('change', handleThemeChange);

		// Initial check
		setIsDarkTheme(matchMedia.matches);

		return () => matchMedia.removeEventListener('change', handleThemeChange);
	}, []);

	return isDarkTheme;
};
