import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Home, Users, Dog, NotebookPen, UserPlus, Shield } from "lucide-react";
import { obtenerNombre, esFundacion, tienePermiso, logout } from "../api";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreUsuario = obtenerNombre() || location.state?.nombre || "Usuario";
  const esAdmin = esFundacion();

  // Función para verificar si una opción está habilitada
  const estaHabilitado = (permiso: string) => {
    return esAdmin || tienePermiso(permiso);
  };

  // Opciones del menú lateral con permisos
  const menu = [
    {
      nombre: "Dashboard",
      icono: <Home size={22} className="text-white" />,
      ruta: "/dashboard",
      permiso: null, // Siempre visible
    },
    {
      nombre: "Mascotas",
      icono: <Dog size={22} className="text-white" />,
      subOpciones: [
        { 
          nombre: "Registro de mascotas", 
          ruta: "/BienvenidaFundacion", 
          icono: <Dog size={20} className="text-white" />,
          permiso: "CrearMascotas"
        },
        { 
          nombre: "Agregar historia clínica", 
          ruta: "/HistoriaClinica", 
          icono: <NotebookPen size={20} className="text-white" />,
          permiso: "ListarHistoriasClinicas"
        },
      ],
    },
    {
      nombre: "Usuarios",
      icono: <Users size={22} className="text-white" />,
      subOpciones: [
        { 
          nombre: "Crear usuario", 
          ruta: "/CrearFuncionarios", 
          icono: <UserPlus size={20} className="text-white" />,
          permiso: "CrearFuncionario"
        },
        { 
          nombre: "Administrar roles", 
          ruta: "/GestionRoles", 
          icono: <Shield size={20} className="text-white" />,
          permiso: "ListarRoles"
        },
        { 
          nombre: "Administrar permisos", 
          ruta: "/GestionPermisos", 
          icono: <Shield size={20} className="text-white" />,
          permiso: "ListarPermisos"
        },
      ],
    },
  ];

  // Manejar clic en opción del menú
  const handleMenuClick = (ruta: string) => {
    navigate(ruta, { state: { nombre: nombreUsuario } });
  };

  // Manejar clic en sub-opción con validación de permisos
  const handleSubOpcionClick = (subOpcion: any) => {
    if (!estaHabilitado(subOpcion.permiso)) {
      alert(`⛔ No tienes permiso para acceder a "${subOpcion.nombre}"`);
      return;
    }
    navigate(subOpcion.ruta, { state: { nombre: nombreUsuario } });
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#008658] text-white flex flex-col h-screen fixed left-0 top-0 bottom-0 z-10">
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center font-bold text-lg">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm">{nombreUsuario}</div>
            <div className="text-xs text-gray-300">
              {esAdmin ? "🔓 Admin" : "👤 Funcionario"}
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-3 overflow-y-auto">
          {menu.map((item) => (
            <div key={item.nombre} className="mb-1">
              {/* Opción principal */}
              {item.ruta && (
                <button
                  onClick={() => handleMenuClick(item.ruta)}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-[#006f49] transition"
                >
                  <span>{item.icono}</span>
                  <span>{item.nombre}</span>
                </button>
              )}
              
              {/* Sub-opciones siempre visibles */}
              {item.subOpciones && (
                <>
                  <div className="px-4 py-2 text-xs text-gray-300 font-semibold uppercase tracking-wider mt-2">
                    {item.nombre}
                  </div>
                  <div className="ml-2">
                    {item.subOpciones.map((sub: any) => {
                      const permitido = estaHabilitado(sub.permiso);
                      return (
                        <button
                          key={sub.nombre}
                          onClick={() => handleSubOpcionClick(sub)}
                          disabled={!permitido}
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition mb-1 text-sm ${
                            permitido 
                              ? "hover:bg-[#006f49] cursor-pointer" 
                              : "opacity-50 cursor-not-allowed bg-gray-600"
                          }`}
                          title={permitido ? "" : "🔒 Sin permiso"}
                        >
                          <span>{sub.icono}</span>
                          <span>{sub.nombre}</span>
                          {!permitido && <span className="ml-auto text-xs">🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-sm"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
