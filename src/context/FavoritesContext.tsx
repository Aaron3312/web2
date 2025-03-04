import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

// Definir la estructura de una película favorita
interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview?: string;
  backdrop_path?: string;
}

interface FavoritesContextType {
  favorites: FavoriteMovie[];
  isLoading: boolean;
  addToFavorites: (movie: FavoriteMovie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isLoading: true,
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Escuchar cambios en los favoritos del usuario
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userRef = doc(db, 'users', user.uid);
    
    // Suscripción en tiempo real a los cambios en favoritos
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Verificar que favorites existe y es un array
        if (userData.favorites && Array.isArray(userData.favorites)) {
          // Eliminar posibles duplicados basados en ID
          const uniqueFavorites = Array.from(
            new Map(userData.favorites.map((movie: FavoriteMovie) => [movie.id, movie]))
            .values()
          );
          
          setFavorites(uniqueFavorites);
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error al obtener favoritos:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Añadir película a favoritos
  const addToFavorites = async (movie: FavoriteMovie) => {
    if (!user) return;
    
    // Verificar que la película no está ya en favoritos
    if (isFavorite(movie.id)) {
      console.log("La película ya está en favoritos");
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Actualizar Firestore
      await updateDoc(userRef, {
        favorites: arrayUnion(movie)
      });
      
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
    }
  };

  // Eliminar película de favoritos
  const removeFromFavorites = async (movieId: number) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Encontrar la película exacta a eliminar
      const movieToRemove = favorites.find(fav => fav.id === movieId);
      
      if (movieToRemove) {
        // Eliminar usando arrayRemove
        await updateDoc(userRef, {
          favorites: arrayRemove(movieToRemove)
        });
      }
      
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
    }
  };

  // Verificar si una película está en favoritos
  const isFavorite = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isLoading, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};