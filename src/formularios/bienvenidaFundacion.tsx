import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function BienvenidaFundacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // 👉 Estado para mascotas
  const [mascotas, setMascotas] = useState<any[]>([]);

  // 👉 Estado para modal "Ver más"
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);

  // Estados tipados
  const [nombre, setNombre] = useState<string>("");
  const [edad, setEdad] = useState<string>("");
  const [caracteristicas, setCaracteristicas] = useState<string>("");
  const [foto, setFoto] = useState<File | null>(null);

  const nombreFundacion = location.state?.nombre || "Fundación";

  const [busqueda, setBusqueda] = useState<string>("");

  // 👉 Botón Volver
  const manejarVolver = () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
    } else {
      navigate("/");
    }
  };

  // 👉 Cargar mascotas al inicio
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

  const filtroMascotas = mascotas.filter((mascota) =>
  mascota.nombre.toLowerCase().includes(busqueda.toLowerCase())
);


  // 👉 Manejar envío del formulario
  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("edad", edad);
    formData.append("caracteristicas", caracteristicas);
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mascotas", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const nuevaMascota = await response.json();

        setMascotas((prev) => [...prev, nuevaMascota.data]);

        setMostrarFormulario(false);
        setNombre("");
        setEdad("");
        setCaracteristicas("");
        setFoto(null);

        setMostrarModalExito(true);
      } else {
        alert("Error al guardar la mascota ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la conexión al servidor ❌");
    }
  };

  // 👉 Manejar cambio de archivo
  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <h1 className="text-lg font-bold text-white">
            Bienvenido Fundación ({nombreFundacion})
          </h1>
        </div>

        <button
          onClick={manejarVolver}
          className="bg-white text-black border border-black rounded-[10px] px-4 py-1 hover:bg-gray-100 transition"
        >
          Volver
        </button>
      </header>

      {/* Botones */}
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 mt-8 mb-6">
                <input
          type="text"
          placeholder="🔍 Buscar mascota..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-black px-4 py-2 rounded-lg w-1/3"
        />

        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center border border-black px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          ➕ <span className="ml-2">Agregar mascota</span>
        </button>
      </div>

      {/* Modal Formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Registrar Mascota
            </h2>
            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              <label className="font-semibold">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la mascota"
                className="border border-gray-400 rounded px-3 py-2"
                required
              />

              <label className="font-semibold">Edad</label>
              <input
                type="text"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Edad de la mascota"
                className="border border-gray-400 rounded px-3 py-2"
                required
              />

              <label className="font-semibold">Características</label>
              <input
                type="text"
                value={caracteristicas}
                onChange={(e) => setCaracteristicas(e.target.value)}
                placeholder="Características"
                className="border border-gray-400 rounded px-3 py-2"
              />

              <label className="font-semibold">Foto</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={manejarCambioArchivo}
                className="border border-gray-400 rounded px-3 py-2"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-gray-400 text-white rounded px-4 py-2 hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#008658] text-white rounded px-4 py-2 hover:bg-green-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-bold text-green-600 mb-3">
              ✅ Mascota guardada con éxito
            </h2>
            <button
              onClick={() => setMostrarModalExito(false)}
              className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal Ver más */}
      {mascotaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center shadow-lg relative">
            <button
              onClick={() => setMascotaSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            {mascotaSeleccionada.foto && (
              <img
                src={`http://127.0.0.1:8000/storage/${mascotaSeleccionada.foto}`}
                alt={mascotaSeleccionada.nombre}
                className="w-32 h-32 object-cover mx-auto rounded-full mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{mascotaSeleccionada.nombre}</h2>
            <p className="text-gray-700 mt-2">Edad: {mascotaSeleccionada.edad}</p>
            <p className="text-gray-700 mt-2">
              Características:{" "}
              {mascotaSeleccionada.caracteristicas || "No registradas"}
            </p>
          </div>
        </div>
      )}

      {/* Lista de mascotas */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filtroMascotas.map((mascota) => (
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
                <p className="border border-black px-2 py-1 mb-1 text-sm font-semibold rounded">
                  {mascota.nombre}
                </p>
                <p className="border border-black px-2 py-1 mb-2 text-sm rounded">
                  {mascota.edad}
                </p>
                <button
                  onClick={() => setMascotaSeleccionada(mascota)}
                  className="border border-black px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full"
                >
                  Ver más..
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BienvenidaFundacion;
