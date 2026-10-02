import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mainApi } from "../api/mainApi";

// Remember me → เก็บใน localStorage (อยู่ข้ามการปิด browser)
// ไม่ติ๊ก → sessionStorage (หายเมื่อปิดแท็บ/browser)
const authStorage = {
  getItem: (name) =>
    localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const remember = JSON.parse(value).state?.remember;
    const [keep, clear] = remember
      ? [localStorage, sessionStorage]
      : [sessionStorage, localStorage];
    keep.setItem(name, value);
    clear.removeItem(name);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: "",
      remember: false,
      login: async (data) => {
        const resp = await mainApi.post("/auth/login", data);
        set({
          user: resp.data.user,
          token: resp.data.token,
          remember: Boolean(data.remember),
        });
        return resp;
      },
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: "" }),
    }),
    { name: "authState", storage: createJSONStorage(() => authStorage) },
  ),
);

export default useUserStore;
