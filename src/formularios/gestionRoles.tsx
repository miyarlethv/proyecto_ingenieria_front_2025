import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import type { ChangeEvent, FormEvent } from "react";
import { Pencil, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

const GestionRoles: React.FC = () => {
  // =========================
  // 🔹 Estados principales
  // =========================
  const [roles, setRoles] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState<{
    tipo: "eliminar" | "actualizar" | null;
    id?: number;
  }>({ tipo: null });

  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    permisos: [] as number[],
  });

  const [editData, setEditData] = useState<any>(null);

  // =========================
  // 🔹 Cargar roles y permisos
  // =========================
  useEffect(() => {
    cargarRoles();
    cargarPermisos();
  }, []);

  const cargarRoles = async () => {
    try {
  const res = await apiFetch("/ListarRoles");
  const data = await res.json();
      console.log("📦 Roles recibidos:", data);
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al listar roles", error);
      setRoles([]);
    }
  };

  const cargarPermisos = async () => {
    try {
  const res = await apiFetch("/ListarPermisos");
  const data = await res.json();
      console.log("📦 Permisos recibidos:", data);
      setPermisos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al listar permisos", error);
      setPermisos([]);
    }
  };

  // =========================
  // 🔹 Manejo de inputs
  // =========================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (permisoId: number) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permisoId)
        ? prev.permisos.filter((id) => id !== permisoId)
        : [...prev.permisos, permisoId],
    }));
  };

  // =========================
  // 🔹 Crear rol
  // =========================
  const crearRol = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log("📦 Enviando datos:", formData);

      const response = await apiFetch("/CrearRol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          descripcion: formData.descripcion,
          permissions: formData.permisos || [], // 👈 se cambia "permisos" → "permissions"
        }),
      });

      const data = await response.json();
      console.log("✅ Respuesta del backend:", data);

      if (response.ok) {
        setIsModalOpen(false);
        setMostrarModalExito(true);
        setFormData({ name: "", descripcion: "", permisos: [] });
        cargarRoles();
      } else {
        console.error("❌ Error en la creación:", data);
        alert(data.message || "Error al crear el rol");
      }
    } catch (error) {
      console.error("💥 Error al crear rol:", error);
      alert("Error al conectar con el servidor");
    }
  };

  // =========================
  // 🔹 Editar rol
  // =========================
  const abrirEditar = (rol: any) => {
    setEditData({
      ...rol,
      permisos:
        rol.permissions?.map((p: any) => p.id) ||
        rol.permisos?.map((p: any) => p.id) ||
        [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditCheckbox = (permisoId: number) => {
    setEditData((prev: any) => ({
      ...prev,
      permisos: prev.permisos.includes(permisoId)
        ? prev.permisos.filter((id: number) => id !== permisoId)
        : [...prev.permisos, permisoId],
    }));
  };

  const confirmarActualizar = () => setModalConfirmacion({ tipo: "actualizar" });

  const actualizarRol = async () => {
    try {
      const response = await apiFetch("/ActualizarRol", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editData.id,
          name: editData.name,
          descripcion: editData.descripcion,
          permissions: editData.permisos || [], // 👈 se cambia "permisos" → "permissions"
        }),
      });

      if (response.ok) {
        setModalConfirmacion({ tipo: null });
        setIsEditModalOpen(false);
        setMostrarModalExito(true);
        cargarRoles();
      } else {
        console.error("Error al actualizar rol");
      }
    } catch (error) {
      console.error("Error al actualizar rol", error);
    }
  };

  // =========================
  // 🔹 Eliminar rol
  // =========================
  const confirmarEliminar = (id: number) =>
    setModalConfirmacion({ tipo: "eliminar", id });

  const eliminarRol = async () => {
    try {
      const response = await apiFetch("/EliminarRol", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modalConfirmacion.id }),
      });

      if (response.ok) {
        setModalConfirmacion({ tipo: null });
        setMostrarModalExito(true);
        cargarRoles();
      } else {
        console.error("Error al eliminar rol");
      }
    } catch (error) {
      console.error("Error al eliminar rol", error);
    }
  };

  // =========================
  // 🔹 Render principal
  // =========================
  return (
    <div className="w-[95%] mx-auto bg-white p-6 rounded-2xl shadow">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-200">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Crear Rol
          </button>
        </div>

        {/* Tabla de Roles */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Nombre Rol</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Permisos</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((rol) => (
                <tr key={rol.id} className="border-b text-center">
                  <td className="p-2">{rol.name}</td>
                  <td className="p-2">{rol.descripcion || "Sin descripción"}</td>
                  <td className="p-2">
                    {(rol.permissions || rol.permisos)?.length ? (
                      <div className="space-y-1">
                        {(rol.permissions || rol.permisos).map((p: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                            <span>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin permisos</span>
                    )}
                  </td>
                  <td className="flex justify-center gap-4 py-2">
                    <button
                      onClick={() => abrirEditar(rol)}
                      className="text-black hover:text-blue-700"
                      title="Editar"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminar(rol.id)}
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
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  No hay roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {isModalOpen && (
        <ModalRol
          titulo="Nuevo Rol"
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          permisos={permisos}
          cerrar={() => setIsModalOpen(false)}
          handleSubmit={crearRol}
        />
      )}

      {isEditModalOpen && editData && (
        <ModalRol
          titulo="Editar Rol"
          formData={editData}
          handleChange={handleEditChange}
          handleCheckboxChange={handleEditCheckbox}
          permisos={permisos}
          cerrar={() => setIsEditModalOpen(false)}
          handleSubmit={(e) => {
            e.preventDefault();
            confirmarActualizar();
          }}
        />
      )}

      {modalConfirmacion.tipo && (
        <ModalConfirmacion
          tipo={modalConfirmacion.tipo}
          confirmar={
            modalConfirmacion.tipo === "eliminar"
              ? eliminarRol
              : actualizarRol
          }
          cancelar={() => setModalConfirmacion({ tipo: null })}
        />
      )}

      {mostrarModalExito && (
        <ModalExito cerrarModal={() => setMostrarModalExito(false)} />
      )}
    </div>
  );
};

export default GestionRoles;

//
// =============================
// 🔹 COMPONENTES REUTILIZABLES
// =============================
//

const ModalRol: React.FC<{
  titulo: string;
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (id: number) => void;
  permisos: any[];
  cerrar: () => void;
  handleSubmit: (e: FormEvent) => void;
}> = ({
  titulo,
  formData,
  handleChange,
  handleCheckboxChange,
  permisos,
  cerrar,
  handleSubmit,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">{titulo}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del rol"
          value={formData.name || ""}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion || ""}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <div>
          <h3 className="font-semibold mb-2">Permisos</h3>
          <div className="grid grid-cols-2 gap-2">
            {Array.isArray(permisos) && permisos.length > 0 ? (
              permisos.map((permiso) => (
                <label key={permiso.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.permisos &&
                      formData.permisos.includes(permiso.id)
                    }
                    onChange={() => handleCheckboxChange(permiso.id)}
                  />
                  {permiso.name}
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No hay permisos disponibles.
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={cerrar}
            className="px-4 py-2 border border-gray-400 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ModalConfirmacion: React.FC<{
  tipo: "eliminar" | "actualizar";
  confirmar: () => void;
  cancelar: () => void;
}> = ({ tipo, confirmar, cancelar }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
      <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">
        {tipo === "eliminar"
          ? "¿Deseas eliminar este rol?"
          : "¿Deseas actualizar este rol?"}
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

const ModalExito: React.FC<{ cerrarModal: () => void }> = ({ cerrarModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
      <p className="mb-4">El rol se ha procesado correctamente.</p>
      <button
        onClick={cerrarModal}
        className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Aceptar
      </button>
    </div>
  </div>
);
