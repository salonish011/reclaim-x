import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { getAllMatches } from '../services/itemService';
import { startConversation } from '../services/chatService';


function ItemMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const { user } = useAuth();
  
  const fetchMatches = async () => {
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch (err) {
      setError('Could not load matches. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMatches();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#43a047';
    if (score >= 50) return '#fb8c00';
    return '#e53935';
  };
  const handleStartChat = async (match) => {
  const isFinder = match.found_item?.user_id === user?.id;
  
  // Only the finder should start the chat
  if (!isFinder) {
    alert('The person who found the item will contact you. Please wait!');
    return;
  }

  const foundItemId = match.found_item?.id;
  const receiverId = match.lost_item?.user_id;
  const itemName = match.lost_item?.title || match.lost_item?.name || 'your item';

  if (!foundItemId || !receiverId) {
    alert(`Missing data - foundItemId: ${foundItemId}, receiverId: ${receiverId}`);
    return;
  }

  try {
    await startConversation(
      foundItemId,
      receiverId,
      `Hi! I think I found your lost item "${itemName}".`
    );
    alert('Conversation started! Go to Chat page.');
  } catch (error) {
    alert('Could not start conversation. Try again.');
    console.error(error);
  }
};
  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <h2 style={styles.pageTitle}>🤝 My Item Matches</h2>
        <p style={styles.pageSubtitle}>
          Items matched using our ML algorithm (Random Forest + Logistic Regression)
        </p>

        {/* 
          BEFORE (old code — plain text):
          {loading && (
            <div style={styles.centerMsg}>⏳ Loading matches...</div>
          )}

          AFTER (new code — proper spinner):
        */}
        {loading && (
          <Spinner message="Finding your matches..." />
        )}

        {/* Only show error and content when NOT loading */}
        {!loading && error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: '48px' }}>🔍</span>
            <h3>No matches found yet</h3>
            <p>Report a lost or found item and our system will search automatically.</p>
          </div>
        )}

        {!loading && (
          <div style={styles.matchList}>
            {matches.map((match, index) => (
              <div key={index} style={styles.matchCard}>

                <div style={{
                  ...styles.scoreBadge,
                  background: getScoreColor(match.confidence_score ?? 75),
                }}>
                  {match.confidence_score ?? 75}% Match
                </div>

                <div style={styles.matchRow}>
                  <div style={styles.itemBox}>
                    <p style={styles.itemTypeLabel}>📦 Lost Item</p>
                    <h3 style={styles.itemName}>{match.lost_item?.title || match.lost_item?.name || 'Unknown'}</h3>
                    <p style={styles.itemDetail}>📍 {match.lost_item?.location ?? '—'}</p>
                    <p style={styles.itemDetail}>📝 {match.lost_item?.description ?? '—'}</p>
                  </div>

                  <div style={styles.arrowBox}>↔️</div>

                  <div style={styles.itemBox}>
                    <p style={styles.itemTypeLabel}>✅ Found Item</p>
                    <h3 style={styles.itemName}>{match.found_item?.title || match.found_item?.name || 'Unknown'}</h3>
                    <p style={styles.itemDetail}>📍 {match.found_item?.location ?? '—'}</p>
                    <p style={styles.itemDetail}>📝 {match.found_item?.description ?? '—'}</p>
                  </div>
                </div>

                {match.contact_info && (
  <div style={styles.contactBox}>
    📧 Contact: {match.contact_info}
  </div>
)}
{match.found_item?.user_id === user?.id ? (
  <button
    onClick={() => handleStartChat(match)}
    style={styles.chatBtn}
  >
    💬 Contact the Owner
  </button>
) : (
  <div style={styles.waitingNote}>
    ⏳ The finder will contact you if this is your item.
  </div>
)}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page:         { minHeight: '100vh', background: '#f0f2f5' },
  content:      { padding: '32px' },
  pageTitle:    { fontSize: '24px', margin: '0 0 6px', color: '#1a1a1a' },
  pageSubtitle: { fontSize: '14px', color: '#666', marginBottom: '28px' },
  errorBox: {
    background: '#ffebee', color: '#c62828',
    padding: '16px', borderRadius: '10px', marginBottom: '20px',
  },
  emptyBox: {
    textAlign: 'center', padding: '60px 20px',
    background: 'white', borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)', color: '#555',
  },
  matchList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  matchCard: {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    padding: '24px', position: 'relative',
  },
  scoreBadge: {
    position: 'absolute', top: '20px', right: '20px',
    color: 'white', padding: '5px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '700',
  },
  matchRow:      { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
  itemBox:       { flex: 1, minWidth: '180px', background: '#f8f9fa', borderRadius: '10px', padding: '16px' },
  itemTypeLabel: { margin: '0 0 6px', fontSize: '12px', color: '#888', fontWeight: '600' },
  itemName:      { margin: '0 0 8px', fontSize: '17px', color: '#1a1a1a' },
  itemDetail:    { margin: '4px 0', fontSize: '13px', color: '#555' },
  arrowBox:      { fontSize: '28px', flexShrink: 0 },
  contactBox: {
    marginTop: '16px', background: '#e8f5e9',
    borderRadius: '8px', padding: '12px',
    fontSize: '14px', color: '#2e7d32',
  },
chatBtn: {
  marginTop: '12px',
  background: '#1a73e8',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '14px',
},
waitingNote: {
  marginTop: '12px',
  color: '#888',
  fontSize: '13px',
  fontStyle: 'italic',
},

};

export default ItemMatches;