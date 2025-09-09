import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/recuperar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMensaje(data.message);

    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al procesar la solicitud.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFF] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-xl font-semibold text-center text-black">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Ingresa tu correo electrónico para recibir un enlace de recuperación.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-[#008658] text-black focus:outline-none focus:ring-2 focus:ring-[#008658]"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#008658] text-white font-semibold rounded-xl hover:bg-[#006f49] transition"
        >
          Enviar enlace
        </button>

        {mensaje && (
          <p className="text-center text-sm text-gray-700 mt-2">{mensaje}</p>
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full py-2 text-[#008658] hover:underline text-sm"
        >
          Volver al login
        </button>
      </form>
    </div>
  );
}

export default RecuperarContraseña;
