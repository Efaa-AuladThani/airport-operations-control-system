import StatusBadge from "./StatusBadge";

function RecentIncidentsTable({ incidents }) {
  const visibleIncidents = Array.isArray(incidents) ? incidents.slice(0, 5) : [];

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

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <section className="recent-incidents-table">
      <header className="recent-incidents-table__header">
        <h2 className="recent-incidents-table__title">Recent Incidents</h2>
      </header>

      {visibleIncidents.length === 0 ? (
        <div className="recent-incidents-table__empty">
          No recent incidents are on record at this time.
        </div>
      ) : (
        <div className="recent-incidents-table__wrapper">
          <table className="recent-incidents-table__table">
            <thead className="recent-incidents-table__head">
              <tr className="recent-incidents-table__row">
                <th className="recent-incidents-table__header-cell">Title</th>
                <th className="recent-incidents-table__header-cell">Severity</th>
                <th className="recent-incidents-table__header-cell">Status</th>
                <th className="recent-incidents-table__header-cell">Flight</th>
                <th className="recent-incidents-table__header-cell">Reported</th>
              </tr>
            </thead>
            <tbody className="recent-incidents-table__body">
              {visibleIncidents.map((incident) => (
                <tr
                  key={incident.id || `${incident.title}-${incident.reported_at}`}
                  className="recent-incidents-table__row"
                >
                  <td className="recent-incidents-table__cell">{incident.title}</td>
                  <td className="recent-incidents-table__cell">
                    <span className={`recent-incidents-table__severity ${getSeverityClass(incident.severity)}`}>
                      {incident.severity || "Unknown"}
                    </span>
                  </td>
                  <td className="recent-incidents-table__cell">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="recent-incidents-table__cell">{incident.flight_id || "N/A"}</td>
                  <td className="recent-incidents-table__cell">{formatDate(incident.reported_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentIncidentsTable;
