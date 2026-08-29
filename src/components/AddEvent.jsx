import React from "react";
import { useState } from "react";
import { mainApi } from "../api/mainApi";
import useUserStore from "../stores/userStore";

function AddEvent({ onClose, onCreated }) {
  const token = useUserStore((state) => state.token);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    eventDate: "",
    capacity: "",
    eventImage: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity), // ✅ แปลง string → number ตรงนี้
      };
      console.log(form);
      const resp = await mainApi.post("/events", payload);
      // onCreated?.(resp.data.data || resp.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "สร้างอีเวนต์ไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-[#1A1A1A] text-[13.5px] outline-none focus:border-[#E8491D] focus:ring-1 focus:ring-[#E8491D] placeholder:text-gray-400";
  const labelClass =
    "block text-[10.5px] font-bold tracking-wider uppercase mb-1.5";

  return (
    // Backdrop — คลิกด้านนอกกล่องเพื่อปิด modal
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal box — stopPropagation กันไม่ให้คลิกข้างในแล้ว modal ปิดไปด้วย */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F4F1EA] border border-[#1A1A1A] w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <h2 className="font-black text-xl uppercase tracking-tight">
            Add Event
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={form.title}
              onChange={handleChange("title")}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Category</label>
            <input
              type="text"
              placeholder="e.g. MUSIC, ART, TECH"
              value={form.category}
              onChange={handleChange("category")}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={form.location}
              onChange={handleChange("location")}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div className="mb-4">
              <label className={labelClass}>Event Date</label>
              <input
                type="datetime-local"
                value={form.eventDate}
                onChange={handleChange("eventDate")}
                required
                className={inputClass}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Capacity</label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={form.capacity}
                onChange={handleChange("capacity")}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.eventImage}
              onChange={handleChange("eventImage")}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-[11px] text-[#E8491D] font-semibold mb-4">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-[#c73e17] transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
