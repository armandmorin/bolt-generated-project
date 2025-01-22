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

function App() {
  const location = useLocation();
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings')) || {
    logo: '',
    primaryColor: '#2563eb'
  };

  // Add /test to public routes
  const publicRoutes = ['/', '/super-admin-login', '/register', '/test'];
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
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />
          
          {/* Catch invalid routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
