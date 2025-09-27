import { useContext } from 'react';
import {ThemeContext} from "../../context/ThemeContext.tsx";

export const useTheme = () => useContext(ThemeContext);
