import { Bell, Settings, CircleUser } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__content">
        <div className="navbar__title-group">
          <h1 className="navbar__title">{title}</h1>
        </div>

        <div className="navbar__actions">
          <button type="button" className="navbar__icon-button" aria-label="View notifications">
            <Bell className="navbar__icon" aria-hidden="true" />
          </button>

          <button type="button" className="navbar__icon-button" aria-label="Open settings">
            <Settings className="navbar__icon" aria-hidden="true" />
          </button>

          <div className="navbar__profile">
            <CircleUser className="navbar__profile-icon" aria-hidden="true" />
            <span className="navbar__profile-name">{user?.full_name || "Guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
