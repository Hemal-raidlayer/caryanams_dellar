import axios from 'axios';

const BASE_URL = 'https://crmapi.conscor.com/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // If you store token in AsyncStorage after login
    // import AsyncStorage and use it like this:
    // const token = await AsyncStorage.getItem('token');

    const token = null; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirect to login.");
    }
    return Promise.reject(error);
  }
);

export default api;
