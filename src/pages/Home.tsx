// Home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import NavBar from '../components/NavBar';

const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';
const TMDB_API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`;

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(TMDB_API_URL);
                setMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="container mx-auto p-4">
                {isLoading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                rating={movie.vote_average}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}