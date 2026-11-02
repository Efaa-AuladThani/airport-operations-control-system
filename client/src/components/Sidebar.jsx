import { NavLink, useNavigate } from "react-router-dom";
import { Home, PlaneTakeoff, LayoutGrid, AlertTriangle, LogOut, Menu } from "lucide-react";
import aocsIcon from "../assets/ aocs-icon.png";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isCollapsed, onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand" aria-label="AOCS branding">
          <img
            src={aocsIcon}
            alt="AOCS icon"
            className={`sidebar__brand-image ${isCollapsed ? "sidebar__brand-image--icon" : ""}`}
          />
        </div>

        <button
          type="button"
          className="sidebar__toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="sidebar__toggle-icon" aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <Home className="sidebar__link-icon" aria-hidden="true" />
              <span className="sidebar__link-text">Dashboard</span>
            </NavLink>
          </li>

          <li className="sidebar__item">
            <NavLink
              to="/flights"
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <PlaneTakeoff className="sidebar__link-icon" aria-hidden="true" />
              <span className="sidebar__link-text">Flights</span>
            </NavLink>
          </li>

          <li className="sidebar__item">
            <NavLink
              to="/gates"
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <LayoutGrid className="sidebar__link-icon" aria-hidden="true" />
              <span className="sidebar__link-text">Gates</span>
            </NavLink>
          </li>

          <li className="sidebar__item">
            <NavLink
              to="/incidents"
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <AlertTriangle className="sidebar__link-icon" aria-hidden="true" />
              <span className="sidebar__link-text">Incidents</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          <LogOut className="sidebar__logout-icon" aria-hidden="true" />
          <span className="sidebar__logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
