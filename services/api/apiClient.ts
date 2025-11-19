import axios from "axios";

// URL base de la API - configurable mediante variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5277";

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar autenticación
      sessionStorage.removeItem("authToken");
      // Opcional: redirigir a login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Función helper para obtener URLs completas de recursos (imágenes, etc.)
export const getFullApiUrl = (path: string | undefined): string => {
  if (!path) return "";

  // Si la ruta ya es una URL completa, devolverla tal cual
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Si la ruta comienza con /, quitarla para evitar doble /
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${API_BASE_URL}/${cleanPath}`;
};

// Función helper específica para obtener URLs de imágenes de productos
export const getProductsImageUrl = (productId: string | undefined): string => {
  if (!productId) return "";
  return `${API_BASE_URL}/api/public/products/${productId}/image`;
};

export default apiClient;
