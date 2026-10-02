import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";

export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
  headers: {
    "Content-Type": "application/json",
  },
});

mainApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// token หมดอายุ / ไม่ถูกต้อง → logout แล้ว AppRouter จะพากลับหน้า Login เอง
mainApi.interceptors.response.use(
  (resp) => resp,
  (err) => {
    const { token, logout } = useUserStore.getState();
    if (err.response?.status === 401 && token) {
      logout();
      toast.info("Session expired. Please log in again.", {
        position: "top-center",
      });
    }
    return Promise.reject(err);
  },
);
