// NavBar.tsx estilo Cuevana
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import MovieCard from './MovieCard';
import { AuthContext } from "../context/AuthContext";
import { useFavorites } from '../context/FavoritesContext';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average?: number; // Hacemos que vote_average sea opcional
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

export default function NavBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const { user, logout } = useContext(AuthContext);

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        }

        // Add scroll listener
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // Add event listeners
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [searchRef]);

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
        setIsMobileMenuOpen(false);
    }

    function handleLogin(event: React.MouseEvent) {
        event.preventDefault();
        navigate(`/login`);
        setIsMobileMenuOpen(false);
    }

    function handleLogout(event: React.MouseEvent) {
        event.preventDefault();
        logout();
        navigate(`/`);
        setIsMobileMenuOpen(false);
    }

    // Función auxiliar para formatear ratings de manera segura
    const formatRating = (rating?: number) => {
        // Si el rating no existe o no es un número, devolvemos "N/A"
        if (rating === undefined || rating === null || isNaN(rating)) {
            return "N/A";
        }
        // Si el rating existe, lo formateamos a un decimal
        return rating.toFixed(1);
    };

    return (
        <div className="flex flex-col w-full">
            <nav className={`bg-gray-900 text-white w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-lg py-2' : 'py-4'} ${isMobileMenuOpen ? 'relative' : 'sticky top-0'}`}>
                <div className="container mx-auto px-4">
                    {/* Top Navigation Bar */}
                    <div className="flex items-center justify-between">
                        {/* Logo de Cuevana estilo original */}
                        <Link to="/" className="text-2xl font-bold flex items-center">
                            <div className="mr-2 relative">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full absolute" style={{ top: '35%', left: '35%' }}></div>
                                    <div className="w-6 h-6 border-4 border-white rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-blue-500 font-extrabold tracking-wide">CUEVANA by Aaron</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link>
                            <Link to="/peliculas" className="text-gray-300 hover:text-white transition-colors">Películas</Link>
                            <Link to="/series" className="text-gray-300 hover:text-white transition-colors">Series</Link>
                            <Link to="/estrenos" className="text-gray-300 hover:text-white transition-colors">Estrenos</Link>
                            {user && (
                                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Mi Cuevana</Link>
                            )}
                        </div>

                        {/* Right section: Search, Favorites, Auth */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative" ref={searchRef}>
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchExpanded(true)}
                                        placeholder="Buscar..."
                                        className={`bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-300 ${isSearchExpanded ? 'w-60' : 'w-32 md:w-40'}`}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </form>

                                {/* Search results dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute mt-2 w-full md:w-80 right-0 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-50 max-h-96 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                                            <h3 className="font-medium">Resultados</h3>
                                            <button 
                                                onClick={() => setSearchResults([])}
                                                className="text-gray-500 hover:text-gray-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        {isLoading ? (
                                            <div className="text-center py-8">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                            </div>
                                        ) : error ? (
                                            <div className="text-center text-red-500 p-4">{error}</div>
                                        ) : (
                                            <div className="p-2">
                                                {searchResults.map((movie) => (
                                                    <div 
                                                        key={movie.id} 
                                                        className="flex p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            navigate(`/movie/${movie.id}`);
                                                            setSearchResults([]);
                                                        }}
                                                    >
                                                        <div className="flex-shrink-0 w-12 h-16 bg-gray-800 rounded overflow-hidden">
                                                            {movie.poster_path ? (
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                                                    alt={movie.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="font-medium line-clamp-1">{movie.title}</h4>
                                                            <div className="flex items-center text-xs text-yellow-500">
                                                                <span className="mr-1">⭐</span>
                                                                <span>{formatRating(movie.vote_average)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                <div 
                                                    className="mt-2 py-2 text-center text-sm text-blue-500 hover:text-blue-400 cursor-pointer border-t border-gray-800"
                                                    onClick={() => {
                                                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                        setSearchResults([]);
                                                    }}
                                                >
                                                    Ver todos los resultados
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Favorites */}
                            {user && (
                                <Link 
                                    to="/favorites" 
                                    className="hidden md:flex items-center hover:text-yellow-400 transition-colors relative"
                                >
                                    <span className="text-xl">⭐</span>
                                    {favorites && favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Auth Buttons - Desktop */}
                            <div className="hidden md:block">
                                {user ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="text-sm text-gray-300 truncate max-w-[120px]">{user.email}</div>
                                        <button 
                                            onClick={handleLogout}
                                            className="bg-red-600 hover:bg-red-700 py-1.5 px-3 rounded-full text-sm transition-colors"
                                        >
                                            Salir
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={handleLogin}
                                            className="bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-full text-sm transition-colors"
                                        >
                                            Ingresar
                                        </button>
                                        <button 
                                            onClick={handleSignup}
                                            className="bg-gray-700 hover:bg-gray-600 py-1.5 px-3 rounded-full text-sm transition-colors"
                                        >
                                            Registro
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button 
                                className="md:hidden text-gray-300 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 py-4 border-t border-gray-800 space-y-4">
                            <div className="space-y-2">
                                <Link to="/" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
                                <Link to="/peliculas" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Películas</Link>
                                <Link to="/series" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Series</Link>
                                <Link to="/estrenos" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Estrenos</Link>
                                {user && (
                                    <>
                                        <Link to="/dashboard" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mi Cuevana</Link>
                                        <Link to="/favorites" className="block py-2 text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                            Mis Favoritos
                                            {favorites && favorites.length > 0 && (
                                                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                                                    {favorites.length}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Auth buttons - Mobile */}
                            <div className="pt-2 border-t border-gray-800">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-300">{user.email}</div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <button 
                                            onClick={handleLogin}
                                            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Iniciar sesión
                                        </button>
                                        <button 
                                            onClick={handleSignup}
                                            className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}