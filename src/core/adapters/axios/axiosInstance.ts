import axios from "axios";

const axiosAdapter = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosAdapter.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (customerId) {
    config.headers["X-Customer-Id"] = customerId;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosAdapter;
