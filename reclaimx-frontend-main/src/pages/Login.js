import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password)        newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
const data = await loginUser(username, password);
const userData = { username: username };
login(userData, data.access);
      navigate('/dashboard');
    } catch (err) {
      setApiError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🔍</span>
          <h2 style={styles.title}>ReclaimX</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {apiError && <div style={styles.apiError}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.username ? '#e53935' : '#ddd'
              }}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: '' });
              }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span style={styles.fieldError}>⚠ {errors.username}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.password ? '#e53935' : '#ddd'
              }}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={styles.fieldError}>⚠ {errors.password}</span>
            )}
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p style={styles.linkText}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh', background: '#f0f2f5'
  },
  card: {
    background: 'white', padding: '40px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px'
  },
  logoArea:  { textAlign: 'center', marginBottom: '24px' },
  logoIcon:  { fontSize: '40px' },
  title:     { color: '#1a73e8', margin: '8px 0 4px', fontSize: '24px' },
  subtitle:  { color: '#666', fontSize: '14px', margin: 0 },
  apiError: {
    background: '#ffebee', color: '#c62828', padding: '12px',
    borderRadius: '8px', marginBottom: '16px',
    fontSize: '14px', textAlign: 'center'
  },
  form:       { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  label:      { fontWeight: '600', fontSize: '13px', color: '#333' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1.5px solid #ddd', fontSize: '14px', outline: 'none'
  },
  fieldError: { color: '#e53935', fontSize: '12px' },
  button: {
    padding: '12px', background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px',
    cursor: 'pointer', fontWeight: '600', width: '100%', marginTop: '4px'
  },
  linkText: { textAlign: 'center', marginTop: '20px', fontSize: '14px' }
};

export default Login;