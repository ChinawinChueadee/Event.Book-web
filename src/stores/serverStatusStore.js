import { create } from "zustand";

// นับจำนวน request ที่ช้าผิดปกติ (เช่น server บน Render กำลังตื่นจากการหลับ)
// > 0 = แสดงกล่องแจ้ง "Waking up the server…"
const useServerStatusStore = create((set) => ({
  slowRequests: 0,
  increment: () => set((s) => ({ slowRequests: s.slowRequests + 1 })),
  decrement: () =>
    set((s) => ({ slowRequests: Math.max(s.slowRequests - 1, 0) })),
}));

export default useServerStatusStore;
