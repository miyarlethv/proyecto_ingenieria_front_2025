import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Trash2, Pencil, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { apiFetch, tienePermiso } from "../api";
import jsPDF from "jspdf";
import ModalError from "../components/ModalError";
import { useModalError } from "../hooks/useModalError";

const CrearHistoria: React.FC = () => {
  const { modalError, mostrarError, cerrarError } = useModalError();
  
  // 🔹 Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState<{
    tipo: "eliminar" | "actualizar" | null;
    historiaId?: number;
  }>({ tipo: null });
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const [formData, setFormData] = useState({
    fecha: "",
    descripcion: "",
    nombre_responsable: "",
    telefono: "",
    cargo: "",
    tipo: "",
  });
  const [editData, setEditData] = useState<any>(null);
  const [error, setError] = useState("");
  const [historias, setHistorias] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  const { mascotaId } = useParams();

  // 🔹 Interfaces
  interface Funcionario {
    id: number;
    nombre: string;
    email: string;
    roles: string[];
    rol_principal: string;
  }

  interface Mascota {
    id: number;
    nombre: string;
    edad: string;
  }

  // 🔹 Cargar funcionarios y mascotas
  useEffect(() => {
    const obtenerFuncionarios = async () => {
      try {
        // ✅ Esta ruta es pública, no necesita token
        const respuesta = await fetch("http://127.0.0.1:8000/api/ListarFuncionariosConRoles");
        console.log("📡 Respuesta funcionarios:", respuesta.status, respuesta.ok);
        if (!respuesta.ok) {
          console.error("❌ Error al cargar funcionarios:", respuesta.status);
          return;
        }
        const data = await respuesta.json();
        console.log("📋 Funcionarios obtenidos:", data);
        setFuncionarios(data);
      } catch (error) {
        console.error("❌ Error al obtener los funcionarios:", error);
      }
    };

    const obtenerMascotas = async () => {
      try {
        // ✅ Esta ruta también es pública
        const respuesta = await fetch("http://127.0.0.1:8000/api/mascotas");
        const data = await respuesta.json();
        setMascotas(data);
      } catch (error) {
        console.error("Error al obtener las mascotas:", error);
      }
    };

    obtenerFuncionarios();
    obtenerMascotas();
  }, []);

  // 🔹 Abrir y cerrar modales
  const abrirModal = () => {
    if (!tienePermiso('CrearHistoriaClinica')) {
      mostrarError("No tienes permiso para crear historias clínicas");
      return;
    }
    setIsModalOpen(true);
  };
  const cerrarModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const cerrarEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const cerrarModalConfirmacion = () =>
    setModalConfirmacion({ tipo: null, historiaId: undefined });

  // const cerrarModalExito = () => setMostrarModalExito(false);

  // 🔹 Manejo de inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Si cambia el nombre del responsable (funcionario), traemos su rol automáticamente
    if (name === "nombre_responsable") {
      const funcionarioSeleccionado = funcionarios.find((f) => f.nombre === value);
      setFormData({
        ...formData,
        nombre_responsable: value,
        cargo: funcionarioSeleccionado ? funcionarioSeleccionado.rol_principal : "",
      });
    } else if (name === "mascota_nombre") {
      // Si cambia la mascota, traemos su edad automáticamente
      const mascotaSeleccionada = mascotas.find((m) => m.nombre === value);
      setFormData({
        ...formData,
        telefono: mascotaSeleccionada ? mascotaSeleccionada.edad : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nombre_responsable") {
      const funcionarioSeleccionado = funcionarios.find((f) => f.nombre === value);
      setEditData({
        ...editData,
        nombre_responsable: value,
        cargo: funcionarioSeleccionado ? funcionarioSeleccionado.rol_principal : "",
      });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // 🔹 Crear historia clínica
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const dataAEnviar = { mascota_id: mascotaId, ...formData };

    try {
      // ✅ USAR apiFetch para enviar el token automáticamente
      const response = await apiFetch("CrearHistoriaClinica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataAEnviar),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la historia clínica");
      }

      await response.json();

      setFormData({
        fecha: "",
        descripcion: "",
        nombre_responsable: "",
        telefono: "",
        cargo: "",
        tipo: "",
      });
      cerrarModal();
      setMostrarModalExito(true);
      cargarHistorias();
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setError("❌ Ocurrió un error al guardar la historia clínica.");
    }
  };

  // 🔹 Cargar historias
  const cargarHistorias = async () => {
    if (!mascotaId) return;

    try {
      // ✅ USAR apiFetch para enviar el token
      const response = await apiFetch(
        `ListarHistoriasClinicas?mascota_id=${mascotaId}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar historias");
      }

      const data = await response.json();
      setHistorias(data.data || []);
    } catch (err) {
      console.error("❌ Error al cargar historias:", err);
    }
  };

  useEffect(() => {
    cargarHistorias();
  }, [mascotaId]);

  // 🔹 Confirmar eliminación
  const confirmarEliminar = (id: number) => {
    if (!tienePermiso('EliminarHistoriaClinica')) {
      mostrarError("No tienes permiso para eliminar historias clínicas");
      return;
    }
    setModalConfirmacion({ tipo: "eliminar", historiaId: id });
  };

  // 🔹 Confirmar actualización
  const confirmarActualizar = () => {
    setModalConfirmacion({ tipo: "actualizar" });
  };

  // 🔹 Eliminar historia
  const eliminarHistoria = async () => {
    if (!modalConfirmacion.historiaId) return;

    try {
      // ✅ USAR apiFetch para enviar el token
      const response = await apiFetch("EliminarHistoriaClinica", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modalConfirmacion.historiaId }),
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar");
      }

      setModalConfirmacion({ tipo: null });
      setMostrarModalExito(true);
      cargarHistorias();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      mostrarError("Error al eliminar la historia clínica. Verifica que tengas los permisos necesarios.");
    }
  };

  // 🔹 Abrir modal de edición
  const abrirModalEditar = (historia: any) => {
    if (!tienePermiso('ActualizarHistoriaClinica')) {
      mostrarError("No tienes permiso para editar historias clínicas");
      return;
    }
    setEditData(historia);
    setIsEditModalOpen(true);
  };

  // 🔹 Guardar edición
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    confirmarActualizar();
  };

  // 🔹 Actualizar historia clínica
  const actualizarHistoria = async () => {
    try {
      // ✅ USAR apiFetch para enviar el token
      const response = await apiFetch("ActualizarHistoriaClinica", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar");
      }

      cerrarEditModal();
      setModalConfirmacion({ tipo: null });
      setMostrarModalExito(true);
      cargarHistorias();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      mostrarError("Ocurrió un error al actualizar. Verifica que tengas los permisos necesarios.");
    }
  };

  // 🔹 Descargar historias clínicas en PDF
  const descargarPDF = async () => {
    if (historias.length === 0) {
      mostrarError("No hay historias clínicas para descargar");
      return;
    }

    try {
      // Obtener el nombre de la mascota
      const mascota = mascotas.find((m) => m.id === Number(mascotaId));
      const nombreMascota = mascota ? mascota.nombre : "Mascota";

      const doc = new jsPDF();
      
      // Título del documento
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`Historia Clínica - ${nombreMascota}`, 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
      
      let yPosition = 40;

      // Agregar cada historia clínica
      historias.forEach((historia, index) => {
        // Verificar si necesitamos una nueva página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Separador
        if (index > 0) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition, 190, yPosition);
          yPosition += 8;
        }

        // Número de registro
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Registro #${index + 1}`, 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        
        // Fecha
        doc.text("Fecha:", 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(historia.fecha || "N/A", 50, yPosition);
        yPosition += 6;

        // Tipo de procedimiento
        doc.setFont("helvetica", "bold");
        doc.text("Tipo:", 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(historia.tipo || "N/A", 50, yPosition);
        yPosition += 6;

        // Responsable
        doc.setFont("helvetica", "bold");
        doc.text("Responsable:", 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(historia.nombre_responsable || "N/A", 50, yPosition);
        yPosition += 6;

        // Cargo
        doc.setFont("helvetica", "bold");
        doc.text("Cargo:", 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(historia.cargo || "N/A", 50, yPosition);
        yPosition += 6;

        // Descripción
        doc.setFont("helvetica", "bold");
        doc.text("Descripción:", 20, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        
        // Dividir la descripción en líneas si es muy larga
        const descripcion = historia.descripcion || "N/A";
        const lineasDescripcion = doc.splitTextToSize(descripcion, 170);
        doc.text(lineasDescripcion, 20, yPosition);
        yPosition += lineasDescripcion.length * 5 + 8;
      });

      // Descargar el PDF
      doc.save(`Historia_Clinica_${nombreMascota}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      mostrarError("Error al generar el PDF");
    }
  };

  return (
    <div className="w-[95%] mx-auto bg-white p-6 rounded-2xl shadow">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-200">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Historia clínica</h1>
          <div className="flex gap-3">
            <button
              onClick={descargarPDF}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              title="Descargar todas las historias en PDF"
            >
              <Download size={18} />
              Descargar PDF
            </button>
            
            <button
              onClick={abrirModal}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Crear Historia
            </button>
          </div>
        </div>

        {/* Tabla de historias */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Fecha</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Responsable</th>
              <th className="p-2">Cargo</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historias.length > 0 ? (
              historias.map((historia) => (
                <tr key={historia.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-center">{historia.fecha}</td>
                  <td className="p-2">{historia.tipo}</td>
                  <td className="p-2">{historia.descripcion}</td>
                  <td className="p-2">{historia.nombre_responsable}</td>
                  <td className="p-2">{historia.cargo}</td>
                  <td className="p-2 flex justify-center gap-4">
                    <button
                      onClick={() => abrirModalEditar(historia)}
                      className="text-black hover:text-blue-700"
                      title="Editar"
                    >
                      <Pencil size={20} />
                    </button>
                    
                    <button
                      onClick={() => confirmarEliminar(historia.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">
                  No hay historias clínicas registradas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 Modal de creación */}
      {isModalOpen && (
        <ModalHistoria
          titulo="Nueva Historia Clínica"
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          cerrarModal={cerrarModal}
          error={error}
          funcionarios={funcionarios}
        />
      )}

      {/* 🟣 Modal de edición */}
      {isEditModalOpen && editData && (
        <ModalHistoria
          titulo="Editar Historia Clínica"
          formData={editData}
          handleChange={handleEditChange}
          handleSubmit={handleEditSubmit}
          cerrarModal={cerrarEditModal}
          error={error}
          funcionarios={funcionarios}
        />
      )}

      {/* 🔔 Modal de confirmación */}
      {modalConfirmacion.tipo && (
        <ModalConfirmacion
          tipo={modalConfirmacion.tipo}
          confirmar={
            modalConfirmacion.tipo === "eliminar"
              ? eliminarHistoria
              : actualizarHistoria
          }
          cancelar={cerrarModalConfirmacion}
        />
      )}

      {/* 🟢 Modal de éxito */}
      {mostrarModalExito && <ModalExito cerrarModal={() => setMostrarModalExito(false)} />}

      {/* Modal de error */}
      <ModalError
        mostrar={modalError.mostrar}
        titulo={modalError.titulo}
        mensaje={modalError.mensaje}
        onCerrar={cerrarError}
      />
    </div>
  );
};

export default CrearHistoria;

/* ===========================
   🔸 MODAL DE HISTORIA CLÍNICA
=========================== */
interface ModalProps {
  titulo: string;
  formData: any;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent) => void;
  cerrarModal: () => void;
  error: string;
  funcionarios: any[];
}

const ModalHistoria: React.FC<ModalProps> = ({
  titulo,
  formData,
  handleChange,
  handleSubmit,
  cerrarModal,
  error,
  funcionarios,
}) => {
  console.log("🔍 Funcionarios en modal:", funcionarios);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">{titulo}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md text-center">
              {error}
            </div>
          )}

          <label className="block font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
            required
          />

          <label className="block font-medium text-gray-700 mb-1">
            Descripción del procedimiento
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Describe el procedimiento realizado..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
            required
          />

          {/* 🔹 Nombre del responsable (funcionario) */}
          <label className="block font-medium text-gray-700 mb-1">
            Nombre del responsable
          </label>
          <select
            name="nombre_responsable"
            value={formData.nombre_responsable}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
            required
          >
            <option value="">Selecciona un funcionario</option>
            {funcionarios.map((func) => (
              <option key={func.id} value={func.nombre}>
                {func.nombre}
              </option>
            ))}
          </select>

          {/* 🔹 Cargo (se llena automáticamente) */}
          <label className="block font-medium text-gray-700 mb-1">Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 focus:ring-green-200 focus:outline-none"
            placeholder="Se llenará automáticamente al seleccionar el funcionario"
            readOnly
            required
          />

          {/* 🔹 Tipo de procedimiento */}
          <label className="block font-medium text-gray-700 mb-1">
            Tipo de procedimiento
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Desparasitación">Desparasitación</option>
            <option value="Control general">Control general</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Esterilización">Esterilización</option>
            <option value="Urgencia">Urgencia</option>
            <option value="Otro">Otro</option>
          </select>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#008658] text-white font-semibold hover:bg-green-700 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ===========================
   🔸 MODAL DE CONFIRMACIÓN
=========================== */
interface ModalConfirmacionProps {
  tipo: "eliminar" | "actualizar";
  confirmar: () => void;
  cancelar: () => void;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  tipo,
  confirmar,
  cancelar,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
      <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">
        {tipo === "eliminar"
          ? "¿Deseas eliminar esta historia clínica?"
          : "¿Deseas actualizar esta historia clínica?"}
      </h3>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={confirmar}
          className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirmar
        </button>
        <button
          onClick={cancelar}
          className="border border-gray-400 px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

/* ===========================
   🔸 MODAL DE ÉXITO
=========================== */
interface ModalExitoProps {
  cerrarModal: () => void;
}

const ModalExito: React.FC<ModalExitoProps> = ({ cerrarModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
      <p className="mb-4">La historia clínica se ha procesado correctamente.</p>
      <button
        onClick={cerrarModal}
        className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Aceptar
      </button>
    </div>
  </div>
);
