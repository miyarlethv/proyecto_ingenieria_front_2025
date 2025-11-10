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
  ];

  const isPublic = PUBLIC_PATH_SEGMENTS.some((seg) =>
    finalPath.toLowerCase().includes(seg.toLowerCase())
  );

  const defaultHeaders: Record<string, string> = {};
  if (token && !isPublic) {
    // Solo añadir Authorization si existe token y la ruta NO es pública
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Si el body es FormData, no establecer Content-Type (el navegador lo hace automáticamente con boundary)
  const isFormData = options?.body instanceof FormData;
  
  const mergedHeaders: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
    ...defaultHeaders,
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
