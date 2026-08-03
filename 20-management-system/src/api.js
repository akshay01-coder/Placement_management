import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(window.location.hostname)
);

const api = axios.create({
  baseURL: isLocal 
    ? `http://${window.location.hostname}:5000` 
    : 'https://placement-management-36bb.onrender.com'
});

// Interceptor to add Authorization Bearer token to headers dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;