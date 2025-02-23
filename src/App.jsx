import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { supabase, checkAndRestoreSession } from './lib/supabase';
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

// Protected Route component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, check localStorage for user info
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        // Then, verify with Supabase
        const session = await checkAndRestoreSession();
        
        // If session exists, fetch user role
        if (session || parsedUser) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('email', session?.user?.email || parsedUser?.email)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            setIsAuthenticated(false);
          } else {
            setUserRole(userData?.role);
            // Check if user's role matches required roles
            setIsAuthenticated(
              requiredRoles.length === 0 || 
              requiredRoles.includes(userData?.role)
            );
          }
        } else {
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated 
    ? children 
    : <Navigate to="/" replace />;
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
              <ProtectedRoute requiredRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client" 
            element={
              <ProtectedRoute requiredRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client/edit" 
            element={
              <ProtectedRoute requiredRoles={['client', 'admin']}>
                <ClientEdit />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
