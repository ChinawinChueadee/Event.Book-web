import { Navigate, Outlet, useLocation, useOutletContext } from "react-router";
import useUserStore from "../stores/userStore";

// หน้าที่ต้องล็อกอิน: ถ้ายังไม่ล็อกอิน → ไปหน้า /login แล้วจำหน้าเดิมไว้ใน state.from
function RequireAuth() {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  // ส่ง context จาก UserLayout (eventsVersion, openAddEvent) ต่อให้หน้าข้างใน
  // ถ้าไม่ส่ง หน้าอย่าง Host จะได้ useOutletContext() เป็น undefined
  const outletContext = useOutletContext();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return <Outlet context={outletContext} />;
}

export default RequireAuth;
