import { useEffect, useState } from 'react';
import {useTheme} from "./useTheme.ts";

const getCssVariable = (variableName: string): string => {
	const root = document.documentElement;
	return getComputedStyle(root).getPropertyValue(variableName).trim();
};

const getPalette = () => ({
	backgroundColor: getCssVariable('--background-color'),
	textColor: getCssVariable('--text-color'),
	primaryColor: getCssVariable('--primary-color'),
	secondaryColor: getCssVariable('--secondary-color'),
	dangerColor: getCssVariable('--danger-color'),
	buttonBg: getCssVariable('--button-bg'),
	buttonBgHover: getCssVariable('--button-bg-hover'),
	buttonDeleteBg: getCssVariable('--button-delete-bg'),
	buttonDeleteBgHover: getCssVariable('--button-delete-bg-hover'),
	progressBg: getCssVariable('--progress-bg'),
	scrollbarTrack: getCssVariable('--scrollbar-track'),
	scrollbarThumb: getCssVariable('--scrollbar-thumb'),
	scrollbarThumbHover: getCssVariable('--scrollbar-thumb-hover'),
});

export const usePalette = () => {
	const { theme } = useTheme();
	const [palette, setPalette] = useState(getPalette());

	useEffect(() => {
		console.log('palette: '+JSON.stringify(palette));
		setPalette(getPalette());
	}, [theme]);

	return palette;
};
