import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import useServerStatusStore from "../stores/serverStatusStore";

export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- server ตื่นช้า (Render free plan หลับเมื่อไม่มีคนใช้ ~15 นาที) ----------
const SLOW_AFTER_MS = 4000; // ช้ากว่านี้ถือว่า server อาจกำลังตื่น
// ลองใหม่เฉพาะ GET (ทำซ้ำได้ปลอดภัย) — รวมรอได้ ~30 วินาทีบวกเวลาของแต่ละ request
const RETRY_DELAYS_MS = [2000, 4000, 8000, 15000];
const RETRY_STATUS = [502, 503, 504];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const markSlow = (config) => {
  if (config._slow) return;
  config._slow = true;
  useServerStatusStore.getState().increment();
};

const settle = (config) => {
  clearTimeout(config._slowTimer);
  if (config._slow) {
    config._slow = false;
    useServerStatusStore.getState().decrement();
  }
};

mainApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config._slowTimer = setTimeout(() => markSlow(config), SLOW_AFTER_MS);
  return config;
});

mainApi.interceptors.response.use(
  (resp) => {
    settle(resp.config);
    return resp;
  },
  async (err) => {
    const config = err.config;

    // server ยังไม่พร้อม (ไม่มี response / 502-504) → รอแล้วลอง GET ใหม่
    const retryCount = config?._retryCount ?? 0;
    const canRetry =
      config &&
      config.method === "get" &&
      (!err.response || RETRY_STATUS.includes(err.response.status)) &&
      retryCount < RETRY_DELAYS_MS.length;
    if (canRetry) {
      clearTimeout(config._slowTimer);
      markSlow(config); // ระหว่างรอ retry ให้กล่องแจ้งเตือนยังแสดงอยู่
      await sleep(RETRY_DELAYS_MS[retryCount]);
      config._retryCount = retryCount + 1;
      return mainApi(config);
    }
    if (config) settle(config);

    // token หมดอายุ / ไม่ถูกต้อง → logout แล้ว AppRouter จะพากลับหน้า Login เอง
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
