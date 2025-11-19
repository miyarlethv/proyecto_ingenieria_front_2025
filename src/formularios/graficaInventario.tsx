import { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function GraficaInventario() {


  // Estados para inventario
  const [productosInventario, setProductosInventario] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  // Cargar datos del inventario
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/productos"),
          fetch("http://127.0.0.1:8000/api/categorias")
        ]);

        if (resProductos.ok) {
          const data = await resProductos.json();
          setProductosInventario(Array.isArray(data) ? data : data.data ?? []);
        }

        if (resCategorias.ok) {
          const data = await resCategorias.json();
          setCategorias(Array.isArray(data) ? data : data.data ?? []);
        }
      } catch (error) {
        console.error("Error cargando datos del inventario:", error);
      }
    };
    cargarDatos();
  }, []);

  // Preparar datos para gráfica de barras (cantidad por categoría)
  const datosGraficaBarras = {
    labels: categorias.map(cat => cat.categoria),
    datasets: [
      {
        label: 'Cantidad Total de Productos',
        data: categorias.map(cat => {
          return productosInventario
            .filter(prod => prod.categoria === cat.categoria)
            .reduce((sum, prod) => sum + (parseInt(prod.cantidad) || 0), 0);
        }),
        backgroundColor: 'rgba(0, 134, 88, 0.6)',
        borderColor: 'rgba(0, 134, 88, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para gráfica de pastel (distribución por categoría)
  const datosGraficaPastel = {
    labels: categorias.map(cat => cat.categoria),
    datasets: [
      {
        label: 'Número de Productos',
        data: categorias.map(cat => {
          return productosInventario.filter(prod => prod.categoria === cat.categoria).length;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para gráfica de dona (stock bajo)
  const productosBajoStock = productosInventario.filter(prod => parseInt(prod.cantidad) < 50);
  const datosGraficaDona = {
    labels: productosBajoStock.map(prod => prod.nombre),
    datasets: [
      {
        label: 'Stock Bajo (< 50 unidades)',
        data: productosBajoStock.map(prod => parseInt(prod.cantidad) || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Calcular estadísticas
  const totalProductos = productosInventario.length;
  const totalCantidad = productosInventario.reduce((sum, prod) => sum + (parseInt(prod.cantidad) || 0), 0);
  
  // ✅ Ordenar TODOS los productos por cantidad (de mayor a menor)
  const productosOrdenados = [...productosInventario].sort((a, b) => (parseInt(b.cantidad) || 0) - (parseInt(a.cantidad) || 0));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#008658]">Gráficas de Inventario</h1>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Total de Productos</p>
          <p className="text-3xl font-bold text-[#008658]">{totalProductos}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Cantidad Total</p>
          <p className="text-3xl font-bold text-blue-600">{totalCantidad}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Categorías</p>
          <p className="text-3xl font-bold text-purple-600">{categorias.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Stock Bajo</p>
          <p className="text-3xl font-bold text-red-600">{productosBajoStock.length}</p>
        </div>
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-[#008658]">Cantidad Total por Categoría</h2>
          <div className="h-80">
            {categorias.length > 0 ? (
              <Bar data={datosGraficaBarras} options={opcionesGrafica} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Cargando datos...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-[#008658]">Distribución de Productos</h2>
          <div className="h-80">
            {categorias.length > 0 ? (
              <Pie data={datosGraficaPastel} options={opcionesGrafica} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Cargando datos...</div>
            )}
          </div>
        </div>
      </div>

      {/* Gráfica de stock bajo y tabla */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-red-600">Productos con Stock Bajo</h2>
          <div className="h-80">
            {productosBajoStock.length > 0 ? (
              <Doughnut data={datosGraficaDona} options={opcionesGrafica} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No hay productos con stock bajo</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-[#008658]">Stock de Productos</h2>
          <div className="overflow-auto max-h-80">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Categoría</th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-700">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productosOrdenados.length > 0 ? (
                  productosOrdenados.map((prod, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{prod.nombre}</td>
                      <td className="p-3 text-sm">{prod.categoria}</td>
                      <td className="p-3 text-sm text-right font-semibold text-[#008658]">{prod.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-400">No hay productos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraficaInventario;