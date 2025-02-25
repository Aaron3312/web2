// Home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import NavBar from '../components/NavBar';

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

export default function Home() {
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchMoviesData = async () => {
            setIsLoading(true);
            try {
                // Fetch trending movies
                const trendingResponse = await axios.get(
                    `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`
                );
                setTrendingMovies(trendingResponse.data.results);
                
                // Set hero movie from trending
                if (trendingResponse.data.results.length > 0) {
                    setHeroMovie(trendingResponse.data.results[Math.floor(Math.random() * 5)]);
                }

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

        // Set interval for hero section slideshow
        const slideInterval = setInterval(() => {
            if (trendingMovies.length > 0) {
                setActiveSlide((prev) => (prev + 1) % Math.min(5, trendingMovies.length));
                setHeroMovie(trendingMovies[activeSlide]);
            }
        }, 8000);

        return () => clearInterval(slideInterval);
    }, [activeSlide, trendingMovies.length]);

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

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <NavBar />
                <div className="h-96 w-full bg-gray-800 animate-pulse mb-6"></div>
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-800 rounded w-64 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, index) => (
                                <MovieCardSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <NavBar />
            
            {/* Hero Section */}
            {heroMovie && (
                <div className="relative h-[60vh] mb-8">
                    <div className="absolute inset-0">
                        <img 
                            src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`} 
                            alt={heroMovie.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                    </div>
                    <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroMovie.title}</h1>
                            <div className="flex items-center mb-6">
                                <span className="inline-flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                                    <span className="mr-1">⭐</span>
                                    {heroMovie.vote_average.toFixed(1)}
                                </span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Trending
                                </span>
                            </div>
                            <button 
                                onClick={() => window.location.href = `/movie/${heroMovie.id}`}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Ver detalles
                            </button>
                        </div>
                        
                        {/* Indicator dots */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {trendingMovies.slice(0, 5).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveSlide(index);
                                        setHeroMovie(trendingMovies[index]);
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        index === activeSlide ? 'bg-white scale-125' : 'bg-white/50'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="container mx-auto px-4">
                {/* Género */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Explorar por Género</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreSelect(genre.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">
                                {genres.find(g => g.id === selectedGenre)?.name || 'Género'} Movies
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {genreMovies.slice(0, 10).map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        id={movie.id}
                                        title={movie.title}
                                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        rating={movie.vote_average}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Trending Movies */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Trending Hoy</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {trendingMovies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                rating={movie.vote_average}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Popular Movies */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Películas Populares</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {popularMovies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                rating={movie.vote_average}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Top Rated Movies */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Mejor Valoradas</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {topRatedMovies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                rating={movie.vote_average}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
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