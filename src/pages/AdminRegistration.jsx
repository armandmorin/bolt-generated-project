import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import styles from '../styles/registration.module.css';

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

      const [errors, setErrors] = useState({});
      const navigate = useNavigate();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      };

      const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.company.trim()) {
          newErrors.company = 'Company name is required';
        }

        return newErrors;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        try {
          // Here you would typically make an API call to register the admin
          // For now, we'll just store in localStorage
          const admins = JSON.parse(localStorage.getItem('admins') || '[]');
          const newAdmin = {
            ...formData,
            id: Date.now(),
            dateCreated: new Date().toISOString(),
            clients: [],
            status: 'pending' // Requires super admin approval
          };
          
          admins.push(newAdmin);
          localStorage.setItem('admins', JSON.stringify(admins));
          
          // Redirect to success page or login
          navigate('/registration-success');
        } catch (error) {
          setErrors({ submit: 'Registration failed. Please try again.' });
        }
      };

      return (
        <div className={styles.registrationPage}>
          <div className={styles.registrationContainer}>
            <h1>Admin Registration</h1>
            <p className={styles.subtitle}>Create your admin account to get started</p>

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

              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

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
