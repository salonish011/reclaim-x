import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { getMyItems, deleteItem } from '../services/itemService';
import Spinner from '../components/Spinner';

function Dashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all'); // 'all', 'lost', 'found'

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
  try {
    const data = await getMyItems();

    // ✅ Handle if API returns { data: [...] } or { results: [...] } or just []
    if (Array.isArray(data)) {
      setItems(data);
    } else if (Array.isArray(data?.data)) {
      setItems(data.data);
    } else if (Array.isArray(data?.results)) {
      setItems(data.results);
    } else if (Array.isArray(data?.items)) {
      setItems(data.items);
    } else {
      setItems([]); // fallback
    }

  } catch (err) {
    console.log('Backend not connected yet — showing empty state.');
    setItems([]);
  } finally {
    setLoading(false);
  }
};
  // Delete an item and refresh the list
  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to remove this report?');
    if (!confirmed) return;
    try {
      await deleteItem(itemId);
      // Remove from list without refetching everything
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      alert('Could not delete. Make sure backend is running.');
    }
  };

  // Filter items based on selected tab
  // ✅ CORRECT
  // Filter items based on selected tab
const filteredItems = (items || []).filter(item => {
  if (filter === 'all')   return true;
  if (filter === 'lost')  return item.status === 'lost';
  if (filter === 'found') return item.status === 'found';
  return true;
});

 const lostCount  = items.filter(i => i.status === 'lost').length;
  const foundCount = items.filter(i => i.status === 'found').length;
  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        {/* Welcome banner */}
        <div style={styles.welcomeBanner}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user?.username}! 👋
          </h1>
          <p style={styles.welcomeSubtitle}>
            Smart Lost & Found — powered by Machine Learning
          </p>
        </div>

        {/* Summary cards */}
        <div style={styles.cardRow}>
          <div style={{ ...styles.card, borderTop: '4px solid #e53935' }}>
            <span style={styles.cardIcon}>📦</span>
            <h3 style={styles.cardNumber}>{loading ? '...' : lostCount}</h3>
            <p style={styles.cardLabel}>Lost Reports</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #43a047' }}>
            <span style={styles.cardIcon}>✅</span>
            <h3 style={styles.cardNumber}>{loading ? '...' : foundCount}</h3>
            <p style={styles.cardLabel}>Found Reports</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #1a73e8' }}>
            <span style={styles.cardIcon}>📋</span>
            <h3 style={styles.cardNumber}>{loading ? '...' : items.length}</h3>
            <p style={styles.cardLabel}>Total Reports</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div style={styles.actionRow}>
          <button
            style={{ ...styles.actionBtn, background: '#e53935' }}
            onClick={() => navigate('/report-lost')}
          >
            📦 Report Lost Item
          </button>
          <button
            style={{ ...styles.actionBtn, background: '#43a047' }}
            onClick={() => navigate('/report-found')}
          >
            ✅ Report Found Item
          </button>
          <button
            style={{ ...styles.actionBtn, background: '#1a73e8' }}
            onClick={() => navigate('/matches')}
          >
            🤝 View Matches
          </button>
        </div>

        {/* My Reports section */}
        <div style={styles.reportsSection}>

          <div style={styles.reportsTitleRow}>
            <h2 style={styles.sectionTitle}>📋 My Reports</h2>

            {/* Filter tabs */}
            <div style={styles.filterTabs}>
              {['all', 'lost', 'found'].map(tab => (
                <button
                  key={tab}
                  style={{
                    ...styles.filterTab,
                    background: filter === tab ? '#1a73e8' : '#f0f2f5',
                    color:      filter === tab ? 'white'    : '#555',
                  }}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {/* Loading state — proper spinner */}
        {loading && (
           <Spinner message="Loading your reports..." />
         )}

          {/* Empty state — shows when backend is not connected yet too */}
          {!loading && filteredItems.length === 0 && (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: '40px' }}>📭</span>
              <p style={{ margin: '10px 0 0', color: '#777' }}>
                No reports yet. Use the buttons above to report a lost or found item.
              </p>
            </div>
          )}

          {/* Items grid */}
          <div style={styles.itemsGrid}>
            {filteredItems.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', background: '#f0f2f5' },
  content: { padding: '28px 32px' },

  welcomeBanner: {
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    borderRadius: '16px', padding: '32px',
    color: 'white', marginBottom: '24px',
  },
  welcomeTitle:    { fontSize: '26px', margin: '0 0 6px' },
  welcomeSubtitle: { fontSize: '14px', opacity: 0.85, margin: 0 },

  cardRow: {
    display: 'flex', gap: '16px',
    marginBottom: '20px', flexWrap: 'wrap',
  },
  card: {
    flex: 1, minWidth: '160px', background: 'white',
    borderRadius: '12px', padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardIcon:   { fontSize: '28px' },
  cardNumber: { fontSize: '32px', margin: '6px 0 2px', color: '#1a1a1a' },
  cardLabel:  { color: '#666', fontSize: '13px', margin: 0 },

  actionRow: {
    display: 'flex', gap: '12px',
    marginBottom: '28px', flexWrap: 'wrap',
  },
  actionBtn: {
    flex: 1, minWidth: '160px',
    color: 'white', border: 'none',
    padding: '14px 20px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },

  reportsSection: { },
  reportsTitleRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
  },
  sectionTitle: { margin: 0, fontSize: '18px', color: '#1a1a1a' },

  filterTabs:  { display: 'flex', gap: '8px' },
  filterTab: {
    padding: '7px 16px', border: 'none',
    borderRadius: '20px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
    transition: 'all 0.2s',
  },

  centerMsg: { textAlign: 'center', padding: '40px', color: '#888' },
  emptyBox: {
    textAlign: 'center', padding: '50px 20px',
    background: 'white', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },

  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
};

export default Dashboard;