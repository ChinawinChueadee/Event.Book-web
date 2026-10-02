import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { LogIn, Menu, Plus, Power, Search, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import useUserStore from "../stores/userStore";

const navItems = [
  { to: "/", label: "Discover" },
  { to: "/tickets", label: "My Tickets" },
  { to: "/host", label: "Hosting" },
  { to: "/profile", label: "Profile" },
];

const navClass = ({ isActive }) =>
  isActive ? "text-[#E8491D]" : "hover:text-[#E8491D]";

function Header({ onAddEvent }) {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links =
    user?.role === "ADMIN"
      ? [...navItems, { to: "/admin", label: "Admin" }]
      : navItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ไปหน้า Discover แล้วโฟกัสช่องค้นหา
  const handleSearch = () => {
    setMenuOpen(false);
    navigate("/");
    setTimeout(() => document.getElementById("event-search")?.focus(), 0);
  };

  return (
    <header className="sticky top-0 z-10 bg-[#F4F1EA] border-b border-[#1A1A1A] text-[#1A1A1A]">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 px-6 sm:px-8 lg:px-10 xl:px-14 py-4">
        {/* Menu toggle — ใช้เฉพาะจอเล็ก (lg ขึ้นไปมี nav แสดงอยู่แล้ว) */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          title="Menu"
          className="lg:hidden w-9 h-9 -ml-2 flex items-center justify-center"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link to="/" aria-label="Event.Book home">
          <BrandLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider uppercase ml-10">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Username — hidden on small screens to save space */}
          {user && (
            <Link
              to="/profile"
              className="hidden sm:inline text-[11px] font-bold tracking-wide uppercase text-[#4a463c] hover:text-[#E8491D]"
            >
              {user.username || user.email}
            </Link>
          )}

          {/* Add Event button */}
          <button
            type="button"
            onClick={onAddEvent}
            className="hidden sm:flex items-center gap-1.5 h-9 bg-[#E8491D] text-white border border-[#1A1A1A] px-3.5 text-[11px] font-extrabold tracking-wider uppercase hover:bg-[#c73e17] transition-colors"
          >
            <Plus size={14} strokeWidth={3} /> Add Event
          </button>

          {/* Compact icon-only version for mobile */}
          <button
            type="button"
            onClick={onAddEvent}
            title="Add Event"
            className="sm:hidden w-9 h-9 flex items-center justify-center border border-[#1A1A1A] bg-[#E8491D] text-white"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={handleSearch}
            title="Search events"
            className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A] hover:bg-white transition-colors"
          >
            <Search size={16} strokeWidth={2.5} />
          </button>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#E8491D] hover:border-[#E8491D] transition-colors"
            >
              <Power size={16} strokeWidth={2.5} />
            </button>
          ) : (
            // ยังไม่ล็อกอิน → ปุ่ม Sign In แทน Logout
            <Link
              to="/login"
              title="Sign In"
              className="h-9 flex items-center gap-1.5 px-3 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F4F1EA] text-[11px] font-extrabold tracking-wider uppercase hover:bg-[#E8491D] hover:border-[#E8491D] transition-colors"
            >
              <LogIn size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-[#1A1A1A] px-6 sm:px-8 flex flex-col text-xs font-bold tracking-wider uppercase">
          {user && (
            <span className="sm:hidden py-3.5 border-b border-[#1A1A1A]/20 text-[#8A8578]">
              {user.username || user.email}
            </span>
          )}
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMenuOpen(false)}
              className={(state) =>
                `py-3.5 border-b border-[#1A1A1A]/20 last:border-b-0 ${navClass(state)}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
