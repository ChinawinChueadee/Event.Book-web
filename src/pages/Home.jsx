import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import useUserStore from "../stores/userStore";

const categories = ["MUSIC", "ART", "DESIGN", "TALKS"];

const events = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop",
    tag: "TECHNO / INDUSTRIAL",
    date: "24.10.2024",
    title: "Berlin Underground Warehouse Rave",
    venue: "Tresor, Kraftwerk",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    tag: "SYNTHESIS / WORKSHOP",
    date: "12.11.2024",
    title: "Modular Sound Design Masterclass",
    venue: "The Grid Auditorium",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800&auto=format&fit=crop",
    tag: "EXPERIMENTAL / AMBIENT",
    date: "05.12.2024",
    title: "Drone Music Installation",
    venue: "Kunsthaus Zürich",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
    tag: "JAZZ / AVANT-GARDE",
    date: "18.12.2024",
    title: "Improvisation Sessions: Quartet X",
    venue: "Blue Note Basel",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
    tag: "DESIGN / LECTURE",
    date: "24.10.2024",
    title: "Modernist Typography Symposium",
    venue: "Kunsthaus Zürich",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
    tag: "ARCHITECTURE / TOUR",
    date: "02.11.2024",
    title: "Structural Rhythms: Concrete Walk",
    venue: "Bauhaus Archive Berlin",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("MUSIC");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const inputClass =
    "flex-1 bg-white px-4 py-3 text-xs tracking-wider uppercase outline-none placeholder:text-gray-400 border border-[#1A1A1A] border-r-0";

  return (
    <div className="bg-[#F4F1EA] min-h-screen w-full font-sans text-[#1A1A1A]">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 px-6 sm:px-8 lg:px-10 xl:px-14 py-4 border-b border-[#1A1A1A] sticky top-0 bg-[#F4F1EA] z-10">
        <span className="text-base">☰</span>
        <span className="font-black text-[15px] tracking-wide uppercase">
          Event.Book
        </span>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider uppercase ml-10">
          <a href="#" className="hover:text-[#E8491D]">
            Discover
          </a>
          <a href="#" className="hover:text-[#E8491D]">
            Saved
          </a>
          <a href="#" className="hover:text-[#E8491D]">
            Tickets
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Username — hidden on small screens to save space */}
          {user && (
            <span className="hidden sm:inline text-[11px] font-bold tracking-wide uppercase text-[#4a463c]">
              {user.username || user.email}
            </span>
          )}

          <button className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]">
            🔍
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#E8491D] hover:border-[#E8491D] transition-colors"
          >
            ⏻
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 pt-10 lg:pt-16 pb-10 border-b border-[#1A1A1A]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-end max-w-[1400px] mx-auto">
          <h1 className="font-black text-[42px] sm:text-[52px] lg:text-[64px] xl:text-[76px] leading-[0.95] lg:leading-[0.9] tracking-tight uppercase mb-0">
            Find <br /> Your Next <br /> Event
          </h1>

          <div>
            <p className="text-sm leading-6 text-[#4a463c] mb-6 max-w-md lg:ml-auto">
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
              <button className="w-12 flex items-center justify-center bg-[#1A1A1A] text-[#F4F1EA] border border-[#1A1A1A]">
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 max-w-[1400px] mx-auto">
        <div className="flex gap-8 py-5 text-sm font-extrabold tracking-wider uppercase overflow-x-auto">
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

      {/* Event grid */}
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 pb-16 lg:pb-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#1A1A1A]">
          {events.map((event) => (
            <a
              key={event.id}
              href="#"
              className="group border-r border-b border-[#1A1A1A] bg-[#F4F1EA] hover:bg-white transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[#1A1A1A]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="absolute top-3 right-3 bg-white border border-[#1A1A1A] text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                  {event.date}
                </span>
              </div>

              <div className="p-5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#8A8578] mb-2">
                  {event.tag}
                </p>
                <h3 className="font-black text-lg lg:text-xl leading-tight uppercase mb-4">
                  {event.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4a463c]">
                    {event.venue}
                  </span>
                  <span className="text-[#E8491D] text-lg group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] px-6 sm:px-8 lg:px-10 xl:px-14 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="font-black text-[13px] uppercase tracking-wide">
          Event.Book
        </div>
        <div className="flex gap-3.5 text-[9.5px] font-semibold tracking-wide uppercase">
          <span>Terms</span> <span>Privacy</span> <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
