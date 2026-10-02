import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Tickets from "../pages/Tickets";
import Host from "../pages/Host";
import Admin from "../pages/Admin";
import ResetPassword from "../pages/ResetPassword";
import UserLayout from "../layouts/UserLayout";
import RequireAuth from "./RequireAuth";

// router เดียวสำหรับทุกคน: หน้า Home ดูได้โดยไม่ต้องล็อกอิน
// หน้าอื่นอยู่ใต้ RequireAuth ซึ่งจะพาไปหน้า /login ก่อน
const router = createBrowserRouter([
  {
    path: "/",
    Component: UserLayout,
    children: [
      { index: true, Component: Home },
      {
        Component: RequireAuth,
        children: [
          { path: "profile", Component: Profile },
          { path: "tickets", Component: Tickets },
          { path: "host", Component: Host },
          { path: "admin", Component: Admin },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/reset-password", Component: ResetPassword },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
