import React from 'react';

function Spinner({ message = 'Loading...' }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner}></div>
      <p style={styles.message}>{message}</p>

      {/* The spinning animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    gap: '16px',
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #1a73e8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    color: '#888',
    fontSize: '14px',
    margin: 0,
  },
};

export default Spinner;