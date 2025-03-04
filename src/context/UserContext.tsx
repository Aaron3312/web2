import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useContext as useReactContext } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../config/firebase";

interface UserProfile {
  description: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUserDescription: (description: string) => Promise<void>;
}

const defaultUserProfile: UserProfile = {
  description: ""
};

export const UserContext = createContext<UserContextType>({
  userProfile: null,
  isLoading: true,
  error: null,
  updateUserDescription: async () => {}
});

export const useUserProfile = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useReactContext(AuthContext);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Create a new user profile if it doesn't exist
          await setDoc(userDocRef, defaultUserProfile);
          setUserProfile(defaultUserProfile);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("No se pudo cargar el perfil de usuario. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateUserDescription = async (description: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { description });
      setUserProfile(prev => prev ? { ...prev, description } : defaultUserProfile);
    } catch (err) {
      console.error("Error updating user description:", err);
      setError("No se pudo actualizar la descripción. Por favor, inténtalo de nuevo más tarde.");
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isLoading,
        error,
        updateUserDescription
      }}
    >
      {children}
    </UserContext.Provider>
  );
};