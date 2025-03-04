import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../Components/MovieCard';
import NavBar from '../Components/NavBar';
import HeroCarousel from '../Components/HeroCarousel'; // Importamos el nuevo componente

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    backdrop_path: string;
}

interface Genre {
    id: number;
    name: string;
}

// Componente para el carrusel horizontal
interface MovieCarouselProps {
    title: string;
    movies: Movie[];
}

const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Función para deslizar hacia la izquierda
    const scrollLeft1 = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: carouselRef.current.scrollLeft - 300,
                behavior: 'smooth'
            });
        }
    };

    // Función para deslizar hacia la derecha
    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: carouselRef.current.scrollLeft + 300,
                behavior: 'smooth'
            });
        }
    };

    // Gestionar eventos de mouse/touch para el deslizamiento manual
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        if (carouselRef.current) {
            const x = e.pageX - (carouselRef.current.offsetLeft || 0);
            const walk = (x - startX) * 2; // Velocidad de desplazamiento
            carouselRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        if (carouselRef.current) {
            const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0);
            const walk = (x - startX) * 2;
            carouselRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={scrollLeft1}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                        aria-label="Desplazar a la izquierda"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={scrollRight}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                        aria-label="Desplazar a la derecha"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <div 
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleMouseUp}
                onTouchMove={handleTouchMove}
            >
                {movies.map(movie => (
                    <div key={movie.id} className="flex-shrink-0" style={{ width: '200px' }}>
                        <MovieCard
                            id={movie.id}
                            title={movie.title}
                            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            rating={movie.vote_average}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    const navigate = useNavigate();
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMoviesData = async () => {
            setIsLoading(true);
            try {
                // Fetch trending movies
                const trendingResponse = await axios.get(
                    `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`
                );
                setTrendingMovies(trendingResponse.data.results);

                // Fetch popular movies
                const popularResponse = await axios.get(
                    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
                );
                setPopularMovies(popularResponse.data.results);

                // Fetch top rated movies
                const topRatedResponse = await axios.get(
                    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
                );
                setTopRatedMovies(topRatedResponse.data.results);

                // Fetch genres
                const genresResponse = await axios.get(
                    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
                );
                setGenres(genresResponse.data.genres);

            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoviesData();
    }, []);

    useEffect(() => {
        // Fetch movies by genre when a genre is selected
        const fetchMoviesByGenre = async () => {
            if (selectedGenre === null) return;
            
            try {
                const response = await axios.get(
                    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre}`
                );
                setGenreMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching genre movies:', error);
            }
        };

        fetchMoviesByGenre();
    }, [selectedGenre]);

    // Function to handle genre selection
    const handleGenreSelect = (genreId: number) => {
        setSelectedGenre(genreId === selectedGenre ? null : genreId);
    };

    // Loading skeleton component
    const MovieCardSkeleton = () => (
        <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[2/3] bg-gray-700"></div>
            <div className="p-3">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
        </div>
    );

    const CarouselSkeleton = () => (
        <div className="mb-8">
            <div className="h-8 bg-gray-800 rounded w-64 mb-4 animate-pulse"></div>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex-shrink-0" style={{ width: '200px' }}>
                        <MovieCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <NavBar />
                <div className="h-96 w-full bg-gray-800 animate-pulse mb-6"></div>
                <div className="container mx-auto px-4">
                    <CarouselSkeleton />
                    <CarouselSkeleton />
                    <CarouselSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            {/* Hero Section con el nuevo componente */}
            {trendingMovies.length > 0 && (
                <HeroCarousel movies={trendingMovies.slice(0, 5)} autoPlayInterval={8000} />
            )}
            
            <div className="container mx-auto px-4">
                {/* Género */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Explorar por Género</h2>
                    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreSelect(genre.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                                    selectedGenre === genre.id
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                    
                    {selectedGenre && genreMovies.length > 0 && (
                        <MovieCarousel 
                            title={`${genres.find(g => g.id === selectedGenre)?.name || 'Género'} Movies`}
                            movies={genreMovies}
                        />
                    )}
                </div>
                
                {/* Trending Movies */}
                <MovieCarousel title="Trending Hoy" movies={trendingMovies} />
                
                {/* Popular Movies */}
                <MovieCarousel title="Películas Populares" movies={popularMovies} />
                
                {/* Top Rated Movies */}
                <MovieCarousel title="Mejor Valoradas" movies={topRatedMovies} />
            </div>
            
            {/* Agregar estilos CSS para ocultar la barra de desplazamiento en todos los navegadores */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            
            {/* Footer */}
            <footer className="bg-gray-950 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p className="mb-2">Creado con 🎬 y ❤️</p>
                    <p>Usando la API de TMDB</p>
                </div>
            </footer>
        </div>
    );
}