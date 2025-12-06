import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Auto attach JWT to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("📤 Sending request to:", config.url);
    console.log("📤 Token from localStorage:", token?.substring(0, 50) + "...");
    console.log("📤 Token length:", token?.length);
    console.log("📤 Token periods:", (token?.match(/\./g) || []).length);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Global response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or invalid ✨ Logging out...");
      localStorage.removeItem("token");
      // window.location.href = "/login"; // uncomment if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
