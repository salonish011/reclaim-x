import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const PUBLIC_URLS = ['/api/users/register/', '/api/auth/login/', '/api/token/', '/api/token/refresh/'];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_URLS.some(url => config.url?.includes(url));

  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;