// API configuration based on environment
const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment 
  ? 'http://localhost/bookstore/php-backend/api'
  : (import.meta.env.VITE_API_URL || 'https://your-railway-backend.up.railway.app/api');

export default API_URL;
