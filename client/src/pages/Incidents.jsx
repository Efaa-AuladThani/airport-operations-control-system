import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { getIncidents } from "../services/incidentService";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      try {
        setLoading(true);
        setError("");

        const incidentList = await getIncidents();

        if (!isMounted) {
          return;
        }

        setIncidents(Array.isArray(incidentList) ? incidentList : []);
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
      minute: "2-digit"
    });
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
      </header>

      {loading && <p className="flight-page__status">Loading incidents...</p>}

      {!loading && error && <p className="flight-page__error">{error}</p>}

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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </section>
  );
}

export default Incidents;