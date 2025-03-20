import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// aqui criei interceptadores para injetar o token se fosse necessário, apenas de exemplo
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
