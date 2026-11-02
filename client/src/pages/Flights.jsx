import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import FlightTable from "../components/FlightTable";
import {
  createFlight,
  deleteFlight,
  getFlights,
  updateFlight,
} from "../services/flightService";
import { getGates } from "../services/gateService";

const emptyFlightForm = {
  flight_number: "",
  airline: "",
  aircraft_type: "",
  origin: "",
  destination: "",
  scheduled_time: "",
  status: "scheduled",
  gate_id: "",
};

function Flights() {
  const [flights, setFlights] = useState([]);
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [flightForm, setFlightForm] = useState(emptyFlightForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFlights() {
      try {
        setLoading(true);
        setError("");

        const [flightList, gateList] = await Promise.all([
          getFlights(),
          getGates(),
        ]);

        if (!isMounted) {
          return;
        }

        setFlights(Array.isArray(flightList) ? flightList : []);
        setGates(Array.isArray(gateList) ? gateList : []);
      } catch (err) {
        if (isMounted) {
          setError("Unable to load flights.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFlights();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetModal = () => {
    setIsModalOpen(false);
    setEditingFlightId(null);
    setFlightForm(emptyFlightForm);
    setSubmitError("");
  };

  const handleOpenAddModal = () => {
    setEditingFlightId(null);
    setFlightForm(emptyFlightForm);
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (flight) => {
    setEditingFlightId(flight.id);
    setFlightForm({
      flight_number: flight.flight_number || "",
      airline: flight.airline || "",
      aircraft_type: flight.aircraft_type || "",
      origin: flight.origin || "",
      destination: flight.destination || "",
      scheduled_time: flight.scheduled_time
        ? new Date(flight.scheduled_time).toISOString().slice(0, 16)
        : "",
      status: flight.status || "scheduled",
      gate_id: flight.gate_id ? String(flight.gate_id) : "",
    });
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFlightForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleDeleteFlight = async (flight) => {
    const confirmed = window.confirm(
      `Delete flight ${flight.flight_number || "this flight"}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFlight(flight.id);
      const [flightList, gateList] = await Promise.all([getFlights(), getGates()]);
      setFlights(Array.isArray(flightList) ? flightList : []);
      setGates(Array.isArray(gateList) ? gateList : []);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete flight.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !flightForm.flight_number ||
      !flightForm.airline ||
      !flightForm.origin ||
      !flightForm.destination ||
      !flightForm.scheduled_time ||
      !flightForm.status
    ) {
      setSubmitError("Please complete all required flight fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      ...flightForm,
      flight_number: flightForm.flight_number.trim(),
      airline: flightForm.airline.trim(),
      aircraft_type: flightForm.aircraft_type ? flightForm.aircraft_type.trim() : null,
      origin: flightForm.origin.trim().toUpperCase(),
      destination: flightForm.destination.trim().toUpperCase(),
      gate_id: flightForm.gate_id === "" ? null : Number(flightForm.gate_id),
      scheduled_time: new Date(flightForm.scheduled_time).toISOString(),
    };

    try {
      if (editingFlightId) {
        await updateFlight(editingFlightId, payload);
      } else {
        await createFlight(payload);
      }

      const [flightList, gateList] = await Promise.all([getFlights(), getGates()]);
      setFlights(Array.isArray(flightList) ? flightList : []);
      setGates(Array.isArray(gateList) ? gateList : []);
      resetModal();
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Unable to save flight.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flight-page">
      <header className="flight-page__header">
        <div>
          <h1 className="flight-page__title">Flights</h1>
          <p className="flight-page__subtitle">
            Track scheduled movements and operational status.
          </p>
        </div>

        <div className="flight-page__header-actions">
          <button type="button" className="flight-page__add-button" onClick={handleOpenAddModal}>
            <Plus className="flight-page__add-button-icon" size={18} aria-hidden="true" />
            Add Flight
          </button>
        </div>
      </header>

      {loading && <p className="flight-page__status">Loading flights...</p>}

      {!loading && error && <p className="flight-page__error">{error}</p>}

      {!loading && !error && (
        <FlightTable
          flights={flights}
          gates={gates}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteFlight}
        />
      )}

      {isModalOpen && (
        <div className="flight-page__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="flight-form-title">
          <div className="flight-page__modal">
            <div className="flight-page__modal-header">
              <h2 id="flight-form-title" className="flight-page__modal-title">
                {editingFlightId ? "Edit Flight" : "Add Flight"}
              </h2>
              <button
                type="button"
                className="flight-page__close-button"
                onClick={resetModal}
                aria-label="Close flight form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {submitError && <p className="flight-page__form-error">{submitError}</p>}

            <form className="flight-page__form" onSubmit={handleSubmit}>
              <label className="flight-page__field">
                <span>Flight Number</span>
                <input
                  type="text"
                  name="flight_number"
                  value={flightForm.flight_number}
                  onChange={handleInputChange}
                  placeholder="e.g. AA101"
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Airline</span>
                <input
                  type="text"
                  name="airline"
                  value={flightForm.airline}
                  onChange={handleInputChange}
                  placeholder="Airline name"
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Aircraft Type</span>
                <input
                  type="text"
                  name="aircraft_type"
                  value={flightForm.aircraft_type}
                  onChange={handleInputChange}
                  placeholder="e.g. A321"
                />
              </label>

              <label className="flight-page__field">
                <span>Status</span>
                <select name="status" value={flightForm.status} onChange={handleInputChange} required>
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="departed">Departed</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <label className="flight-page__field">
                <span>Origin</span>
                <input
                  type="text"
                  name="origin"
                  value={flightForm.origin}
                  onChange={handleInputChange}
                  placeholder="JFK"
                  maxLength={3}
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Destination</span>
                <input
                  type="text"
                  name="destination"
                  value={flightForm.destination}
                  onChange={handleInputChange}
                  placeholder="LAX"
                  maxLength={3}
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Scheduled Time</span>
                <input
                  type="datetime-local"
                  name="scheduled_time"
                  value={flightForm.scheduled_time}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Gate</span>
                <select name="gate_id" value={flightForm.gate_id} onChange={handleInputChange}>
                  <option value="">Unassigned</option>
                  {gates.map((gate) => (
                    <option key={gate.id} value={gate.id}>
                      {gate.gate_number || gate.gate || `Gate ${gate.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flight-page__form-actions flight-page__form-actions--full">
                <button type="button" className="flight-page__secondary-button" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="flight-page__submit-button" disabled={isSubmitting}>
                  <Save className="flight-page__submit-button-icon" size={16} aria-hidden="true" />
                  {isSubmitting ? "Saving..." : editingFlightId ? "Save Changes" : "Create Flight"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Flights;