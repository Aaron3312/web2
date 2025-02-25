// src/pages/Dashboard.tsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { favorites } = useFavorites();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a tu Dashboard</h1>
          <p className="text-gray-300">
            Hola <span className="font-bold">{user?.email}</span>, aquí puedes ver tus estadísticas y películas favoritas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Tus Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-400">{favorites.length}</p>
                <p className="text-gray-400">Películas Favoritas</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-400">
                  {favorites.length > 0 
                    ? (favorites.reduce((acc, movie) => acc + movie.vote_average, 0) / favorites.length).toFixed(1) 
                    : "0.0"}
                </p>
                <p className="text-gray-400">Rating Promedio</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span> 
                Has iniciado sesión exitosamente
              </li>
              {favorites.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">•</span> 
                  Has añadido {favorites.length} películas a favoritos
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> 
                Has accedido a tu dashboard
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Tus Películas Favoritas</h2>
            {favorites.length > 0 && (
              <button 
                onClick={() => window.location.href = '/favorites'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Ver todas
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No has añadido películas a favoritos aún. 
              ¡Explora nuestra colección y añade algunas!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favorites.slice(0, 4).map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  rating={movie.vote_average}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}