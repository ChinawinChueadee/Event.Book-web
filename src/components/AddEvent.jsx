import React from "react";
import { useState } from "react";
import { mainApi } from "../api/mainApi";
import useCategories from "../hooks/useCategories";
import ImageUpload from "./ImageUpload";
import { getErrorMessage, toDateTimeInput } from "../utils/event";

// ตัวเลือกเวลา ทุก 30 นาที (00:00 – 23:30)
const TIME_OPTIONS = Array.from(
  { length: 48 },
  (_, i) =>
    `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);

// วันนี้ในรูปแบบ "YYYY-MM-DD" (เวลาท้องถิ่น) สำหรับ min ของช่องวันที่
const todayInput = () => toDateTimeInput(new Date()).slice(0, 10);

// ส่ง event เข้ามา = โหมดแก้ไข, ไม่ส่ง = สร้างใหม่
function AddEvent({ event, onClose, onSaved }) {
  const isEdit = Boolean(event);
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category?.toUpperCase() || "",
    location: event?.location || "",
    eventDate: toDateTimeInput(event?.eventDate),
    capacity: event?.capacity ?? "",
    eventImage: event?.eventImage || "",
    status: event?.status || "OPEN",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // แยกช่องวันที่กับเวลา (Safari เลือกเวลาจาก datetime-local ไม่ได้) แล้วรวมกลับเป็น "YYYY-MM-DDTHH:mm"
  const [datePart = "", timePart = ""] = form.eventDate.split("T");
  const setEventDate = (date, time) =>
    setForm((prev) => ({ ...prev, eventDate: `${date}T${time}` }));
  // event เก่าที่เวลาไม่ตรงทุก 30 นาที → ใส่เวลาเดิมเพิ่มในรายการ
  const timeOptions =
    timePart && !TIME_OPTIONS.includes(timePart)
      ? [...TIME_OPTIONS, timePart].sort()
      : TIME_OPTIONS;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const categories = useCategories();
  // event เก่าที่หมวดไม่อยู่ในรายการของ API → ให้เลือกหมวดใหม่
  const isLegacyCategory =
    isEdit && categories.length > 0 && !categories.includes(form.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!categories.includes(form.category)) {
      setError("Please choose a category");
      return;
    }
    if (!datePart || !timePart) {
      setError("Please choose the event date and time");
      return;
    }
    setSubmitting(true);
    try {
      const { status, ...rest } = form;
      const payload = {
        ...rest,
        capacity: Number(form.capacity), // ✅ แปลง string → number ตรงนี้
        ...(isEdit && { status }),
      };
      const resp = isEdit
        ? await mainApi.patch(`/events/${event.id}`, payload)
        : await mainApi.post("/events", payload);
      onSaved?.(resp.data.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        getErrorMessage(
          err,
          isEdit ? "แก้ไขอีเวนต์ไม่สำเร็จ" : "สร้างอีเวนต์ไม่สำเร็จ",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-[#1A1A1A] text-[13.5px] outline-none focus:border-[#E8491D] focus:ring-1 focus:ring-[#E8491D] placeholder:text-gray-400";
  const labelClass =
    "block text-[10.5px] font-bold tracking-wider uppercase mb-1.5";
  // ปิดหน้าตา select ของ browser (Safari ทำให้มุมมน/เตี้ยกว่าช่องอื่น) แล้ววางลูกศรเอง
  const selectClass = `${inputClass} appearance-none rounded-none pr-10 cursor-pointer`;
  const selectArrow = (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]">
      ▼
    </span>
  );

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
            {isEdit ? "Edit Event" : "Add Event"}
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
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              placeholder="What is this event about?"
              value={form.description}
              onChange={handleChange("description")}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Category</label>
            <div className="relative">
              <select
                value={categories.includes(form.category) ? form.category : ""}
                onChange={handleChange("category")}
                required
                className={`${selectClass} ${
                  categories.includes(form.category) ? "" : "text-gray-400"
                }`}
              >
                <option value="" disabled>
                  {categories.length ? "Choose a category" : "Loading..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-[#1A1A1A]">
                    {cat}
                  </option>
                ))}
              </select>
              {selectArrow}
            </div>
            {isLegacyCategory && (
              <p className="text-[10.5px] text-[#8A8578] font-semibold mt-1">
                Current category "{event.category}" is no longer available —
                please choose a new one.
              </p>
            )}
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

          <div className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr] gap-x-4">
            <div className="mb-4">
              <label className={labelClass}>Event Date</label>
              <input
                type="date"
                value={datePart}
                min={isEdit ? undefined : todayInput()}
                onChange={(e) => setEventDate(e.target.value, timePart)}
                required
                className={`${inputClass} rounded-none`}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Time</label>
              <div className="relative">
                <select
                  value={timePart}
                  onChange={(e) => setEventDate(datePart, e.target.value)}
                  required
                  className={`${selectClass} ${timePart ? "" : "text-gray-400"}`}
                >
                  <option value="" disabled>
                    --:--
                  </option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time} className="text-[#1A1A1A]">
                      {time}
                    </option>
                  ))}
                </select>
                {selectArrow}
              </div>
            </div>
            <div className="mb-4 col-span-2 sm:col-span-1">
              <label className={labelClass}>Capacity</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 30"
                value={form.capacity}
                onChange={handleChange("capacity")}
                required
                className={inputClass}
              />
            </div>
          </div>

          {isEdit && (
            <div className="mb-4">
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={handleChange("status")}
                  className={selectClass}
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                {selectArrow}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className={labelClass}>
              Event Image{" "}
              <span className="text-[#8A8578] normal-case tracking-normal font-semibold">
                (optional)
              </span>
            </label>
            <ImageUpload
              value={form.eventImage}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, eventImage: url }))
              }
              onUploadingChange={setUploading}
              alt={form.title}
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
              disabled={submitting || uploading}
              className="flex-1 bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-[#c73e17] transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Event"}
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
