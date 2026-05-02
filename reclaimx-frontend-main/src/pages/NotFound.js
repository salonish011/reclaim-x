import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <span style={styles.emoji}>🔍</span>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.message}>
          Looks like this page got lost too. Let's get you back.
        </p>
        <button
          style={styles.button}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#f0f2f5',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  box: {
    background: 'white', borderRadius: '20px',
    padding: '60px 40px', textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    maxWidth: '400px', width: '100%',
  },
  emoji:   { fontSize: '56px' },
  code:    { fontSize: '72px', color: '#1a73e8', margin: '8px 0 0' },
  title:   { fontSize: '22px', color: '#1a1a1a', margin: '0 0 12px' },
  message: { color: '#777', fontSize: '15px', lineHeight: '1.6' },
  button: {
    marginTop: '24px', padding: '12px 32px',
    background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
};

export default NotFound;