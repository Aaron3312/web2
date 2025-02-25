// App.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites'; // New Favorites page
import { FavoritesProvider } from './context/FavoritesContext'; // Import the provider

export default function App() {
    return (
        <FavoritesProvider>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </div>
        </FavoritesProvider>
    );
}