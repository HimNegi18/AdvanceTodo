import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Ensure this matches your NestJS backend port

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending HTTP-only cookies
});

// We'll implement a way to set the token later, perhaps via an Auth context or local storage (if not using http-only cookies)
// For now, if we were sending a bearer token from local storage:
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
