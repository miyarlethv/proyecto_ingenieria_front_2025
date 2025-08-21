// src/components/Bienvenida.tsx
import { useNavigate, useLocation } from "react-router-dom";

function BienvenidaUsuario() {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos del usuario desde el state que se envió al navegar
  const usuario = location.state?.usuario || "Usuario";

  const volverInicio = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 to-purple-500 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Hola, bienvenido {usuario} 👋</h1>
      <p className="mb-6 text-lg text-white/90">¡Nos alegra tenerte de vuelta!</p>
      <button
        onClick={volverInicio}
        className="px-6 py-2 bg-white text-purple-600 rounded-md font-semibold hover:bg-purple-100 transition"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default BienvenidaUsuario;
