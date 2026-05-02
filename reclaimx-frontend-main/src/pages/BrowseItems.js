import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import Spinner from '../components/Spinner';
import api from '../services/api';

function BrowseItems() {

  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [filter,    setFilter]    = useState('all');
  const [category,  setCategory]  = useState('all');
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const response = await api.get('/api/items/browse/');  // ✅ FIXED URL
      setItems(response.data);
    } catch (err) {
      setError('Could not load items. Backend may not be connected yet.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {

    const typeMatch =
      filter === 'all' ||
      item.status === filter;              // ✅ FIXED: was item.item_type

    const categoryMatch =
      category === 'all' ||
      item.category === category;

    const searchMatch =
      search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||        // ✅ FIXED: was item.name
      (item.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location ?? '').toLowerCase().includes(search.toLowerCase());

    return typeMatch && categoryMatch && searchMatch;
  });

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <div style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>📋 Browse All Items</h2>
            <p style={styles.pageSubtitle}>
              See all lost and found items reported across the campus
            </p>
          </div>
          <div style={styles.totalBadge}>
            {items.length} total reports
          </div>
        </div>

        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by item name, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              style={styles.clearSearch}
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>

        <div style={styles.filterRow}>
          <div style={styles.tabGroup}>
            {['all', 'lost', 'found'].map(tab => (
              <button
                key={tab}
                style={{
                  ...styles.tab,
                  background: filter === tab ? '#1a73e8' : 'white',
                  color:      filter === tab ? 'white'   : '#555',
                  border:     filter === tab ? 'none'    : '1px solid #ddd',
                }}
                onClick={() => setFilter(tab)}
              >
                {tab === 'all'   ? '📋 All'   : ''}
                {tab === 'lost'  ? '📦 Lost'  : ''}
                {tab === 'found' ? '✅ Found' : ''}
              </button>
            ))}
          </div>

          <select
            style={styles.categorySelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="wallet">Wallet / Purse</option>
            <option value="keys">Keys</option>
            <option value="bag">Bag / Backpack</option>
            <option value="clothing">Clothing</option>
            <option value="documents">Documents / ID</option>
            <option value="jewellery">Jewellery</option>
            <option value="other">Other</option>
          </select>
        </div>

        {!loading && (
          <p style={styles.resultsCount}>
            Showing {filteredItems.length} of {items.length} items
            {search && ` matching "${search}"`}
          </p>
        )}

        {loading && <Spinner message="Loading all items..." />}

        {!loading && error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: '48px' }}>📭</span>
            <h3 style={{ margin: '12px 0 6px' }}>No items found</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>
              {search
                ? `No items match "${search}". Try different keywords.`
                : 'No items have been reported yet.'}
            </p>
            {search && (
              <button
                style={styles.clearBtn}
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && !error && (
          <div style={styles.grid}>
            {filteredItems.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', background: '#f0f2f5' },
  content: { padding: '28px 32px' },

  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px'
  },
  pageTitle:    { margin: '0 0 4px', fontSize: '24px', color: '#1a1a1a' },
  pageSubtitle: { margin: 0, fontSize: '14px', color: '#666' },
  totalBadge: {
    background: '#e8f0fe', color: '#1a73e8',
    padding: '8px 16px', borderRadius: '20px',
    fontSize: '14px', fontWeight: '600',
  },

  searchBar: {
    display: 'flex', alignItems: 'center',
    background: 'white', borderRadius: '12px',
    padding: '4px 16px', marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    border: '1.5px solid #e0e0e0',
  },
  searchIcon:  { fontSize: '18px', marginRight: '10px' },
  searchInput: {
    border: 'none', outline: 'none', fontSize: '15px',
    flex: 1, padding: '10px 0', background: 'transparent',
  },
  clearSearch: {
    background: 'none', border: 'none',
    color: '#999', cursor: 'pointer', fontSize: '16px',
  },

  filterRow: {
    display: 'flex', gap: '12px',
    marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center'
  },
  tabGroup: { display: 'flex', gap: '8px' },
  tab: {
    padding: '8px 18px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  categorySelect: {
    padding: '8px 14px', borderRadius: '20px',
    border: '1px solid #ddd', fontSize: '13px',
    background: 'white', cursor: 'pointer', outline: 'none',
  },

  resultsCount: { fontSize: '13px', color: '#888', marginBottom: '16px' },

  errorBox: {
    background: '#ffebee', color: '#c62828',
    padding: '16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px',
  },
  emptyBox: {
    textAlign: 'center', padding: '60px 20px',
    background: 'white', borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  clearBtn: {
    marginTop: '16px', padding: '10px 24px',
    background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '14px', cursor: 'pointer',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
};

export default BrowseItems;