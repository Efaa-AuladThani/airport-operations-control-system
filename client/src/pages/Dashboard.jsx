import { useEffect, useState } from "react";
import { Plane, LayoutGrid, AlertTriangle, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import RecentFlightsTable from "../components/RecentFlightsTable";
import RecentIncidentsTable from "../components/RecentIncidentsTable";
import { getFlights } from "../services/flightService";
import { getGates } from "../services/gateService";
import { getIncidents } from "../services/incidentService";

const SETTINGS_STORAGE_KEY = "aocs-dashboard-settings";
const DEFAULT_SETTINGS = {
  compactDashboard: false,
  showRecentIncidents: true
};

const readSettings = () => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(storedSettings)
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

function Dashboard() {
  const [stats, setStats] = useState({
    flightsToday: 0,
    availableGates: 0,
    activeIncidents: 0,
    delayedFlights: 0
  });
  const [flights, setFlights] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [flights, gates, incidents] = await Promise.all([
          getFlights(),
          getGates(),
          getIncidents()
        ]);

        if (!isMounted) {
          return;
        }

        const flightList = Array.isArray(flights) ? flights : [];
        const gateList = Array.isArray(gates) ? gates : [];
        const incidentList = Array.isArray(incidents) ? incidents : [];

        setFlights(flightList);
        setIncidents(incidentList);
        setStats({
          flightsToday: flightList.length,
          availableGates: gateList.filter((gate) => String(gate.status).toLowerCase() === "available").length,
          activeIncidents: incidentList.filter(
            (incident) => !["resolved", "closed"].includes(String(incident.status).toLowerCase())
          ).length,
          delayedFlights: flightList.filter((flight) => String(flight.status).toLowerCase() === "delayed").length
        });
      } catch (err) {
        if (isMounted) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(readSettings());
    };

    window.addEventListener("aocs-settings-change", handleSettingsChange);

    return () => {
      window.removeEventListener("aocs-settings-change", handleSettingsChange);
    };
  }, []);

  return (
    <section className={`dashboard-page ${settings.compactDashboard ? "dashboard-page--compact" : ""}`}>
      <header className="dashboard-page__header">
        <h1 className="dashboard-page__title">Airport Operations Dashboard</h1>
        <p className="dashboard-page__subtitle">
          Monitor today&apos;s airport operations in real time.
        </p>
      </header>

      {loading && <p className="dashboard-page__status">Loading dashboard data...</p>}

      {!loading && error && <p className="dashboard-page__error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-page__grid">
            <StatCard
              title="Flights Today"
              value={String(stats.flightsToday)}
              icon={<Plane />}
              trend="Live flight count"
              trendType="positive"
            />

            <StatCard
              title="Available Gates"
              value={String(stats.availableGates)}
              icon={<LayoutGrid />}
              trend="Open gate capacity"
              trendType="positive"
            />

            <StatCard
              title="Active Incidents"
              value={String(stats.activeIncidents)}
              icon={<AlertTriangle />}
              trend="Open operational issues"
              trendType="positive"
            />

            <StatCard
              title="Delayed Flights"
              value={String(stats.delayedFlights)}
              icon={<Clock />}
              trend="Current delays"
              trendType="negative"
            />
          </div>

          <section className="dashboard-page__recent">
            <header className="dashboard-page__section-header">
              <h2 className="dashboard-page__section-title">Recent Flights</h2>
            </header>
            <RecentFlightsTable flights={flights} />
          </section>

          {settings.showRecentIncidents && (
            <section className="dashboard-page__recent">
              <header className="dashboard-page__section-header">
                <h2 className="dashboard-page__section-title">Recent Incidents</h2>
              </header>
              <RecentIncidentsTable incidents={incidents} />
            </section>
          )}
        </>
      )}
    </section>
  );
}

export default Dashboard;