// src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      // Redirección inmediata sin mostrar alerta
      navigate('/dashboard', { replace: true });
      return resp.user.uid;
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 flex justify-center items-center flex-grow">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              {/* <label htmlFor="password" className="block text-white mb-2">Contraseña</label> */}
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Iniciar Sesión
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{" "}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Registrarse
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}