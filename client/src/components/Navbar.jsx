import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Settings,
  CircleUser,
  Clock3,
  AlertTriangle,
  Mail,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getFlights } from "../services/flightService";
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

function Navbar({ title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settings, setSettings] = useState(readSettings);
  const [notifications, setNotifications] = useState({
    delayedFlights: [],
    activeIncidents: [],
    loading: true,
    error: ""
  });

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setNotifications((previous) => ({
          ...previous,
          loading: true,
          error: ""
        }));

        const [flightResponse, incidentResponse] = await Promise.all([
          getFlights(),
          getIncidents()
        ]);

        if (!isMounted) {
          return;
        }

        const flightList = Array.isArray(flightResponse) ? flightResponse : [];
        const incidentList = Array.isArray(incidentResponse) ? incidentResponse : [];

        setNotifications({
          delayedFlights: flightList
            .filter((flight) => String(flight.status || "").toLowerCase() === "delayed")
            .slice(0, 4),
          activeIncidents: incidentList
            .filter(
              (incident) =>
                !["resolved", "closed"].includes(
                  String(incident.status || "").toLowerCase()
                )
            )
            .slice(0, 4),
          loading: false,
          error: ""
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setNotifications({
          delayedFlights: [],
          activeIncidents: [],
          loading: false,
          error: "Unable to load alerts right now."
        });
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }

      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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

  const totalNotificationCount =
    notifications.delayedFlights.length + notifications.activeIncidents.length;

  const updateSetting = (key, value) => {
    const nextSettings = {
      ...settings,
      [key]: value
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
    setSettings(nextSettings);
    window.dispatchEvent(new Event("aocs-settings-change"));
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__content">
        <div className="navbar__title-group">
          <h1 className="navbar__title">{title}</h1>
        </div>

        <div className="navbar__actions">
          <div className="navbar__dropdown-wrapper" ref={notificationsRef}>
            <button
              type="button"
              className="navbar__icon-button"
              aria-label="View notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
            >
              <Bell className="navbar__icon" aria-hidden="true" />
              {totalNotificationCount > 0 && (
                <span className="navbar__badge">{totalNotificationCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="navbar__panel navbar__panel--notifications">
                <div className="navbar__panel-header">
                  <h2>Operational alerts</h2>
                </div>

                {notifications.loading ? (
                  <p className="navbar__panel-state">Loading notifications...</p>
                ) : notifications.error ? (
                  <p className="navbar__panel-state navbar__panel-state--error">
                    {notifications.error}
                  </p>
                ) : totalNotificationCount === 0 ? (
                  <p className="navbar__panel-empty">No active notifications at the moment.</p>
                ) : (
                  <div className="navbar__notification-list">
                    {notifications.delayedFlights.length > 0 && (
                      <div className="navbar__notification-group">
                        <div className="navbar__notification-label">
                          <Clock3 size={14} />
                          <span>Delayed flights</span>
                        </div>
                        <ul className="navbar__notification-items">
                          {notifications.delayedFlights.map((flight) => (
                            <li key={flight.id || flight.flight_number} className="navbar__notification-item">
                              <span className="navbar__notification-title">
                                {flight.flight_number || "Flight"}
                              </span>
                              <span className="navbar__notification-meta">
                                {flight.destination || "Unknown destination"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {notifications.activeIncidents.length > 0 && (
                      <div className="navbar__notification-group">
                        <div className="navbar__notification-label">
                          <AlertTriangle size={14} />
                          <span>Active incidents</span>
                        </div>
                        <ul className="navbar__notification-items">
                          {notifications.activeIncidents.map((incident) => (
                            <li key={incident.id || incident.title} className="navbar__notification-item">
                              <span className="navbar__notification-title">
                                {incident.title || "Incident"}
                              </span>
                              <span className="navbar__notification-meta">
                                {incident.severity || "Unknown severity"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="navbar__dropdown-wrapper" ref={settingsRef}>
            <button
              type="button"
              className="navbar__icon-button"
              aria-label="Open settings"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((open) => !open)}
            >
              <Settings className="navbar__icon" aria-hidden="true" />
            </button>

            {settingsOpen && (
              <div className="navbar__panel navbar__panel--settings">
                <div className="navbar__panel-header">
                  <h2>Display settings</h2>
                </div>

                <div className="navbar__setting-row">
                  <div>
                    <p className="navbar__setting-title">Compact dashboard</p>
                    <p className="navbar__setting-description">Use tighter spacing on the dashboard.</p>
                  </div>

                  <button
                    type="button"
                    className={`navbar__switch ${settings.compactDashboard ? "navbar__switch--active" : ""}`}
                    aria-label="Toggle compact dashboard view"
                    onClick={() => updateSetting("compactDashboard", !settings.compactDashboard)}
                  >
                    <span className="navbar__switch-knob" />
                  </button>
                </div>

                <div className="navbar__setting-row">
                  <div>
                    <p className="navbar__setting-title">Recent incidents</p>
                    <p className="navbar__setting-description">Show recent incidents on the dashboard.</p>
                  </div>

                  <button
                    type="button"
                    className={`navbar__switch ${settings.showRecentIncidents ? "navbar__switch--active" : ""}`}
                    aria-label="Toggle recent incidents visibility"
                    onClick={() => updateSetting("showRecentIncidents", !settings.showRecentIncidents)}
                  >
                    <span className="navbar__switch-knob" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="navbar__dropdown-wrapper" ref={profileRef}>
            <button
              type="button"
              className="navbar__profile"
              aria-label="Open user profile"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <CircleUser className="navbar__profile-icon" aria-hidden="true" />
              <span className="navbar__profile-name">{user?.full_name || "Guest"}</span>
            </button>

            {profileOpen && (
              <div className="navbar__panel navbar__panel--profile">
                <div className="navbar__panel-header">
                  <h2>Profile</h2>
                </div>

                <div className="navbar__profile-details">
                  <div className="navbar__profile-detail">
                    <span className="navbar__profile-detail-label">Full name</span>
                    <span>{user?.full_name || "Guest"}</span>
                  </div>

                  {user?.email && (
                    <div className="navbar__profile-detail">
                      <span className="navbar__profile-detail-label">
                        <Mail size={12} />
                        Email
                      </span>
                      <span>{user.email}</span>
                    </div>
                  )}

                  {user?.role && (
                    <div className="navbar__profile-detail">
                      <span className="navbar__profile-detail-label">
                        <ShieldCheck size={12} />
                        Role
                      </span>
                      <span>{user.role}</span>
                    </div>
                  )}
                </div>

                <button type="button" className="navbar__profile-logout" onClick={handleLogout}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
