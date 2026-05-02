import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();               // clears token from memory and browser
    navigate('/login');     // sends user back to login page
  };

  return (
    <nav style={styles.nav}>

      {/* Left side — App name/logo */}
      <Link to="/dashboard" style={styles.logo}>
        🔍 ReclaimX
      </Link>

      {/* Right side — navigation links */}
      <div style={styles.links}>
        <Link to="/dashboard"    style={styles.link}>Home</Link>
        <Link to="/report-lost"  style={styles.link}>Report Lost</Link>
        <Link to="/report-found" style={styles.link}>Report Found</Link>
        <Link to="/matches"      style={styles.link}>Matches</Link>
        <Link to="/chat"         style={styles.link}>Chat</Link>
        <Link to="/profile"      style={styles.link}>Profile</Link>
        <Link to="/browse"       style={styles.link}>Browse Items</Link>
        <NotificationBell />

        {/* Show username and logout button */}
        <span style={styles.username}>
          👤 {user?.username}
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    background: '#1a73e8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'sticky',    // stays at top even when you scroll
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  username: {
    color: '#d0e8ff',
    fontSize: '14px',
    marginLeft: '10px',
  },
  logoutBtn: {
    background: 'white',
    color: '#1a73e8',
    border: 'none',
    padding: '7px 16px',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default Navbar;