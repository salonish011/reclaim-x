import React from 'react';

function ItemCard({ item, onDelete }) {
  // Decide colors based on whether it's a lost or found item
  const isLost = item.status === 'lost';
  const typeColor  = isLost ? '#e53935' : '#43a047';
  const typeLabel  = isLost ? '📦 Lost'  : '✅ Found';
  const borderColor = isLost ? '#ffcdd2' : '#c8e6c9';

  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${typeColor}` }}>

      {/* Top row: item name + type badge */}
      <div style={styles.topRow}>
        <h3 style={styles.itemName}>{item.name}</h3>
        <span style={{ ...styles.typeBadge, background: typeColor }}>
          {typeLabel}
        </span>
      </div>

      {/* Category tag */}
      {item.category && (
        <span style={styles.categoryTag}>{item.category}</span>
      )}

      {/* Item image if available */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={styles.image}
        />
      )}

      {/* Description */}
      <p style={styles.description}>
        {item.description ?? 'No description provided.'}
      </p>

      {/* Location and date */}
      <div style={styles.metaRow}>
        <span style={styles.metaItem}>
          📍 {item.location ?? 'Location not specified'}
        </span>
        <span style={styles.metaItem}>
          📅 {item.date_lost ?? item.date_found ?? 'Date not set'}
        </span>
      </div>

      {/* Delete button — only shows if onDelete function is passed */}
      {onDelete && (
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(item.id)}
        >
          🗑️ Remove Report
        </button>
      )}

    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },
  itemName: {
    margin: 0,
    fontSize: '17px',
    color: '#1a1a1a',
    flex: 1,
  },
  typeBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  categoryTag: {
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',      // crops neatly without stretching
    borderRadius: '8px',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.5',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '13px',
    color: '#777',
  },
  deleteBtn: {
    alignSelf: 'flex-start',
    background: 'none',
    border: '1px solid #ffcdd2',
    color: '#e53935',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '4px'
  }
};

export default ItemCard;