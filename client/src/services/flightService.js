import api from "../api/api";

// Fetch all flights.
export async function getFlights() {
  const response = await api.get("/flights");
  return response.data;
}

// Fetch a single flight by id.
export async function getFlight(id) {
  const response = await api.get(`/flights/${id}`);
  return response.data;
}

// Create a new flight.
export async function createFlight(data) {
  const response = await api.post("/flights", data);
  return response.data;
}

// Update an existing flight.
export async function updateFlight(id, data) {
  const response = await api.put(`/flights/${id}`, data);
  return response.data;
}

// Delete a flight by id.
export async function deleteFlight(id) {
  const response = await api.delete(`/flights/${id}`);
  return response.data;
}
