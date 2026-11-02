import api from "../api/api";

// Fetch all incidents.
export async function getIncidents() {
  const response = await api.get("/incidents");
  return response.data;
}

// Fetch a single incident by id.
export async function getIncident(id) {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
}

// Create a new incident.
export async function createIncident(data) {
  const response = await api.post("/incidents", data);
  return response.data;
}

// Update an existing incident.
export async function updateIncident(id, data) {
  const response = await api.put(`/incidents/${id}`, data);
  return response.data;
}

// Delete an incident by id.
export async function deleteIncident(id) {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
}
