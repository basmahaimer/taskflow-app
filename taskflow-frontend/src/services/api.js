import axios from "axios";

const api = axios.create({
  baseURL: "https://taskflow-app-production.up.railway.app/api", // ton backend Laravel
});

// Intercepteur pour inclure automatiquement le token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
