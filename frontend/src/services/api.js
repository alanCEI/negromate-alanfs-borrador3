/**
 *
 * Comunicación con el Backend
 *
 */

// Configuración
const BASE_URL = import.meta.env.VITE_API_URL;
// Maneja las respuestas de la API
const handleResponse = async (response) => {
  // Parsear la respuesta como JSON
  const data = await response.json();
  // Si la respuesta no fue exitosa, mostrar error
  if (!response.ok) {
    const error = (data && data.msg) || response.statusText;
    throw new Error(error);
  }
  // Return si los datos estan correctos
  return data;
};

// Realizar peticiones a la API
export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  options = {}
) => {
  // Configuración
  let baseUrl = BASE_URL.replace(/\/$/, "");
  // Aseguramos que siempre incluya el /api
  if (!baseUrl.endsWith("/api")) {
    baseUrl = `${baseUrl}/api`;
  }

  const url = `${baseUrl}/${endpoint.replace(/^\//, "")}`;
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
  };
  // Si se proporciona un token JWT, lo agregamos al header Authorization
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fetch
  const fetchOptions = {
    method,
    headers,
    ...options,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    return handleResponse(response);
  } catch (error) {
    // Error en consola
    console.error("API request error:", error);
    throw error;
  }
};

// Servicios de la API organizados
export const api = {
  auth: {
    login: (credentials, options = {}) =>
      apiRequest("auth/login", "POST", credentials, null, options),
    register: (userData, options = {}) =>
      apiRequest("auth/register", "POST", userData, null, options),
    getProfile: (token, options = {}) =>
      apiRequest("auth/profile", "GET", null, token, options),
  },
  products: {
    get: (category = "", options = {}) =>
      apiRequest(
        `products${category ? `?category=${category}` : ""}`,
        "GET",
        null,
        null,
        options
      ),
    getById: (id, options = {}) =>
      apiRequest(`products/${id}`, "GET", null, null, options),
    getWithGallery: (category, options = {}) =>
      apiRequest(`products/category/${category}`, "GET", null, null, options),
  },
  content: {
    get: (sectionName, options = {}) =>
      apiRequest(`content/${sectionName}`, "GET", null, null, options),
  },
  orders: {
    create: (orderData, token, options = {}) =>
      apiRequest("orders", "POST", orderData, token, options),
    getMyOrders: (token, options = {}) =>
      apiRequest("orders/myorders", "GET", null, token, options),
  },
};
