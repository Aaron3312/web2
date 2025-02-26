// src/pages/Estrenos.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    backdrop_path: string;
}

interface UpcomingMovie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
}

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export default function Estrenos() {
    const navigate = useNavigate();
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<UpcomingMovie[]>([]);
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            
            try {
                // Fetch movies in theaters
                const nowPlayingResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=es-ES&page=1&region=ES`
                );
                
                const nowPlayingMovies = nowPlayingResponse.data.results;
                setNowPlaying(nowPlayingMovies);
                
                // Select a featured movie from now playing
                if (nowPlayingMovies.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(5, nowPlayingMovies.length));
                    const movieId = nowPlayingMovies[randomIndex].id;
                    
                    // Get detailed info for featured movie
                    const detailResponse = await axios.get(
                        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`
                    );
                    setFeaturedMovie(detailResponse.data);
                }
                
                // Fetch upcoming movies
                const upcomingResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=es-ES&page=1&region=ES`
                );
                setUpcoming(upcomingResponse.data.results);
                
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchMovies();
    }, []);
    
    // Group upcoming movies by month
    const upcomingByMonth: { [key: string]: UpcomingMovie[] } = {};
    upcoming.forEach(movie => {
        if (!movie.release_date) return;
        
        const date = new Date(movie.release_date);
        const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!upcomingByMonth[monthYear]) {
            upcomingByMonth[monthYear] = [];
        }
        
        upcomingByMonth[monthYear].push(movie);
    });
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            {isLoading ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="h-96 w-full bg-gray-800 animate-pulse mb-10 rounded-xl"></div>
                    
                    <div className="h-8 w-64 bg-gray-800 animate-pulse mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                                <div className="aspect-[2/3] bg-gray-700"></div>
                                <div className="p-3">
                                    <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="h-8 w-64 bg-gray-800 animate-pulse my-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                                <div className="aspect-[2/3] bg-gray-700"></div>
                                <div className="p-3">
                                    <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Featured Movie Hero */}
                    {featuredMovie && (
                        <div className="relative w-full h-[60vh] mb-10">
                            <div className="absolute inset-0">
                                <img 
                                    src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
                                    alt={featuredMovie.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                            </div>
                            
                            <div className="container mx-auto px-4 h-full flex items-center">
                                <div className="max-w-xl z-10">
                                    <h1 className="text-3xl md:text-5xl font-bold mb-3">{featuredMovie.title}</h1>
                                    <div className="flex items-center text-sm mb-4">
                                        <span className="bg-blue-600 px-2 py-1 rounded-md font-medium mr-3">ESTRENO</span>
                                        <span className="text-gray-300">{formatDate(featuredMovie.release_date)}</span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center text-yellow-400">
                                            <span className="mr-1">⭐</span>
                                            {featuredMovie.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 mb-6 line-clamp-3">{featuredMovie.overview}</p>
                                    <button 
                                        onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="container mx-auto px-4 py-8">
                        {/* Now Playing */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">En cines ahora</h2>
                                <button 
                                    onClick={() => navigate('/peliculas?orden=primary_release_date.desc')}
                                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                                >
                                    Ver todos
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {nowPlaying.slice(0, 5).map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        id={movie.id}
                                        title={movie.title}
                                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        rating={movie.vote_average}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Upcoming by Month */}
                        <h2 className="text-2xl font-bold mb-6">Próximos estrenos</h2>
                        
                        {Object.keys(upcomingByMonth).sort().map(month => (
                            <div key={month} className="mb-10">
                                <h3 className="text-xl font-medium mb-4 text-blue-500">{month.charAt(0).toUpperCase() + month.slice(1)}</h3>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {upcomingByMonth[month].map(movie => (
                                        <div 
                                            key={movie.id} 
                                            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                        >
                                            <div className="relative aspect-[2/3]">
                                                {movie.poster_path ? (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image+Available';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
                                                        <span className="text-sm text-center p-2">Sin imagen</span>
                                                    </div>
                                                )}
                                                
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-2">
                                                    <div className="text-xs text-white font-medium">
                                                        {formatDate(movie.release_date)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="p-3">
                                                <h4 className="font-medium truncate">{movie.title}</h4>
                                                <div className="flex items-center text-xs text-blue-500">
                                                    <span className="mr-1">📅</span>
                                                    <span>Próximamente</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {/* Footer */}
            <footer className="bg-gray-950 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p className="mb-2">Cuevana 2025 - Todos los estrenos</p>
                    <p>Este sitio no almacena ningún archivo en su servidor. Todo el contenido es proporcionado por terceros no afiliados.</p>
                </div>
            </footer>
        </div>
    );
}