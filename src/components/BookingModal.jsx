import React from "react";
import { useState, useEffect } from "react";
import { mainApi } from "../api/mainApi";
import useUserStore from "../stores/userStore"; // ✅ เพิ่ม import

function BookingModal({ event, onClose, onBooked, onDeleted }) {
  const currentUser = useUserStore((state) => state.user); // ✅ ดึง user ปัจจุบัน
  const isOwner = currentUser?.id === event.userId; // ✅ เช็คว่าเป็นเจ้าของ event ไหม

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [checkingBooking, setCheckingBooking] = useState(true);
  const [myBooking, setMyBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const [deleting, setDeleting] = useState(false); // ✅ state สำหรับลบ event

  useEffect(() => {
    if (isOwner) {
      setCheckingBooking(false); // เจ้าของ event ไม่ต้องเช็คว่าตัวเองจองไหม
      return;
    }

    const checkExistingBooking = async () => {
      try {
        setCheckingBooking(true);
        const resp = await mainApi.get("/bookings/me");
        const bookings = resp.data.data || resp.data;
        const existing = bookings.find(
          (b) => b.eventId === event.id && b.status !== "CANCELLED",
        );
        setMyBooking(existing || null);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingBooking(false);
      }
    };

    checkExistingBooking();
  }, [event.id, isOwner]);

  const handleConfirmBooking = async () => {
    setError("");
    setSubmitting(true);
    try {
      const resp = await mainApi.post("/bookings", { eventId: event.id });
      const newBooking = resp.data.data || resp.data;
      setMyBooking(newBooking);
      setSuccess(true);
      onBooked?.(newBooking);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "จองอีเวนต์ไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    setError("");
    setCancelling(true);
    try {
      await mainApi.patch(`/bookings/${myBooking.id}/cancel`);
      setMyBooking(null);
      setSuccess(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "ยกเลิกการจองไม่สำเร็จ");
    } finally {
      setCancelling(false);
    }
  };

  // ✅ ฟังก์ชันลบ event
  const handleDeleteEvent = async () => {
    const confirmed = window.confirm(
      "ต้องการลบอีเวนต์นี้ใช่ไหม? การลบไม่สามารถย้อนกลับได้",
    );
    if (!confirmed) return;

    setError("");
    setDeleting(true);
    try {
      await mainApi.delete(`/events/${event.id}`);
      onDeleted?.(event.id); // แจ้งฝั่ง Home ให้เอา event นี้ออกจาก list
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "ลบอีเวนต์ไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F4F1EA] border border-[#1A1A1A] w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <h2 className="font-black text-xl uppercase tracking-tight">
            Event Details
          </h2>
          <div className="flex items-center gap-2">
            {/* ✅ ปุ่มลบ — โชว์เฉพาะเจ้าของ event */}
            {isOwner && (
              <button
                type="button"
                onClick={handleDeleteEvent}
                disabled={deleting}
                title="Delete Event"
                className="w-20 h-8 flex items-center justify-center border border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden border-b border-[#1A1A1A]">
          <img
            src={
              event.eventImage ||
              "https://via.placeholder.com/800x450?text=No+Image"
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />

          {myBooking && (
            <span className="absolute top-3 right-3 bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1.5 uppercase tracking-wide">
              ✓ You're Going
            </span>
          )}

          {/* ✅ badge บอกว่าเป็น event ของตัวเอง */}
          {isOwner && (
            <span className="absolute top-3 left-3 bg-[#E8491D] text-white text-[10px] font-bold px-2.5 py-1.5 uppercase tracking-wide">
              Your Event
            </span>
          )}
        </div>

        <div className="p-6">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-2">
            {event.category}
          </p>
          <h3 className="font-black text-2xl leading-tight uppercase mb-2">
            {event.title}
          </h3>

          {event.user && (
            <p className="text-xs font-semibold text-[#4a463c] mb-4 flex items-center gap-1.5">
              <span className="text-[#8A8578]">Organized by</span>
              <span className="font-bold text-[#1A1A1A]">
                {event.user.username || event.user.email}
              </span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-1">
                Date
              </p>
              <p className="font-semibold">
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-1">
                Location
              </p>
              <p className="font-semibold">{event.location}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-1">
                Capacity
              </p>
              <p className="font-semibold">{event.capacity}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-1">
                Status
              </p>
              <p className="font-semibold">{event.status}</p>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-[#E8491D] font-semibold mb-4">
              {error}
            </p>
          )}

          {/* ✅ ถ้าเป็นเจ้าของ event ไม่ต้องโชว์ปุ่มจอง แค่โชว์ปุ่ม Close พอ */}
          {isOwner ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-white transition-colors"
            >
              Close
            </button>
          ) : checkingBooking ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8578] text-center py-2">
              Checking booking status...
            </p>
          ) : success ? (
            <div className="text-center py-2">
              <p className="font-black text-lg uppercase mb-4">
                🎉 Booking Confirmed!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          ) : myBooking ? (
            <div>
              <div className="flex items-center gap-2 mb-4 bg-white border border-[#1A1A1A] px-4 py-3">
                <span className="text-[#1A1A1A]">✓</span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  You've already booked this event
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 bg-transparent text-[#E8491D] border border-[#E8491D] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-[#E8491D] hover:text-white transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="flex-1 bg-[#E8491D] text-white border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-[#c73e17] transition-colors disabled:opacity-50"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 border border-[#1A1A1A] font-extrabold text-[13px] tracking-wider uppercase py-3.5 hover:bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
