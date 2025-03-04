// src/Components/BioForm.tsx
import { useState } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BioForm() {
  const { user, bio } = useContext(AuthContext);
  const [newBio, setNewBio] = useState(bio);

  async function handleSubmit(e) {
    e.preventDefault();
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        bio: newBio,
      });
      alert("Biografía actualizada");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-800 text-white"
        placeholder="Escribe tu biografía..."
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2">
        Guardar Biografía
      </button>
    </form>
  );
}