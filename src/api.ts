export const API_BASE = "http://127.0.0.1:8000/api";

/**
 * Helper minimal para centralizar llamadas al backend.
 * Añade Authorization si hay token en localStorage.
 * Devuelve el objeto Response para mantener compatibilidad con el código existente.
 */
export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("token");
  const finalPath = path.startsWith("/") ? `${API_BASE}${path}` : `${API_BASE}/${path}`;

  // Rutas públicas (no deben enviar Authorization). Añade aquí las rutas
  // que quieres que siempre sean públicas desde el frontend.
  // Las rutas de registro, login y lectura de mascotas aleatorias no requieren token.
  const PUBLIC_PATH_SEGMENTS = [
    "/crearfundacion",
    "/crear",
    "/fundacion",
    "/persona",
    "/login",
    "/mascotas/aleatorias",
    "/mascotas",
    "/productos",
    "/categorias",
    "/nombres",
  ];

  const pathAfterApi = finalPath.replace(API_BASE, '').toLowerCase();
  const isPublic = PUBLIC_PATH_SEGMENTS.some((seg) => 
    pathAfterApi === seg.toLowerCase() || 
    pathAfterApi.startsWith(seg.toLowerCase() + '/')
  );

  const defaultHeaders: Record<string, string> = {};
  if (token && !isPublic) {
    // Solo añadir Authorization si existe token y la ruta NO es pública
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Si el body es FormData, no establecer Content-Type (el navegador lo hace automáticamente con boundary)
  const isFormData = options?.body instanceof FormData;
  
  const mergedHeaders: Record<string, string> = {
    ...defaultHeaders, // Authorization debe ir primero
    ...(options?.headers as Record<string, string>),
  };

  // Si es FormData, eliminar cualquier Content-Type que pudiera haberse establecido
  if (isFormData && mergedHeaders['Content-Type']) {
    delete mergedHeaders['Content-Type'];
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  return fetch(finalPath, mergedOptions);
}

// ============================================================
// SISTEMA DE PERMISOS
// ============================================================

export interface Permiso {
  id: number;
  name: string;
  url: string | null;
  descripcion: string | null;
}

export interface UsuarioAuth {
  tipo: 'fundacion' | 'funcionario' | 'persona';
  nombre: string;
  email: string;
  permisos: Permiso[] | 'all';
  roles?: string[];
}

/**
 * Guardar información del usuario después del login
 * Llamar después de recibir respuesta exitosa de /api/login
 */
export function guardarLogin(data: any): void {
  localStorage.setItem('token', data.token);
  localStorage.setItem('tipo', data.tipo);
  localStorage.setItem('nombre', data.nombre);
  localStorage.setItem('email', data.email || '');
  
  if (data.tipo === 'fundacion') {
    // Fundación tiene todos los permisos
    localStorage.setItem('permisos', 'all');
  } else if (data.tipo === 'funcionario') {
    // Funcionario tiene permisos específicos
    localStorage.setItem('permisos', JSON.stringify(data.permisos || []));
    localStorage.setItem('roles', JSON.stringify(data.roles || []));
  } else {
    // Persona no tiene permisos administrativos
    localStorage.removeItem('permisos');
    localStorage.removeItem('roles');
  }
}

/**
 * Obtener información del usuario autenticado
 */
export function obtenerUsuario(): UsuarioAuth | null {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo') as 'fundacion' | 'funcionario' | 'persona' | null;
  const nombre = localStorage.getItem('nombre');
  const email = localStorage.getItem('email');
  const permisosStr = localStorage.getItem('permisos');
  const rolesStr = localStorage.getItem('roles');

  if (!token || !tipo || !nombre) {
    return null;
  }

  let permisos: Permiso[] | 'all' = [];
  if (permisosStr === 'all') {
    permisos = 'all';
  } else if (permisosStr) {
    try {
      permisos = JSON.parse(permisosStr);
    } catch {
      permisos = [];
    }
  }

  let roles: string[] = [];
  if (rolesStr) {
    try {
      roles = JSON.parse(rolesStr);
    } catch {
      roles = [];
    }
  }

  return {
    tipo,
    nombre,
    email: email || '',
    permisos,
    roles,
  };
}

/**
 * Verificar si el usuario tiene permiso para acceder a una URL
 * @param url - URL del endpoint (ej: 'CrearMascotas', 'ListarFuncionarios')
 * @returns true si tiene permiso, false si no
 */
export function tienePermiso(url: string): boolean {
  const usuario = obtenerUsuario();
  
  if (!usuario) {
    return false; // No autenticado
  }

  // Personas no tienen permisos administrativos
  if (usuario.tipo === 'persona') {
    return false;
  }

  // Fundación tiene todos los permisos
  if (usuario.tipo === 'fundacion' || usuario.permisos === 'all') {
    return true;
  }

  // Funcionario: verificar permisos específicos
  if (Array.isArray(usuario.permisos)) {
    // Normalizar URL (quitar / inicial si existe)
    const urlNormalizada = url.startsWith('/') ? url.substring(1) : url;
    
    return usuario.permisos.some(
      (permiso) => permiso.url && permiso.url.toLowerCase() === urlNormalizada.toLowerCase()
    );
  }

  return false;
}

/**
 * Verificar si el usuario tiene al menos uno de los permisos
 */
export function tieneAlgunPermiso(urls: string[]): boolean {
  return urls.some((url) => tienePermiso(url));
}

/**
 * Verificar si el usuario tiene todos los permisos
 */
export function tieneTodosLosPermisos(urls: string[]): boolean {
  return urls.every((url) => tienePermiso(url));
}

/**
 * Verificar si el usuario es fundación
 */
export function esFundacion(): boolean {
  const usuario = obtenerUsuario();
  return usuario?.tipo === 'fundacion';
}

/**
 * Verificar si el usuario es funcionario
 */
export function esFuncionario(): boolean {
  const usuario = obtenerUsuario();
  return usuario?.tipo === 'funcionario';
}

/**
 * Verificar si el usuario es persona
 */
export function esPersona(): boolean {
  const usuario = obtenerUsuario();
  return usuario?.tipo === 'persona';
}

/**
 * Verificar si hay una sesión activa
 */
export function estaAutenticado(): boolean {
  return !!localStorage.getItem('token');
}

/**
 * Obtener nombre del usuario
 */
export function obtenerNombre(): string {
  return localStorage.getItem('nombre') || '';
}

/**
 * Obtener tipo de usuario
 */
export function obtenerTipo(): 'fundacion' | 'funcionario' | 'persona' | null {
  return localStorage.getItem('tipo') as any;
}

/**
 * Cerrar sesión (limpiar todo el localStorage)
 */
export function cerrarSesion(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('tipo');
  localStorage.removeItem('nombre');
  localStorage.removeItem('email');
  localStorage.removeItem('permisos');
  localStorage.removeItem('roles');
}

/**
 * Cerrar sesión en el backend y limpiar localStorage
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } catch (error) {
    console.error('Error al cerrar sesión en el backend:', error);
  } finally {
    cerrarSesion();
  }
}

// ============================================================
// CATÁLOGO DE PERMISOS DEL SISTEMA
// ============================================================

/**
 * Permisos operativos del sistema (Mascotas, Historias Clínicas, Adopciones, Productos)
 */
export const PERMISOS_SISTEMA = [
  // Mascotas
  { url: 'CrearMascotas', nombre: 'Crear Mascotas', categoria: 'Mascotas' },
  { url: 'ActualizarMascotas', nombre: 'Editar Mascotas', categoria: 'Mascotas' },
  { url: 'EliminarMascotas', nombre: 'Eliminar Mascotas', categoria: 'Mascotas' },
  
  // Historias Clínicas
  { url: 'CrearHistoriaClinica', nombre: 'Crear Historia Clínica', categoria: 'Historias Clínicas' },
  { url: 'ActualizarHistoriaClinica', nombre: 'Editar Historia Clínica', categoria: 'Historias Clínicas' },
  { url: 'EliminarHistoriaClinica', nombre: 'Eliminar Historia Clínica', categoria: 'Historias Clínicas' },
  { url: 'ListarHistoriasClinicas', nombre: 'Ver Historias Clínicas', categoria: 'Historias Clínicas' },
  
  // Solicitudes de Adopción
  { url: 'solicitudes-adopcion', nombre: 'Gestionar Solicitudes de Adopción', categoria: 'Adopciones' },
  
  // Productos
  { url: 'CrearProducto', nombre: 'Crear Productos', categoria: 'Productos' },
  { url: 'ActualizarProducto', nombre: 'Editar Productos', categoria: 'Productos' },
  { url: 'EliminarProducto', nombre: 'Eliminar Productos', categoria: 'Productos' },
  
  // Categorías
  { url: 'CrearCategoria', nombre: 'Gestionar Categorías', categoria: 'Productos' },
];

/**
 * Permisos administrativos (Roles, Permisos, Funcionarios)
 * Solo accesibles para Fundación
 */
export const PERMISOS_ADMIN = [
  // Roles
  { url: 'CrearRol', nombre: 'Crear Roles', categoria: 'Roles' },
  { url: 'ListarRoles', nombre: 'Listar Roles', categoria: 'Roles' },
  { url: 'ActualizarRol', nombre: 'Editar Roles', categoria: 'Roles' },
  { url: 'EliminarRol', nombre: 'Eliminar Roles', categoria: 'Roles' },
  
  // Permisos
  { url: 'CrearPermiso', nombre: 'Crear Permisos', categoria: 'Permisos' },
  { url: 'ListarPermisos', nombre: 'Listar Permisos', categoria: 'Permisos' },
  { url: 'ActualizarPermiso', nombre: 'Editar Permisos', categoria: 'Permisos' },
  { url: 'EliminarPermiso', nombre: 'Eliminar Permisos', categoria: 'Permisos' },
  
  // Funcionarios
  { url: 'CrearFuncionario', nombre: 'Crear Funcionarios', categoria: 'Funcionarios' },
  { url: 'ListarFuncionarios', nombre: 'Listar Funcionarios', categoria: 'Funcionarios' },
  { url: 'ActualizarFuncionario', nombre: 'Editar Funcionarios', categoria: 'Funcionarios' },
  { url: 'EliminarFuncionario', nombre: 'Eliminar Funcionarios', categoria: 'Funcionarios' },
];

/**
 * Todos los permisos del sistema (combinación de operativos y administrativos)
 */
export const TODOS_LOS_PERMISOS = [...PERMISOS_SISTEMA, ...PERMISOS_ADMIN];