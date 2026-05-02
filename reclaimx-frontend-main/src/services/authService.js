import api from './api';

export const registerUser = async (formData) => {
  const response = await api.post('/api/users/register/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('/api/auth/login/', { username, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/api/users/profile/');  // ✅ fixed URL
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};