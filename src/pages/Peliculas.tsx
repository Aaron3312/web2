// src/pages/Peliculas.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import MovieCard from '../Components/MovieCard';
import axios from 'axios';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

interface Genre {
    id: number;
    name: string;
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

export default function Peliculas() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(
        searchParams.get('genero') ? Number(searchParams.get('genero')) : null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(searchParams.get('orden') || 'popularity.desc');
    const [year, setYear] = useState(searchParams.get('año') || '');
    
    // Obtener géneros al cargar la página
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`
                );
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        
        fetchGenres();
    }, []);
    
    // Obtener películas según los filtros seleccionados
    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            
            let endpoint = 'discover/movie';
            let params = `api_key=${TMDB_API_KEY}&language=es-ES&page=${currentPage}&sort_by=${sortBy}`;
            
            if (selectedGenre) {
                params += `&with_genres=${selectedGenre}`;
            }
            
            if (year) {
                params += `&primary_release_year=${year}`;
            }
            
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/${endpoint}?${params}`
                );
                setMovies(response.data.results);
                setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchMovies();
        
        // Actualizar la URL con los parámetros de búsqueda
        const params: { [key: string]: string } = {};
        if (selectedGenre) params.genero = selectedGenre.toString();
        if (sortBy) params.orden = sortBy;
        if (year) params.año = year;
        setSearchParams(params);
        
    }, [currentPage, selectedGenre, sortBy, year, setSearchParams]);
    
    const handleGenreChange = (genreId: number) => {
        setSelectedGenre(genreId === selectedGenre ? null : genreId);
        setCurrentPage(1); // Reiniciar a la primera página al cambiar de género
    };
    
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };
    
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(e.target.value);
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
                        <h1 className="text-3xl font-bold">Películas</h1>
                        <p className="text-gray-400 mt-1">
                            Explora nuestra colección de películas
                            {selectedGenre && genres.length > 0 && (
                                <span> de {getGenreName(selectedGenre)}</span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        {/* Selector de año */}
                        <select 
                            value={year}
                            onChange={handleYearChange}
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Todos los años</option>
                            {[...Array(30)].map((_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                        
                        {/* Selector de orden */}
                        <select 
                            value={sortBy}
                            onChange={handleSortChange}
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="popularity.desc">Más populares</option>
                            <option value="vote_average.desc">Mejor valoradas</option>
                            <option value="primary_release_date.desc">Más recientes</option>
                            <option value="revenue.desc">Más taquilleras</option>
                            <option value="title.asc">Título A-Z</option>
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
                
                {/* Películas */}
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
                            {movies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    title={movie.title}
                                    poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    rating={movie.vote_average}
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
                    <p className="mb-2">Cuevana 2025 - Todas las películas</p>
                    <p>Este sitio no almacena ningún archivo en su servidor. Todo el contenido es proporcionado por terceros no afiliados.</p>
                </div>
            </footer>
        </div>
    );
}