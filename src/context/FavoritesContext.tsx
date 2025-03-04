import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  // Sincronizar favoritos con Firestore cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists() && snapshot.data().favorites) {
        setFavorites(snapshot.data().favorites);
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  async function addFavorite(movie) {
    // Verificar si la película ya está en favoritos para evitar duplicados
    if (!favorites.some(fav => fav.id === movie.id) && user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(movie)
        });
      } catch (error) {
        console.error("Error al añadir a favoritos:", error);
      }
    }
  }

  async function removeFavorite(movieId) {
    if (user) {
      const movieToRemove = favorites.find(movie => movie.id === movieId);
      if (movieToRemove) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          await updateDoc(userDocRef, {
            favorites: arrayRemove(movieToRemove)
          });
        } catch (error) {
          console.error("Error al eliminar de favoritos:", error);
        }
      }
    }
  }

  const isFavorite = (movieId) => favorites.some(movie => movie.id === movieId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}