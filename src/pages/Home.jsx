import React from "react";
import { useState, useEffect } from "react";
import { mainApi } from "../api/mainApi";
import BookingModal from "../components/BookingModal";

const categories = ["ALL", "TECH", "MUSIC", "ART", "DESIGN", "TALKS"];

function Home() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  // ---------- Events state ----------
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const resp = await mainApi.get("/events"); // ปรับ endpoint ให้ตรงกับที่มีจริง
        setEvents(resp.data.data || resp.data); // ปรับตามโครงสร้าง response จริง (data.data หรือ data ตรง ๆ)
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "โหลดข้อมูลอีเวนต์ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // ดึงข้อมูลครั้งเดียวตอน component mount

  // ---------- Filter ด้วย category + search ฝั่ง client ----------
  const filteredEvents = events.filter((event) => {
    const matchCategory =
      activeCategory === "ALL" ||
      event.category?.toUpperCase() === activeCategory;
    const matchSearch = event.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const inputClass =
    "flex-1 bg-white px-4 py-3 text-xs tracking-wider uppercase outline-none placeholder:text-gray-400 border border-[#1A1A1A] border-r-0";

  return (
    <div className="bg-[#F4F1EA] min-h-screen w-full font-sans text-[#1A1A1A]">
      {/* Hero */}
      <div className="bg-[#1A1A1A] text-[#F4F1EA] border-b border-[#1A1A1A]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-end px-6 sm:px-8 lg:px-10 xl:px-14 py-10 lg:py-16">
          <h1 className="font-black text-[42px] sm:text-[52px] lg:text-[64px] xl:text-[76px] leading-[0.95] lg:leading-[0.9] tracking-tight uppercase mb-0">
            Find <br /> Your Next <br /> Event
          </h1>

          <div>
            <p className="text-sm leading-6 text-[#E8491D] mb-6 max-w-md lg:ml-auto">
              Discover cozy festivals, craft workshops, and epic quests in your
              area. Curated events for the discerning attendee.
            </p>

            <div className="flex max-w-md lg:ml-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH EVENTS, ARTISTS, VENUES..."
                className={inputClass}
              />
              <button className="w-12 flex items-center justify-center bg-[#E8491D] text-[#F4F1EA] border border-[#E8491D] hover:bg-[#c73e17] transition-colors">
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14">
        <div className="flex items-center justify-between gap-4 pt-6 sm:pt-8 pb-5 sm:pb-6">
          <div className="flex gap-6 sm:gap-8 text-sm font-extrabold tracking-wider uppercase overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`pb-1 whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat
                    ? "border-[#E8491D] text-[#1A1A1A]"
                    : "border-transparent text-[#8A8578] hover:text-[#1A1A1A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event grid */}
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 pb-16 lg:pb-20">
        {loading && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center">
            Loading events...
          </p>
        )}

        {!loading && error && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#E8491D]">
            {error}
          </p>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <p className="text-sm font-semibold uppercase tracking-wide py-10 text-center text-[#8A8578]">
            No events found.
          </p>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 border-t border-l border-[#1A1A1A]">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="group flex flex-col text-left border-r border-b border-[#1A1A1A] bg-[#F4F1EA] hover:bg-white transition-colors"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-[#1A1A1A]">
                  <img
                    src={
                      event.eventImage ||
                      "https://via.placeholder.com/800x600?text=No+Image"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white border border-[#1A1A1A] text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-2">
                    {event.category}
                  </p>
                  <h3 className="font-black text-lg lg:text-xl leading-tight uppercase mb-4">
                    {event.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#4a463c] truncate">
                      {event.location}
                    </span>
                    <span className="text-[#E8491D] text-lg group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A]">
        <div className="px-6 sm:px-8 lg:px-10 xl:px-14 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="font-black text-[13px] uppercase tracking-wide">
            Event.Book
          </div>
          <div className="flex gap-5 text-[10.5px] font-semibold tracking-wider uppercase text-[#4a463c]">
            <span>Terms</span> <span>Privacy</span> <span>Contact</span>
          </div>
        </div>
      </footer>

      {/* ✅ Modal แสดงรายละเอียด + ปุ่มจอง */}
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onBooked={() => {
            // ถ้าต้องการ refresh รายการ event หลังจองสำเร็จ ทำได้ที่นี่
          }}
          onDeleted={(deletedId) => {
            setEvents((prev) => prev.filter((e) => e.id !== deletedId)); // ✅ เอา event ที่ลบออกจาก state ทันที
          }}
        />
      )}
    </div>
  );
}

export default Home;
