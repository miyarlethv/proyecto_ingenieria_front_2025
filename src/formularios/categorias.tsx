import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, PlusCircle, Pencil, Trash2, CheckCircle2 } from "lucide-react";

function Categorias() {
  const navigate = useNavigate();

  // ==================== ESTADOS ====================
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState<"categoria" | "nombre">("categoria");
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [editandoItem, setEditandoItem] = useState<any | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nombres, setNombres] = useState<any[]>([]);

  // Formulario
  const [categoria, setCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // ==================== CARGAR DATOS ====================
  const cargarCategorias = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categorias");
      if (response.ok) {
        const data = await response.json();
        setCategorias(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const cargarNombres = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/nombres");
      if (response.ok) {
        const data = await response.json();
        setNombres(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch (error) {
      console.error("Error cargando nombres:", error);
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarNombres();
  }, []);

  // ==================== FILTROS ====================
  const filtroNombres = nombres.filter((nom) =>
    nom.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    nom.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ==================== HANDLERS - NAVEGACIÓN ====================
  const manejarVolver = () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setEditandoItem(null);
      setCategoria("");
      setNombre("");
      setCategoriaId("");
    } else {
      navigate("/dashboard");
    }
  };

  // ==================== HANDLERS - AGREGAR ====================
  const abrirAgregarCategoria = () => {
    setTipoFormulario("categoria");
    setEditandoItem(null);
    setCategoria("");
    setMostrarFormulario(true);
  };

  const abrirAgregarNombre = () => {
    setTipoFormulario("nombre");
    setEditandoItem(null);
    setNombre("");
    setCategoriaId("");
    setMostrarFormulario(true);
  };

  // ==================== HANDLERS - EDITAR ====================
  const abrirEditarCategoria = (cat: any) => {
    setTipoFormulario("categoria");
    setEditandoItem(cat);
    setCategoria(cat.categoria ?? "");
    setMostrarFormulario(true);
  };

  const abrirEditarNombre = (nom: any) => {
    setTipoFormulario("nombre");
    setEditandoItem(nom);
    setNombre(nom.nombre ?? "");
    setCategoriaId(String(nom.categoria_id ?? ""));
    setMostrarFormulario(true);
  };

  // ==================== HANDLERS - GUARDAR/ACTUALIZAR ====================
  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (tipoFormulario === "categoria") {
        if (editandoItem) {
          const response = await fetch("http://127.0.0.1:8000/api/ActualizarCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editandoItem.id, categoria }),
          });

          if (response.ok) {
            // ✅ Recargar categorías automáticamente
            await cargarCategorias();
            setMostrarFormulario(false);
            setEditandoItem(null);
            setCategoria("");
            setMostrarModalExito(true);
          } else {
            alert("Error al actualizar la categoría");
          }
        } else {
          const response = await fetch("http://127.0.0.1:8000/api/CrearCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoria }),
          });

          if (response.ok) {
            // ✅ Recargar categorías automáticamente
            await cargarCategorias();
            setMostrarFormulario(false);
            setCategoria("");
            setMostrarModalExito(true);
          } else {
            alert("Error al guardar la categoría");
          }
        }
      } else {
        // PRODUCTOS
        if (editandoItem) {
          const response = await fetch("http://127.0.0.1:8000/api/ActualizarNombre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              id: editandoItem.id, 
              nombre,
              categoria_id: categoriaId 
            }),
          });

          if (response.ok) {
            await cargarNombres();
            setMostrarFormulario(false);
            setEditandoItem(null);
            setMostrarModalExito(true);
          } else {
            alert("Error al actualizar el producto");
          }
        } else {
          const response = await fetch("http://127.0.0.1:8000/api/CrearNombre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              nombre,
              categoria_id: categoriaId 
            }),
          });

          if (response.ok) {
            await cargarNombres();
            setMostrarFormulario(false);
            setMostrarModalExito(true);
          } else {
            alert("Error al guardar el producto");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la conexión al servidor");
    } finally {
      setIsProcessing(false);
      setCategoria("");
      setNombre("");
      setCategoriaId("");
    }
  };

  // ==================== HANDLERS - ELIMINAR ====================
  const handleEliminar = (item: any, tipo: "categoria" | "nombre") => {
    setConfirmEliminar({ ...item, tipo });
  };

  const confirmarEliminar = async () => {
    setIsProcessing(true);
    try {
      const endpoint = confirmEliminar.tipo === "categoria" 
        ? "http://127.0.0.1:8000/api/EliminarCategoria"
        : "http://127.0.0.1:8000/api/EliminarNombre";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmEliminar.id }),
      });

      if (confirmEliminar.tipo === "categoria") {
        await cargarCategorias();
      } else {
        await cargarNombres();
      }
      setConfirmEliminar(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-white">
      {/* BARRA DE BÚSQUEDA Y BOTÓN VOLVER */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 mt-8 mb-6">
        <div className="relative w-1/3">
          <Search className="absolute inset-y-0 left-3 my-auto text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-green-600 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={abrirAgregarCategoria}
            className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <PlusCircle size={22} />
            <span>Agregar Categoría</span>
          </button>
          <button
            onClick={abrirAgregarNombre}
            className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <PlusCircle size={22} />
            <span>Agregar Producto</span>
          </button>
          <button
            onClick={manejarVolver}
            className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* MODAL FORMULARIO */}
      {mostrarFormulario && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editandoItem 
                ? `Actualizar ${tipoFormulario === "categoria" ? "Categoría" : "Producto"}` 
                : `Registrar ${tipoFormulario === "categoria" ? "Categoría" : "Producto"}`}
            </h2>
            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              {tipoFormulario === "categoria" ? (
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Categoría"
                  className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                  required
                />
              ) : (
                <>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoria}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del producto"
                    className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                    required
                  />
                </>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setMostrarFormulario(false); setEditandoItem(null); }}
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
                  {isProcessing ? "Procesando..." : (editandoItem ? "Actualizar" : "Guardar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {confirmEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-3">Confirmar eliminación</h3>
            <p className="mb-4">
              ¿Eliminar {confirmEliminar.tipo === "categoria" ? "la categoría" : "el producto"}{" "}
              <strong>{confirmEliminar.categoria || confirmEliminar.nombre}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmEliminar(null)}
                disabled={isProcessing}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={isProcessing}
                className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {isProcessing ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">Los datos se han guardado/actualizado correctamente.</p>
            <button
              onClick={() => setMostrarModalExito(false)}
              className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* TABLA UNIFICADA DE PRODUCTOS */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-4">Productos por Categoría</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#008658] text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Categoría</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                <th className="border border-gray-300 px-4 py-2 w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtroNombres.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                filtroNombres.map((nom) => (
                  <tr key={nom.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{nom.categoria}</td>
                    <td className="border border-gray-300 px-4 py-2">{nom.nombre}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => abrirEditarNombre(nom)} 
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                          title="Editar"
                        >
                          <Pencil size={18} className="text-black" />
                        </button>
                        <button 
                          onClick={() => handleEliminar(nom, "nombre")} 
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Categorias;