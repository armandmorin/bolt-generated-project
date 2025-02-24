import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { supabase, checkAndRestoreSession, getCurrentUserRole, logSupabaseError } from './lib/supabase';
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    logSupabaseError('App Error Boundary', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const storedUserRole = await getCurrentUserRole();
        const session = await checkAndRestoreSession();
        
        const authenticated = session !== null && 
          (requiredRoles.length === 0 || 
           (storedUserRole && requiredRoles.includes(storedUserRole)));
        
        setIsAuthenticated(authenticated);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        logSupabaseError('Protected Route Authentication', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [requiredRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
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

  // Debug logging for routes and navigation
  useEffect(() => {
    console.group('App Component Navigation');
    console.log('Current Path:', location.pathname);
    console.log('Public Routes:', publicRoutes);
    console.log('Hide Header:', hideHeader);
    console.groupEnd();
  }, [location]);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Unhandled error:', event.error);
      logSupabaseError('Global Unhandled Error', event.error);
    };

    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {!hideHeader && <Header logo={brandSettings.logo} primaryColor={brandSettings.primaryColor} />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<AdminRegistration />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/test" element={<SupabaseTest />} />
            
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
              path="/client-edit" 
              element={
                <ProtectedRoute requiredRoles={['client', 'admin']}>
                  <ClientEdit />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
