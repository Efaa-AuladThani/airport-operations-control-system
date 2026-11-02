import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatScheduledTime(value) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function FlightTable({ flights = [], gates = [], onEdit, onDelete }) {
  const gateMap = new Map(
    gates.map((gate) => [gate.id, gate.gate_number || gate.gate || "TBD"])
  );

  const visibleFlights = Array.isArray(flights) ? flights : [];

  return (
    <section className="flight-table">
      <div className="flight-table__wrapper">
        {visibleFlights.length === 0 ? (
          <div className="flight-table__empty">
            No flights are scheduled at the moment.
          </div>
        ) : (
          <table className="flight-table__table">
            <thead className="flight-table__head">
              <tr className="flight-table__row">
                <th className="flight-table__header-cell">Flight</th>
                <th className="flight-table__header-cell">Airline</th>
                <th className="flight-table__header-cell">Origin</th>
                <th className="flight-table__header-cell">Destination</th>
                <th className="flight-table__header-cell">Scheduled Time</th>
                <th className="flight-table__header-cell">Gate</th>
                <th className="flight-table__header-cell">Status</th>
                <th className="flight-table__header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="flight-table__body">
              {visibleFlights.map((flight) => (
                <tr
                  key={flight.id || `${flight.flight_number}-${flight.origin}-${flight.destination}`}
                  className="flight-table__row"
                >
                  <td className="flight-table__cell">{flight.flight_number || "N/A"}</td>
                  <td className="flight-table__cell">{flight.airline || "Unknown"}</td>
                  <td className="flight-table__cell">{flight.origin || "TBD"}</td>
                  <td className="flight-table__cell">{flight.destination || "TBD"}</td>
                  <td className="flight-table__cell">
                    {formatScheduledTime(flight.scheduled_time)}
                  </td>
                  <td className="flight-table__cell">
                    {gateMap.get(flight.gate_id) || flight.gate_number || flight.gate || "TBD"}
                  </td>
                  <td className="flight-table__cell">
                    <StatusBadge status={flight.status} />
                  </td>
                  <td className="flight-table__cell flight-table__cell--actions">
                    <div className="flight-table__actions">
                      <button
                        type="button"
                        className="flight-table__action flight-table__action--edit"
                        onClick={() => onEdit?.(flight)}
                        aria-label={`Edit flight ${flight.flight_number || "flight"}`}
                      >
                        <Pencil className="flight-table__action-icon" size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="flight-table__action flight-table__action--delete"
                        onClick={() => onDelete?.(flight)}
                        aria-label={`Delete flight ${flight.flight_number || "flight"}`}
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
  );
}

export default FlightTable;
