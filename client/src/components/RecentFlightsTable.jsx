import StatusBadge from "./StatusBadge";

function RecentFlightsTable({ flights }) {
  const visibleFlights = Array.isArray(flights) ? flights.slice(0, 5) : [];

  const getStatusVariant = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "delayed") {
      return "negative";
    }

    if (normalized === "cancelled" || normalized === "closed" || normalized === "resolved") {
      return "negative";
    }

    return "positive";
  };

  return (
    <section className="recent-flights-table">
      {visibleFlights.length === 0 ? (
        <div className="recent-flights-table__empty">
          No recent flights are available at the moment.
        </div>
      ) : (
        <div className="recent-flights-table__wrapper">
          <table className="recent-flights-table__table">
            <thead className="recent-flights-table__head">
              <tr className="recent-flights-table__row">
                <th className="recent-flights-table__header-cell">Flight</th>
                <th className="recent-flights-table__header-cell">Airline</th>
                <th className="recent-flights-table__header-cell">Destination</th>
                <th className="recent-flights-table__header-cell">Gate</th>
                <th className="recent-flights-table__header-cell">Status</th>
              </tr>
            </thead>
            <tbody className="recent-flights-table__body">
              {visibleFlights.map((flight) => (
                <tr key={flight.id || `${flight.flight_number}-${flight.destination}`}
                  className="recent-flights-table__row"
                >
                  <td className="recent-flights-table__cell">{flight.flight_number}</td>
                  <td className="recent-flights-table__cell">{flight.airline}</td>
                  <td className="recent-flights-table__cell">{flight.destination}</td>
                  <td className="recent-flights-table__cell">{flight.gate_id || flight.gate || "TBD"}</td>
                  <td className="recent-flights-table__cell">
                    <StatusBadge
                      label={flight.status || "Unknown"}
                      variant={getStatusVariant(flight.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentFlightsTable;
