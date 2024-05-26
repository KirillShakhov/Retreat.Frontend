import {
    MemoryRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './App.css'
import Torrents from "./components/torrents/Torrents.tsx";

function App() {
    return <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/torrents"/>}/>
            <Route path="/torrents" element={<Torrents/>}/>
        </Routes>
    </Router>
}

export default App
