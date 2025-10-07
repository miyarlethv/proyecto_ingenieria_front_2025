import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // Asegúrate de tener instalado lucide-react

const CrearHistoria: React.FC = () => {
  // 🔹 Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "",
    descripcion: "",
    tipo: "",
  });
  const [error, setError] = useState(""); // Mensaje de error
  const [mostrarModalExito, setMostrarModalExito] = useState(false); // Modal de éxito

  const navigate = useNavigate();
  const { mascotaId } = useParams();

  // 🔹 Funciones para abrir y cerrar modal
  const abrirModal = () => setIsModalOpen(true);
  const cerrarModal = () => {
    setIsModalOpen(false);
    setError(""); // Limpiar error al cerrar
  };

  // 🔹 Manejador de cambios de los inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Enviar formulario
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
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setFormData({ fecha: "", descripcion: "", tipo: "" }); // Limpiar form
        cerrarModal();
        setMostrarModalExito(true); // Mostrar modal de éxito
      })
      .catch((error) => {
        console.error("Error al guardar:", error);
        setError(
          "❌ Ocurrió un error al guardar la historia clínica. Intenta de nuevo."
        );
      });
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

        {/* Contenedor de historias */}
        <div className="border-2 border-gray-300 rounded-xl h-64 p-4">
          {/* Aquí se podrían listar las historias */}
        </div>
      </div>

      {/* 🟩 Modal para crear historia */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Nueva Historia Clínica
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded-md mb-2 text-center">
                  {error}
                </div>
              )}

              {/* Fecha */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe el procedimiento o revisión realizada..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Tipo de procedimiento
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
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
              </div>

              {/* Botones */}
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
      )}

      {/* 🟢 Modal de éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">
              La historia clínica se ha registrado correctamente.
            </p>
            <button
              onClick={() => setMostrarModalExito(false)}
              className="bg-[#008658] text-white px-4 py-2 rounded"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearHistoria;
