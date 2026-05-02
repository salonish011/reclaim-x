import React, { useEffect } from 'react';

// type can be: 'success', 'error', 'info'
function Toast({ message, type = 'success', onClose }) {

  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer); // cleanup if component unmounts early
  }, [onClose]);

  const colors = {
    success: { background: '#43a047', icon: '✅' },
    error:   { background: '#e53935', icon: '❌' },
    info:    { background: '#1a73e8', icon: 'ℹ️'  },
  };

  const { background, icon } = colors[type] || colors.info;

  return (
    <div style={{ ...styles.toast, background }}>
      <span style={styles.icon}>{icon}</span>
      <span style={styles.message}>{message}</span>
      <button style={styles.closeBtn} onClick={onClose}>✕</button>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: 9999,              // always on top of everything
    minWidth: '260px',
    maxWidth: '380px',
    animation: 'slideIn 0.3s ease-out',
  },
  icon:     { fontSize: '18px', flexShrink: 0 },
  message:  { flex: 1, lineHeight: '1.4' },
  closeBtn: {
    background: 'none', border: 'none',
    color: 'white', cursor: 'pointer',
    fontSize: '16px', opacity: 0.8,
    flexShrink: 0,
  },
};

export default Toast;