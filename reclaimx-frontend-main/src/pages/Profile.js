import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';        // 👈 import Spinner
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/authService';

function Profile() {
  const { user }    = useAuth();
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError('Could not load profile. Backend may not be connected yet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.card}>

          {/*
            BEFORE (old code — plain text):
            {loading ? (
              <p style={{ textAlign: 'center' }}>⏳ Loading profile...</p>
            ) : ( ... )}

            AFTER (new code — proper spinner):
          */}
          {loading && (
            <Spinner message="Loading your profile..." />
          )}

          {/* Show error if backend not connected */}
          {!loading && error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          {/* Show profile only when done loading and no error */}
          {!loading && !error && (
            <>
              <div style={styles.avatarSection}>
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    style={styles.avatar}
                  />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <h2 style={styles.name}>{profile?.username ?? user?.username}</h2>
                <p style={styles.joinedText}>ReclaimX Member</p>
              </div>

              <div style={styles.infoList}>

                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>👤</span>
                  <div>
                    <p style={styles.infoLabel}>Username</p>
                    <p style={styles.infoValue}>{profile?.username ?? '—'}</p>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📧</span>
                  <div>
                    <p style={styles.infoLabel}>Email</p>
                    <p style={styles.infoValue}>{profile?.email ?? '—'}</p>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📞</span>
                  <div>
                    <p style={styles.infoLabel}>Phone</p>
                    <p style={styles.infoValue}>{profile?.phone ?? '—'}</p>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', background: '#f0f2f5' },
  content: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  card: {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '40px', width: '100%', maxWidth: '480px',
    minHeight: '300px',          // so card doesn't collapse while spinner shows
  },
  errorBox: {
    background: '#ffebee', color: '#c62828',
    padding: '16px', borderRadius: '10px', textAlign: 'center',
  },
  avatarSection: { textAlign: 'center', marginBottom: '32px' },
  avatar: {
    width: '100px', height: '100px', borderRadius: '50%',
    objectFit: 'cover', border: '4px solid #1a73e8', margin: '0 auto',
  },
  avatarPlaceholder: {
    width: '100px', height: '100px', borderRadius: '50%',
    background: '#1a73e8', color: 'white',
    fontSize: '40px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto',
  },
  name:       { marginTop: '14px', fontSize: '22px', color: '#1a1a1a' },
  joinedText: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  infoList:   { display: 'flex', flexDirection: 'column', gap: '16px' },
  infoRow: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px', background: '#f8f9fa', borderRadius: '10px',
  },
  infoIcon:  { fontSize: '24px' },
  infoLabel: { margin: 0, fontSize: '12px', color: '#888', fontWeight: '600' },
  infoValue: { margin: '2px 0 0', fontSize: '16px', color: '#1a1a1a' },
};

export default Profile;