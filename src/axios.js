import axios from "axios";
import store from "@/store";

const api = axios.create({
  baseURL: "https://api.vk.com/",
  headers: {
    "Content-Type": "application/json"
  }
});

// Добавляем interceptor для автоматического обновления токена
api.interceptors.request.use(async (config) => {
  let token = store.state.auth.accessToken;

  if (!token) {
    token = localStorage.getItem("access_token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const newToken = await store.dispatch("refreshAccessToken");
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
