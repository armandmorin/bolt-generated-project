// In the handleClientUpdate function, update the client update code:

const handleClientUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Update client details
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        name: client.name,
        website: client.website,
        contact_email: client.contact_email // Changed from contactEmail to contact_email
      })
      .eq('id', clientId);

    if (clientError) throw clientError;

    // Rest of the function remains the same...
  } catch (error) {
    console.error('Error saving changes:', error);
    alert('Error saving changes: ' + error.message);
  } finally {
    setSaving(false);
  }
};
