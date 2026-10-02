import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Header from "../components/Header";
import AddEvent from "../components/AddEvent";
import { useState } from "react";
import useUserStore from "../stores/userStore";

function UserLayout() {
  const [showAddEvent, setShowAddEvent] = useState(false);
  // เพิ่มค่าเมื่อมี event ใหม่ → หน้า Home / Host ที่ใช้ค่านี้จะ re-fetch
  const [eventsVersion, setEventsVersion] = useState(0);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  // ยังไม่ล็อกอิน → ไปหน้า Login ก่อน แล้วกลับมาหน้าเดิม
  const openAddEvent = () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    setShowAddEvent(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col">
      <Header onAddEvent={openAddEvent} />

      <Outlet context={{ eventsVersion, openAddEvent }} />

      <footer className="mt-auto border-t border-[#1A1A1A] text-[#1A1A1A]">
        <div className="px-6 sm:px-8 lg:px-10 xl:px-14 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="font-black text-[13px] uppercase tracking-wide">
            Event.Book
          </div>
          <div className="flex gap-5 text-[10.5px] font-semibold tracking-wider uppercase text-[#4a463c]">
            <span>Terms</span> <span>Privacy</span> <span>Contact</span>
          </div>
        </div>
      </footer>

      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onSaved={() => {
            setEventsVersion((v) => v + 1);
            toast.success("Event created");
          }}
        />
      )}
    </div>
  );
}

export default UserLayout;
