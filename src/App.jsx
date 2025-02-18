// App.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
        </div>
    );
}