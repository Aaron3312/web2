import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import NavBar from '../Components/NavBar';
import MovieHeader from './MovieHeader';
import MovieContent from './MovieContent';
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
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState('overview');
    
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
            // Restablecer la pestaña activa cuando cambia la película
            setActiveTab('overview');
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
                handleFavoriteToggle={handleFavoriteToggle}
                isFavorited={isFavorited}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            
            <MovieContent 
                movie={movie}
                cast={cast}
                videos={videos}
                similarMovies={similarMovies}
                activeTab={activeTab}
            />
            
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