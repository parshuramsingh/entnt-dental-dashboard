import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Patients from './pages/Patients';
import Incidents from './pages/Incidents';
import Calendar from './pages/Calendar';
import MyProfile from './pages/MyProfile';
import TreatmentHistory from './pages/TreatmentHistory';

import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Toast Notifications */}
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Shared (Admin + Patient) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRole="admin">
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute allowedRole="admin">
              <Incidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRole="admin">
              <Calendar />
            </ProtectedRoute>
          }
        />

        {/* Patient-only */}
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRole="patient">
              <TreatmentHistory />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route
          path="*"
          element={<Navigate to={user ? '/dashboard' : '/'} replace />}
        />
      </Routes>
    </div>
  );
}
