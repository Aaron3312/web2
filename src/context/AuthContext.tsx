import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext({
  user: null,
  bio: "",
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        // Si no existe el documento, lo crea con los datos por defecto
        if (!userSnapshot.exists()) {
          await setDoc(userDocRef, {
            email: currentUser.email,
            bio: "",
            favorites: [], // Añadimos un array vacío para los favoritos
            createdAt: new Date(),
          });
          console.log("Documento creado para:", currentUser.email);
        } else if (!userSnapshot.data().favorites) {
          // Si el usuario existe pero no tiene el campo favorites, lo añadimos
          await setDoc(userDocRef, { favorites: [] }, { merge: true });
        }

        // Sincronización en tiempo real para la biografía
        const unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setBio(snapshot.data().bio);
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setBio("");
      }
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    await signOut(auth);
    setUser(null);
    setBio("");
  }

  return (
    <AuthContext.Provider value={{ user, bio, logout }}>
      {children}
    </AuthContext.Provider>
  );
}