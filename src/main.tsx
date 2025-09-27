import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import {UserProvider} from "./context/UserContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</ThemeProvider>
		<ToastContainer newestOnTop={true} />
	</React.StrictMode>,
)
