import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    backdrop_path: string;
}

interface HeroCarouselProps {
    movies: Movie[];
    autoPlayInterval?: number;
}

const HeroCarousel = ({ movies, autoPlayInterval = 8000 }: HeroCarouselProps) => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Función para ir a un slide específico
    const goToSlide = (index: number) => {
        // Asegurarse de que el índice esté dentro del rango
        const newIndex = (index + movies.length) % movies.length;
        setActiveSlide(newIndex);
        
        // Mover el scroll si el contenedor existe
        if (carouselRef.current) {
            const slideWidth = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({
                left: newIndex * slideWidth,
                behavior: 'smooth'
            });
        }
    };

    // Funciones para navegar entre slides
    const nextSlide = () => {
        goToSlide(activeSlide + 1);
    };

    const prevSlide = () => {
        goToSlide(activeSlide - 1);
    };

    // Manejadores de eventos para el deslizamiento táctil
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        resetAutoPlay();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        resetAutoPlay();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        handleDrag(currentX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        handleDrag(currentX);
    };

    const handleDrag = (currentX: number) => {
        const diff = startX - currentX;
        // Si el arrastre es significativo
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Arrastre hacia la izquierda, ir al siguiente slide
                nextSlide();
            } else {
                // Arrastre hacia la derecha, ir al slide anterior
                prevSlide();
            }
            setIsDragging(false);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        startAutoPlay();
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        startAutoPlay();
    };

    // Reiniciar el temporizador para la reproducción automática
    const resetAutoPlay = () => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }
    };

    // Iniciar la reproducción automática
    const startAutoPlay = () => {
        resetAutoPlay();
        autoPlayTimerRef.current = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
    };

    // Configurar la reproducción automática al montar y limpiar al desmontar
    useEffect(() => {
        startAutoPlay();
        return () => resetAutoPlay();
    }, [activeSlide]);

    // Manejar cambios de tamaño de ventana
    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                const slideWidth = carouselRef.current.offsetWidth;
                carouselRef.current.scrollTo({
                    left: activeSlide * slideWidth,
                    behavior: 'auto'
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeSlide]);

    if (movies.length === 0) return null;

    return (
        <div className="relative h-[60vh] mb-8 overflow-hidden">
            {/* Contenedor principal del carrusel */}
            <div 
                ref={carouselRef}
                className="relative w-full h-full flex transition-transform duration-500 ease-out overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {movies.slice(0, 5).map((movie, index) => (
                    <div 
                        key={movie.id} 
                        className="relative min-w-full h-full flex-shrink-0"
                        style={{
                            transform: `translateX(${(index - activeSlide) * 100}%)`,
                            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
                        }}
                    >
                        <img 
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                        
                        {/* Contenido del slide */}
                        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:container lg:mx-auto">
                            <div className="max-w-xl">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                                <div className="flex items-center mb-6">
                                    <span className="inline-flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                                        <span className="mr-1">⭐</span>
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Trending
                                    </span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Botones de navegación */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                aria-label="Anterior película"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                aria-label="Siguiente película"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            
            {/* Indicadores de slide */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {movies.slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === activeSlide ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                        aria-label={`Ir al slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;