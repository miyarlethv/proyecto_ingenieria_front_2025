import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Trash2, Pencil, AlertTriangle } from "lucide-react";

const CrearHistoria: React.FC = () => {
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
    telefono: "", // usaremos este campo para la edad
    cargo: "",
    tipo: "",
  });
  const [editData, setEditData] = useState<any>(null);
  const [error, setError] = useState("");
  const [historias, setHistorias] = useState<any[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  const navigate = useNavigate();
  const { mascotaId } = useParams();

  // 🔹 Interfaces
  interface Rol {
    id: number;
    nombre: string;
  }

  interface Mascota {
    id: number;
    nombre: string;
    edad: string;
  }

  // 🔹 Cargar roles y mascotas
  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/ListarRoles");
        const data = await respuesta.json();
        setRoles(data);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    const obtenerMascotas = async () => {
      try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/mascotas");
        const data = await respuesta.json();
        setMascotas(data);
      } catch (error) {
        console.error("Error al obtener las mascotas:", error);
      }
    };

    obtenerRoles();
    obtenerMascotas();
  }, []);

  // 🔹 Abrir y cerrar modales
  const abrirModal = () => setIsModalOpen(true);
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

  const cerrarModalExito = () => setMostrarModalExito(false);

  // 🔹 Manejo de inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Si cambia el nombre de la mascota, traemos su edad automáticamente
    if (name === "nombre_responsable") {
      const mascotaSeleccionada = mascotas.find((m) => m.nombre === value);
      setFormData({
        ...formData,
        nombre_responsable: value,
        telefono: mascotaSeleccionada ? mascotaSeleccionada.edad : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 🔹 Crear historia clínica
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const dataAEnviar = { mascota_id: mascotaId, ...formData };

    fetch("http://127.0.0.1:8000/api/CrearHistoriaClinica", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataAEnviar),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo guardar la historia clínica");
        return res.json();
      })
      .then(() => {
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
      })
      .catch(() =>
        setError("❌ Ocurrió un error al guardar la historia clínica.")
      );
  };

  // 🔹 Cargar historias
  const cargarHistorias = () => {
    if (!mascotaId) return;

    fetch(
      `http://127.0.0.1:8000/api/ListarHistoriasClinicas?mascota_id=${mascotaId}`
    )
      .then((res) => res.json())
      .then((data) => setHistorias(data.data || []))
      .catch((err) => console.error("Error al cargar historias:", err));
  };

  useEffect(() => {
    cargarHistorias();
  }, [mascotaId]);

  // 🔹 Confirmar eliminación
  const confirmarEliminar = (id: number) => {
    setModalConfirmacion({ tipo: "eliminar", historiaId: id });
  };

  // 🔹 Confirmar actualización
  const confirmarActualizar = () => {
    setModalConfirmacion({ tipo: "actualizar" });
  };

  // 🔹 Eliminar historia
  const eliminarHistoria = () => {
    if (!modalConfirmacion.historiaId) return;

    fetch("http://127.0.0.1:8000/api/EliminarHistoriaClinica", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: modalConfirmacion.historiaId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar");
        setModalConfirmacion({ tipo: null });
        setMostrarModalExito(true);
        cargarHistorias();
      })
      .catch(() => alert("Error al eliminar la historia clínica"));
  };

  // 🔹 Abrir modal de edición
  const abrirModalEditar = (historia: any) => {
    setEditData(historia);
    setIsEditModalOpen(true);
  };

  // 🔹 Guardar edición
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    confirmarActualizar();
  };

  // 🔹 Actualizar historia clínica
  const actualizarHistoria = () => {
    fetch("http://127.0.0.1:8000/api/ActualizarHistoriaClinica", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar");
        cerrarEditModal();
        setModalConfirmacion({ tipo: null });
        setMostrarModalExito(true);
        cargarHistorias();
      })
      .catch(() => alert("Ocurrió un error al actualizar"));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-start">
      {/* Contenedor principal */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl border border-gray-200">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Historia clínica</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/HistoriaClinica")}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Volver
            </button>
            <button
              onClick={abrirModal}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Listado de historias */}
        <div className="border-2 border-gray-300 rounded-xl h-64 p-4 overflow-y-auto">
          {historias.length > 0 ? (
            <ul className="space-y-3">
              {historias.map((historia) => (
                <li
                  key={historia.id}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Fecha:</span> {historia.fecha}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Tipo:</span> {historia.tipo}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Descripción:</span> {historia.descripcion}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => abrirModalEditar(historia)}
                      className="text-black hover:text-black transition"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminar(historia.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No hay historias clínicas registradas aún.
            </p>
          )}
        </div>
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
          roles={roles}
          mascotas={mascotas}
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
          roles={roles}
          mascotas={mascotas}
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
      {mostrarModalExito && <ModalExito cerrarModal={cerrarModalExito} />}
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
  roles: any[];
  mascotas: any[];
}

const ModalHistoria: React.FC<ModalProps> = ({
  titulo,
  formData,
  handleChange,
  handleSubmit,
  cerrarModal,
  error,
  roles,
  mascotas,
}) => (
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
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
          required
        />

        {/* 🔹 Nombre de mascota */}
        <label className="block font-medium text-gray-700 mb-1">
          Nombre de mascota
        </label>
        <select
          name="nombre_responsable"
          value={formData.nombre_responsable}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
          required
        >
          <option value="">Selecciona una mascota</option>
          {mascotas.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* 🔹 Edad (rellenado automático) */}
        <label className="block font-medium text-gray-700 mb-1">Edad</label>
        <input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
          readOnly
        />

        <label className="block font-medium text-gray-700 mb-1">Cargo</label>
        <select
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-200 focus:outline-none"
          required
        >
          <option value="">Selecciona un tipo</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.nombre}>
              {rol.nombre}
            </option>
          ))}
        </select>

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

