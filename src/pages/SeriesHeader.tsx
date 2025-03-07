import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext'; // Importamos el hook de favoritos

// Interfaces para los tipos de datos
export interface SeriesDetail {
    id: number;
    name: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    last_air_date: string;
    genres: Array<{ id: number; name: string }>;
    number_of_episodes: number;
    number_of_seasons: number;
    backdrop_path: string;
    tagline?: string;
    status?: string;
    networks?: Array<{ id: number; name: string; logo_path: string }>;
    created_by?: Array<{ id: number; name: string; profile_path: string }>;
    spoken_languages?: Array<{ english_name: string }>;
    production_companies?: Array<{ name: string; logo_path: string }>;
    seasons?: Array<{
        id: number;
        name: string;
        season_number: number;
        episode_count: number;
        poster_path: string;
        overview: string;
        air_date: string;
    }>;
}

export interface Video {
    key: string;
    name: string;
    type: string;
    site: string;
}

function SeriesHeader({ 
    series, 
    videos 
}: { 
    series: SeriesDetail; 
    videos: Video[] 
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    
    // Usar el contexto de favoritos
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    
    // Estado para controlar si la serie está en favoritos
    const [isInFavorites, setIsInFavorites] = useState(false);
    
    // Actualizar el estado cuando se carga la serie o cambia el estado de favoritos
    useEffect(() => {
        if (series) {
            setIsInFavorites(isFavorite(series.id));
        }
    }, [series, isFavorite]);
    
    // Manejar el clic en el botón de favoritos
    const handleFavoritesClick = async () => {
        if (!series) return;
        
        try {
            if (isInFavorites) {
                await removeFromFavorites(series.id);
            } else {
                // Crear objeto con los datos necesarios para guardar en favoritos
                const favoriteItem = {
                    id: series.id,
                    name: series.name,
                    poster_path: series.poster_path,
                    vote_average: series.vote_average,
                    first_air_date: series.first_air_date,
                    overview: series.overview,
                    backdrop_path: series.backdrop_path
                };
                
                await addToFavorites(favoriteItem);
            }
            
            // Actualizar estado local (aunque esto sucederá automáticamente por el efecto)
            setIsInFavorites(!isInFavorites);
        } catch (error) {
            console.error("Error al gestionar favoritos:", error);
        }
    };

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

    // Renderizar el contenido según la pestaña activa
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {series.overview || 'No hay sinopsis disponible para esta serie.'}
                        </p>
                        
                        {/* Datos adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            {/* Creadores */}
                            {series.created_by && series.created_by.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-medium mb-4">Creada por</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {series.created_by.map(creator => (
                                            <div key={creator.id} className="flex items-center bg-gray-800 rounded-lg p-3">
                                                {creator.profile_path ? (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w200${creator.profile_path}`}
                                                        alt={creator.name}
                                                        className="h-12 w-12 rounded-full object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full mr-3">
                                                        <span>{creator.name.substring(0, 1)}</span>
                                                    </div>
                                                )}
                                                <span>{creator.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Redes/Plataformas */}
                            {series.networks && series.networks.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-medium mb-4">Disponible en</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {series.networks.map(network => (
                                            <div key={network.id} className="flex items-center bg-gray-800 rounded-lg p-3">
                                                {network.logo_path ? (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                                                        alt={network.name}
                                                        className="h-10 object-contain mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-3">
                                                        <span>{network.name.substring(0, 1)}</span>
                                                    </div>
                                                )}
                                                <span>{network.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
                
            case 'seasons':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-6">Temporadas</h2>
                        
                        {series.seasons && series.seasons.length > 0 ? (
                            <div className="space-y-6">
                                {series.seasons
                                    .filter(season => season.season_number > 0) // Filtrar temporadas especiales (como la 0)
                                    .map(season => (
                                        <div key={season.id} className="bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/4">
                                                    {season.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                                                            alt={season.name}
                                                            className="w-full h-auto"
                                                        />
                                                    ) : (
                                                        <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700 text-gray-400">
                                                            <span>No imagen</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 md:p-6 md:w-3/4">
                                                    <h3 className="text-xl font-medium mb-2">{season.name}</h3>
                                                    
                                                    <div className="flex items-center mb-4 text-gray-400">
                                                        <span>{season.air_date ? new Date(season.air_date).getFullYear() : 'Fecha no disponible'}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{season.episode_count} episodios</span>
                                                    </div>
                                                    
                                                    <p className="text-gray-300">
                                                        {season.overview || `La temporada ${season.season_number} de ${series.name} se estrenó el ${season.air_date ? new Date(season.air_date).toLocaleDateString('es-ES') : 'fecha no disponible'}.`}
                                                    </p>
                                                    
                                                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                                                        Ver episodios
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">No hay información de temporadas disponible para esta serie.</p>
                            </div>
                        )}
                    </div>
                );
                
            case 'cast':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-6">Reparto principal</h2>
                        {/* Este contenido se llenará cuando tengamos los datos del reparto */}
                        <p className="text-gray-400">Cargando información del reparto...</p>
                    </div>
                );
                
            case 'videos':
                return (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-6">Videos</h2>
                        {videos.length > 0 ? (
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
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">No hay videos disponibles para esta serie.</p>
                            </div>
                        )}
                    </div>
                );
            
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
                        src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
                        alt={series.name}
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
                                        src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                                        alt={series.name}
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                                        }}
                                    />
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    {/* Botón de añadir a favoritos actualizado con funcionalidad */}
                                    <button 
                                        onClick={handleFavoritesClick}
                                        className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors font-medium text-sm ${
                                            isInFavorites 
                                                ? 'bg-yellow-600 hover:bg-yellow-700' 
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        } text-white`}
                                    >
                                        <span className="mr-2 text-lg">{isInFavorites ? '★' : '☆'}</span>
                                        {isInFavorites ? 'Quitar de favoritos' : 'Añadir a favoritos'}
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
                                
                                {/* Series info box */}
                                <div className="mt-6 bg-gray-900 rounded-xl p-5 space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Estado</span>
                                        <p className="font-medium">{series.status || 'N/A'}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-gray-400 text-sm">Fecha de estreno</span>
                                        <p className="font-medium">{new Date(series.first_air_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    
                                    {series.last_air_date && (
                                        <div>
                                            <span className="text-gray-400 text-sm">Último episodio</span>
                                            <p className="font-medium">{new Date(series.last_air_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <span className="text-gray-400 text-sm">Temporadas</span>
                                        <p className="font-medium">{series.number_of_seasons}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-gray-400 text-sm">Episodios</span>
                                        <p className="font-medium">{series.number_of_episodes}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Series title and basic info */}
                            <div className="md:w-2/3 lg:w-3/4">
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{series.name}</h1>
                                
                                {series.tagline && (
                                    <p className="text-gray-400 text-xl italic mb-4">{series.tagline}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <div className="flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full font-medium">
                                        <span className="mr-1">⭐</span>
                                        {series.vote_average.toFixed(1)}
                                    </div>
                                    
                                    <span className="text-gray-400">•</span>
                                    
                                    <span className="text-gray-300">
                                        {new Date(series.first_air_date).getFullYear()}
                                    </span>
                                    
                                    <span className="text-gray-400">•</span>
                                    
                                    <span className="text-gray-300">
                                        {series.number_of_seasons} {series.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
                                    </span>
                                </div>

                                <div className="mb-6 flex flex-wrap gap-2">
                                    {series.genres.map(genre => (
                                        <span
                                            key={genre.id}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-full text-sm"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Tabs */}
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
                                            onClick={() => setActiveTab('seasons')}
                                            className={`py-3 font-medium relative ${
                                                activeTab === 'seasons' 
                                                    ? 'text-white' 
                                                    : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                        >
                                            Temporadas
                                            {activeTab === 'seasons' && (
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
                                
                                {/* Contenido de la pestaña activa */}
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SeriesHeader;