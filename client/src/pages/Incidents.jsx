import { useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { getFlights } from "../services/flightService";
import {
  createIncident,
  deleteIncident,
  getIncidents,
  updateIncident,
} from "../services/incidentService";

const emptyIncidentForm = {
  flight_id: "",
  title: "",
  description: "",
  severity: "low",
  status: "open",
};

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncidentId, setEditingIncidentId] = useState(null);
  const [incidentForm, setIncidentForm] = useState(emptyIncidentForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const [incidentList, flightList] = await Promise.all([
          getIncidents(),
          getFlights(),
        ]);

        if (!isMounted) {
          return;
        }

        setIncidents(Array.isArray(incidentList) ? incidentList : []);
        setFlights(Array.isArray(flightList) ? flightList : []);
      } catch (err) {
        if (isMounted) {
          setError("Unable to load incidents.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadIncidents();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetModal = () => {
    setIsModalOpen(false);
    setEditingIncidentId(null);
    setIncidentForm(emptyIncidentForm);
    setSubmitError("");
  };

  const handleOpenAddModal = () => {
    setEditingIncidentId(null);
    setIncidentForm(emptyIncidentForm);
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (incident) => {
    setEditingIncidentId(incident.id);
    setIncidentForm({
      flight_id: incident.flight_id ? String(incident.flight_id) : "",
      title: incident.title || "",
      description: incident.description || "",
      severity: incident.severity || "low",
      status: incident.status || "open",
    });
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setIncidentForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const getSeverityClass = (severity) => {
    const normalized = String(severity || "").toLowerCase();

    if (normalized === "critical") {
      return "recent-incidents-table__severity--critical";
    }

    if (normalized === "high") {
      return "recent-incidents-table__severity--high";
    }

    if (normalized === "medium") {
      return "recent-incidents-table__severity--medium";
    }

    return "recent-incidents-table__severity--low";
  };

  const formatReportedDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteIncident = async (incident) => {
    const confirmed = window.confirm(
      `Delete incident ${incident.title || "this incident"}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteIncident(incident.id);
      const [incidentList, flightList] = await Promise.all([
        getIncidents(),
        getFlights(),
      ]);
      setIncidents(Array.isArray(incidentList) ? incidentList : []);
      setFlights(Array.isArray(flightList) ? flightList : []);
      setSuccessMessage("Incident deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete incident.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!incidentForm.flight_id) {
      setSubmitError("Please select a flight.");
      return;
    }

    if (!incidentForm.title || !incidentForm.description || !incidentForm.severity || !incidentForm.status) {
      setSubmitError("Please complete all required incident fields.");
      return;
    }

    if (incidentForm.title.trim().length > 150) {
      setSubmitError("Incident title must be 150 characters or fewer.");
      return;
    }

    const normalizedSeverity = String(incidentForm.severity).trim().toLowerCase();
    const normalizedStatus = String(incidentForm.status).trim().toLowerCase();
    const allowedSeverities = ["low", "medium", "high", "critical"];
    const allowedStatuses = ["open", "investigating", "resolved", "closed"];

    if (!allowedSeverities.includes(normalizedSeverity)) {
      setSubmitError("Severity must be Low, Medium, High, or Critical.");
      return;
    }

    if (!allowedStatuses.includes(normalizedStatus)) {
      setSubmitError("Status must be Open, Investigating, Resolved, or Closed.");
      return;
    }

    const payload = {
      flight_id: Number(incidentForm.flight_id),
      title: incidentForm.title.trim(),
      description: incidentForm.description.trim(),
      severity: normalizedSeverity,
      status: normalizedStatus,
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (editingIncidentId) {
        await updateIncident(editingIncidentId, payload);
      } else {
        await createIncident(payload);
      }

      const [incidentList, flightList] = await Promise.all([
        getIncidents(),
        getFlights(),
      ]);
      setIncidents(Array.isArray(incidentList) ? incidentList : []);
      setFlights(Array.isArray(flightList) ? flightList : []);
      setSuccessMessage(
        editingIncidentId ? "Incident updated successfully." : "Incident created successfully."
      );
      resetModal();
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Unable to save incident.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flight-page">
      <header className="flight-page__header">
        <div>
          <h1 className="flight-page__title">Incidents</h1>
          <p className="flight-page__subtitle">
            Track operational issues, severity, and response status.
          </p>
        </div>

        <div className="flight-page__header-actions">
          <button type="button" className="flight-page__add-button" onClick={handleOpenAddModal}>
            <Plus className="flight-page__add-button-icon" size={18} aria-hidden="true" />
            Add Incident
          </button>
        </div>
      </header>

      {loading && <p className="flight-page__status">Loading incidents...</p>}

      {!loading && error && <p className="flight-page__error">{error}</p>}
      {!loading && successMessage && <p className="flight-page__status">{successMessage}</p>}

      {!loading && !error && (
        <section className="flight-table">
          <div className="flight-table__wrapper">
            {incidents.length === 0 ? (
              <div className="flight-table__empty">
                No incidents reported at this time.
              </div>
            ) : (
              <table className="flight-table__table">
                <thead className="flight-table__head">
                  <tr className="flight-table__row">
                    <th className="flight-table__header-cell">Title</th>
                    <th className="flight-table__header-cell">Flight</th>
                    <th className="flight-table__header-cell">Severity</th>
                    <th className="flight-table__header-cell">Status</th>
                    <th className="flight-table__header-cell">Reported</th>
                    <th className="flight-table__header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="flight-table__body">
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id || `${incident.title}-${incident.reported_at}`}
                      className="flight-table__row"
                    >
                      <td className="flight-table__cell">{incident.title || "Untitled"}</td>
                      <td className="flight-table__cell">
                        {incident.flight_number || incident.flight_id || "N/A"}
                      </td>
                      <td className="flight-table__cell">
                        <span
                          className={`recent-incidents-table__severity ${getSeverityClass(incident.severity)}`}
                        >
                          {incident.severity || "Unknown"}
                        </span>
                      </td>
                      <td className="flight-table__cell">
                        <StatusBadge status={incident.status} />
                      </td>
                      <td className="flight-table__cell">
                        {formatReportedDate(incident.reported_at)}
                      </td>
                      <td className="flight-table__cell flight-table__cell--actions">
                        <div className="flight-table__actions">
                          <button
                            type="button"
                            className="flight-table__action flight-table__action--edit"
                            onClick={() => handleOpenEditModal(incident)}
                            aria-label={`Edit incident ${incident.title || "incident"}`}
                          >
                            <Pencil className="flight-table__action-icon" size={15} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="flight-table__action flight-table__action--delete"
                            onClick={() => handleDeleteIncident(incident)}
                            aria-label={`Delete incident ${incident.title || "incident"}`}
                          >
                            <Trash2 className="flight-table__action-icon" size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {isModalOpen && (
        <div className="flight-page__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="incident-form-title">
          <div className="flight-page__modal">
            <div className="flight-page__modal-header">
              <h2 id="incident-form-title" className="flight-page__modal-title">
                {editingIncidentId ? "Edit Incident" : "Add Incident"}
              </h2>
              <button
                type="button"
                className="flight-page__close-button"
                onClick={resetModal}
                aria-label="Close incident form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {submitError && <p className="flight-page__form-error">{submitError}</p>}

            <form className="flight-page__form" onSubmit={handleSubmit}>
              <label className="flight-page__field">
                <span>Flight</span>
                <select
                  name="flight_id"
                  value={incidentForm.flight_id}
                  onChange={handleInputChange}
                  disabled={Boolean(editingIncidentId)}
                  required
                >
                  <option value="">Select a flight</option>
                  {flights.map((flight) => (
                    <option key={flight.id} value={flight.id}>
                      {flight.flight_number || `Flight ${flight.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flight-page__field">
                <span>Title</span>
                <input
                  type="text"
                  name="title"
                  value={incidentForm.title}
                  onChange={handleInputChange}
                  maxLength={150}
                  placeholder="e.g. Mechanical inspection"
                  required
                />
              </label>

              <label className="flight-page__field flight-page__field--full">
                <span>Description</span>
                <textarea
                  name="description"
                  value={incidentForm.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe the incident"
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Severity</span>
                <select name="severity" value={incidentForm.severity} onChange={handleInputChange} required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>

              <label className="flight-page__field">
                <span>Status</span>
                <select name="status" value={incidentForm.status} onChange={handleInputChange} required>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>

              <div className="flight-page__form-actions flight-page__form-actions--full">
                <button type="button" className="flight-page__secondary-button" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="flight-page__submit-button" disabled={isSubmitting}>
                  <Save className="flight-page__submit-button-icon" size={16} aria-hidden="true" />
                  {isSubmitting ? "Saving..." : editingIncidentId ? "Save Changes" : "Create Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Incidents;