import axios from "axios";

// Create a shared Axios instance for all API requests.
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach the JWT from localStorage to the Authorization header when available.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Export the configured Axios instance for use across the frontend.
export default api;
