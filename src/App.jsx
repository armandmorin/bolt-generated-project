import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrandProvider } from './contexts/BrandContext';
import Header from './components/Header';
import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientEdit from './pages/ClientEdit';
import SupabaseTest from './components/SupabaseTest';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const publicRoutes = ['/', '/register', '/super-admin-login', '/test'];
  const hideHeader = publicRoutes.includes(location.pathname);

  return (
    <BrandProvider>
      <div className="app-container">
        {!hideHeader && <Header />}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/test" element={<SupabaseTest />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<AdminRegistration />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />

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
            <Route
              path="/client-edit/:clientId"
              element={
                <ProtectedRoute>
                  <ClientEdit />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrandProvider>
  );
}

export default App;
