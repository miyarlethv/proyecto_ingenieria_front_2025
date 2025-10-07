import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Mascota {
  id: number;
  nombre: string;
  foto?: string; // ✅ campo opcional para la imagen
}

const HistoriaClinica: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const navigate = useNavigate();

  // Cargar mascotas desde el backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/mascotas")
      .then((res) => res.json())
      .then((data) => {
        console.log("Mascotas recibidas:", data);
        setMascotas(data);
      })
      .catch((error) => console.error("Error al cargar mascotas:", error));
  }, []);

  // Redirigir a la ruta de creación de historia
  const abrirHistoria = (mascotaId: number) => {
    navigate(`/crearHistoria/${mascotaId}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Agregar Historia Clínica
      </h1>

      {/* Listado de mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mascotas.map((mascota) => (
          <div
            key={mascota.id}
            className="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col items-center"
          >
            {/* Imagen de la mascota */}
            <div className="w-32 h-32 mb-4">
              {mascota.foto ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${mascota.foto}`}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover rounded-full border-2 border-[#008658]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-full border-2 border-gray-300">
                  Sin foto
                </div>
              )}
            </div>

            {/* Nombre */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {mascota.nombre}
            </h2>

            {/* Botón */}
            <button
              onClick={() => abrirHistoria(mascota.id)}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Agregar Historia
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoriaClinica;
