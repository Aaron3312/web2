import { Video } from '../../../types/movieTypes';

interface VideosTabProps {
    videos: Video[];
}

const VideosTab: React.FC<VideosTabProps> = ({ videos }) => {
    const openVideoModal = (video: Video) => {
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
    };

    return (
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
                                        onClick={() => openVideoModal(video)}
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
    );
};

export default VideosTab;