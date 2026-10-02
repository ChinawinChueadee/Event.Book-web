import { useEffect } from "react";
import { create } from "zustand";
import { mainApi } from "../api/mainApi";

// รายการ category มาจาก API (GET /categories) — โหลดครั้งเดียวแล้วใช้ร่วมกันทั้งแอป
// ทุก component ที่ใช้ hook นี้อ่านจาก store เดียวกัน พอล้าง cache แล้วโหลดใหม่ ทุกหน้าจะเห็นรายการใหม่ทันที
const useCategoryStore = create((set, get) => ({
  categories: [],
  loaded: false,
  request: null,
  load: async () => {
    if (get().loaded) return get().categories;
    if (get().request) return get().request;

    const request = mainApi
      .get("/categories")
      .then((resp) => {
        set({ categories: resp.data.data, loaded: true, request: null });
        return resp.data.data;
      })
      .catch((err) => {
        console.error(err);
        set({ request: null }); // ให้ลองโหลดใหม่ได้ครั้งถัดไป
        return get().categories;
      });
    set({ request });
    return request;
  },
}));

// เรียกหลัง admin เพิ่ม / แก้ชื่อ / ลบหมวด เพื่อล้าง cache แล้วโหลดรายการใหม่
export const invalidateCategories = () => {
  useCategoryStore.setState({ loaded: false, request: null });
  return useCategoryStore.getState().load();
};

function useCategories() {
  const categories = useCategoryStore((state) => state.categories);
  const load = useCategoryStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  return categories;
}

export default useCategories;
