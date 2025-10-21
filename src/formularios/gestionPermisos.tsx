import React, { useState, useEffect} from "react";
import type { FormEvent } from "react";

export default function GestionPermisos() {
  const [permisos, setPermisos] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar todos los permisos
  const cargarPermisos = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/ListarPermisos");
    const data = await res.json();
    setPermisos(data);
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  // Crear un nuevo permiso
  const crearPermiso = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://127.0.0.1:8000/api/CrearPermiso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ nombre: "", descripcion: "" });
      setIsModalOpen(false);
      cargarPermisos();
    } catch (error) {
      console.error("Error al crear permiso:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Permisos</h2>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Nuevo Permiso
      </button>

      {/* Lista de permisos */}
      <table className="mt-4 w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso: any) => (
            <tr key={permiso.id} className="border-b">
              <td className="p-2">{permiso.id}</td>
              <td className="p-2">{permiso.nombre}</td>
              <td className="p-2">{permiso.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal crear permiso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <form
            onSubmit={crearPermiso}
            className="bg-white p-6 rounded shadow-md w-96"
          >
            <h3 className="text-lg font-bold mb-3">Nuevo Permiso</h3>
            <input
              type="text"
              placeholder="Nombre del permiso"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <textarea
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
