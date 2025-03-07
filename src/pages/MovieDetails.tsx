import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import NavBar from '../Components/NavBar';
import MovieHeader from './MovieHeader';
import axios from 'axios';

export interface MovieDetail {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
    genres: Array<{ id: number; name: string }>;
    runtime: number;
    backdrop_path: string;
    tagline?: string;
    status?: string;
    budget?: number;
    revenue?: number;
    spoken_languages?: Array<{ english_name: string }>;
    production_companies?: Array<{ name: string; logo_path: string }>;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    key: string;
    name: string;
    type: string;
    site: string;
}

export interface SimilarMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get favorites functions from context
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

    useEffect(() => {
        const fetchMovieData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch movie details
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
                );
                setMovie(movieResponse.data);
                
                // Fetch cast information
                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
                );
                setCast(creditsResponse.data.cast.slice(0, 10));
                
                // Fetch videos (trailers, etc.)
                const videosResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}`
                );
                setVideos(videosResponse.data.results.filter(
                    (video: Video) => video.site === 'YouTube' && 
                    (video.type === 'Trailer' || video.type === 'Teaser')
                ).slice(0, 3));
                
                // Fetch similar movies
                const similarResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}`
                );
                setSimilarMovies(similarResponse.data.results.slice(0, 6));
                
            } catch (err) {
                console.error('Error fetching movie data:', err);
                setError('Error fetching movie details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchMovieData();
        }
    }, [id, TMDB_API_KEY]);

    // Check if movie is in favorites
    const isFavorited = movie ? isFavorite(movie.id) : false;

    // Handle toggling favorites
    const handleFavoriteToggle = () => {
        if (!movie) return;
        
        if (isFavorited) {
            removeFavorite(movie.id);
        } else {
            addFavorite({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <NavBar />
                <div className="h-96 w-full bg-gray-800 animate-pulse"></div>
                <div className="container mx-auto p-4 -mt-24 relative z-10">
                    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3 h-96 bg-gray-700 rounded-lg"></div>
                            <div className="md:w-2/3">
                                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
                                <div className="h-32 bg-gray-700 rounded mb-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <NavBar />
                <div className="container mx-auto p-4 flex items-center justify-center flex-grow">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center">
                        <div className="text-red-500 text-5xl mb-4">😕</div>
                        <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
                        <p className="text-gray-400 mb-6">{error || 'No se pudo encontrar la película'}</p>
                        <button 
                            onClick={() => window.history.back()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        >
                            Volver atrás
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            <MovieHeader 
                movie={movie} 
                videos={videos}
                cast={cast}
                similarMovies={similarMovies}
                handleFavoriteToggle={handleFavoriteToggle}
                isFavorited={isFavorited}
            />
            
            {/* Similar Movies Section - Separado y abajo */}
            {similarMovies.length > 0 && (
                <div className="container mx-auto p-6 mt-8">
                    <div className="bg-gray-800 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-6">Películas similares</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {similarMovies.map(movie => (
                                <div 
                                    key={movie.id} 
                                    className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => {
                                        // Enfoque directo: usar la ruta específica con el prefijo conocido
                                        navigate(`/movie/${movie.id}`);
                                        
                                        // Información de depuración
                                        console.log("Navegando a película:", movie.id);
                                        console.log("Ruta actual:", location.pathname);
                                    }}
                                >
                                    <div className="aspect-[2/3] bg-gray-700">
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400">
                                                <span>No imagen</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                                        </div>
                                        <h3 className="font-medium text-sm text-white line-clamp-2">{movie.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Back to top button */}
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
}