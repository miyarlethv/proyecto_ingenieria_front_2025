import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dog, ChartPie, Users, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { apiFetch } from "../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreFundacion = location.state?.nombre || "Fundación";

  // Estados para los contadores
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  
  // Estados para adopciones
  const [totalAdopciones, setTotalAdopciones] = useState(0);
  const [adopcionesPendientes, setAdopcionesPendientes] = useState(0);
  const [adopcionesAprobadas, setAdopcionesAprobadas] = useState(0);
  const [adopcionesRechazadas, setAdopcionesRechazadas] = useState(0);

  // Estados para personas registradas
  const [totalPersonas, setTotalPersonas] = useState(0);

  // Estado para la foto de la fundación
  const [fotoFundacion, setFotoFundacion] = useState<string | null>(null);

  // Cargar datos de las APIs
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar mascotas
        const resMascotas = await apiFetch("mascotas");
        if (resMascotas.ok) {
          const dataMascotas = await resMascotas.json();
          const mascotas = Array.isArray(dataMascotas) ? dataMascotas : dataMascotas.data ?? [];
          setTotalMascotas(mascotas.length);
        }

        // Cargar productos
        const resProductos = await apiFetch("productos");
        if (resProductos.ok) {
          const dataProductos = await resProductos.json();
          const productos = Array.isArray(dataProductos) ? dataProductos : dataProductos.data ?? [];
          setTotalProductos(productos.length);
        }

        // Cargar funcionarios
        const resFuncionarios = await apiFetch("ListarFuncionarios");
        if (resFuncionarios.ok) {
          const dataFuncionarios = await resFuncionarios.json();
          const funcionarios = Array.isArray(dataFuncionarios) ? dataFuncionarios : dataFuncionarios.data ?? [];
          setTotalFuncionarios(funcionarios.length);
        }

        // Cargar adopciones
        const resAdopciones = await apiFetch("solicitudes-adopcion");
        if (resAdopciones.ok) {
          const dataAdopciones = await resAdopciones.json();
          const adopciones = Array.isArray(dataAdopciones) ? dataAdopciones : dataAdopciones.data ?? [];
          
          setTotalAdopciones(adopciones.length);
          setAdopcionesPendientes(adopciones.filter((a: any) => a.estado === 'Pendiente' || a.estado === 'pendiente').length);
          setAdopcionesAprobadas(adopciones.filter((a: any) => a.estado === 'Aprobada' || a.estado === 'aprobada').length);
          setAdopcionesRechazadas(adopciones.filter((a: any) => a.estado === 'Rechazada' || a.estado === 'rechazada').length);
        }

        // Cargar personas
        const resPersonas = await apiFetch("personas");
        if (resPersonas.ok) {
          const dataPersonas = await resPersonas.json();
          const personas = Array.isArray(dataPersonas) ? dataPersonas : dataPersonas.data ?? [];
          setTotalPersonas(personas.length);
        }

        // Cargar datos de la fundación (foto y nombre)
        const resFundacion = await apiFetch("fundaciones");
        if (resFundacion.ok) {
          const dataFundacion = await resFundacion.json();
          const fundaciones = Array.isArray(dataFundacion) ? dataFundacion : dataFundacion.data ?? [];
          
          // Buscar la fundación actual por nombre
          const fundacionActual = fundaciones.find((f: any) => f.nombre === nombreFundacion);
          
          if (fundacionActual && fundacionActual.logo) {
            setFotoFundacion(fundacionActual.logo);
          }
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    };

    cargarDatos();
  }, [nombreFundacion]);

  // Tarjetas de resumen con datos dinámicos
  const stats = [
    { 
      color: "bg-yellow-500", 
      value: totalMascotas, 
      label: "Mascotas disponibles", 
      icon: <Dog size={28} />,
      ruta: "/BienvenidaFundacion"
    },
    { 
      color: "bg-red-500", 
      value: totalProductos, 
      label: "Productos en inventario", 
      icon: <ChartPie size={28} />, 
      ruta: "/graficaInventario"
    },
    { 
      color: "bg-cyan-600", 
      value: totalFuncionarios, 
      label: "Funcionarios registrados", 
      icon: <Users size={28} />,
      ruta: "/CrearFuncionarios"
    },
  ];

  // Estadísticas de adopciones
  const estadisticasAdopciones = [
    {
      label: "Total",
      value: totalAdopciones,
      icon: <FileText size={20} />,
      color: "bg-purple-500",
      textColor: "text-purple-600"
    },
    {
      label: "Pendientes",
      value: adopcionesPendientes,
      icon: <Clock size={20} />,
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      label: "Aprobadas",
      value: adopcionesAprobadas,
      icon: <CheckCircle size={20} />,
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      label: "Rechazadas",
      value: adopcionesRechazadas,
      icon: <XCircle size={20} />,
      color: "bg-red-500",
      textColor: "text-red-600"
    }
  ];

  // Datos para la gráfica de personas
  const datosGraficaPersonas = {
    labels: ['Total de Personas'],
    datasets: [
      {
        label: 'Visitantes Registrados',
        data: [totalPersonas],
        backgroundColor: 'rgba(0, 134, 88, 0.8)',
        borderColor: 'rgba(0, 134, 88, 1)',
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 60,
        hoverBackgroundColor: 'rgba(0, 134, 88, 1)',
        hoverBorderColor: 'rgba(0, 134, 88, 1)',
      },
    ],
  };

  const opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          color: '#333',
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Registro Total de Visitantes',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#008658',
        padding: {
          top: 5,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        padding: 14,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `Total: ${context.parsed.y} Visitantes registrados`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.max(1, Math.ceil(totalPersonas / 5)),
          font: {
            size: 12,
          },
          color: '#666',
          padding: 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Cantidad',
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          color: '#008658',
          padding: { top: 10, bottom: 0 },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen">
      {/* ========== HEADER ========== */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#008658]">Dashboard</h1>
      </header>
          
      {/* ========== TARJETAS DE RESUMEN ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={`rounded-xl shadow-lg p-4 flex flex-col items-center text-white ${stat.color} cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => stat.ruta && navigate(stat.ruta, { state: { nombre: nombreFundacion } })}
          >
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-4xl font-bold">{stat.value}</div>
            <div className="text-xs mt-1 text-center">{stat.label}</div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (stat.ruta) navigate(stat.ruta, { state: { nombre: nombreFundacion } });
              }}
              className="mt-2 text-xs bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Más info
            </button>
          </div>
        ))}
      </div>

      {/* ========== GRÁFICAS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estadísticas de Adopciones */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-base font-bold mb-3 text-[#008658]">Estado de Adopciones</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {estadisticasAdopciones.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-200">
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-20 mb-2`}>
                  <div className={stat.textColor}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 text-center font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Barra de progreso visual */}
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">Distribución</div>
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
              {totalAdopciones > 0 ? (
                <>
                  <div 
                    className="bg-yellow-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(adopcionesPendientes / totalAdopciones) * 100}%` }}
                  >
                    {adopcionesPendientes > 0 && `${Math.round((adopcionesPendientes / totalAdopciones) * 100)}%`}
                  </div>
                  <div 
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(adopcionesAprobadas / totalAdopciones) * 100}%` }}
                  >
                    {adopcionesAprobadas > 0 && `${Math.round((adopcionesAprobadas / totalAdopciones) * 100)}%`}
                  </div>
                  <div 
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(adopcionesRechazadas / totalAdopciones) * 100}%` }}
                  >
                    {adopcionesRechazadas > 0 && `${Math.round((adopcionesRechazadas / totalAdopciones) * 100)}%`}
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center justify-center text-xs text-gray-400">
                  Sin datos
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>🟡 Pendientes</span>
              <span>🟢 Aprobadas</span>
              <span>🔴 Rechazadas</span>
            </div>
          </div>
        </div>

        {/* Gráfica de Personas Registradas */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-t-4 border-[#008658]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#008658] flex items-center gap-2">
              <Users size={20} className="text-[#008658]" />
              Visitantes
            </h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar data={datosGraficaPersonas} options={opcionesGrafica} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;