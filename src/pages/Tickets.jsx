import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import PageHeader from "../components/PageHeader";
import {
  FALLBACK_IMAGE,
  bookingStatusClass,
  bookingStatusLabel,
  formatDate,
  getErrorMessage,
} from "../utils/event";

function Tickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const resp = await mainApi.get("/bookings/me");
        setBookings(resp.data.data || resp.data);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err, "โหลดการจองไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm(`ยกเลิกการจอง "${booking.event.title}" ใช่ไหม?`)) return;
    setCancellingId(booking.id);
    try {
      const resp = await mainApi.patch(`/bookings/${booking.id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: resp.data.data.status } : b,
        ),
      );
      toast.success("Booking cancelled");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "ยกเลิกการจองไม่สำเร็จ"));
    } finally {
      setCancellingId(null);
    }
  };

  // ที่ยังไม่ผ่านไปขึ้นก่อน เรียงตามวันจัดงาน
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.event.eventDate) > now)
    .sort((a, b) => new Date(a.event.eventDate) - new Date(b.event.eventDate));
  const past = bookings.filter((b) => new Date(b.event.eventDate) <= now);

  const renderBooking = (booking, isPast) => (
    <li
      key={booking.id}
      className="flex flex-col sm:flex-row gap-4 sm:gap-5 border-b border-[#1A1A1A] py-5"
    >
      <img
        src={booking.event.eventImage || FALLBACK_IMAGE}
        alt={booking.event.title}
        className={`w-full sm:w-40 aspect-[4/3] object-cover border border-[#1A1A1A] ${
          isPast || booking.status === "CANCELLED" ? "grayscale" : ""
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578]">
            {booking.event.category}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 ${bookingStatusClass[booking.status]}`}
          >
            {bookingStatusLabel[booking.status]}
          </span>
        </div>
        <h3 className="font-black text-lg lg:text-xl leading-tight uppercase mb-2">
          {booking.event.title}
        </h3>
        <p className="text-xs font-semibold text-[#4a463c]">
          {formatDate(booking.event.eventDate, true)} ·{" "}
          {booking.event.location}
        </p>
      </div>
      {!isPast && booking.status !== "CANCELLED" && (
        <div className="sm:self-center">
          <button
            type="button"
            onClick={() => handleCancel(booking)}
            disabled={cancellingId === booking.id}
            className="w-full sm:w-auto px-5 py-2.5 border border-[#E8491D] text-[#E8491D] font-extrabold text-[11px] tracking-wider uppercase hover:bg-[#E8491D] hover:text-white transition-colors disabled:opacity-50"
          >
            {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}
    </li>
  );

  const sectionTitle =
    "text-[13px] font-extrabold tracking-wider uppercase pt-8 pb-3 border-b border-[#1A1A1A]";

  return (
    <main className="flex-1 w-full text-[#1A1A1A]">
      <PageHeader
        title="My Tickets"
        subtitle="Events you've booked. Pending bookings are waiting for the host to confirm."
      />

      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 pb-16">
        {loading && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center">
            Loading bookings...
          </p>
        )}
        {!loading && error && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#E8491D]">
            {error}
          </p>
        )}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#8A8578]">
            You haven't booked any events yet.
          </p>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className={sectionTitle}>Upcoming ({upcoming.length})</h2>
            <ul>{upcoming.map((b) => renderBooking(b, false))}</ul>
          </section>
        )}
        {past.length > 0 && (
          <section>
            <h2 className={`${sectionTitle} text-[#8A8578]`}>
              Past ({past.length})
            </h2>
            <ul className="opacity-70">
              {past.map((b) => renderBooking(b, true))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

export default Tickets;
