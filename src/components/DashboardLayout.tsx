import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Home, Users, Dog, NotebookPen, UserPlus, Shield, Package, Heart, ClipboardList, Key, AlertTriangle, X } from "lucide-react";
import { obtenerNombre, esFundacion, tienePermiso, logout } from "../api";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreUsuario = obtenerNombre() || location.state?.nombre || "Usuario";
  const esAdmin = esFundacion();
  
  // Estado para modal de permisos
  const [modalPermiso, setModalPermiso] = useState<{ mostrar: boolean; mensaje: string }>({
    mostrar: false,
    mensaje: ""
  });

  // Estado para el logo de la fundación
  const [logoFundacion, setLogoFundacion] = useState<string | null>(null);
  const [nombreFundacion, setNombreFundacion] = useState<string>("");

  // Obtener datos de la fundación
  useEffect(() => {
    const obtenerDatosFundacion = async () => {
      try {
        const token = localStorage.getItem("token");
        const fundacionId = localStorage.getItem("fundacion_id");
        
        console.log("fundacion_id desde localStorage:", fundacionId);
        
        // Obtener todas las fundaciones (temporalmente mientras arreglamos el backend)
        const url = "http://127.0.0.1:8000/api/Fundacion";
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Respuesta API:", response.status);
        console.log("URL llamada:", url);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Datos completos de la API:", data);
          
          // Buscar la fundación por ID si existe, sino tomar la primera
          let fundacion;
          if (Array.isArray(data)) {
            console.log("Total de fundaciones:", data.length);
            if (fundacionId) {
              console.log("Buscando fundación con ID:", fundacionId);
              fundacion = data.find(f => f.id === parseInt(fundacionId));
              console.log("Fundación encontrada por ID:", fundacion);
            }
            if (!fundacion) {
              console.log("No se encontró por ID, tomando la primera");
              fundacion = data[0];
            }
          } else {
            fundacion = data;
          }
          
          console.log("Fundación seleccionada:", fundacion);
          console.log("ID de la fundación seleccionada:", fundacion?.id);
          console.log("Nombre de la fundación seleccionada:", fundacion?.nombre);
          console.log("Logo fundación:", fundacion?.logo);
          
          if (fundacion) {
            setNombreFundacion(fundacion.nombre || "");
            if (fundacion.logo) {
              const urlLogo = `http://127.0.0.1:8000/storage/${fundacion.logo}`;
              console.log("URL del logo:", urlLogo);
              setLogoFundacion(urlLogo);
            } else {
              console.log("La fundación no tiene logo registrado");
            }
          }
        } else {
          console.error("Error en la respuesta:", response.status);
        }
      } catch (error) {
        console.error("Error al obtener datos de la fundación:", error);
      }
    };

    if (esAdmin) {
      obtenerDatosFundacion();
    }
  }, [esAdmin]);

  // Función para verificar si una opción está habilitada
  const estaHabilitado = (permiso: string) => {
    return esAdmin || tienePermiso(permiso);
  };

  // Opciones del menú lateral con permisos
  const menu = [
    {
      nombre: "Inicio",
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
          permiso: "CrearMascotas" // ✅ Correcto
        },
        { 
          nombre: "Agregar historia clínica", 
          ruta: "/HistoriaClinica", 
          icono: <NotebookPen size={20} className="text-white" />,
          permiso: "CrearHistoriaClinica" // ✅ CORREGIDO - era "ListarHistoriasClinicas"
        },
      ],
    },
    {
      nombre: "Adopciones",
      icono: <Heart size={22} className="text-white" />,
      subOpciones: [
        { 
          nombre: "Solicitudes de adopción", 
          ruta: "/solicitudes-adopcion", 
          icono: <ClipboardList size={20} className="text-white" />,
          permiso: "solicitudes-adopcion" // ✅ CORREGIDO - coincide con api.ts
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
          permiso: "CrearFuncionario" // ✅ Correcto
        },
        { 
          nombre: "Administrar roles", 
          ruta: "/GestionRoles", 
          icono: <Shield size={20} className="text-white" />,
          permiso: "ListarRoles" // ✅ Correcto
        },
        { 
          nombre: "Administrar permisos", 
          ruta: "/GestionPermisos", 
          icono: <Key size={20} className="text-white" />,
          permiso: "ListarPermisos" // ✅ Correcto
        },
      ],
    },
    {
      nombre: "Inventario",
      icono: <Package size={22} className="text-white" />,
      subOpciones: [
        { 
          nombre: "Registro de Producto", 
          ruta: "/inventariofundacion", 
          icono: <Package size={20} className="text-white" />,
          permiso: "CrearProducto" // ✅ CORREGIDO - coincide con api.ts
        },
        { 
          nombre: "Registro de Categorías", 
          ruta: "/categorias", 
          icono: <Shield size={20} className="text-white" />,
          permiso: "CrearCategoria" // ✅ CORREGIDO - coincide con api.ts
        },
        { 
          nombre: "Gráfica de inventario", 
          ruta: "/graficas-inventario", 
          icono: <Home size={20} className="text-white" />,
          permiso: "CrearProducto" // ✅ Usa el mismo permiso de productos
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
      setModalPermiso({
        mostrar: true,
        mensaje: `No tienes permiso para acceder a "${subOpcion.nombre}"`
      });
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
          {/* Logo de la fundación o inicial del usuario */}
          {logoFundacion ? (
            <img
              src={logoFundacion}
              alt={nombreFundacion}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              onError={() => {
                console.error("Error al cargar la imagen:", logoFundacion);
                setLogoFundacion(null);
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center font-bold text-lg">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
          )}
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

      {/* Modal de permiso denegado */}
      {modalPermiso.mostrar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Acceso Denegado</h3>
              </div>
              <button
                onClick={() => setModalPermiso({ mostrar: false, mensaje: "" })}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">{modalPermiso.mensaje}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalPermiso({ mostrar: false, mensaje: "" })}
                className="bg-[#008658] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
