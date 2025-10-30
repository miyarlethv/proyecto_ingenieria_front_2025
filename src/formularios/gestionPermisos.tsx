import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Pencil, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function GestionPermisos() {
  const [permisos, setPermisos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState<{
    tipo: "eliminar" | "actualizar" | null;
    id?: number;
  }>({ tipo: null });

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    descripcion: "",
    url: "",
  });

  // =========================
  // 🔹 Cargar permisos
  // =========================
  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ListarPermisos");
      const data = await res.json();
      // Validación para evitar errores de formato
      if (Array.isArray(data)) {
        setPermisos(data);
      } else if (data.data) {
        setPermisos(data.data);
      } else {
        console.error("⚠️ Respuesta inesperada del backend:", data);
      }
    } catch (error) {
      console.error("Error al listar permisos:", error);
    }
  };

  // =========================
  // 🔹 Manejo de inputs
  // =========================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================
  // 🔹 Crear permiso
  // =========================
  const crearPermiso = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/CrearPermiso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          descripcion: formData.descripcion.trim(),
          url: formData.url.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ id: null, name: "", descripcion: "", url: "" });
        setMostrarModalExito(true);
        cargarPermisos();
      } else {
        alert(data.message || "Error al crear el permiso");
      }
    } catch (error) {
      console.error("Error al crear permiso:", error);
      alert("Error al conectar con el servidor");
    }
  };

  // =========================
  // 🔹 Abrir modal editar
  // =========================
  const abrirEditar = (permiso: any) => {
    setFormData({
      id: permiso.id,
      name: permiso.name,
      descripcion: permiso.descripcion,
      url: permiso.url,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // =========================
  // 🔹 Actualizar permiso
  // =========================
  const actualizarPermiso = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/ActualizarPermiso", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name.trim(),
          descripcion: formData.descripcion.trim(),
          url: formData.url.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalConfirmacion({ tipo: null });
        setIsModalOpen(false);
        setMostrarModalExito(true);
        cargarPermisos();
      } else {
        alert(data.message || "Error al actualizar el permiso");
      }
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      alert("Error al conectar con el servidor");
    }
  };

  // =========================
  // 🔹 Eliminar permiso
  // =========================
  const eliminarPermiso = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/EliminarPermiso", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: modalConfirmacion.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalConfirmacion({ tipo: null });
        setMostrarModalExito(true);
        cargarPermisos();
      } else {
        alert(data.message || "Error al eliminar el permiso");
      }
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      alert("Error al conectar con el servidor");
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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Permisos</h1>
          <button
            onClick={() => {
              setFormData({ id: null, name: "", descripcion: "", url: "" });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Nuevo Permiso
          </button>
        </div>

        {/* Tabla de permisos */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">URL</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {permisos.length > 0 ? (
              permisos.map((permiso) => (
                <tr key={permiso.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-center">{permiso.id}</td>
                  <td className="p-2">{permiso.name}</td>
                  <td className="p-2">{permiso.descripcion}</td>
                  <td className="p-2">{permiso.url}</td>
                  <td className="p-2 flex justify-center gap-4">
                    <button
                      onClick={() => abrirEditar(permiso)}
                      className="text-black hover:text-blue-700"
                      title="Editar"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setModalConfirmacion({ tipo: "eliminar", id: permiso.id })
                      }
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
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  No hay permisos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <ModalPermiso
          titulo={isEditing ? "Editar Permiso" : "Nuevo Permiso"}
          formData={formData}
          handleChange={handleChange}
          cerrar={() => setIsModalOpen(false)}
          handleSubmit={(e) => {
            e.preventDefault();
            isEditing
              ? setModalConfirmacion({ tipo: "actualizar" })
              : crearPermiso(e);
          }}
        />
      )}

      {/* Modal Confirmación */}
      {modalConfirmacion.tipo && (
        <ModalConfirmacion
          tipo={modalConfirmacion.tipo}
          confirmar={
            modalConfirmacion.tipo === "eliminar"
              ? eliminarPermiso
              : actualizarPermiso
          }
          cancelar={() => setModalConfirmacion({ tipo: null })}
        />
      )}

      {/* Modal Éxito */}
      {mostrarModalExito && (
        <ModalExito cerrarModal={() => setMostrarModalExito(false)} />
      )}
    </div>
  );
}

// =============================
// 🔹 COMPONENTES REUTILIZABLES
// =============================

const ModalPermiso: React.FC<{
  titulo: string;
  formData: any;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  cerrar: () => void;
  handleSubmit: (e: FormEvent) => void;
}> = ({ titulo, formData, handleChange, cerrar, handleSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">{titulo}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del permiso"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="text"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
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
          ? "¿Deseas eliminar este permiso?"
          : "¿Deseas actualizar este permiso?"}
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
      <p className="mb-4">El permiso se ha procesado correctamente.</p>
      <button
        onClick={cerrarModal}
        className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Aceptar
      </button>
    </div>
  </div>
);
