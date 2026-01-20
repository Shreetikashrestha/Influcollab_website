import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050',
  withCredentials: true, // allow cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for error handling and token injection if needed
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    return Promise.reject(error);
  }
);

export default instance;
