import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protect routes so only authenticated users can access the wrapped content.
function ProtectedRoute({ children }) {
  // Read authentication state from the shared auth context.
  const { isAuthenticated } = useAuth();

  // Redirect unauthenticated users to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected page content for authenticated users.
  return children;
}

export default ProtectedRoute;
