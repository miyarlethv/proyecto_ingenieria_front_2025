import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, CheckCircle2, Bell } from "lucide-react";
import { apiFetch } from "../api";
import type { Notificacion } from "../types/Notificacion";
import logoIndex from "../assets/LogoIndex.jpg";

function BienvenidoUsuario() {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreUsuario = location.state?.nombre || "Usuario";

  const [mascotas, setMascotas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);
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

  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarModalNotificaciones, setMostrarModalNotificaciones] = useState(false);

  // Cargar mascotas
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

  // Cargar notificaciones
  useEffect(() => {
    const fetchNotificaciones = async () => {
      const res = await apiFetch("notificaciones");
      if (res.ok) {
        const data = await res.json();
        setNotificaciones(data);
      }
    };
    fetchNotificaciones();
  }, []);

  const manejarVolver = () => navigate("/");

  const handleChangeAdopcion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosAdopcion(prev => ({ ...prev, [name]: value }));
  };

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

  const abrirFormularioAdopcion = () => setMostrarFormularioAdopcion(true);
  const cerrarFormularioAdopcion = () => {
    setMostrarFormularioAdopcion(false);
    setMascotaSeleccionada(null);
    limpiarFormularioAdopcion();
  };

  const enviarSolicitudAdopcion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(datosAdopcion).some(val => val === "")) {
      setMensajeError("Por favor completa todos los campos");
      setMostrarModalError(true);
      return;
    }
    if (parseInt(datosAdopcion.estrato) < 1 || parseInt(datosAdopcion.estrato) > 6) {
      setMensajeError("El estrato social debe estar entre 1 y 6");
      setMostrarModalError(true);
      return;
    }
    if (parseInt(datosAdopcion.edad) < 18) {
      setMensajeError("Debes ser mayor de 18 años para adoptar");
      setMostrarModalError(true);
      return;
    }
    if (parseInt(datosAdopcion.numeroPersonas) < 1) {
      setMensajeError("Número de personas inválido");
      setMostrarModalError(true);
      return;
    }

    try {
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

      const response = await apiFetch("solicitudes-adopcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        limpiarFormularioAdopcion();
        setMostrarFormularioAdopcion(false);
        setMascotaSeleccionada(null);
        setMostrarModalExito(true);
      } else {
        setMensajeError(data.message || "Error al enviar la solicitud");
        setMostrarModalError(true);
      }
    } catch {
      setMensajeError("No se pudo enviar la solicitud");
      setMostrarModalError(true);
    }
  };

  // Marcar notificación como leída
  const handleCerrarNotificacion = async (id: number) => {
    try {
      const res = await apiFetch(`notificaciones/${id}/marcar-leida`, { method: "POST" });
      if (res.ok) {
        setNotificaciones(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      } else {
        setMensajeError("No se pudo marcar como leída en el servidor");
        setMostrarModalError(true);
      }
    } catch (error) {
      setMensajeError("Error de conexión al marcar como leída");
      setMostrarModalError(true);
    }
  };

  const mascotasFiltradas = mascotas.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HEADER CON LOGO ========== */}
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Logo de la aplicación (igual que en index.tsx) */}
          <img src={logoIndex} alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-lg font-bold text-white">
            Bienvenido Usuario ({nombreUsuario})
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Campana de notificaciones */}
          <div className="relative">
            <button
              onClick={() => setMostrarModalNotificaciones((v) => !v)}
              className="relative bg-white text-[#008658] border border-[#008658] px-3 py-2 rounded-full hover:bg-[#a0a8a5] hover:text-white transition shadow"
            >
              <Bell size={24} />
              {notificaciones.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
                  {notificaciones.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Dropdown de notificaciones */}
            {mostrarModalNotificaciones && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <div className="flex justify-between items-center border-b">
                  <h2 className="text-base font-bold p-3">Notificaciones</h2>
                  <button
                    onClick={() => setMostrarModalNotificaciones(false)}
                    className="p-2 text-gray-500 hover:text-black"
                    title="Cerrar"
                  >
                    <X size={20} />
                  </button>
                </div>
                {notificaciones.length === 0 ? (
                  <p className="text-gray-500 p-3">No tienes notificaciones.</p>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {notificaciones.map((n) => (
                      <li key={n.id} className={`flex items-center justify-between px-4 py-3 border-b ${n.read ? 'bg-gray-100' : 'bg-green-100 border-green-600'}`}>
                        <div className="text-left">
                          <span className="block text-sm">{n.message}</span>
                          <span className="block text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        {!n.read && (
                          <button
                            className="ml-2 text-green-600 hover:text-green-800"
                            onClick={() => handleCerrarNotificacion(n.id)}
                            title="Marcar como leída"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={manejarVolver}
            className="bg-white text-[#008658] border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#a0a8a5] hover:text-white transition shadow"
          >
            Volver
          </button>
        </div>
      </header>

      {/* ========== BUSCADOR ========== */}
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

      {/* ========== MODAL: VER MÁS MASCOTA ========== */}
      {mascotaSeleccionada && !mostrarFormularioAdopcion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setMascotaSeleccionada(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            
            <div className="text-center pt-2">
              {mascotaSeleccionada.foto && (
                <img
                  src={`http://127.0.0.1:8000/storage/${mascotaSeleccionada.foto}`}
                  alt={mascotaSeleccionada.nombre}
                  className="w-32 h-32 object-cover mx-auto rounded-full mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-3">{mascotaSeleccionada.nombre}</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Edad:</span> {mascotaSeleccionada.edad}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Características:</span>{" "}
                {mascotaSeleccionada.caracteristicas || "No registradas"}
              </p>
              <button
                onClick={abrirFormularioAdopcion}
                className="w-full bg-[#008658] text-white px-6 py-2 rounded-lg hover:bg-[#006f49] transition font-semibold"
              >
                Adoptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: FORMULARIO DE ADOPCIÓN ========== */}
      {mostrarFormularioAdopcion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={cerrarFormularioAdopcion}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-[#008658] mb-2 text-center pt-2">
              Formulario de Adopción
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Adoptar a: <span className="font-semibold">{mascotaSeleccionada?.nombre}</span>
            </p>
            
            <form onSubmit={enviarSolicitudAdopcion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                  <input
                    type="number"
                    name="edad"
                    value={datosAdopcion.edad}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    placeholder="Ingresa tu edad"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={datosAdopcion.ciudad}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    placeholder="Ingresa tu ciudad"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación *</label>
                  <input
                    type="text"
                    name="ocupacion"
                    value={datosAdopcion.ocupacion}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    placeholder="Ingresa tu ocupación"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estrato *</label>
                  <input
                    type="number"
                    name="estrato"
                    value={datosAdopcion.estrato}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    placeholder="1-6"
                    min="1"
                    max="6"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Tiene hijos? *</label>
                  <select
                    name="tieneHijos"
                    value={datosAdopcion.tieneHijos}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de personas en el hogar *
                  </label>
                  <input
                    type="number"
                    name="numeroPersonas"
                    value={datosAdopcion.numeroPersonas}
                    onChange={handleChangeAdopcion}
                    className="w-full px-3 py-2 border border-green-600 rounded-lg"
                    placeholder="Número de personas"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Acepta visitas o seguimiento? *
                </label>
                <select
                  name="aceptaVisitas"
                  value={datosAdopcion.aceptaVisitas}
                  onChange={handleChangeAdopcion}
                  className="w-full px-3 py-2 border border-green-600 rounded-lg"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              
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

      {/* ========== MODAL: ÉXITO ========== */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg text-center">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">Tu solicitud de adopción se ha enviado correctamente.</p>
            <button
              onClick={() => setMostrarModalExito(false)}
              className="bg-[#008658] text-white px-6 py-2 rounded hover:bg-[#006f49] transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* ========== MODAL: ERROR ========== */}
      {mostrarModalError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            {/* Botón X en la esquina superior derecha */}
            <button
              onClick={() => setMostrarModalError(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Contenido del modal */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Error</h3>
              <p className="text-gray-600 mb-6">{mensajeError}</p>
              <button
                onClick={() => setMostrarModalError(false)}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== LISTA DE MASCOTAS ========== */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                {m.foto ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${m.foto}`}
                    alt={m.nombre}
                    className="w-24 h-24 object-cover mb-3 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />
                )}
                <div className="text-center w-full">
                  <p className="text-xs text-black font-medium">Nombre</p>
                  <p className="border border-green-600 px-2 py-1 mb-1 text-sm rounded">
                    {m.nombre}
                  </p>
                  <p className="text-xs text-black font-medium">Edad</p>
                  <p className="border border-green-600 px-2 py-1 mb-2 text-sm rounded">
                    {m.edad}
                  </p>
                  <button
                    onClick={() => setMascotaSeleccionada(m)}
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