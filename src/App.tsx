import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Peliculas from './pages/Peliculas';
import Series from './pages/Series';
import Estrenos from './pages/Estrenos';
import Search from './pages/Search'; // Importar la nueva página de búsqueda
import ProtectedRoute from './Components/ProtectedRoute';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ReviewsProvider } from './context/ReviewsContext';

export default function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <FavoritesProvider>
                    <ReviewsProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="/movie/:id" element={<MovieDetails />} />
                            <Route path="/favorites" element={
                                <ProtectedRoute>
                                    <Favorites />
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            
                            {/* Rutas de contenido */}
                            <Route path="/peliculas" element={<Peliculas />} />
                            <Route path="/series" element={<Series />} />
                            <Route path="/estrenos" element={<Estrenos />} />
                            
                            {/* Ruta de búsqueda */}
                            <Route path="/search" element={<Search />} />
                        </Routes>
                    </ReviewsProvider>
                </FavoritesProvider>
            </UserProvider>
        </AuthProvider>
    );
}