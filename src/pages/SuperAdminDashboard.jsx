// Add this near the top of your component, after the state declarations:

  useEffect(() => {
    // Clear any cached data
    clearCaches();
    // Load fresh data
    loadAdmins();
    loadBrandingSettings();
  }, []);

  const clearCaches = () => {
    // Clear localStorage items
    localStorage.removeItem('admins');
    localStorage.removeItem('globalBranding');
    localStorage.removeItem('brandSettings');
    
    // Clear sessionStorage if you're using it
    sessionStorage.clear();
    
    // Clear Supabase cache by forcing a new session
    supabase.auth.refreshSession();
  };
