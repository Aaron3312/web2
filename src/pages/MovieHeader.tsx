import { MovieDetail, Video, Cast, SimilarMovie } from './MovieDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebase';
import MovieReviews from './MovieReviews';

interface MovieHeaderProps {
    movie: MovieDetail;
    videos: Video[];
    cast: Cast[];
    similarMovies: SimilarMovie[];
    handleFavoriteToggle: () => void;
    isFavorited: boolean;
}

export default function MovieHeader({ 
    movie, 
    videos, 
    cast,
    similarMovies,
    handleFavoriteToggle, 
    isFavorited
}: MovieHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);
    const [isProcessing, setIsProcessing] = useState(false);
    const processingRef = useRef(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Efecto para sincronizar el estado local con las props
    useEffect(() => {
        setLocalIsFavorited(isFavorited);
    }, [isFavorited]);

    const createTrailerModal = (videoKey: string) => {
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
                        src="https://www.youtube.com/embed/${videoKey}?autoplay=1" 
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
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Nueva función para manejar el clic en el botón de favoritos usando transacciones
    const handleFavoriteClick = async () => {
        // Prevenir múltiples clicks
        if (isProcessing || processingRef.current) return;
        
        // Comprobar si el usuario está autenticado
        if (!user) {
            // Si no está autenticado, redirigir a la página de login con redirect
            navigate(`/login?redirect=${location.pathname}`);
            return;
        }

        // Activar flag de procesamiento
        setIsProcessing(true);
        processingRef.current = true;

        try {
            const userRef = doc(db, "users", user.uid);
            
            // Usar transacción para garantizar operaciones atómicas
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                
                if (!userDoc.exists()) {
                    throw new Error("El documento del usuario no existe");
                }
                
                const userData = userDoc.data();
                const currentFavorites = userData.favorites || [];
                
                // Comprobar si la película ya está en favoritos
                const movieIndex = currentFavorites.findIndex(fav => fav.id === movie.id);
                const isAlreadyFavorited = movieIndex !== -1;
                
                // Crear la nueva lista de favoritos
                let updatedFavorites;
                
                if (!isAlreadyFavorited) {
                    // Añadir la película a favoritos
                    const movieData = {
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                        overview: movie.overview,
                        backdrop_path: movie.backdrop_path
                    };
                    
                    updatedFavorites = [...currentFavorites, movieData];
                } else {
                    // Eliminar la película de favoritos
                    updatedFavorites = currentFavorites.filter(fav => fav.id !== movie.id);
                }
                
                // Actualizar Firestore dentro de la transacción
                transaction.update(userRef, { favorites: updatedFavorites });
                
                // Actualizar el estado local
                setLocalIsFavorited(!isAlreadyFavorited);
            });
            
            // Una vez completada la transacción, notificar al componente padre
            // que hemos terminado correctamente
            handleFavoriteToggle();
            
        } catch (error) {
            console.error("Error al actualizar favoritos:", error);
            // No revertir el estado local si hay error, ya que no se completó la operación
        } finally {
            // Desactivar flag de procesamiento
            setIsProcessing(false);
            processingRef.current = false;
        }
    };

    // Función para renderizar el contenido de la pestaña activa
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {movie.overview || 'No hay sinopsis disponible para esta película.'}
                        </p>
                        
                        {/* Production Companies */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-medium mb-4">Compañías productoras</h3>
                                <div className="flex flex-wrap gap-6">
                                    {movie.production_companies.map(company => (
                                        <div key={company.name} className="flex items-center bg-gray-800 rounded-lg p-3">
                                            {company.logo_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-10 object-contain mr-3"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-3">
                                                    <span>{company.name.substring(0, 1)}</span>
                                                </div>
                                            )}
                                            <span>{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'cast':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-6">Reparto principal</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {cast.map(person => (
                                <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
                                    <div className="aspect-[2/3] bg-gray-700">
                                        {person.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                                                alt={person.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
                                                <span>No imagen</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-white">{person.name}</h3>
                                        <p className="text-sm text-gray-400">{person.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'videos':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-6">Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map(video => (
                                <div 
                                    key={video.key} 
                                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => createTrailerModal(video.key)}
                                >
                                    <div className="relative aspect-video">
                                        <img
                                            src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                                            alt={video.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-red-600 bg-opacity-80 rounded-full p-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-white truncate">{video.name}</h3>
                                        <p className="text-sm text-gray-400">{video.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'reviews':
                return <MovieReviews movieId={movie.id} />;
            default:
                return null;
        }
    };

    return (
        <>
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
                            onClick={() => createTrailerModal(videos[0].key)}
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
                                    {/* Favorite button - Usamos handleFavoriteClick con prevención de doble clic */}
                                    <button 
                                        onClick={handleFavoriteClick}
                                        disabled={isProcessing}
                                        className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors font-medium text-sm ${
                                            localIsFavorited 
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <span className="mr-2 text-lg">
                                            {localIsFavorited ? '⭐' : '☆'}
                                        </span>
                                        {isProcessing 
                                            ? 'Procesando...' 
                                            : (localIsFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos')}
                                    </button>
                                    
                                    {/* Watch trailer button - mobile only */}
                                    {videos.length > 0 && (
                                        <button
                                            onClick={() => createTrailerModal(videos[0].key)}
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

                            {/* Movie title and basic info */}
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
                                
                                {/* Tabs - Integrados directamente con su contenido */}
                                <div className="mt-8 border-b border-gray-700">
                                    <div className="flex space-x-6 overflow-x-auto pb-1">
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
                                        
                                        <button 
                                            onClick={() => setActiveTab('reviews')}
                                            className={`py-3 font-medium relative ${
                                                activeTab === 'reviews' 
                                                    ? 'text-white' 
                                                    : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                        >
                                            Reseñas
                                            {activeTab === 'reviews' && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Contenido de la pestaña activa - Integrado directamente debajo de los tabs */}
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}