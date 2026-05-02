import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { reportItem } from '../services/itemService';
import Toast    from '../components/Toast';
import useToast from '../context/useToast';

function ReportLost() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
  });
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Build FormData to send text + image together
    const formData = new FormData();
    formData.append('status',      'lost');
    formData.append('title',       form.title);
    formData.append('description', form.description);
    formData.append('location',    form.location);
    formData.append('date',        form.date);
    if (image) {
      formData.append('image', image);
    }

    try {
      await reportItem(formData);
      showToast('Lost item reported successfully! We will notify you if a match is found.', 'success');
      setTimeout(() => navigate('/dashboard'), 2000); // wait 2 sec so user sees toast
    } catch (err) {
      setError('Failed to submit. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.card}>

          {/* Header */}
          <div style={styles.header}>
            <span style={styles.headerIcon}>📦</span>
            <div>
              <h2 style={styles.title}>Report a Lost Item</h2>
              <p style={styles.subtitle}>
                Fill in as many details as possible for better matching
              </p>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>

            <label style={styles.label}>Item Name *</label>
            <input
              style={styles.input}
              name="title"
              onChange={handleChange}
              placeholder="e.g. Black leather wallet"
              required
            />

            <label style={styles.label}>Category</label>
            <select style={styles.input} name="category" onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="wallet">Wallet / Purse</option>
              <option value="keys">Keys</option>
              <option value="bag">Bag / Backpack</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents / ID</option>
              <option value="jewellery">Jewellery</option>
              <option value="other">Other</option>
            </select>

            <label style={styles.label}>Description *</label>
            <textarea
              style={{ ...styles.input, height: '90px', resize: 'vertical' }}
              name="description"
              onChange={handleChange}
              placeholder="Describe colour, brand, size, any unique features..."
              required
            />

            <label style={styles.label}>Where did you lose it? *</label>
            <input
              style={styles.input}
              name="location"
              onChange={handleChange}
              placeholder="e.g. College canteen, Library, Gate 2"
              required
            />

            <label style={styles.label}>Date Lost *</label>
            <input
              style={styles.input}
              name="date"
              type="date"
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Upload a Photo (optional but recommended)</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div style={styles.buttonRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Submitting...' : '📦 Submit Lost Report'}
              </button>
            </div>

          </form>
        </div>
      </div>
      {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={hideToast}
  />
)}
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', background: '#f0f2f5' },
  content: { display: 'flex', justifyContent: 'center', padding: '32px 16px' },
  card: {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '36px', width: '100%', maxWidth: '560px',
  },
  header:     { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' },
  headerIcon: { fontSize: '40px' },
  title:      { margin: 0, fontSize: '22px', color: '#1a1a1a' },
  subtitle:   { margin: '4px 0 0', color: '#666', fontSize: '13px' },
  form:       { display: 'flex', flexDirection: 'column', gap: '12px' },
  label:      { fontWeight: '600', fontSize: '14px', color: '#333' },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    width: '100%', boxSizing: 'border-box',
  },
  buttonRow:  { display: 'flex', gap: '12px', marginTop: '8px' },
  cancelBtn: {
    flex: 1, padding: '12px', background: '#f0f2f5',
    border: 'none', borderRadius: '8px',
    fontSize: '14px', cursor: 'pointer', color: '#333',
  },
  submitBtn: {
    flex: 2, padding: '12px', background: '#e53935',
    border: 'none', borderRadius: '8px', fontSize: '14px',
    cursor: 'pointer', color: 'white', fontWeight: '600',
  },
  error: { color: 'red', fontSize: '14px', textAlign: 'center' },
};

export default ReportLost;