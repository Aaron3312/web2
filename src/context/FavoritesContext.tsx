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

// Definir la estructura de una serie favorita
interface FavoriteSeries {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  overview?: string;
  backdrop_path?: string;
}

// Tipo que puede ser una película o una serie favorita
type FavoriteItem = FavoriteMovie | FavoriteSeries;

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isLoading: boolean;
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (itemId: number) => Promise<void>;
  isFavorite: (itemId: number) => boolean;
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
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
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
            new Map(userData.favorites.map((item: FavoriteItem) => [item.id, item]))
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

  // Añadir elemento a favoritos
  const addToFavorites = async (item: FavoriteItem) => {
    if (!user) return;
    
    // Verificar que el elemento no está ya en favoritos
    if (isFavorite(item.id)) {
      console.log("El elemento ya está en favoritos");
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Actualizar Firestore
      await updateDoc(userRef, {
        favorites: arrayUnion(item)
      });
      
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
    }
  };

  // Eliminar elemento de favoritos
  const removeFromFavorites = async (itemId: number) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Encontrar el elemento exacto a eliminar
      const itemToRemove = favorites.find(fav => fav.id === itemId);
      
      if (itemToRemove) {
        // Eliminar usando arrayRemove
        await updateDoc(userRef, {
          favorites: arrayRemove(itemToRemove)
        });
      }
      
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
    }
  };

  // Verificar si un elemento está en favoritos
  const isFavorite = (itemId: number): boolean => {
    return favorites.some(item => item.id === itemId);
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