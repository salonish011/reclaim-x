import React, { useEffect, useMemo, useState } from 'react';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/chatService';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.bellBtn} onClick={() => setOpen((v) => !v)}>
        <span role="img" aria-label="notifications">🔔</span>
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <strong>Notifications</strong>
            <button style={styles.markAllBtn} onClick={handleMarkAll}>
              Mark all read
            </button>
          </div>

          <div style={styles.list}>
            {notifications.length === 0 && (
              <p style={styles.emptyText}>No notifications</p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  ...styles.notificationItem,
                  background: n.is_read ? '#fff' : '#eff6ff',
                }}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
              >
                <div style={styles.notificationTitle}>{n.title}</div>
                <div style={styles.notificationMessage}>{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  bellBtn: {
    position: 'relative',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#e53935',
    color: '#fff',
    borderRadius: '50%',
    minWidth: '16px',
    height: '16px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    fontWeight: '700',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '34px',
    width: '320px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    zIndex: 1100,
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
  },
  markAllBtn: {
    border: 'none',
    background: 'transparent',
    color: '#1a73e8',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  list: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  emptyText: {
    margin: 0,
    padding: '16px 12px',
    fontSize: '13px',
    color: '#6b7280',
  },
  notificationItem: {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
  },
  notificationTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '2px',
  },
  notificationMessage: {
    fontSize: '12px',
    color: '#4b5563',
  },
};

export default NotificationBell;
