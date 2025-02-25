// FavoritesContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

interface FavoritesContextType {
    favorites: Movie[];
    addFavorite: (movie: Movie) => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Movie[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem('movieFavorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Save favorites to localStorage whenever the favorites state changes
    useEffect(() => {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (movie: Movie) => {
        setFavorites((prev) => {
            // Check if movie is already in favorites
            if (prev.some((fav) => fav.id === movie.id)) {
                return prev;
            }
            return [...prev, movie];
        });
    };

    const removeFavorite = (id: number) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== id));
    };

    const isFavorite = (id: number) => {
        return favorites.some((movie) => movie.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Custom hook for using the favorites context
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};