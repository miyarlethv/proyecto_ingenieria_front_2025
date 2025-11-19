import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock, X, Download } from "lucide-react";
import { apiFetch } from "../api";
import jsPDF from "jspdf";

interface SolicitudAdopcion {
  id: number;
  mascota_id: number;
  persona_id: number;
  edad: number;
  ciudad_residencia: string;
  ocupacion: string;
  estrato_social: string;
  tiene_hijos: string;
  numero_personas_hogar: number;
  acepta_seguimiento: string;
  estado: string;
  created_at: string;
  mascota?: {
    id: number;
    nombre: string;
    foto?: string;
  };
  persona?: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    nit?: string;
  };
}

function SolicitudAdopcion() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAdopcion | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Cargar solicitudes al inicio
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    setCargando(true);
    try {
      const response = await apiFetch("solicitudes-adopcion");
      if (response.ok) {
        const data = await response.json();
        setSolicitudes(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const cumpleBusqueda = 
      solicitud.persona?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.mascota?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.ciudad_residencia.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === "todas" || solicitud.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  // Ver detalle de solicitud
  const verDetalle = (solicitud: SolicitudAdopcion) => {
    setSolicitudSeleccionada(solicitud);
    setMostrarModalDetalle(true);
  };

  // Cambiar estado de solicitud
  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const response = await apiFetch(`solicitudes-adopcion/${id}/estado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        // Actualizar el estado local
        setSolicitudes((prev) =>
          prev.map((sol) =>
            sol.id === id ? { ...sol, estado: nuevoEstado } : sol
          )
        );
        setMostrarModalDetalle(false);
        setMensajeExito(`Solicitud ${nuevoEstado === "aprobada" ? "aprobada" : "rechazada"} correctamente`);
        setMostrarModalExito(true);
      } else {
        setMensajeError("Error al actualizar el estado de la solicitud");
        setMostrarModalError(true);
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      setMensajeError("Error al actualizar el estado");
      setMostrarModalError(true);
    }
  };

  // Obtener color según estado
  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "aprobada":
        return "bg-green-100 text-green-800 border-green-300";
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Obtener ícono según estado
  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock size={16} />;
      case "aprobada":
        return <CheckCircle size={16} />;
      case "rechazada":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  // Generar PDF de la solicitud
  const generarPDF = (solicitud: SolicitudAdopcion) => {
    try {
      const doc = new jsPDF();
      
      // Título del documento
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Solicitud de Adopción", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-CO")}`, 105, 28, { align: "center" });
      
      let yPosition = 45;

      // Mascota solicitada
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Mascota solicitada", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Nombre:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.mascota?.nombre || "N/A", 70, yPosition);
      yPosition += 6;

      
      yPosition += 8;

      // Información del solicitante
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Información del solicitante", 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      
      // Nombre
      doc.setFont("helvetica", "bold");
      doc.text("Nombre:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.persona?.nombre || "N/A", 70, yPosition);
      yPosition += 6;

      // Email
      doc.setFont("helvetica", "bold");
      doc.text("Email:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.persona?.email || "N/A", 70, yPosition);
      yPosition += 6;

      // Cédula
      doc.setFont("helvetica", "bold");
      doc.text("Cédula:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.persona?.nit || "N/A", 70, yPosition);
      yPosition += 6;

      // Teléfono
      doc.setFont("helvetica", "bold");
      doc.text("Teléfono:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.persona?.telefono || "N/A", 70, yPosition);
      yPosition += 6;

      // Dirección
      doc.setFont("helvetica", "bold");
      doc.text("Dirección:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      const direccion = solicitud.persona?.direccion || "N/A";
      if (direccion.length > 50) {
        const lineas = doc.splitTextToSize(direccion, 120);
        doc.text(lineas, 70, yPosition);
        yPosition += (lineas.length * 6);
      } else {
        doc.text(direccion, 70, yPosition);
        yPosition += 6;
      }

      // Edad
      doc.setFont("helvetica", "bold");
      doc.text("Edad:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${solicitud.edad} años`, 70, yPosition);
      yPosition += 6;

      // Ciudad de residencia
      doc.setFont("helvetica", "bold");
      doc.text("Ciudad de residencia:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.ciudad_residencia, 70, yPosition);
      yPosition += 6;

      // Ocupación
      doc.setFont("helvetica", "bold");
      doc.text("Ocupación:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.ocupacion, 70, yPosition);
      yPosition += 6;

      // Estrato social
      doc.setFont("helvetica", "bold");
      doc.text("Estrato social:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.estrato_social, 70, yPosition);
      yPosition += 6;

      // Tiene hijos
      doc.setFont("helvetica", "bold");
      doc.text("¿Tiene hijos?:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.tiene_hijos, 70, yPosition);
      yPosition += 6;

      // Número de personas en el hogar
      doc.setFont("helvetica", "bold");
      doc.text("Personas en el hogar:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(String(solicitud.numero_personas_hogar), 70, yPosition);
      yPosition += 6;

      // Acepta seguimiento
      doc.setFont("helvetica", "bold");
      doc.text("¿Acepta seguimiento?:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.acepta_seguimiento, 70, yPosition);
      yPosition += 12;

      // Estado de la solicitud
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Estado de la solicitud", 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Estado:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1), 70, yPosition);
      yPosition += 6;

      doc.setFont("helvetica", "bold");
      doc.text("Fecha de solicitud:", 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(solicitud.created_at).toLocaleString("es-CO"), 70, yPosition);

      // Guardar el PDF
      const nombreArchivo = `Solicitud_${solicitud.persona?.nombre?.replace(/\s+/g, "_")}_${solicitud.mascota?.nombre?.replace(/\s+/g, "_")}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Error generando PDF:", error);
      setMensajeError("Error al generar el PDF");
      setMostrarModalError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#008658] mb-2">Solicitudes de Adopción</h1>
        <p className="text-gray-600">Gestiona las solicitudes de adopción de mascotas</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre de persona, mascota o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008658]"
            />
          </div>

          {/* Filtro por estado */}
          <div className="w-full md:w-48">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008658]"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{solicitudes.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-yellow-700">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-800">
              {solicitudes.filter((s) => s.estado === "pendiente").length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700">Aprobadas</p>
            <p className="text-2xl font-bold text-green-800">
              {solicitudes.filter((s) => s.estado === "aprobada").length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-sm text-red-700">Rechazadas</p>
            <p className="text-2xl font-bold text-red-800">
              {solicitudes.filter((s) => s.estado === "rechazada").length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando solicitudes...</p>
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron solicitudes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciudad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocupación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-[#008658] flex items-center justify-center text-white font-semibold">
                            {solicitud.persona?.nombre?.charAt(0).toUpperCase() || "?"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {solicitud.persona?.nombre || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {solicitud.persona?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {solicitud.mascota?.foto && (
                          <img
                            src={`http://127.0.0.1:8000/storage/${solicitud.mascota.foto}`}
                            alt={solicitud.mascota.nombre}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.mascota?.nombre || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{solicitud.ciudad_residencia}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{solicitud.ocupacion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${obtenerColorEstado(
                          solicitud.estado
                        )}`}
                      >
                        {obtenerIconoEstado(solicitud.estado)}
                        {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.created_at).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => verDetalle(solicitud)}
                        className="text-[#008658] hover:text-[#006f49] inline-flex items-center gap-1"
                      >
                        <Eye size={18} />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">{mensajeExito}</p>
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
            <XCircle size={48} className="text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="mb-4 text-gray-700">{mensajeError}</p>
            <button
              onClick={() => setMostrarModalError(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {mostrarModalDetalle && solicitudSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMostrarModalDetalle(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#008658] mb-4">Detalle de Solicitud</h2>

            {/* Información de la mascota */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Mascota solicitada</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {solicitudSeleccionada.mascota?.foto && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${solicitudSeleccionada.mascota.foto}`}
                      alt={solicitudSeleccionada.mascota.nombre}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-xl">{solicitudSeleccionada.mascota?.nombre || "N/A"}</p>
                  </div>
                </div>
                <button
                  onClick={() => generarPDF(solicitudSeleccionada)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#008658] text-white rounded-lg hover:bg-[#006f49] transition font-semibold -mt-6"
                  title="Descargar PDF"
                >
                  <Download size={18} />
                  Descargar PDF
                </button>
              </div>
            </div>

            {/* Información del solicitante */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Información del solicitante</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium">{solicitudSeleccionada.persona?.nombre || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{solicitudSeleccionada.persona?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cédula</p>
                  <p className="font-medium">{solicitudSeleccionada.persona?.nit || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{solicitudSeleccionada.persona?.telefono || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium">{solicitudSeleccionada.persona?.direccion || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-medium">{solicitudSeleccionada.edad} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ciudad de residencia</p>
                  <p className="font-medium">{solicitudSeleccionada.ciudad_residencia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ocupación</p>
                  <p className="font-medium">{solicitudSeleccionada.ocupacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estrato social</p>
                  <p className="font-medium">{solicitudSeleccionada.estrato_social}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">¿Tiene hijos?</p>
                  <p className="font-medium">{solicitudSeleccionada.tiene_hijos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número de personas en el hogar</p>
                  <p className="font-medium">{solicitudSeleccionada.numero_personas_hogar}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">¿Acepta seguimiento?</p>
                  <p className="font-medium">{solicitudSeleccionada.acepta_seguimiento}</p>
                </div>
              </div>
            </div>

            {/* Estado y acciones */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Estado de la solicitud</h3>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${obtenerColorEstado(
                    solicitudSeleccionada.estado
                  )}`}
                >
                  {obtenerIconoEstado(solicitudSeleccionada.estado)}
                  {solicitudSeleccionada.estado.charAt(0).toUpperCase() +
                    solicitudSeleccionada.estado.slice(1)}
                </span>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(solicitudSeleccionada.created_at).toLocaleString("es-CO")}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            {solicitudSeleccionada.estado === "pendiente" && (
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => cambiarEstado(solicitudSeleccionada.id, "rechazada")}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                >
                  <XCircle size={20} />
                  Rechazar
                </button>
                <button
                  onClick={() => cambiarEstado(solicitudSeleccionada.id, "aprobada")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Aprobar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SolicitudAdopcion;
