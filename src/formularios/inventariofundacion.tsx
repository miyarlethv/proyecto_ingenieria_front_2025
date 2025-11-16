import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, PlusCircle, Pencil, Trash2, CheckCircle2, X } from "lucide-react";

function InventarioFundacion() {
  const navigate = useNavigate();

  // Estados UI
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<any | null>(null);
  const [confirmEliminar, setConfirmEliminar] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Productos
  const [productos, setProductos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);

  // Listas maestras para desplegables
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nombres, setNombres] = useState<any[]>([]);
  const [nombresOriginales, setNombresOriginales] = useState<any[]>([]); // ✅ Lista completa

  // Formulario
  const [categoriaId, setCategoriaId] = useState("");
  const [nombreId, setNombreId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [busqueda, setBusqueda] = useState("");

  // Botón volver
  const manejarVolver = () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setEditandoProducto(null);
      setCategoriaId("");
      setNombreId("");
      setCantidad("");
      setFoto(null);
    } else {
      navigate("/dashboard");
    }
  };

  // ✅ Función para cargar productos (reutilizable)
  const cargarProductos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/productos");
      if (response.ok) {
        const data = await response.json();
        setProductos(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  // Cargar categorías y nombres para desplegables
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const [resCategorias, resNombres] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/categorias"),
          fetch("http://127.0.0.1:8000/api/nombres")
        ]);

        if (resCategorias.ok) {
          const dataCat = await resCategorias.json();
          setCategorias(Array.isArray(dataCat) ? dataCat : dataCat.data ?? []);
        }

        if (resNombres.ok) {
          const dataNom = await resNombres.json();
          const nombresData = Array.isArray(dataNom) ? dataNom : dataNom.data ?? [];
          setNombresOriginales(nombresData); // ✅ Guardar lista completa
          setNombres(nombresData);
        }
      } catch (error) {
        console.error("Error cargando opciones:", error);
      }
    };
    fetchOpciones();
  }, []);

  // ✅ Cargar productos al montar componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const filtroProductos = productos.filter((producto) =>
    producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ✅ Filtrar nombres cuando cambia la categoría seleccionada
  const handleCambioCategoria = (catId: string) => {
    setCategoriaId(catId);
    setNombreId(""); // Resetear producto seleccionado
    
    if (catId) {
      // Filtrar solo productos de esa categoría
      const nombresFiltrados = nombresOriginales.filter(
        (nom) => String(nom.categoria_id) === String(catId)
      );
      setNombres(nombresFiltrados);
    } else {
      // Mostrar todos si no hay categoría seleccionada
      setNombres(nombresOriginales);
    }
  };

  // Abrir formulario agregar
  const abrirAgregar = () => {
    setEditandoProducto(null);
    setCategoriaId("");
    setNombreId("");
    setCantidad("");
    setFoto(null);
    setNombres(nombresOriginales); // ✅ Resetear lista completa
    setMostrarFormulario(true);
  };

  // Abrir formulario editar
  const abrirEditar = (producto: any) => {
    setEditandoProducto(producto);
    setCategoriaId(String(producto.categoria_id ?? ""));
    setNombreId(String(producto.nombre_id ?? ""));
    setCantidad(String(producto.cantidad ?? ""));
    setFoto(null);
    setMostrarFormulario(true);
  };

  // ✅ Guardar o actualizar con recarga automática
  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (editandoProducto) {
        // === actualizar ===
        const url = "http://127.0.0.1:8000/api/ActualizarProducto";
        const formData = new FormData();
        formData.append("id", editandoProducto.id);
        formData.append("categoria_id", categoriaId);
        formData.append("nombre_id", nombreId);
        formData.append("cantidad", cantidad);
        if (foto) formData.append("foto", foto);

        const response = await fetch(url, { method: "POST", body: formData });

        if (response.ok) {
          // ✅ Recargar productos desde el servidor
          await cargarProductos();
          setMostrarFormulario(false);
          setEditandoProducto(null);
          setMostrarModalExito(true);
        } else {
          alert("Error al actualizar el producto");
        }
      } else {
        // === crear ===
        const url = "http://127.0.0.1:8000/api/CrearProducto";
        const formData = new FormData();
        formData.append("categoria_id", categoriaId);
        formData.append("nombre_id", nombreId);
        formData.append("cantidad", cantidad);
        if (foto) formData.append("foto", foto);

        const response = await fetch(url, { method: "POST", body: formData });

        if (response.ok) {
          // ✅ Recargar productos desde el servidor
          await cargarProductos();
          setMostrarFormulario(false);
          setMostrarModalExito(true);
        } else {
          alert("Error al guardar el producto");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la conexión al servidor");
    } finally {
      setIsProcessing(false);
      setCategoriaId("");
      setNombreId("");
      setCantidad("");
      setFoto(null);
    }
  };

  // Cambiar archivo
  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Eliminar
  const handleEliminarProducto = (id: number | string) => {
    const producto = productos.find((p) => String(p.id) === String(id));
    if (!producto) return;
    setConfirmEliminar(producto);
  };

  // ✅ Confirmar eliminación con recarga automática
  const confirmarEliminarProducto = async () => {
    setIsProcessing(true);
    try {
      await fetch("http://127.0.0.1:8000/api/EliminarProducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmEliminar.id }),
      });
      // ✅ Recargar productos desde el servidor
      await cargarProductos();
      setConfirmEliminar(null);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Barra búsqueda + botones */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 mt-8 mb-6">
        <div className="relative w-1/3">
          <Search className="absolute inset-y-0 left-3 my-auto text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar producto..."
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
            <span>Agregar producto</span>
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
              {editandoProducto ? "Actualizar Producto" : "Registrar Producto"}
            </h2>
            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              {/* Desplegable de Categoría */}
              <select
                id="categoria_id"
                value={categoriaId}
                onChange={(e) => handleCambioCategoria(e.target.value)}
                className="border border-green-600 px-3 py-2 text-sm hover:bg-gray-100 rounded-[10px] w-full"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoria}
                  </option>
                ))}
              </select>

              {/* Desplegable de Nombre */}
              <select
                id="nombre_id"
                value={nombreId}
                onChange={(e) => setNombreId(e.target.value)}
                className="border border-green-600 px-3 py-2 text-sm hover:bg-gray-100 rounded-[10px] w-full"
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
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Cantidad disponible"
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full"
                required
              />
              <input
                id="foto"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={manejarCambioArchivo}
                className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full"
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

      {/* Modal Confirmar eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-3">Confirmar eliminación</h3>
            <p className="mb-4">¿Eliminar el producto <strong>{confirmEliminar.nombre}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmEliminar(null)}
                disabled={isProcessing}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarProducto}
                disabled={isProcessing}
                className="bg-[#008658] text-white px-4 py-2 rounded"
              >
                {isProcessing ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
            <p className="mb-4">El producto se ha guardado/actualizado correctamente.</p>
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
      {productoSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center shadow-lg relative">
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            {productoSeleccionado.foto && (
              <img
                src={`http://127.0.0.1:8000/storage/${productoSeleccionado.foto}`}
                alt={productoSeleccionado.nombre}
                className="w-32 h-32 object-cover mx-auto rounded-full mb-4"
              />
            )}
            <h2 className="text-black mt-2">Categoría: {productoSeleccionado.categoria}</h2>
            <h2 className="text-xl font-bold">{productoSeleccionado.nombre}</h2>
            <p className="text-black mt-2">Cantidad: {productoSeleccionado.cantidad}</p>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filtroProductos.map((producto) => (
            <div key={producto.id} className="flex flex-col items-center border border-gray-300 rounded-lg p-4 shadow-sm">
              {producto.foto ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${producto.foto}`}
                  alt={producto.nombre}
                  className="w-24 h-24 object-cover mb-3 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />
              )}
              <div className="text-center w-full">
                <p className="text-xs text-black font-medium">Categoría</p>
                <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">{producto.categoria}</p>
                <p className="text-xs text-black font-medium">Nombre</p>
                <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">{producto.nombre}</p>
                <p className="text-xs text-black font-medium">Cantidad</p>
                <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">{producto.cantidad}</p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button onClick={() => abrirEditar(producto)} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Pencil size={20} className="text-black" />
                  </button>
                  <button onClick={() => handleEliminarProducto(producto.id)} className="p-2 rounded-full hover:bg-gray-100 transition">
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

export default InventarioFundacion;