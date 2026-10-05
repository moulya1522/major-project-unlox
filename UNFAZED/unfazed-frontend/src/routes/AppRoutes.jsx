import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/therapist/Dashboard";
import Clients from "../pages/therapist/Clients";
import ClientDetails from "../pages/therapist/ClientDetails";
import Schedule from "../pages/therapist/Schedule";
import Sessions from "../pages/therapist/Sessions";
import Notes from "../pages/therapist/Notes";
import Payments from "../pages/therapist/Payments";
import Packages from "../pages/therapist/Packages";
import Analytics from "../pages/therapist/Analytics";
import Messages from "../pages/therapist/Messages";
import ChangePassword from "../pages/therapist/ChangePassword";

import ClientLogin from "../pages/client/ClientLogin";
import ClientPortal from "../pages/client/ClientPortal";
import ClientBooking from "../pages/client/ClientBooking";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { therapist, loading } = useAuth();

  if (loading) {
    return <div>Loading Unfazed...</div>;
  }

  if (!therapist) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { therapist, loading } = useAuth();

  if (loading) {
    return <div>Loading Unfazed...</div>;
  }

  if (therapist) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/packages"
        element={
          <ProtectedRoute>
            <Packages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/client-login" element={<ClientLogin />} />

      <Route path="/client-portal" element={<ClientPortal />} />

      <Route path="/client-booking" element={<ClientBooking />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;