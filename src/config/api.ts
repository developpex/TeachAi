export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? process.env.VITE_API_URL || 'https://api.teachai.com'
    : 'http://localhost:3000',
  endpoints: {
    tools: '/tools'
  }
};