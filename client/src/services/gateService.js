import api from "../api/api";

// Fetch all gates.
export async function getGates() {
  const response = await api.get("/gates");
  return response.data;
}

// Fetch a single gate by id.
export async function getGate(id) {
  const response = await api.get(`/gates/${id}`);
  return response.data;
}

// Create a new gate.
export async function createGate(data) {
  const response = await api.post("/gates", data);
  return response.data;
}

// Update an existing gate.
export async function updateGate(id, data) {
  const response = await api.put(`/gates/${id}`, data);
  return response.data;
}

// Delete a gate by id.
export async function deleteGate(id) {
  const response = await api.delete(`/gates/${id}`);
  return response.data;
}
