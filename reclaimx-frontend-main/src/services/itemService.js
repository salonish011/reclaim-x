import api from './api';

// Get ALL items reported by the logged-in user
export const getMyItems = async () => {
  const response = await api.get('/api/items/');
  return response.data;
};

// Report a new lost OR found item
export const reportItem = async (itemData) => {
  try {
    const response = await api.post('/api/items/', itemData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('POST /api/items/ failed:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      headers: error?.response?.headers,
    });
    throw error;
  }
};

// ✅ NEW — Delete an item by ID (used in Dashboard.js)
export const deleteItem = async (itemId) => {
  const response = await api.delete(`/api/items/${itemId}/`);
  return response.data;
};

// ✅ NEW — Get all matches (used in ItemMatches.js)
export const getAllMatches = async () => {
  const response = await api.get('/api/matches/');
  return response.data;
};