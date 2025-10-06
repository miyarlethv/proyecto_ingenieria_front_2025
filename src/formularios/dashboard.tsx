
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, Users, Eye, Dog, NotebookPen, UserPlus, Shield } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreFundacion = location.state?.nombre || "Fundación";

  // Tarjetas de resumen
  const stats = [
    { color: "bg-yellow-500", value: 44, label: "Mascotas disponibles", icon: <Users size={32} /> },
    { color: "bg-red-500", value: 65, label: "Visitas únicas", icon: <Eye size={32} /> },
    { color: "bg-cyan-600", value: 12, label: "Últimos animales registrados", icon: <Dog size={32} /> },
  ];

  // Estado para cada desplegable
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // Opciones del menú lateral
  const menu = [
    {
      nombre: "Mascotas",
      icono: <Home size={22} className="text-white" />,
      subOpciones: [
        { nombre: "Registro de mascotas", ruta: "/BienvenidaFundacion", icono: <Dog size={20} className="text-white" /> },
        { nombre: "Agregar historia clínica", ruta: "/B", icono: <NotebookPen size={20} className="text-white" /> },
      ],
    },
    {
      nombre: "Usuarios",
      icono: <Users size={22} className="text-white" />,
      subOpciones: [
        { nombre: "Crear usuario", ruta: "/crear-usuario", icono: <UserPlus size={20} className="text-white" /> },
        { nombre: "Administrar roles", ruta: "/administrar-roles", icono: <Shield size={20} className="text-white" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#008658] text-white flex flex-col min-h-screen">
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-12 h-12 rounded-full bg-gray-400" />
          <div>
            <div className="font-bold">{nombreFundacion}</div>
            <div className="text-xs text-gray-300">Fundación</div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          {menu.map((item) => (
            <div key={item.nombre} className="mb-2">
              <button
                onClick={() => setOpenDropdowns((prev) => ({ ...prev, [item.nombre]: !prev[item.nombre] }))}
                className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-[#008658] transition"
              >
                <span>{item.icono}</span>
                <span>{item.nombre}</span>
                <span className="ml-auto">{openDropdowns[item.nombre] ? '▲' : '▼'}</span>
              </button>
              {/* Sub-opciones desplegables */}
              {openDropdowns[item.nombre] && (
                <div className="ml-8 mt-2">
                  {item.subOpciones.map((sub) => (
                    <button
                      key={sub.nombre}
                      onClick={() => navigate(sub.ruta, { state: { nombre: nombreFundacion } })}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-[#008658] transition mb-1 text-sm"
                    >
                      <span>{sub.icono}</span>
                      <span>{sub.nombre}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#008658]">Dashboard</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-black border border-black rounded-[10px] px-4 py-1 hover:bg-gray-100 transition"
          >
            Volver
          </button>
        </header>

        {/* Tarjetas de resumen */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-xl shadow-lg p-6 flex flex-col items-center text-white ${stat.color}`}>
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm mt-2">{stat.label}</div>
              <button className="mt-4 text-xs bg-white text-black px-3 py-1 rounded hover:bg-gray-200">Más info</button>
            </div>
          ))}
        </div>

        {/* Área de widgets y gráficas (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-[#008658]">Gráfica de adopciones</h2>
            <div className="h-40 flex items-center justify-center text-gray-400">[Gráfica aquí]</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-[#008658]">Visitantes</h2>
            <div className="h-40 flex items-center justify-center text-gray-400">[Mapa/Gráfica aquí]</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
