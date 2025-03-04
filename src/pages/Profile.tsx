// src/pages/Profile.tsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NavBar from "../Components/NavBar";

export default function Profile() {
  const { user, updateUserBio } = useContext(AuthContext);
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveBio = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      await updateUserBio(bio);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar la biografía:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tu Perfil</h1>
          <p className="text-gray-300">
            Administra tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna de información de usuario */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-2xl text-white font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-white">{user?.email}</h2>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm">Miembro desde</p>
              <p className="text-white">
                {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "Fecha desconocida"}
              </p>
            </div>
          </div>

          {/* Columna de biografía */}
          <div className="bg-gray-900 rounded-lg p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Sobre Ti</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setBio(user?.bio || "");
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg p-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cuéntanos un poco sobre ti, tus películas favoritas, géneros preferidos, etc."
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-4">
                {user?.bio ? (
                  <p className="text-gray-300 whitespace-pre-wrap">{user.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No has añadido una biografía aún. Haz clic en 'Editar' para agregar información sobre ti.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}