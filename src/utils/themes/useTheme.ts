import { useContext } from 'react';
import {ThemeContext} from "../../contexts/ThemeContext.tsx";

export const useTheme = () => useContext(ThemeContext);
