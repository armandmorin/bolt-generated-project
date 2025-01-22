import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import SupabaseTest from './components/SupabaseTest';
import './styles/global.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/register', '/super-admin-login', '/test'];
  
  // If it's a public route, render normally
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  // If not authenticated and not on a public route, redirect to login
  if (!userRole) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If authenticated, render the protected route
  return children;
};

function App() {
  const location = useLocation();
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings')) || {
    logo: '',
    primaryColor: '#2563eb'
  };

  const publicRoutes = ['/', '/register', '/super-admin-login', '/test'];
  const hideHeader = publicRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {!hideHeader && <Header logo={brandSettings.logo} primaryColor={brandSettings.primaryColor} />}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<AdminRegistration />} />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/test" element={<SupabaseTest />} />
          
          {/* Protected Routes */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Catch invalid routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
