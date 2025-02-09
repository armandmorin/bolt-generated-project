import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/profile.module.css';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', userData.email)
          .single();

        if (error) throw error;

        setProfile(prev => ({
          ...prev,
          email: data.email
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          password: profile.newPassword // Note: In a real app, you'd hash this password
        })
        .eq('email', profile.email);

      if (error) throw error;

      alert('Profile updated successfully!');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.profileSettings}>
      <h2>Profile Settings</h2>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label>Current Password</label>
          <input
            type="password"
            value={profile.currentPassword}
            onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={profile.newPassword}
            onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
            minLength={8}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={profile.confirmPassword}
            onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
            minLength={8}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
