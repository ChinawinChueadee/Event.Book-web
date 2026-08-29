import React from "react";
import { useNavigate } from "react-router";
import useUserStore from "../stores/userStore";

function Header({ onAddEvent }) {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex  items-center gap-2.5 px-6 sm:px-8 lg:px-10 xl:px-14 py-4 border-b border-[#1A1A1A] fixed top-0 bg-[#F4F1EA] z-10 left-0 right-0">
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

          {/* Add Event button */}
          <button
            type="button"
            onClick={onAddEvent}
            className="hidden sm:flex items-center gap-1.5 bg-[#E8491D] text-white border border-[#1A1A1A] px-3.5 py-2 text-[11px] font-extrabold tracking-wider uppercase hover:bg-[#c73e17] transition-colors"
          >
            <span className="text-sm leading-none">+</span> Add Event
          </button>

          {/* Compact icon-only version for mobile */}
          <button
            type="button"
            onClick={onAddEvent}
            title="Add Event"
            className="sm:hidden w-8 h-8 flex items-center justify-center border border-[#1A1A1A] bg-[#E8491D] text-white"
          >
            +
          </button>

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
    </div>
  );
}

export default Header;
