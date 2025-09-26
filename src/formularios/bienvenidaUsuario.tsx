import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search,X } from "lucide-react";

function BienvenidoUsuario() {
  const location = useLocation();
  const nombreUsuario = location.state?.nombre || "Usuario";

  // Estado para mascotas
  const [mascotas, setMascotas] = useState<any[]>([]);

  // Estado búsqueda
  const [busqueda, setBusqueda] = useState<string>("");

  // Estado para modal "Ver más"
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);

   const navigate = useNavigate();
   const manejarVolver = () => {
    navigate("/");
  };

  // Cargar mascotas desde la API
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/mascotas");
        if (response.ok) {
          const data = await response.json();
          setMascotas(data);
        }
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      }
    };

    fetchMascotas();
  }, []);

  // Filtrar mascotas por nombre
  const filtroMascotas = mascotas.filter((mascota) =>
    mascota.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header con nombre del usuario */}
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <h1 className="text-lg font-bold text-white">
            Bienvenido Usuario ({nombreUsuario})
          </h1>
        </div>
         <button
          onClick={manejarVolver}
          className="bg-white text-black border border-black rounded-[10px] px-4 py-1 hover:bg-gray-100 transition"
        >
          Volver
        </button>
      </header>

      {/* Buscador */}
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 mt-8 mb-6">
        <div className="relative w-1/3">
          <Search className="absolute inset-y-0 left-3 my-auto text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar mascota..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-green-600 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Modal Ver más */}
      {mascotaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center shadow-lg relative">
            <button
              onClick={() => setMascotaSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
             <X size={20} />
            </button>
            {mascotaSeleccionada.foto && (
              <img
                src={`http://127.0.0.1:8000/storage/${mascotaSeleccionada.foto}`}
                alt={mascotaSeleccionada.nombre}
                className="w-32 h-32 object-cover mx-auto rounded-full mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{mascotaSeleccionada.nombre}</h2>
            <p className="text-black-700 mt-2">Edad: {mascotaSeleccionada.edad}</p>
            <p className="text-black-700 mt-2">
              Características:{" "}
              {mascotaSeleccionada.caracteristicas || "No registradas"}
            </p>
          </div>
        </div>
      )}

      {/* Lista de mascotas */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filtroMascotas.length > 0 ? (
            filtroMascotas.map((mascota) => (
              <div
                key={mascota.id}
                className="flex flex-col items-center border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                {mascota.foto ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${mascota.foto}`}
                    alt={mascota.nombre}
                    className="w-24 h-24 object-cover mb-3 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />
                )}
                <div className="text-center w-full">
                  <p className="text-xs text-black font-medium">Nombre</p>
                  <p className="border border-green-600 px-2 py-1 mb-1 text-sm  rounded">
                    {mascota.nombre}
                  </p>
                  <p className="text-xs text-black font-medium">Edad</p>
                  <p className="border border-green-600 px-2 py-1 mb-2 text-sm rounded">
                    {mascota.edad}
                  </p>
                  <button
                    onClick={() => setMascotaSeleccionada(mascota)}
                    className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full"
                  >
                    Ver más..
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron resultados ❌
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default BienvenidoUsuario;
