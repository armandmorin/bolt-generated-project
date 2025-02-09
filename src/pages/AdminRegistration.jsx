import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import styles from '../styles/modules/registration.module.css';

    const AdminRegistration = () => {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: '',
        website: ''
      });
      const brandSettings = JSON.parse(localStorage.getItem('brandSettings') || '{}');

      const [errors, setErrors] = useState({});

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        if (errors[name]) {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        // Add registration logic here
      };

      return (
        <div className={styles.registrationPage}>
          <div className={styles.registrationContainer}>
            {brandSettings.logo ? (
              <div className={styles.logoContainer}>
                <img src={brandSettings.logo} alt="Company Logo" className={styles.logo} />
              </div>
            ) : (
              <h1>Admin Registration</h1>
            )}

            <form onSubmit={handleSubmit} className={styles.registrationForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    required
                  />
                  {errors.company && <span className={styles.error}>{errors.company}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Enter your company website"
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                Register Account
              </button>

              <div className={styles.loginLink}>
                Already have an account? <Link to="/">Login here</Link>
              </div>
            </form>
          </div>
        </div>
      );
    };

    export default AdminRegistration;
