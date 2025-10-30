// imports
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, PlusCircle, Pencil, Trash2, CheckCircle2, X } from "lucide-react";

function BienvenidaFundacion() {
  const navigate = useNavigate();
  
  // Estados de la UI
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // Estados nuevos
  const [editandoMascota, setEditandoMascota] = useState<any | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Mascotas
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);

  // Formulario
  const [nombre, setNombre] = useState<string>("");
  const [edad, setEdad] = useState<string>("");
  const [caracteristicas, setCaracteristicas] = useState<string>("");
  const [foto, setFoto] = useState<File | null>(null);

  
  const [busqueda, setBusqueda] = useState<string>("");

  // Botón Volver
  const manejarVolver = () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setEditandoMascota(null);
      setNombre("");
      setEdad("");
      setCaracteristicas("");
      setFoto(null);
    } else {
      navigate("/dashboard");
    }
  };

  // Cargar mascotas al inicio
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/mascotas");
        if (response.ok) {
          const data = await response.json();
          setMascotas(Array.isArray(data) ? data : data.data ?? []);
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

  // Abrir formulario en modo Agregar
  const abrirAgregar = () => {
    setEditandoMascota(null);
    setNombre("");
    setEdad("");
    setCaracteristicas("");
    setFoto(null);
    setMostrarFormulario(true);
  };

  // Abrir formulario en modo Editar
  const abrirEditar = (mascota: any) => {
    setEditandoMascota(mascota);
    setNombre(mascota.nombre ?? "");
    setEdad(String(mascota.edad ?? ""));
    setCaracteristicas(mascota.caracteristicas ?? "");
    setFoto(null);
    setMostrarFormulario(true);
  };

  // Guardar o actualizar
  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (editandoMascota) {
        // === actualizar ===
        const url = 'http://127.0.0.1:8000/api/ActualizarMascotas';
        const formData = new FormData();
        formData.append("id", editandoMascota.id); // Enviar el ID como parte del formData
        formData.append("nombre", nombre);
        formData.append("edad", edad);
        formData.append("caracteristicas", caracteristicas);
        if (foto) formData.append("foto", foto);
        formData.append("_method", "PUT");

        const response = await fetch(url, { method: "POST", body: formData });

        if (response.ok) {
          const updated = await response.json();
          const updatedMascota = updated.data ?? updated;
          setMascotas((prev) =>
            prev.map((m) => (m.id === editandoMascota.id ? updatedMascota : m))
          );
          setMostrarFormulario(false);
          setEditandoMascota(null);
          setMostrarModalExito(true);
        } else {
          alert("Error al actualizar la mascota");
        }
      } else {
        // === crear ===
        const url = `http://127.0.0.1:8000/api/CrearMascotas`;
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("edad", edad);
        formData.append("caracteristicas", caracteristicas);
        if (foto) formData.append("foto", foto);

        const response = await fetch(url, { method: "POST", body: formData });

        if (response.ok) {
          const nueva = await response.json();
          const nuevaMascota = nueva.data ?? nueva;
          setMascotas((prev) => [...prev, nuevaMascota]);
          setMostrarFormulario(false);
          setMostrarModalExito(true);
        } else {
          alert("Error al guardar la mascota");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la conexión al servidor");
    } finally {
      setIsProcessing(false);
      setNombre("");
      setEdad("");
      setCaracteristicas("");
      setFoto(null);
    }
  };

  // Manejar archivo
  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Eliminar
  const handleEliminarMascota = (id: number | string) => {
    const mascota = mascotas.find((m) => String(m.id) === String(id));
    if (!mascota) {
      console.warn("Mascota no encontrada", id);
      return;
    }
    setConfirmEliminar(mascota);
  };

  const confirmarEliminarMascota = async () => {
  setIsProcessing(true);
  try {
    await fetch("http://127.0.0.1:8000/api/EliminarMascotas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: confirmEliminar.id }),
    });

    // 🔹 Actualiza el estado local para quitar la mascota de la vista
    setMascotas((prev) => prev.filter((m) => m.id !== confirmEliminar.id));

    setConfirmEliminar(null);
  } catch (error) {
    console.error("Error al deshabilitar la mascota:", error);
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      {/* Barra búsqueda + Agregar */}
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
        <div className="flex gap-4">
          <button
            onClick={abrirAgregar}
            className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <PlusCircle size={22} className="text-white" />
            <span>Agregar mascota</span>
          </button>
          <button
            onClick={manejarVolver}
            className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Modal Formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editandoMascota ? "Actualizar Mascota" : "Registrar Mascota"}
            </h2>
            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              {/* Nombre */}
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la mascota"
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2"
                required
              />
              {/* Edad */}
              <input
                id="edad"
                type="text"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Edad de la mascota"
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2"
                required
              />
              {/* Características */}
              <input
                id="caracteristicas"
                type="text"
                value={caracteristicas}
                onChange={(e) => setCaracteristicas(e.target.value)}
                placeholder="Características"
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2"
              />
              {/* Foto */}
              <input
                id="foto"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={manejarCambioArchivo}
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setMostrarFormulario(false); setEditandoMascota(null); }}
                  disabled={isProcessing}
                  className="bg-gray-400 text-white rounded px-4 py-2 hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-[#008658] text-white rounded px-4 py-2 hover:bg-green-700"
                >
                  {isProcessing ? "Procesando..." : (editandoMascota ? "Actualizar" : "Guardar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-3">Confirmar eliminación</h3>
            <p className="mb-4">¿Estás segura de que quieres eliminar a <strong>{confirmEliminar.nombre}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmEliminar(null)}
                disabled={isProcessing}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarMascota}
                disabled={isProcessing}
                className="bg-[#008658] text-white px-4 py-2 rounded"
              >
                {isProcessing ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Modal Exito */}
        {mostrarModalExito && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
              <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
              <p className="mb-4">La mascota se ha guardado/Actualizado correctamente.</p>
              <button
                onClick={() => setMostrarModalExito(false)}
                className="bg-[#008658] text-white px-4 py-2 rounded"
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
            <p className="text-black mt-2">Edad: {mascotaSeleccionada.edad}</p>
            <p className="text-black mt-2">
              Características: {mascotaSeleccionada.caracteristicas || "No registradas"}
            </p>
          </div>
        </div>
      )}

      {/* Lista mascotas */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filtroMascotas.map((mascota) => (
            <div key={mascota.id} className="flex flex-col items-center border border-gray-300 rounded-lg p-4 shadow-sm">
              {mascota.foto ? (
                <img src={`http://127.0.0.1:8000/storage/${mascota.foto}`} alt={mascota.nombre} className="w-24 h-24 object-cover mb-3 rounded-full" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />
              )}
              <div className="text-center w-full">
                <p className="text-xs text-black font-medium">Nombre</p>
                <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">{mascota.nombre}</p>
                <p className="text-xs text-black font-medium">Edad</p>
                <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">{mascota.edad}</p>
                <button onClick={() => setMascotaSeleccionada(mascota)} className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">
                  Ver más..
                </button>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button onClick={() => abrirEditar(mascota)} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Pencil size={20} className="text-black" />
                  </button>
                  <button onClick={() => handleEliminarMascota(mascota.id)} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BienvenidaFundacion;
