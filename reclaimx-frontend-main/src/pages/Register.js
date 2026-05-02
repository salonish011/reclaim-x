import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', phone: ''
  });
  const [picture,  setPicture]  = useState(null);
  const [errors,   setErrors]   = useState({});  // stores error for each field
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the error for this field as soon as user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ---- VALIDATION FUNCTION ----
  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Run validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop here — don't call backend
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email',    form.email);
    formData.append('password', form.password);
    formData.append('phone',    form.phone);
    if (picture) formData.append('profile_picture', picture);

    try {
      await registerUser(formData);
      alert('Account created successfully! Please login.');
      navigate('/login');
   } catch (err) {
    if (err.response?.data) {
    const data = err.response.data;
    if (data.username) {
      setApiError('Username already taken. Please choose another.');
    } else if (data.email) {
      setApiError('An account with this email already exists.');
    } else {
      setApiError(JSON.stringify(data));
    }
  } else {
    setApiError('Cannot connect to server. Is your Django backend running?');
  }
}
     finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ReclaimX</h2>
        <p style={styles.subtitle}>Create your account</p>

        {apiError && <div style={styles.apiError}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Username */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username *</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.username ? '#e53935' : '#ddd'
              }}
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
            {/* Error message under the field */}
            {errors.username && (
              <span style={styles.fieldError}>⚠ {errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email *</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.email ? '#e53935' : '#ddd'
              }}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.email && (
              <span style={styles.fieldError}>⚠ {errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password *</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.password ? '#e53935' : '#ddd'
              }}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <span style={styles.fieldError}>⚠ {errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.confirmPassword ? '#e53935' : '#ddd'
              }}
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && (
              <span style={styles.fieldError}>⚠ {errors.confirmPassword}</span>
            )}
          </div>

          {/* Phone */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone (optional)</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.phone ? '#e53935' : '#ddd'
              }}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
            />
            {errors.phone && (
              <span style={styles.fieldError}>⚠ {errors.phone}</span>
            )}
          </div>

          {/* Profile picture */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Profile Picture (optional)</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p style={styles.linkText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '100vh', background: '#f0f2f5'
  },
  card: {
    background: 'white', padding: '40px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px'
  },
  title:    { textAlign: 'center', color: '#1a73e8', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' },
  apiError: {
    background: '#ffebee', color: '#c62828', padding: '12px',
    borderRadius: '8px', marginBottom: '16px',
    fontSize: '14px', textAlign: 'center'
  },
  form:       { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' },
  label:      { fontWeight: '600', fontSize: '13px', color: '#333' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1.5px solid #ddd', fontSize: '14px',
    outline: 'none', transition: 'border-color 0.2s',
  },
  fieldError: { color: '#e53935', fontSize: '12px', marginTop: '2px' },
  button: {
    padding: '12px', background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px',
    cursor: 'pointer', marginTop: '4px', fontWeight: '600'
  },
  linkText: { textAlign: 'center', marginTop: '16px', fontSize: '14px' }
};

export default Register;