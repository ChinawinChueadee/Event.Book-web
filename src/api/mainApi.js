import axios from "axios";
import useUserStore from "../stores/userStore";

export const mainApi = axios.create({
  baseURL: "http://localhost:5005",
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
