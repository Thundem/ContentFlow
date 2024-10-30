// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Інтерцептор відповідей
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Якщо токен недійсний або прострочений, виходимо користувача
      // Оскільки не можна використовувати хуки тут, ви можете використовувати інші методи, наприклад, події або глобальний стан
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;