import { useContext } from 'react';
import { MovieDetail, Video } from '../../types/movieTypes';
import { AuthContext } from '../../context/AuthContext';

interface MovieInfoProps {
    movie: MovieDetail;
    isFavorited: boolean;
    handleFavoriteToggle: () => void;
    videos: Video[];
    formatCurrency: (amount: number) => string;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ 
    movie, 
    isFavorited, 
    handleFavoriteToggle, 
    videos,
    formatCurrency
}) => {
    const { user } = useContext(AuthContext);

    const openTrailerModal = () => {
        if (videos.length === 0) return;
        
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
    };

    return (
        <>
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
                {user && (
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
                )}
                
                {/* Review button */}
                {user && (
                    <button 
                        onClick={() => {
                            // This will be handled in the Reviews component
                            const tabButton = document.querySelector('[data-tab="reviews"]');
                            if (tabButton) {
                                (tabButton as HTMLButtonElement).click();
                            }
                        }}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors font-medium text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        Escribir reseña
                    </button>
                )}
                
                {/* Watch trailer button - mobile only */}
                {videos.length > 0 && (
                    <button
                        onClick={openTrailerModal}
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
        </>
    );
};

export default MovieInfo;