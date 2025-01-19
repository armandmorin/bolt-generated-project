import React, { useState } from 'react';
    import styles from '../styles/modules/profile.module.css';

    const ProfileSettings = () => {
      const [profile, setProfile] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return {
          email: user.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (profile.newPassword !== profile.confirmPassword) {
          alert('New passwords do not match!');
          return;
        }
        // Here you would typically make an API call to update the profile
        localStorage.setItem('user', JSON.stringify({ ...profile, password: profile.newPassword }));
        alert('Profile updated successfully!');
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      };

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
