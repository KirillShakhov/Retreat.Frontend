import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './App.css'
import Torrents from "./components/torrents";
import Watch from "./components/watch/Watch.tsx";

function App() {

    return <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/torrents" replace/>}/>
            <Route path="/torrents" element={<Torrents/>}/>
            <Route path="/watch" element={<Watch/>}/>
        </Routes>
    </Router>
}

export default App
