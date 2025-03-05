// src/pages/Search.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import MovieCard from '../Components/MovieCard';
import axios from 'axios';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
    media_type?: string;
}

interface Person {
    id: number;
    name: string;
    profile_path: string;
    known_for_department: string;
    known_for?: Movie[];
}

interface SearchResults {
    movies: Movie[];
    people: Person[];
    total_movies: number;
    total_people: number;
    total_results: number;
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [activeTab, setActiveTab] = useState('movies');
    const [results, setResults] = useState<SearchResults>({
        movies: [],
        people: [],
        total_movies: 0,
        total_people: 0,
        total_results: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState(query);

    // Formato seguro para ratings
    const formatRating = (rating?: number) => {
        if (rating === undefined || rating === null || isNaN(rating)) {
            return "N/A";
        }
        return rating.toFixed(1);
    };

    // Formato de fecha
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Fecha desconocida';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    useEffect(() => {
        if (!query) return;
        
        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Buscar películas
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=${currentPage}&include_adult=false`
                );
                
                // Buscar personas (actores, directores, etc.)
                const peopleResponse = await axios.get(
                    `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1&include_adult=false`
                );
                
                // Buscar resultados múltiples (películas, series, personas)
                const multiResponse = await axios.get(
                    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1&include_adult=false`
                );
                
                setResults({
                    movies: movieResponse.data.results,
                    people: peopleResponse.data.results,
                    total_movies: movieResponse.data.total_results,
                    total_people: peopleResponse.data.total_results,
                    total_results: multiResponse.data.total_results
                });
                
                setTotalPages(movieResponse.data.total_pages > 500 ? 500 : movieResponse.data.total_pages);
                
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Ocurrió un error al buscar. Por favor intenta nuevamente.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchResults();
    }, [query, currentPage]);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setCurrentPage(1);
        setSearchParams({ q: searchQuery });
    };
    
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden">
            <NavBar />
            
            <div className="w-full px-4 py-8">
                {/* Barra de búsqueda principal - FIX: Se ha añadido flexibilidad para pantallas pequeñas */}
                <div className="mb-8 w-full max-w-full">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full max-w-full sm:max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar películas, actores, directores..."
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg sm:rounded-l-lg sm:rounded-r-none px-3 sm:px-5 py-3 focus:outline-none focus:border-blue-500 mb-2 sm:mb-0"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>
                
                {error ? (
                    <div className="text-center text-red-500 p-8 bg-gray-800 rounded-lg">
                        <p className="text-xl font-bold mb-2">Error</p>
                        <p>{error}</p>
                    </div>
                ) : query ? (
                    <>
                        {/* Resultados */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-1">Resultados para: "{query}"</h1>
                            <p className="text-gray-400">Se encontraron {results.total_results} resultados</p>
                        </div>
                        
                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-800">
                            <div className="flex space-x-8">
                                <button 
                                    onClick={() => handleTabChange('movies')}
                                    className={`py-3 font-medium relative ${
                                        activeTab === 'movies' 
                                            ? 'text-white' 
                                            : 'text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    Películas ({results.total_movies})
                                    {activeTab === 'movies' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={() => handleTabChange('people')}
                                    className={`py-3 font-medium relative ${
                                        activeTab === 'people' 
                                            ? 'text-white' 
                                            : 'text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    Personas ({results.total_people})
                                    {activeTab === 'people' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                                        <div className="aspect-[2/3] bg-gray-700"></div>
                                        <div className="p-3">
                                            <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Contenido de pestañas */}
                                {activeTab === 'movies' && (
                                    <>
                                        {results.movies.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-xl text-gray-400">No se encontraron películas para "{query}"</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {results.movies.map(movie => (
                                                    <MovieCard
                                                        key={movie.id}
                                                        id={movie.id}
                                                        title={movie.title}
                                                        poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                                                        rating={movie.vote_average}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {activeTab === 'people' && (
                                    <>
                                        {results.people.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-xl text-gray-400">No se encontraron personas para "{query}"</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {results.people.map(person => (
                                                    <div 
                                                        key={person.id}
                                                        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                                                        onClick={() => navigate(`/person/${person.id}`)}
                                                    >
                                                        <div className="aspect-[2/3] bg-gray-700 relative">
                                                            {person.profile_path ? (
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                                                    alt={person.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="p-3">
                                                            <h3 className="font-medium text-lg">{person.name}</h3>
                                                            <p className="text-sm text-gray-400">{person.known_for_department}</p>
                                                            
                                                            {person.known_for && person.known_for.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs text-gray-500 mb-1">Conocido por:</p>
                                                                    <div className="text-xs text-gray-400 line-clamp-2">
                                                                        {person.known_for.map((work, i) => (
                                                                            <span key={i}>
                                                                                {work.title || work.name}
                                                                                {i < person.known_for.length - 1 ? ', ' : ''}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {/* Paginación para películas - FIX: Se ha mejorado el diseño para móviles */}
                                {activeTab === 'movies' && totalPages > 1 && (
                                    <div className="flex justify-center mt-10">
                                        <div className="flex flex-wrap justify-center items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-md ${
                                                    currentPage === 1
                                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                Anterior
                                            </button>
                                            
                                            {/* Primera página */}
                                            {currentPage > 3 && (
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                                                >
                                                    1
                                                </button>
                                            )}
                                            
                                            {/* Puntos suspensivos */}
                                            {currentPage > 4 && (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            )}
                                            
                                            {/* Páginas cercanas - FIX: Se ha reducido la cantidad de páginas visibles en móviles */}
                                            {[...Array(window.innerWidth < 640 ? 3 : 5)].map((_, i) => {
                                                const offset = window.innerWidth < 640 ? 1 : 2;
                                                const pageNum = currentPage - offset + i;
                                                if (pageNum > 0 && pageNum <= totalPages) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`px-4 py-2 rounded-md ${
                                                                currentPage === pageNum
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}
                                            
                                            {/* Puntos suspensivos */}
                                            {currentPage < totalPages - 3 && (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            )}
                                            
                                            {/* Última página */}
                                            {currentPage < totalPages - 2 && (
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                                                >
                                                    {totalPages}
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-md ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-3">Buscar contenido</h2>
                        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                            Ingresa un término de búsqueda para encontrar películas, actores, directores y más.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
                            <div 
                                className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-750 transition-colors max-w-xs w-full mx-auto sm:mx-0"
                                onClick={() => navigate('/peliculas')}
                            >
                                <div className="text-4xl mb-3">🎬</div>
                                <h3 className="text-lg font-medium mb-2">Explorar películas</h3>
                                <p className="text-sm text-gray-400">
                                    Explora las películas más populares y recientes
                                </p>
                            </div>
                            <div 
                                className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-750 transition-colors max-w-xs w-full mx-auto sm:mx-0"
                                onClick={() => navigate('/series')}
                            >
                                <div className="text-4xl mb-3">📺</div>
                                <h3 className="text-lg font-medium mb-2">Explorar series</h3>
                                <p className="text-sm text-gray-400">
                                    Descubre las series más populares del momento
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-950 py-8 mt-auto">
                <div className="w-full px-4 text-center text-gray-400">
                    <p className="mb-2">Cuevana 2025 - Buscar</p>
                    <p>Este sitio no almacena ningún archivo en su servidor. Todo el contenido es proporcionado por terceros no afiliados.</p>
                </div>
            </footer>
        </div>
    );
}