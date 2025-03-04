import { useFavorites } from '../context/FavoritesContext';
import { useState, useMemo } from 'react';
import MovieCard from '../Components/MovieCard';
import NavBar from '../Components/NavBar';
import { Heart, Film, SortAsc } from 'lucide-react';

export default function Favorites() {
    const { favorites } = useFavorites();
    const [sortOption, setSortOption] = useState('recent');

    // Ordenar películas según la opción seleccionada
    const sortedMovies = useMemo(() => {
        if (!favorites.length) return [];
        
        const sortedList = [...favorites];
        
        switch (sortOption) {
            case 'recent':
                // Asumiendo que los más recientes están al final de la lista
                return sortedList;
            case 'rating':
                // Ordenar por calificación de mayor a menor
                return sortedList.sort((a, b) => b.vote_average - a.vote_average);
            case 'alphabetical':
                // Ordenar alfabéticamente por título
                return sortedList.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sortedList;
        }
    }, [favorites, sortOption]);

    // Manejar cambio de opción de ordenamiento
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
            <NavBar />
            
            <div className="container mx-auto p-6">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="text-pink-500" size={28} fill="currentColor" />
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-600">
                        Mi Colección Favorita
                    </h1>
                </div>
                
                {favorites.length === 0 ? (
                    <div className="text-center p-12 bg-blue-800/40 backdrop-blur-md rounded-xl border border-blue-700/50 shadow-2xl">
                        <Film size={64} className="mx-auto mb-6 text-blue-400 opacity-70" />
                        <h2 className="text-3xl font-semibold mb-3 text-blue-100">Tu Colección Está Vacía</h2>
                        <p className="text-blue-200 text-lg max-w-md mx-auto mb-8">
                            Explora películas y haz clic en el botón de corazón para comenzar a crear tu colección personal.
                        </p>
                        <a href="/" className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/30">
                            Descubrir Películas
                        </a>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-8 bg-blue-800/30 p-4 rounded-lg backdrop-blur-sm border border-blue-700/40 shadow-lg">
                            <p className="text-xl font-medium flex items-center">
                                <span className="text-pink-500 font-bold text-2xl mr-2">{favorites.length}</span> 
                                {favorites.length === 1 ? 'película' : 'películas'} en tu colección
                            </p>
                            <div className="flex gap-3 items-center">
                                <SortAsc size={20} className="text-blue-300" />
                                <select 
                                    className="bg-blue-900/80 border border-blue-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                >
                                    <option value="recent">Añadido recientemente</option>
                                    <option value="rating">Mejor valoradas</option>
                                    <option value="alphabetical">A-Z</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {sortedMovies.map(movie => (
                                <div key={movie.id} className="relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 rounded-lg flex items-end">
                                        <div className="p-4 w-full">
                                            <p className="text-white font-medium truncate">{movie.title}</p>
                                            <div className="flex items-center mt-2">
                                                <Heart size={16} className="text-pink-500 mr-1" fill="currentColor" />
                                                <span className="text-blue-200 text-sm">Favorito</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden rounded-lg shadow-lg shadow-blue-900/50">
                                        <MovieCard
                                            id={movie.id}
                                            title={movie.title}
                                            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            rating={movie.vote_average}
                                            movie={movie}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}