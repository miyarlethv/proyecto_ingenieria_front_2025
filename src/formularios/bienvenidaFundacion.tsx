import { useNavigate, useLocation } from "react-router-dom";
// import logoIndex from "../assets/logoIndex.jpg"; // Ya no se usa directamente

function BienvenidaFundacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const nombreFundacion = location.state?.nombre || "Fundación";

  const volverInicio = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header estilo verde */}
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Espacio reservado para el logo */}
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <h1 className="text-lg font-bold text-white">
            Bienvenido Fundación ({nombreFundacion})
          </h1>
        </div>

        <button
          onClick={volverInicio}
          className="bg-white text-black border border-black rounded-[10px] px-4 py-1 hover:bg-gray-100 transition"
        >
          Volver
        </button>
      </header>

      {/* 🔍 Botones de acción */}
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 mt-8 mb-6">
        <button className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100">
          🔍 <span className="ml-2">Buscar Mascota</span>
        </button>
        <button className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100">
          ➕ <span className="ml-2">Agregar mascota</span>
        </button>
      </div>

      {/* 🐶 Sección de tarjetas de mascotas */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              {/* Imagen circular de mascota (no cargada) */}
              <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />

              {/* Campos */}
              <div className="text-center w-full">
                <p className="border border-black px-2 py-1 mb-1 text-sm font-semibold rounded">
                  Nombre
                </p>
                <p className="border border-black px-2 py-1 mb-2 text-sm rounded">
                  Edad
                </p>
                <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full">
                  Ver más..
                </button>
              </div>

              {/* Iconos de documento */}
              <div className="mt-3 flex gap-2">
                <span>📄</span>
                <span>📄</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BienvenidaFundacion;
