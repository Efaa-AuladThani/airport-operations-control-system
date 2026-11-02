import { useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import {
  createGate,
  deleteGate,
  getGates,
  updateGate,
} from "../services/gateService";

const emptyGateForm = {
  gate_number: "",
  terminal: "",
  status: "available",
};

function Gates() {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateId, setEditingGateId] = useState(null);
  const [gateForm, setGateForm] = useState(emptyGateForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadGates() {
      try {
        setLoading(true);
        setError("");

        const gateList = await getGates();

        if (!isMounted) {
          return;
        }

        setGates(Array.isArray(gateList) ? gateList : []);
      } catch (err) {
        if (isMounted) {
          setError("Unable to load gates.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGates();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetModal = () => {
    setIsModalOpen(false);
    setEditingGateId(null);
    setGateForm(emptyGateForm);
    setSubmitError("");
  };

  const handleOpenAddModal = () => {
    setEditingGateId(null);
    setGateForm(emptyGateForm);
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (gate) => {
    setEditingGateId(gate.id);
    setGateForm({
      gate_number: gate.gate_number || "",
      terminal: gate.terminal || "",
      status: gate.status || "available",
    });
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGateForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleDeleteGate = async (gate) => {
    const confirmed = window.confirm(
      `Delete gate ${gate.gate_number || "this gate"}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGate(gate.id);
      const gateList = await getGates();
      setGates(Array.isArray(gateList) ? gateList : []);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete gate.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!gateForm.gate_number || !gateForm.terminal || !gateForm.status) {
      setSubmitError("Please complete all required gate fields.");
      return;
    }

    const normalizedStatus = String(gateForm.status).trim().toLowerCase();
    const allowedStatuses = ["available", "occupied", "maintenance"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      setSubmitError("Status must be Available, Occupied, or Maintenance.");
      return;
    }

    const payload = {
      gate_number: gateForm.gate_number.trim(),
      terminal: gateForm.terminal.trim(),
      status: normalizedStatus,
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (editingGateId) {
        await updateGate(editingGateId, payload);
      } else {
        await createGate(payload);
      }

      const gateList = await getGates();
      setGates(Array.isArray(gateList) ? gateList : []);
      resetModal();
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Unable to save gate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flight-page">
      <header className="flight-page__header">
        <div>
          <h1 className="flight-page__title">Gates</h1>
          <p className="flight-page__subtitle">
            Monitor gate availability and terminal assignment.
          </p>
        </div>

        <div className="flight-page__header-actions">
          <button type="button" className="flight-page__add-button" onClick={handleOpenAddModal}>
            <Plus className="flight-page__add-button-icon" size={18} aria-hidden="true" />
            Add Gate
          </button>
        </div>
      </header>

      {loading && <p className="flight-page__status">Loading gates...</p>}

      {!loading && error && <p className="flight-page__error">{error}</p>}

      {!loading && !error && (
        <section className="flight-table">
          <div className="flight-table__wrapper">
            {gates.length === 0 ? (
              <div className="flight-table__empty">
                No gates are available at the moment.
              </div>
            ) : (
              <table className="flight-table__table">
                <thead className="flight-table__head">
                  <tr className="flight-table__row">
                    <th className="flight-table__header-cell">Gate</th>
                    <th className="flight-table__header-cell">Terminal</th>
                    <th className="flight-table__header-cell">Status</th>
                    <th className="flight-table__header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="flight-table__body">
                  {gates.map((gate) => (
                    <tr
                      key={gate.id || gate.gate_number}
                      className="flight-table__row"
                    >
                      <td className="flight-table__cell">{gate.gate_number || "N/A"}</td>
                      <td className="flight-table__cell">{gate.terminal || "Unknown"}</td>
                      <td className="flight-table__cell">
                        <StatusBadge status={gate.status} />
                      </td>
                      <td className="flight-table__cell flight-table__cell--actions">
                        <div className="flight-table__actions">
                          <button
                            type="button"
                            className="flight-table__action flight-table__action--edit"
                            onClick={() => handleOpenEditModal(gate)}
                            aria-label={`Edit gate ${gate.gate_number || "gate"}`}
                          >
                            <Pencil className="flight-table__action-icon" size={15} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="flight-table__action flight-table__action--delete"
                            onClick={() => handleDeleteGate(gate)}
                            aria-label={`Delete gate ${gate.gate_number || "gate"}`}
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
        <div className="flight-page__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="gate-form-title">
          <div className="flight-page__modal">
            <div className="flight-page__modal-header">
              <h2 id="gate-form-title" className="flight-page__modal-title">
                {editingGateId ? "Edit Gate" : "Add Gate"}
              </h2>
              <button
                type="button"
                className="flight-page__close-button"
                onClick={resetModal}
                aria-label="Close gate form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {submitError && <p className="flight-page__form-error">{submitError}</p>}

            <form className="flight-page__form" onSubmit={handleSubmit}>
              <label className="flight-page__field">
                <span>Gate Number</span>
                <input
                  type="text"
                  name="gate_number"
                  value={gateForm.gate_number}
                  onChange={handleInputChange}
                  placeholder="e.g. A12"
                  required
                />
              </label>

              <label className="flight-page__field">
                <span>Terminal</span>
                <input
                  type="text"
                  name="terminal"
                  value={gateForm.terminal}
                  onChange={handleInputChange}
                  placeholder="e.g. Terminal 1"
                  required
                />
              </label>

              <label className="flight-page__field flight-page__field--full">
                <span>Status</span>
                <select name="status" value={gateForm.status} onChange={handleInputChange} required>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>

              <div className="flight-page__form-actions flight-page__form-actions--full">
                <button type="button" className="flight-page__secondary-button" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="flight-page__submit-button" disabled={isSubmitting}>
                  <Save className="flight-page__submit-button-icon" size={16} aria-hidden="true" />
                  {isSubmitting ? "Saving..." : editingGateId ? "Save Changes" : "Create Gate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gates;
