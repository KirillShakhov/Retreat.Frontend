import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "./utils/themes/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<App/>
		</ThemeProvider>
		<ToastContainer newestOnTop={true}/>
	</React.StrictMode>,
)
