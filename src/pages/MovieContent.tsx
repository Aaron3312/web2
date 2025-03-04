import { useState } from 'react';
import { MovieDetail, Cast, Video, SimilarMovie } from './MovieDetails';

interface MovieContentProps {
    movie: MovieDetail;
    cast: Cast[];
    videos: Video[];
    similarMovies: SimilarMovie[];
}

export default function MovieContent({ movie, cast, videos, similarMovies }: MovieContentProps) {
    const [activeTab, setActiveTab] = useState('overview');

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

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 mt-4">
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
                                                        onClick={() => createTrailerModal(video.key)}
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
    );
}