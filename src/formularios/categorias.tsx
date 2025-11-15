import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, PlusCircle, Pencil, Trash2, CheckCircle2 } from "lucide-react";

function Categorias() {
  const navigate = useNavigate();

  // ==================== ESTADOS ====================
  // Estados UI
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
  const [busqueda, setBusqueda] = useState("");

  // ==================== EFECTOS ====================
  // Cargar categorías y nombres al montar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resCategorias = await fetch("http://127.0.0.1:8000/api/categorias");
        const resNombres = await fetch("http://127.0.0.1:8000/api/nombres");
        
        if (resCategorias.ok) {
          const data = await resCategorias.json();
          setCategorias(Array.isArray(data) ? data : data.data ?? []);
        }
        
        if (resNombres.ok) {
          const data = await resNombres.json();
          setNombres(Array.isArray(data) ? data : data.data ?? []);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchDatos();
  }, []);

  // ==================== FILTROS ====================
  const filtroCategorias = categorias.filter((cat) =>
    cat.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const filtroNombres = nombres.filter((nom) =>
    nom.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ==================== HANDLERS - NAVEGACIÓN ====================
  const manejarVolver = () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setEditandoItem(null);
      setCategoria("");
      setNombre("");
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
    setMostrarFormulario(true);
  };

  // ==================== HANDLERS - GUARDAR/ACTUALIZAR ====================
  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (tipoFormulario === "categoria") {
        if (editandoItem) {
          // Actualizar categoría
          const response = await fetch("http://127.0.0.1:8000/api/ActualizarCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editandoItem.id, categoria }),
          });

          if (response.ok) {
            const updated = await response.json();
            const updatedCategoria = updated.data ?? updated;
            setCategorias((prev) =>
              prev.map((c) => (c.id === editandoItem.id ? updatedCategoria : c))
            );
            setMostrarFormulario(false);
            setEditandoItem(null);
            setMostrarModalExito(true);
          } else {
            alert("Error al actualizar la categoría");
          }
        } else {
          // Crear categoría
          const response = await fetch("http://127.0.0.1:8000/api/CrearCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoria }),
          });

          if (response.ok) {
            const nuevo = await response.json();
            const nuevaCategoria = nuevo.data ?? nuevo;
            setCategorias((prev) => [...prev, nuevaCategoria]);
            setMostrarFormulario(false);
            setMostrarModalExito(true);
          } else {
            alert("Error al guardar la categoría");
          }
        }
      } else {
        // Nombre
        if (editandoItem) {
          // Actualizar nombre
          const response = await fetch("http://127.0.0.1:8000/api/ActualizarNombre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editandoItem.id, nombre }),
          });

          if (response.ok) {
            const updated = await response.json();
            const updatedNombre = updated.data ?? updated;
            setNombres((prev) =>
              prev.map((n) => (n.id === editandoItem.id ? updatedNombre : n))
            );
            setMostrarFormulario(false);
            setEditandoItem(null);
            setMostrarModalExito(true);
          } else {
            alert("Error al actualizar el nombre");
          }
        } else {
          // Crear nombre
          const response = await fetch("http://127.0.0.1:8000/api/CrearNombre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre }),
          });

          if (response.ok) {
            const nuevo = await response.json();
            const nuevoNombre = nuevo.data ?? nuevo;
            setNombres((prev) => [...prev, nuevoNombre]);
            setMostrarFormulario(false);
            setMostrarModalExito(true);
          } else {
            alert("Error al guardar el nombre");
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
        setCategorias((prev) => prev.filter((c) => c.id !== confirmEliminar.id));
      } else {
        setNombres((prev) => prev.filter((n) => n.id !== confirmEliminar.id));
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
      {/* ========== BARRA DE BÚSQUEDA Y BOTÓN VOLVER ========== */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 mt-8 mb-6">
        {/* Búsqueda */}
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

        {/* Botón Volver */}
        <button
          onClick={manejarVolver}
          className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          Volver
        </button>
      </div>

      {/* ========== MODAL FORMULARIO ========== */}
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
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del producto"
                  className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                  required
                />
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

      {/* ========== MODAL CONFIRMAR ELIMINAR ========== */}
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

      {/* ========== MODAL ÉXITO ========== */}
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

      {/* ========== TABLAS DE DATOS ========== */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-8">
          {/* TABLA CATEGORÍAS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Categorías</h3>
              <div className="flex gap-2">
                <button 
                  onClick={abrirAgregarCategoria}
                  className="p-2 rounded-full bg-[#008658] hover:bg-green-700 transition"
                  title="Agregar categoría"
                >
                  <PlusCircle size={20} className="text-white" />
                </button>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#008658] text-white">
                  <th className="border border-gray-300 px-4 py-2">Categoría</th>
                </tr>
              </thead>
              <tbody>
                {filtroCategorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 flex justify-between items-center">
                      <span>{cat.categoria}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => abrirEditarCategoria(cat)} 
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Editar"
                        >
                          <Pencil size={18} className="text-black" />
                        </button>
                        <button 
                          onClick={() => handleEliminar(cat, "categoria")} 
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLA PRODUCTOS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Productos</h3>
              <div className="flex gap-2">
                <button 
                  onClick={abrirAgregarNombre}
                  className="p-2 rounded-full bg-[#008658] hover:bg-green-700 transition"
                  title="Agregar producto"
                >
                  <PlusCircle size={20} className="text-white" />
                </button>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#008658] text-white">
                  <th className="border border-gray-300 px-4 py-2">Producto</th>
                </tr>
              </thead>
              <tbody>
                {filtroNombres.map((nom) => (
                  <tr key={nom.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 flex justify-between items-center">
                      <span>{nom.nombre}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => abrirEditarNombre(nom)} 
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Editar"
                        >
                          <Pencil size={18} className="text-black" />
                        </button>
                        <button 
                          onClick={() => handleEliminar(nom, "nombre")} 
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Categorias;