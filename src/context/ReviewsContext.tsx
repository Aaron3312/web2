import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useContext as useReactContext } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../config/firebase";

export interface Review {
  id?: string;
  movieId: number;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewsContextType {
  isLoading: boolean;
  error: string | null;
  addReview: (movieId: number, rating: number, comment: string) => Promise<void>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getMovieReviews: (movieId: number) => Promise<Review[]>;
  getUserReviewForMovie: (movieId: number) => Promise<Review | null>;
}

export const ReviewsContext = createContext<ReviewsContextType>({
  isLoading: false,
  error: null,
  addReview: async () => {},
  updateReview: async () => {},
  deleteReview: async () => {},
  getMovieReviews: async () => [],
  getUserReviewForMovie: async () => null
});

export const useReviews = () => useContext(ReviewsContext);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useReactContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReview = async (movieId: number, rating: number, comment: string) => {
    if (!user) throw new Error("Usuario no autenticado");
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user already has a review for this movie
      const existingReview = await getUserReviewForMovie(movieId);
      
      if (existingReview) {
        throw new Error("Ya has escrito una reseña para esta película");
      }
      
      const reviewData: Omit<Review, 'id'> = {
        movieId,
        userId: user.uid,
        userEmail: user.email || "usuario anónimo",
        rating,
        comment,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, "reviews"), reviewData);
    } catch (err: any) {
      console.error("Error adding review:", err);
      setError(err.message || "Error al añadir la reseña");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!user) throw new Error("Usuario no autenticado");
    
    setIsLoading(true);
    setError(null);
    
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        rating,
        comment,
      });
    } catch (err: any) {
      console.error("Error updating review:", err);
      setError(err.message || "Error al actualizar la reseña");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) throw new Error("Usuario no autenticado");
    
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
    } catch (err: any) {
      console.error("Error deleting review:", err);
      setError(err.message || "Error al eliminar la reseña");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMovieReviews = async (movieId: number): Promise<Review[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const q = query(
        collection(db, "reviews"),
        where("movieId", "==", movieId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          movieId: data.movieId,
          userId: data.userId,
          userEmail: data.userEmail,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt.toDate()
        });
      });
      
      return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (err: any) {
      console.error("Error fetching movie reviews:", err);
      setError(err.message || "Error al obtener las reseñas");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getUserReviewForMovie = async (movieId: number): Promise<Review | null> => {
    if (!user) return null;
    
    try {
      const q = query(
        collection(db, "reviews"),
        where("movieId", "==", movieId),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        movieId: data.movieId,
        userId: data.userId,
        userEmail: data.userEmail,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt.toDate()
      };
    } catch (err) {
      console.error("Error fetching user review:", err);
      return null;
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        isLoading,
        error,
        addReview,
        updateReview,
        deleteReview,
        getMovieReviews,
        getUserReviewForMovie
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};