export const FALLBACK_IMAGE =
  "https://placehold.co/800x600/1A1A1A/F4F1EA?text=No+Image";

export const formatDate = (date, withTime = false) =>
  date
    ? new Date(date).toLocaleString(
        undefined,
        withTime
          ? { dateStyle: "medium", timeStyle: "short" }
          : { dateStyle: "medium" },
      )
    : "-";

// Date → "YYYY-MM-DDTHH:mm" สำหรับ <input type="datetime-local">
export const toDateTimeInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

// ดึงข้อความ error จาก API (รวม Zod field errors)
export const getErrorMessage = (err, fallback) => {
  const fieldErrors = err.response?.data?.errors;
  if (fieldErrors) {
    const first = Object.values(fieldErrors).flat()[0];
    if (first) return first;
  }
  return err.response?.data?.message || fallback;
};

export const bookingStatusClass = {
  PENDING: "bg-white text-[#8A8578] border-[#8A8578]",
  CONFIRMED: "bg-[#1A1A1A] text-white border-[#1A1A1A]",
  CANCELLED: "bg-transparent text-[#E8491D] border-[#E8491D]",
};

export const bookingStatusLabel = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};
