// MovieDetails.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import NavBar from '../Components/NavBar';
import axios from 'axios';

interface MovieDetail {
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

interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface Video {
    key: string;
    name: string;
    type: string;
    site: string;
}

interface SimilarMovie {
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
    const [activeTab, setActiveTab] = useState('overview');
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            {/* Full-width backdrop */}
            <div className="relative">
                <div className="w-full h-[80vh] lg:h-[70vh]">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/1440x800?text=No+Backdrop+Available';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                </div>
                
                {/* Play trailer button (if videos exist) */}
                {videos.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <button
                            className="bg-red-600 bg-opacity-90 hover:bg-opacity-100 rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            onClick={() => {
                                // Create modal with trailer
                                const modal = document.createElement('div');
                                modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                                modal.innerHTML = `
                                    <div class="relative w-full max-w-4xl mx-4">
                                        <div class="absolute top-0 right-0 m-4">
                                            <button class="bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="aspect-video w-full">
                                            <iframe 
                                                width="100%" 
                                                height="100%" 
                                                src="https://www.youtube.com/embed/${videos[0].key}?autoplay=1" 
                                                title="YouTube video player" 
                                                frameborder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowfullscreen
                                            ></iframe>
                                        </div>
                                    </div>
                                `;
                                document.body.appendChild(modal);
                                
                                // Close button functionality
                                const closeButton = modal.querySelector('button');
                                closeButton?.addEventListener('click', () => {
                                    document.body.removeChild(modal);
                                });
                                
                                // Close on background click
                                modal.addEventListener('click', (e) => {
                                    if (e.target === modal) {
                                        document.body.removeChild(modal);
                                    }
                                });
                            }}
                        >
                            <span className="sr-only">Ver trailer</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="container mx-auto p-4 -mt-40 relative z-10">
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Poster and actions */}
                            <div className="md:w-1/3 lg:w-1/4">
                                <div className="rounded-xl overflow-hidden shadow-lg transform -translate-y-16 border-4 border-gray-800">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                                        }}
                                    />
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    {/* Favorite button */}
                                    <button 
                                        onClick={handleFavoriteToggle}
                                        className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors font-medium text-sm ${
                                            isFavorited 
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        <span className="mr-2 text-lg">
                                            {isFavorited ? '⭐' : '☆'}
                                        </span>
                                        {isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                    </button>
                                    
                                    {/* Watch trailer button - mobile only */}
                                    {videos.length > 0 && (
                                        <button
                                            onClick={() => {
                                                // Create modal with trailer
                                                const modal = document.createElement('div');
                                                modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                                                modal.innerHTML = `
                                                    <div class="relative w-full max-w-4xl mx-4">
                                                        <div class="absolute top-0 right-0 m-4">
                                                            <button class="bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div class="aspect-video w-full">
                                                            <iframe 
                                                                width="100%" 
                                                                height="100%" 
                                                                src="https://www.youtube.com/embed/${videos[0].key}?autoplay=1" 
                                                                title="YouTube video player" 
                                                                frameborder="0" 
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                allowfullscreen
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                `;
                                                document.body.appendChild(modal);
                                                
                                                // Close button functionality
                                                const closeButton = modal.querySelector('button');
                                                closeButton?.addEventListener('click', () => {
                                                    document.body.removeChild(modal);
                                                });
                                                
                                                // Close on background click
                                                modal.addEventListener('click', (e) => {
                                                    if (e.target === modal) {
                                                        document.body.removeChild(modal);
                                                    }
                                                });
                                            }}
                                            className="md:hidden w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors font-medium text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                            Ver trailer
                                        </button>
                                    )}
                                </div>
                                
                                {/* Movie info box */}
                                <div className="mt-6 bg-gray-900 rounded-xl p-5 space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Estado</span>
                                        <p className="font-medium">{movie.status || 'N/A'}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-gray-400 text-sm">Fecha de estreno</span>
                                        <p className="font-medium">{new Date(movie.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-gray-400 text-sm">Duración</span>
                                        <p className="font-medium">{movie.runtime} minutos</p>
                                    </div>
                                    
                                    {movie.budget > 0 && (
                                        <div>
                                            <span className="text-gray-400 text-sm">Presupuesto</span>
                                            <p className="font-medium">{formatCurrency(movie.budget)}</p>
                                        </div>
                                    )}
                                    
                                    {movie.revenue > 0 && (
                                        <div>
                                            <span className="text-gray-400 text-sm">Recaudación</span>
                                            <p className="font-medium">{formatCurrency(movie.revenue)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="md:w-2/3 lg:w-3/4">
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                                
                                {movie.tagline && (
                                    <p className="text-gray-400 text-xl italic mb-4">{movie.tagline}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <div className="flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full font-medium">
                                        <span className="mr-1">⭐</span>
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                    
                                    <span className="text-gray-400">•</span>
                                    
                                    <span className="text-gray-300">
                                        {new Date(movie.release_date).getFullYear()}
                                    </span>
                                    
                                    <span className="text-gray-400">•</span>
                                    
                                    <span className="text-gray-300">
                                        {movie.runtime} min
                                    </span>
                                </div>

                                <div className="mb-6 flex flex-wrap gap-2">
                                    {movie.genres.map(genre => (
                                        <span
                                            key={genre.id}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-full text-sm"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Tabs */}
                                <div className="mb-6 border-b border-gray-700">
                                    <div className="flex space-x-6">
                                        <button 
                                            onClick={() => setActiveTab('overview')}
                                            className={`py-3 font-medium relative ${
                                                activeTab === 'overview' 
                                                    ? 'text-white' 
                                                    : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                        >
                                            Sinopsis
                                            {activeTab === 'overview' && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                                            )}
                                        </button>
                                        
                                        <button 
                                            onClick={() => setActiveTab('cast')}
                                            className={`py-3 font-medium relative ${
                                                activeTab === 'cast' 
                                                    ? 'text-white' 
                                                    : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                        >
                                            Reparto
                                            {activeTab === 'cast' && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                                            )}
                                        </button>
                                        
                                        {videos.length > 0 && (
                                            <button 
                                                onClick={() => setActiveTab('videos')}
                                                className={`py-3 font-medium relative ${
                                                    activeTab === 'videos' 
                                                        ? 'text-white' 
                                                        : 'text-gray-400 hover:text-gray-300'
                                                }`}
                                            >
                                                Videos
                                                {activeTab === 'videos' && (
                                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Tab content */}
                                <div className="min-h-[200px]">
                                    {/* Overview tab */}
                                    {activeTab === 'overview' && (
                                        <div>
                                            <p className="text-gray-300 leading-relaxed text-lg">
                                                {movie.overview || 'No hay sinopsis disponible para esta película.'}
                                            </p>
                                            
                                            {movie.production_companies && movie.production_companies.length > 0 && (
                                                <div className="mt-8">
                                                    <h3 className="text-lg font-medium mb-3">Productoras</h3>
                                                    <div className="flex flex-wrap gap-6">
                                                        {movie.production_companies.map(company => (
                                                            <div key={company.name} className="text-center">
                                                                {company.logo_path ? (
                                                                    <img 
                                                                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                                        alt={company.name}
                                                                        className="h-10 object-contain bg-gray-900 rounded p-1"
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 bg-gray-900 rounded p-2 flex items-center justify-center">
                                                                        <span>{company.name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Cast tab */}
                                    {activeTab === 'cast' && (
                                        <div>
                                            {cast.length > 0 ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {cast.map(person => (
                                                        <div key={person.id} className="bg-gray-900 rounded-lg overflow-hidden">
                                                            <div className="aspect-[2/3] bg-gray-800">
                                                                {person.profile_path ? (
                                                                    <img 
                                                                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                                                        alt={person.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-3">
                                                                <h4 className="font-medium truncate">{person.name}</h4>
                                                                <p className="text-sm text-gray-400 truncate">{person.character}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">No hay información de reparto disponible.</p>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Videos tab */}
                                    {activeTab === 'videos' && (
                                        <div>
                                            {videos.length > 0 ? (
                                                <div>
                                                    {/* Reproductor principal para el primer video */}
                                                    <div className="mb-6">
                                                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                                                            <iframe 
                                                                width="100%" 
                                                                height="100%" 
                                                                src={`https://www.youtube.com/embed/${videos[0].key}`}
                                                                title={videos[0].name}
                                                                frameBorder="0" 
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                allowFullScreen
                                                                className="w-full h-full"
                                                            ></iframe>
                                                        </div>
                                                        <h3 className="mt-2 font-medium text-lg">{videos[0].name}</h3>
                                                        <p className="text-sm text-gray-400">{videos[0].type}</p>
                                                    </div>
                                                    
                                                    {/* Lista de videos adicionales */}
                                                    {videos.length > 1 && (
                                                        <div>
                                                            <h3 className="text-lg font-medium mb-3">Más videos</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {videos.slice(1).map(video => (
                                                                    <div 
                                                                        key={video.key}
                                                                        onClick={() => {
                                                                            // Create modal with trailer
                                                                            const modal = document.createElement('div');
                                                                            modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                                                                            modal.innerHTML = `
                                                                                <div class="relative w-full max-w-4xl mx-4">
                                                                                    <div class="absolute top-0 right-0 m-4">
                                                                                        <button class="bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div class="aspect-video w-full">
                                                                                        <iframe 
                                                                                            width="100%" 
                                                                                            height="100%" 
                                                                                            src="https://www.youtube.com/embed/${video.key}?autoplay=1" 
                                                                                            title="YouTube video player" 
                                                                                            frameborder="0" 
                                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                                            allowfullscreen
                                                                                        ></iframe>
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                                                            document.body.appendChild(modal);
                                                                            
                                                                            // Close button functionality
                                                                            const closeButton = modal.querySelector('button');
                                                                            closeButton?.addEventListener('click', () => {
                                                                                document.body.removeChild(modal);
                                                                            });
                                                                            
                                                                            // Close on background click
                                                                            modal.addEventListener('click', (e) => {
                                                                                if (e.target === modal) {
                                                                                    document.body.removeChild(modal);
                                                                                }
                                                                            });
                                                                        }}
                                                                        className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
                                                                    >
                                                                        <div className="aspect-video relative">
                                                                            <img 
                                                                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                                                                alt={video.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all">
                                                                                <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-3">
                                                                            <h4 className="font-medium line-clamp-1">{video.name}</h4>
                                                                            <p className="text-sm text-gray-400">{video.type}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">No hay videos disponibles.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Similar movies section */}
                {similarMovies.length > 0 && (
                    <div className="mt-12 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Películas similares</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {similarMovies.map(similar => (
                                <a 
                                    key={similar.id}
                                    href={`/movie/${similar.id}`}
                                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                                >
                                    <div className="aspect-[2/3]">
                                        {similar.poster_path ? (
                                            <img 
                                                src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                                                alt={similar.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                                                <span className="text-sm text-center p-2">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <h4 className="font-medium truncate text-sm">{similar.title}</h4>
                                        <div className="flex items-center text-yellow-500 text-sm">
                                            <span className="mr-1">⭐</span>
                                            <span>{similar.vote_average.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
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