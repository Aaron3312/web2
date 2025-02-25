// Favorites.tsx
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import NavBar from '../components/NavBar';

export default function Favorites() {
    const { favorites, removeFavorite } = useFavorites();

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
                
                {favorites.length === 0 ? (
                    <div className="text-center p-8 bg-gray-900 rounded-lg">
                        <p className="text-xl">You haven't added any favorites yet.</p>
                        <p className="text-gray-400 mt-2">
                            Browse movies and click the "Add to Favorites" button to start building your collection.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4 text-lg">You have {favorites.length} favorite {favorites.length === 1 ? 'movie' : 'movies'}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {favorites.map(movie => (
                                <div key={movie.id} className="relative">
                                    <MovieCard
                                        id={movie.id}
                                        title={movie.title}
                                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        rating={movie.vote_average}
                                    />
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the MovieCard click
                                            removeFavorite(movie.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}