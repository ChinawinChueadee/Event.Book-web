import { Outlet } from "react-router";
import Header from "../components/Header";
import AddEvent from "../components/AddEvent";
import { useState } from "react";

function UserLayout() {
  const [showAddEvent, setShowAddEvent] = useState(false);
  return (
    <div className="min-h-screen">
      <Header onAddEvent={() => setShowAddEvent(true)} />

      <Outlet />

      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onCreated={() => {
            // ถ้าอยากรีเฟรชรายการ event หลังสร้างสำเร็จ ทำได้ที่นี่
            // เช่นเก็บ trigger ใน store แล้วให้ Home.jsx re-fetch
          }}
        />
      )}
    </div>
  );
}

export default UserLayout;
