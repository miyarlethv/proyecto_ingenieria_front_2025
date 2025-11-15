
import { Home, Users, Eye, Dog } from "lucide-react";
import { esFundacion } from "../api";

function Dashboard() {
  const esAdmin = esFundacion();

  // Tarjetas de resumen
  const stats = [
    { color: "bg-yellow-500", value: 44, label: "Mascotas disponibles", icon: <Users size={32} /> },
    { color: "bg-red-500", value: 65, label: "Visitas únicas", icon: <Eye size={32} /> },
    { color: "bg-cyan-600", value: 12, label: "Últimos animales registrados", icon: <Dog size={32} /> },
  ];

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#008658]">Dashboard</h1>
        <p className="text-white-600 text-sm mt-1">
          {esAdmin ? "Acceso total como administrador" : "Acceso limitado según permisos asignados"}
        </p>
      </header>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold mb-3 text-[#008658]">Gráfica de adopciones</h2>
          <div className="h-36 flex items-center justify-center text-gray-400">[Gráfica aquí]</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold mb-3 text-[#008658]">Visitantes</h2>
          <div className="h-36 flex items-center justify-center text-gray-400">[Mapa/Gráfica aquí]</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;