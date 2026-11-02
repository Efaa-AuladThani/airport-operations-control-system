import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import Gates from "./pages/Gates";
import Incidents from "./pages/Incidents";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="/login" element={<Login />} />

      {/* Protected dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected flights route */}
      <Route
        path="/flights"
        element={
          <ProtectedRoute>
            <Layout title="Flights">
              <Flights />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected gates route */}
      <Route
        path="/gates"
        element={
          <ProtectedRoute>
            <Layout title="Gates">
              <Gates />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected incidents route */}
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <Layout title="Incidents">
              <Incidents />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect the root path to the dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Redirect unknown routes to the dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;