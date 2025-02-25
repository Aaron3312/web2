// src/pages/Series.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';

interface Series {
    id: number;
    name: string;
    poster_path: string;
    vote_average: number;
    first_air_date: string;
    genre_ids: number[];
}

interface Genre {
    id: number;
    name: string;
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

// Componente SeriesCard adaptado para series
function SeriesCard({ id, title, poster, rating }: { id: number; title: string; poster: string; rating: number }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/series/${id}`);
    };

    // Fallback poster en caso de error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image+Available';
    };

    // Formatear el rating a un decimal
    const formattedRating = Number(rating).toFixed(1);

    // Determinar el color del rating basado en su valor
    const getRatingColor = () => {
        if (rating >= 8) return 'bg-green-600';
        if (rating >= 6) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    return (
        <div
            className="relative overflow-hidden bg-gray-900 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer hover:scale-105"
            onClick={handleClick}
        >
            {/* Badge de rating */}
            <div className={`absolute top-2 right-2 ${getRatingColor()} text-white text-sm font-bold rounded-full h-9 w-9 flex items-center justify-center z-20 shadow-md`}>
                {formattedRating}
            </div>
            
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                    src={poster} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            </div>
            
            {/* Info visible siempre */}
            <div className="p-3">
                <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
                <div className="flex items-center text-yellow-400">
                    <span className="mr-1">⭐</span>
                    <span className="text-sm text-gray-300">{formattedRating}</span>
                </div>
            </div>
        </div>
    );
}

export default function Series() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [series, setSeries] = useState<Series[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(
        searchParams.get('genero') ? Number(searchParams.get('genero')) : null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(searchParams.get('orden') || 'popularity.desc');
    const [networkFilter, setNetworkFilter] = useState(searchParams.get('network') || '');
    
    const networks = [
        { id: 213, name: 'Netflix' },
        { id: 1024, name: 'Amazon' },
        { id: 2552, name: 'Apple TV+' },
        { id: 49, name: 'HBO' },
        { id: 67, name: 'Showtime' },
        { id: 337, name: 'Disney+' },
        { id: 4330, name: 'Paramount+' },
        { id: 2739, name: 'Disney+ Hotstar' },
        { id: 359, name: 'Cinemax' },
        { id: 174, name: 'AMC' },
        { id: 19, name: 'FOX' },
        { id: 6, name: 'NBC' },
        { id: 2, name: 'ABC' },
        { id: 4, name: 'BBC' }
    ];
    
    // Obtener géneros al cargar la página
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=es-ES`
                );
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        
        fetchGenres();
    }, []);
    
    // Obtener series según los filtros seleccionados
    useEffect(() => {
        const fetchSeries = async () => {
            setIsLoading(true);
            
            let endpoint = 'discover/tv';
            let params = `api_key=${TMDB_API_KEY}&language=es-ES&page=${currentPage}&sort_by=${sortBy}`;
            
            if (selectedGenre) {
                params += `&with_genres=${selectedGenre}`;
            }
            
            if (networkFilter) {
                params += `&with_networks=${networkFilter}`;
            }
            
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/${endpoint}?${params}`
                );
                setSeries(response.data.results);
                setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
            } catch (error) {
                console.error('Error fetching series:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSeries();
        
        // Actualizar la URL con los parámetros de búsqueda
        const params: { [key: string]: string } = {};
        if (selectedGenre) params.genero = selectedGenre.toString();
        if (sortBy) params.orden = sortBy;
        if (networkFilter) params.network = networkFilter;
        setSearchParams(params);
        
    }, [currentPage, selectedGenre, sortBy, networkFilter, setSearchParams]);
    
    const handleGenreChange = (genreId: number) => {
        setSelectedGenre(genreId === selectedGenre ? null : genreId);
        setCurrentPage(1); // Reiniciar a la primera página al cambiar de género
    };
    
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };
    
    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNetworkFilter(e.target.value);
        setCurrentPage(1);
    };
    
    const getGenreName = (id: number) => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : '';
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Series</h1>
                        <p className="text-gray-400 mt-1">
                            Explora nuestra colección de series
                            {selectedGenre && genres.length > 0 && (
                                <span> de {getGenreName(selectedGenre)}</span>
                            )}
                            {networkFilter && (
                                <span> en {networks.find(n => n.id.toString() === networkFilter)?.name || ''}</span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        {/* Selector de plataforma */}
                        <select 
                            value={networkFilter}
                            onChange={handleNetworkChange}
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Todas las plataformas</option>
                            {networks.map(network => (
                                <option key={network.id} value={network.id}>
                                    {network.name}
                                </option>
                            ))}
                        </select>
                        
                        {/* Selector de orden */}
                        <select 
                            value={sortBy}
                            onChange={handleSortChange}
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="popularity.desc">Más populares</option>
                            <option value="vote_average.desc">Mejor valoradas</option>
                            <option value="first_air_date.desc">Más recientes</option>
                            <option value="name.asc">Título A-Z</option>
                        </select>
                    </div>
                </div>
                
                {/* Géneros */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex space-x-2">
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreChange(genre.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
                                    selectedGenre === genre.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Series */}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {series.map(show => (
                                <SeriesCard
                                    key={show.id}
                                    id={show.id}
                                    title={show.name}
                                    poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                    rating={show.vote_average}
                                />
                            ))}
                        </div>
                        
                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10">
                                <div className="flex items-center space-x-1">
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
                                    
                                    {/* Páginas cercanas */}
                                    {[...Array(5)].map((_, i) => {
                                        const pageNum = currentPage - 2 + i;
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
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-950 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p className="mb-2">Cuevana 2025 - Todas las series</p>
                    <p>Este sitio no almacena ningún archivo en su servidor. Todo el contenido es proporcionado por terceros no afiliados.</p>
                </div>
            </footer>
        </div>
    );
}