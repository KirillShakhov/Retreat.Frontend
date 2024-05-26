import { useContext } from 'react';
import {ThemeContext} from "./ThemeContext.tsx";

export const useTheme = () => useContext(ThemeContext);
