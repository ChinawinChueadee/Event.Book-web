import React from "react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "../api/mainApi";
import AddEvent from "../components/AddEvent";
import PageHeader from "../components/PageHeader";
import {
  FALLBACK_IMAGE,
  bookingStatusClass,
  bookingStatusLabel,
  formatDate,
  getErrorMessage,
} from "../utils/event";

const eventStatusClass = {
  OPEN: "bg-[#1A1A1A] text-white border-[#1A1A1A]",
  CLOSED: "bg-white text-[#8A8578] border-[#8A8578]",
  CANCELLED: "bg-transparent text-[#E8491D] border-[#E8491D]",
};

const smallButton =
  "px-3.5 py-2 border font-extrabold text-[11px] tracking-wider uppercase transition-colors disabled:opacity-50";

// รายชื่อผู้จองของ event หนึ่ง + ปุ่ม confirm / reject
function EventBookings({ eventId, onChange }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const resp = await mainApi.get(`/events/${eventId}/bookings`);
        setBookings(resp.data.data || resp.data);
      } catch (err) {
        console.error(err);
        toast.error(getErrorMessage(err, "โหลดรายชื่อผู้จองไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [eventId]);

  const updateStatus = async (booking, status) => {
    setUpdatingId(booking.id);
    try {
      await mainApi.patch(`/bookings/${booking.id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status } : b)),
      );
      onChange();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "อัปเดตการจองไม่สำเร็จ"));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8578] py-4">
        Loading bookings...
      </p>
    );
  }
  if (bookings.length === 0) {
    return (
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8578] py-4">
        No bookings yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#1A1A1A]/20">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex flex-col sm:flex-row sm:items-center gap-3 py-3"
        >
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">
              {booking.user.username}
            </p>
            <p className="text-xs text-[#8A8578] truncate">
              {booking.user.email} · booked {formatDate(booking.bookedAt)}
            </p>
          </div>
          <span
            className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 ${bookingStatusClass[booking.status]}`}
          >
            {bookingStatusLabel[booking.status]}
          </span>
          {booking.status !== "CANCELLED" && (
            <div className="flex gap-2">
              {booking.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => updateStatus(booking, "CONFIRMED")}
                  disabled={updatingId === booking.id}
                  className={`${smallButton} border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#E8491D] hover:border-[#E8491D]`}
                >
                  Confirm
                </button>
              )}
              <button
                type="button"
                onClick={() => updateStatus(booking, "CANCELLED")}
                disabled={updatingId === booking.id}
                className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white`}
              >
                Reject
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Host() {
  const { eventsVersion, openAddEvent } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [openBookingsId, setOpenBookingsId] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError("");
        const resp = await mainApi.get("/host/me/events");
        setEvents(resp.data.data || resp.data);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err, "โหลดอีเวนต์ของคุณไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventsVersion, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleDelete = async (event) => {
    if (
      !window.confirm(
        `ลบอีเวนต์ "${event.title}" ใช่ไหม? การจองทั้งหมดจะถูกลบด้วย`,
      )
    )
      return;
    try {
      await mainApi.delete(`/events/${event.id}`);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast.success("Event deleted");
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, "ลบอีเวนต์ไม่สำเร็จ"));
    }
  };

  return (
    <main className="flex-1 w-full text-[#1A1A1A]">
      <PageHeader
        title="Hosting"
        subtitle="Manage the events you host and confirm who's coming."
        action={
          <button
            type="button"
            onClick={openAddEvent}
            className="self-start sm:self-auto flex items-center gap-1.5 bg-[#E8491D] text-white border border-[#E8491D] px-5 py-3 text-xs font-extrabold tracking-wider uppercase hover:bg-[#c73e17] transition-colors"
          >
            <span className="text-sm leading-none">+</span> Add Event
          </button>
        }
      />

      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 py-8 pb-16">
        {loading && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center">
            Loading your events...
          </p>
        )}
        {!loading && error && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#E8491D]">
            {error}
          </p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#8A8578]">
            You're not hosting any events yet.
          </p>
        )}

        <ul className="flex flex-col gap-5">
          {events.map((event) => {
            const booked = event._count?.bookings ?? 0;
            const fillRate = Math.min(
              Math.round((booked / event.capacity) * 100),
              100,
            );
            const showBookings = openBookingsId === event.id;

            return (
              <li key={event.id} className="border border-[#1A1A1A] bg-white">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={event.eventImage || FALLBACK_IMAGE}
                    alt={event.title}
                    className="w-full md:w-56 aspect-[4/3] md:aspect-auto object-cover border-b md:border-b-0 md:border-r border-[#1A1A1A]"
                  />
                  <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578]">
                          {event.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 ${eventStatusClass[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-black text-lg lg:text-xl leading-tight uppercase mb-1">
                        {event.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#4a463c]">
                        {formatDate(event.eventDate, true)} · {event.location}
                      </p>
                    </div>

                    {/* แถบจำนวนผู้จอง */}
                    <div>
                      <div className="flex justify-between text-[10.5px] font-bold uppercase tracking-wider mb-1.5">
                        <span>
                          {booked} / {event.capacity} booked
                        </span>
                        <span className="text-[#8A8578]">{fillRate}%</span>
                      </div>
                      <div className="h-2 bg-[#F4F1EA] border border-[#1A1A1A]">
                        <div
                          className="h-full bg-[#E8491D]"
                          style={{ width: `${fillRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenBookingsId(showBookings ? null : event.id)
                        }
                        className={`${smallButton} ${
                          showBookings
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                            : "border-[#1A1A1A] hover:bg-[#F4F1EA]"
                        }`}
                      >
                        {showBookings ? "Hide Bookings" : "Bookings"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(event)}
                        className={`${smallButton} border-[#1A1A1A] hover:bg-[#F4F1EA]`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        className={`${smallButton} border-[#E8491D] text-[#E8491D] hover:bg-[#E8491D] hover:text-white`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {showBookings && (
                  <div className="border-t border-[#1A1A1A] px-5">
                    <EventBookings eventId={event.id} onChange={reload} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {editingEvent && (
        <AddEvent
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={() => {
            reload();
            toast.success("Event updated");
          }}
        />
      )}
    </main>
  );
}

export default Host;
