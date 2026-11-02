import api from "../api/api";

// Authenticate a user and return the backend response data.
export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Clear local authentication state for the current session.
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
