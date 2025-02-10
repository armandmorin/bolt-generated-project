
// ... previous imports remain the same

const AdminDashboard = () => {
  // ... previous state declarations remain the same

  const loadBrandSettings = async () => {
    try {
      const { data, error } = await executeWithRetry(() => 
        supabase
          .from('brand_settings')
          .select('*')
          .eq('admin_id', user.id)
          .single()
      );

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setBrandSettings(data);
        applyBrandSettings(data);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
      alert('Failed to load brand settings. Please try refreshing the page.');
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: existingSettings } = await executeWithRetry(() =>
        supabase
          .from('brand_settings')
          .select('id')
          .eq('admin_id', user.id)
          .single()
      );

      let error;
      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await executeWithRetry(() =>
          supabase
            .from('brand_settings')
            .update({
              ...brandSettings,
              updated_at: new Date().toISOString()
            })
            .eq('admin_id', user.id)
        );
        error = updateError;
      } else {
        // Insert new settings
        const { error