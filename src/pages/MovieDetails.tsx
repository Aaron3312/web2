// MovieDetails.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
}

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const TMDB_API_KEY = '521b418e6b0c0227a624515e80c9288a';

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
                );
                if (!response.ok) {
                    throw new Error('Movie not found');
                }
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching movie details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
    if (!movie) return <div className="text-center p-4">Movie not found</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
                {/* Backdrop Image */}
                <div className="relative h-96 w-full">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster */}
                        <div className="md:w-1/3">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Details */}
                        <div className="md:w-2/3 text-white">
                            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                                <span className="text-gray-400">|</span>
                                <span>{new Date(movie.release_date).getFullYear()}</span>
                                <span className="text-gray-400">|</span>
                                <span>{movie.runtime} min</span>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-2">
                                {movie.genres.map(genre => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}