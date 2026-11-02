import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plane, Home, PlaneTakeoff, LayoutGrid, AlertTriangle, LogOut, Menu } from "lucide-react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <Plane className="sidebar__brand-icon" aria-hidden="true" />
          <span className="sidebar__brand-text">AOCS</span>
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
        <button type="button" className="sidebar__logout">
          <LogOut className="sidebar__logout-icon" aria-hidden="true" />
          <span className="sidebar__logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
