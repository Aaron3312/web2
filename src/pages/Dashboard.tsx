import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NavBar from "../Components/NavBar";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../Components/MovieCard";
import BioForm from "../Components/BioForm";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, bio } = useContext(AuthContext);
  const { favorites } = useFavorites();

  // Asegurarnos que el fondo se aplique en toda la página
  return (
    <div style={{ backgroundColor: "#0F172A" }} className="flex flex-col min-h-screen w-full">
      <NavBar />
      <div style={{ backgroundColor: "#0F172A" }} className="container mx-auto p-4 py-8 w-full">
        <div style={{ backgroundColor: "#1E293B" }} className="rounded-xl p-8 mb-8 shadow-lg border border-blue-700/20">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Bienvenido a tu Dashboard</h1>
          <p className="text-gray-300 text-lg">
            Hola <span className="font-bold text-blue-400">{user?.email}</span>, {bio ? (
              <span>tu biografía: <span className="italic text-blue-300">{bio}</span></span>
            ) : (
              <span>aún no has agregado una biografía.</span>
            )}
          </p>
          <div className="mt-4">
            <BioForm />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div style={{ backgroundColor: "#1E293B" }} className="rounded-xl p-6 shadow-lg border border-blue-700/20 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Tus Estadísticas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div style={{ backgroundColor: "#334155" }} className="p-6 rounded-xl text-center shadow-inner border border-blue-600/20">
                <p className="text-4xl font-bold text-blue-400 mb-2">{favorites.length}</p>
                <p className="text-gray-400">Películas Favoritas</p>
              </div>
              <div style={{ backgroundColor: "#334155" }} className="p-6 rounded-xl text-center shadow-inner border border-blue-600/20">
                <p className="text-4xl font-bold text-green-400 mb-2">
                  {favorites.length > 0 
                    ? (favorites.reduce((acc, movie) => acc + movie.vote_average, 0) / favorites.length).toFixed(1) 
                    : "0.0"}
                </p>
                <p className="text-gray-400">Rating Promedio</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: "#1E293B" }} className="rounded-xl p-6 shadow-lg border border-blue-700/20 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Actividad Reciente
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li style={{ backgroundColor: "#334155" }} className="flex items-center gap-3 p-3 rounded-lg border border-blue-600/20">
                <span className="text-blue-400 text-2xl">•</span> 
                <span>Has iniciado sesión exitosamente</span>
              </li>
              {favorites.length > 0 && (
                <li style={{ backgroundColor: "#334155" }} className="flex items-center gap-3 p-3 rounded-lg border border-blue-600/20">
                  <span className="text-yellow-400 text-2xl">•</span> 
                  <span>Has añadido <span className="font-bold text-yellow-400">{favorites.length}</span> películas a favoritos</span>
                </li>
              )}
              <li style={{ backgroundColor: "#334155" }} className="flex items-center gap-3 p-3 rounded-lg border border-blue-600/20">
                <span className="text-green-400 text-2xl">•</span> 
                <span>Has accedido a tu dashboard</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ backgroundColor: "#1E293B" }} className="rounded-xl p-8 shadow-lg border border-blue-700/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              Tus Películas Favoritas
            </h2>
            {favorites.length > 0 && (
              <Link 
                to="/favorites"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all duration-300 flex items-center"
              >
                Ver todas
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>

          {favorites.length === 0 ? (
            <div style={{ backgroundColor: "#334155" }} className="text-gray-400 text-center py-16 rounded-xl border border-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p className="text-xl">
                No has añadido películas a favoritos aún.
              </p>
              <p className="mt-2 text-blue-400">
                ¡Explora nuestra colección y añade algunas!
              </p>
              <Link 
                to="/movies"
                className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-300"
              >
                Explorar películas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {favorites.slice(0, 4).map((movie) => (
                <div key={movie.id} className="transform hover:scale-105 transition-all duration-300">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    rating={movie.vote_average}
                    movie={movie}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}