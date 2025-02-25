// NavBar.tsx con autenticación
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import MovieCard from './MovieCard';
import { AuthContext } from "../context/AuthContext";
import { useFavorites } from '../context/FavoritesContext';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

export default function NavBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const { user, logout } = useContext(AuthContext);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setSearchResults(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
            setError('Failed to search movies. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    function handleSignup(event: React.MouseEvent) {
        event.preventDefault();
        navigate(`/signup`);
    }

    function handleLogin(event: React.MouseEvent) {
        event.preventDefault();
        navigate(`/login`);
    }

    function handleLogout(event: React.MouseEvent) {
        event.preventDefault();
        logout();
        navigate(`/`);
    }

    return (
        <div className="flex flex-col w-full">
            <nav className="bg-gray-800 text-white p-4 w-full">
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Autenticación */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm">{user.email}</span>
                                
                                {/* Favoritos */}
                                <Link 
                                    to="/favorites" 
                                    className="flex items-center hover:text-yellow-300"
                                >
                                    <span className="text-xl mr-1">⭐</span>
                                    <span className="bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                                        {favorites.length}
                                    </span>
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <button 
                                    onClick={handleSignup}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                                >
                                    Registrarse
                                </button>
                                <button 
                                    onClick={handleLogin}
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSearch} className="flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies..."
                                className="px-4 py-2 rounded-l text-black focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Search Results */}
            {(searchQuery || searchResults.length > 0) && (
                <div className="container mx-auto p-4">
                    {isLoading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center">No movies found</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {searchResults.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    title={movie.title}
                                    poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    rating={movie.vote_average}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}