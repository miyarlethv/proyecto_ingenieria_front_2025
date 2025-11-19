// ==================== TIPOS ====================
interface Categoria {
  id: number;
  categoria: string;
}
interface NombreProducto {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria: string;
}
interface Producto {
  id: number;
  nombre: string;
  nombre_id: number;
  categoria: string;
  categoria_id: number;
  cantidad: number;
  foto?: string;
}
// ==================== IMPORTS ====================
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, PlusCircle, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { tienePermiso, esFundacion } from "../api";
import ModalError from "../components/ModalError";
import { useModalError } from "../hooks/useModalError";

// ==================== UTILIDADES ====================
const puedeGestionarInventario = () => esFundacion() || tienePermiso("GestionarInventario");
const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const baseHeaders = options.headers ? { ...(options.headers as Record<string, string>) } : {};
  if (token) {
    baseHeaders["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
    ...options,
    headers: baseHeaders,
  });
};

function InventarioFundacion() {
  // const navigate = useNavigate();
  const { modalError, mostrarError, cerrarError } = useModalError();
  // ==================== ESTADOS ====================
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<Producto | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState<Producto | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombres, setNombres] = useState<NombreProducto[]>([]);
  const [nombresOriginales, setNombresOriginales] = useState<NombreProducto[]>([]);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [nombreId, setNombreId] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [foto, setFoto] = useState<File | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

    // ==================== CARGA DE DATOS ====================
    const cargarProductos = async () => {
      try {
        const response = await apiFetch("productos");
        if (response.ok) {
          const data = await response.json();
          setProductos(Array.isArray(data) ? data : data.data ?? []);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    const cargarOpciones = async () => {
      try {
        const [resCategorias, resNombres] = await Promise.all([
          apiFetch("categorias"),
          apiFetch("nombres")
        ]);
        if (resCategorias.ok) {
          const dataCat = await resCategorias.json();
          setCategorias(Array.isArray(dataCat) ? dataCat : dataCat.data ?? []);
        }
        if (resNombres.ok) {
          const dataNom = await resNombres.json();
          const nombresData = Array.isArray(dataNom) ? dataNom : dataNom.data ?? [];
          setNombresOriginales(nombresData);
          setNombres(nombresData);
        }
      } catch (error) {
        console.error("Error cargando opciones:", error);
      }
    };
    useEffect(() => {
      cargarProductos();
      cargarOpciones();
    }, []);

    useEffect(() => {
    if (categoriaId) {
      setNombres(nombresOriginales.filter(n => String(n.categoria_id) === categoriaId));
      setNombreId(""); // Opcional: resetea el producto seleccionado
    } else {
      setNombres(nombresOriginales);
      setNombreId("");
    }
  }, [categoriaId, nombresOriginales]);

    // ==================== FILTROS ====================
    const filtroProductos = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ==================== HANDLERS ====================
    // const manejarVolver = () => {
    //   if (mostrarFormulario) {
    //     setMostrarFormulario(false);
    //     setEditandoProducto(null);
    //     setCategoriaId("");
    //     setNombreId("");
    //     setCantidad("");
    //     setFoto(null);
    //   } else {
    //     navigate("/dashboard");
    //   }
    // };
    const abrirAgregar = () => {
      if (!puedeGestionarInventario()) {
        mostrarError("No tienes permiso para agregar productos");
        return;
      }
      setEditandoProducto(null);
      setCategoriaId("");
      setNombreId("");
      setCantidad("");
      setFoto(null);
      setNombres(nombresOriginales);
      setMostrarFormulario(true);
    };
    const abrirEditar = (producto: Producto) => {
      if (!puedeGestionarInventario()) {
        mostrarError("No tienes permiso para editar productos");
        return;
      }
      setEditandoProducto(producto);
      setCategoriaId(String(producto.categoria_id ?? ""));
      setNombreId(String(producto.nombre_id ?? ""));
      setCantidad(String(producto.cantidad ?? ""));
      setFoto(null);
      setMostrarFormulario(true);
    };
    const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsProcessing(true);
      try {
        if (editandoProducto) {
          const formData = new FormData();
          formData.append("id", String(editandoProducto.id));
          formData.append("categoria_id", categoriaId);
          formData.append("nombre_id", nombreId);
          formData.append("cantidad", cantidad);
          if (foto) formData.append("foto", foto);
          const response = await apiFetch("ActualizarProducto", { method: "POST", body: formData });
          if (response.ok) {
            await cargarProductos();
            setMostrarFormulario(false);
            setEditandoProducto(null);
            setMostrarModalExito(true);
          } else {
            const errorData = await response.json().catch(() => ({}));
            mostrarError(errorData.message || "Error al actualizar el producto. Verifica que tengas los permisos necesarios.");
          }
        } else {
          const formData = new FormData();
          formData.append("categoria_id", categoriaId);
          formData.append("nombre_id", nombreId);
          formData.append("cantidad", cantidad);
          if (foto) formData.append("foto", foto);
          const response = await apiFetch("CrearProducto", { method: "POST", body: formData });
          if (response.ok) {
            await cargarProductos();
            setMostrarFormulario(false);
            setMostrarModalExito(true);
          } else {
            const errorData = await response.json().catch(() => ({}));
            mostrarError(errorData.message || "Error al guardar el producto. Verifica que tengas los permisos necesarios.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        mostrarError("Hubo un problema con la conexión al servidor");
      } finally {
        setIsProcessing(false);
        setCategoriaId("");
        setNombreId("");
        setCantidad("");
        setFoto(null);
      }
    };
    const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFoto(e.target.files[0]);
      }
    };
    const abrirEliminar = (producto: Producto) => {
      if (!puedeGestionarInventario()) {
        mostrarError("No tienes permiso para eliminar productos");
        return;
      }
      setConfirmEliminar(producto);
    };
    const confirmarEliminarProducto = async () => {
      if (!confirmEliminar) return;
      setIsProcessing(true);
      try {
        await apiFetch("EliminarProducto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: confirmEliminar.id }),
        });
        await cargarProductos();
        setConfirmEliminar(null);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    // ==================== RENDER ====================
    return (
      <div className="w-full">
        {/* BARRA DE BÚSQUEDA Y BOTÓN VOLVER */}
        <div className="flex justify-between items-center mb-6 mt-4">
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
            {puedeGestionarInventario() && (
              <button
                onClick={abrirAgregar}
                className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
              >
                <PlusCircle size={22} />
                <span>Agregar Producto</span>
              </button>
            )}
            {/* <button
              onClick={manejarVolver}
              className="flex items-center gap-2 bg-[#008658] text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
            >
              Volver
            </button> */}
          </div>
        </div>

        {/* MODAL FORMULARIO */}
        {mostrarFormulario && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                {editandoProducto ? "Actualizar Producto" : "Registrar Producto"}
              </h2>
              <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
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
                <select
                  value={nombreId}
                  onChange={(e) => setNombreId(e.target.value)}
                  className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                  required
                >
                  <option value="">Selecciona un producto</option>
                  {nombres.map((nom) => (
                    <option key={nom.id} value={nom.id}>
                      {nom.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Cantidad"
                  className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCambioArchivo}
                  className="border border-green-600 px-3 py-2 text-sm rounded-xl w-full"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => { setMostrarFormulario(false); setEditandoProducto(null); }}
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
                    {isProcessing ? "Procesando..." : (editandoProducto ? "Actualizar" : "Guardar")}
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
                ¿Eliminar el producto <strong>{confirmEliminar.nombre}</strong>?
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
                  onClick={confirmarEliminarProducto}
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

        {/* TABLA DE INVENTARIO */}
        <section>
          <div>
            <h3 className="text-xl font-bold mb-4">Inventario</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#008658] text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">Categoría</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                  <th className="border border-gray-300 px-4 py-2 w-24">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtroProductos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No hay productos registrados
                    </td>
                  </tr>
                ) : (
                  filtroProductos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{prod.categoria}</td>
                      <td className="border border-gray-300 px-4 py-2">{prod.nombre}</td>
                      <td className="border border-gray-300 px-4 py-2">{prod.cantidad}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex justify-center gap-2">
                          {puedeGestionarInventario() && (
                            <>
                              <button
                                onClick={() => abrirEditar(prod)}
                                className="p-1 rounded-full hover:bg-gray-200 transition"
                                title="Editar"
                              >
                                <Pencil size={18} className="text-black" />
                              </button>
                              <button
                                onClick={() => abrirEliminar(prod)}
                                className="p-1 rounded-full hover:bg-gray-200 transition"
                                title="Eliminar"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal de error */}
        <ModalError
          mostrar={modalError.mostrar}
          titulo={modalError.titulo}
          mensaje={modalError.mensaje}
          onCerrar={cerrarError}
        />
      </div>
    );
  }

  export default InventarioFundacion;