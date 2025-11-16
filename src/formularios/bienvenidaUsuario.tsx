import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../api";

function BienvenidoUsuario() {
  const location = useLocation();
  const nombreUsuario = location.state?.nombre || "Usuario";

  // Estado para mascotas
  const [mascotas, setMascotas] = useState<any[]>([]);

  // Estado búsqueda
  const [busqueda, setBusqueda] = useState<string>("");

  // Estado para modal "Ver más"
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);
  
  // Estado para modal de adopción
  const [mostrarFormularioAdopcion, setMostrarFormularioAdopcion] = useState(false);
  const [datosAdopcion, setDatosAdopcion] = useState({
    edad: "",
    ciudad: "",
    ocupacion: "",
    estrato: "",
    tieneHijos: "",
    numeroPersonas: "",
    aceptaVisitas: ""
  });

  // Estados para modales de éxito y error
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const navigate = useNavigate();
  
  const manejarVolver = () => {
    navigate("/");
  };

  // Cargar mascotas desde la API
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await apiFetch("mascotas");
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

  // Manejar cambios en el formulario de adopción
  const handleChangeAdopcion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosAdopcion(prev => ({ ...prev, [name]: value }));
  };

  // Limpiar formulario de adopción
  const limpiarFormularioAdopcion = () => {
    setDatosAdopcion({
      edad: "",
      ciudad: "",
      ocupacion: "",
      estrato: "",
      tieneHijos: "",
      numeroPersonas: "",
      aceptaVisitas: ""
    });
  };

  // Abrir formulario de adopción
  const abrirFormularioAdopcion = () => {
    setMostrarFormularioAdopcion(true);
  };

  // Cerrar formulario de adopción
  const cerrarFormularioAdopcion = () => {
    setMostrarFormularioAdopcion(false);
    setMascotaSeleccionada(null);
    limpiarFormularioAdopcion();
  };

  // Enviar solicitud de adopción
  const enviarSolicitudAdopcion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos estén llenos
    if (Object.values(datosAdopcion).some(val => val === "")) {
      setMensajeError("Por favor completa todos los campos");
      setMostrarModalError(true);
      return;
    }

    // Validar estrato
    const estratoNum = parseInt(datosAdopcion.estrato);
    if (estratoNum < 1 || estratoNum > 6) {
      setMensajeError("El estrato social debe estar entre 1 y 6");
      setMostrarModalError(true);
      return;
    }

    // Validar edad
    const edadNum = parseInt(datosAdopcion.edad);
    if (edadNum < 18) {
      setMensajeError("Debes ser mayor de 18 años para adoptar");
      setMostrarModalError(true);
      return;
    }

    // Validar número de personas
    const numPersonas = parseInt(datosAdopcion.numeroPersonas);
    if (numPersonas < 1) {
      setMensajeError("El número de personas en el hogar debe ser al menos 1");
      setMostrarModalError(true);
      return;
    }

    try {
      // Mapear los campos del formulario a los nombres que espera el backend
      const payload = {
        mascota_id: mascotaSeleccionada.id,
        edad: parseInt(datosAdopcion.edad),
        ciudad_residencia: datosAdopcion.ciudad,
        ocupacion: datosAdopcion.ocupacion,
        estrato_social: datosAdopcion.estrato,
        tiene_hijos: datosAdopcion.tieneHijos === "si" ? "Sí" : "No",
        numero_personas_hogar: parseInt(datosAdopcion.numeroPersonas),
        acepta_seguimiento: datosAdopcion.aceptaVisitas === "si" ? "Sí" : "No"
      };

      console.log("Enviando al backend:", payload);

      // Usar apiFetch que maneja el token automáticamente
      const response = await apiFetch("solicitudes-adopcion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        // Limpiar formulario y cerrar modales
        limpiarFormularioAdopcion();
        setMostrarFormularioAdopcion(false);
        setMascotaSeleccionada(null);
        setMostrarModalExito(true);
      } else {
        // Mostrar el mensaje de error específico del backend
        setMensajeError(data.message || "Error al enviar la solicitud");
        setMostrarModalError(true);
        console.error("Error del servidor:", data);
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setMensajeError("Error al enviar la solicitud. Intenta de nuevo.");
      setMostrarModalError(true);
    }
  };

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
          className="bg-white text-[#008658] border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#a0a8a5] hover:text-white transition shadow"
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
      {mascotaSeleccionada && !mostrarFormularioAdopcion && (
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
            
            {/* Botón Adoptar */}
            <button
              onClick={abrirFormularioAdopcion}
              className="mt-4 bg-[#008658] text-white px-6 py-2 rounded-lg hover:bg-[#006f49] transition font-semibold"
            >
              Adoptar
            </button>
          </div>
        </div>
      )}

      {/* Modal Formulario de Adopción */}
      {mostrarFormularioAdopcion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={cerrarFormularioAdopcion}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-[#008658] mb-2 text-center">
              Formulario de Adopción
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Adoptar a: <span className="font-semibold">{mascotaSeleccionada.nombre}</span>
            </p>

            <form onSubmit={enviarSolicitudAdopcion} className="space-y-4">
              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad *
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={datosAdopcion.edad}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Ingresa tu edad"
                    required
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad de residencia *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={datosAdopcion.ciudad}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Ingresa tu ciudad"
                    required
                  />
                </div>

                {/* Ocupación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ocupación *
                  </label>
                  <input
                    type="text"
                    name="ocupacion"
                    value={datosAdopcion.ocupacion}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Ingresa tu ocupación"
                    required
                  />
                </div>

                {/* Estrato social */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estrato social *
                  </label>
                  <input
                    type="number"
                    name="estrato"
                    value={datosAdopcion.estrato}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="1-6"
                    min="1"
                    max="6"
                    required
                  />
                </div>

                {/* Tiene hijos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Tiene hijos? *
                  </label>
                  <select
                    name="tieneHijos"
                    value={datosAdopcion.tieneHijos}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Número de personas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de personas en el hogar *
                  </label>
                  <input
                    type="number"
                    name="numeroPersonas"
                    value={datosAdopcion.numeroPersonas}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Número de personas"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Acepta visitas - Campo completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Acepta procesos de seguimiento o visitas de la fundación? *
                </label>
                <select
                  name="aceptaVisitas"
                  value={datosAdopcion.aceptaVisitas}
                  onChange={handleChangeAdopcion}
                  className="w-full px-3 py-2 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={cerrarFormularioAdopcion}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#008658] text-white rounded-lg hover:bg-[#006f49] transition font-semibold"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">Tu solicitud de adopción se ha enviado correctamente.</p>
            <button
              onClick={() => setMostrarModalExito(false)}
              className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-[#006f49] transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Error */}
      {mostrarModalError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <X size={48} className="text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="mb-4 text-gray-700">{mensajeError}</p>
            <button
              onClick={() => setMostrarModalError(false)}
              className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-[#006f49] transition"
            >
              Cerrar
            </button>
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
                  <p className="border border-green-600 px-2 py-1 mb-1 text-sm rounded">
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