import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Tickets from "../pages/Tickets";
import Host from "../pages/Host";
import Admin from "../pages/Admin";
import ResetPassword from "../pages/ResetPassword";
import useUserStore from "../stores/userStore";
import UserLayout from "../layouts/UserLayout";

const guestRouter = createBrowserRouter([
  { path: "/", Component: Login },
  { path: "/reset-password", Component: ResetPassword },
  { path: "*", element: <Navigate to="/" /> },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    Component: UserLayout,
    children: [
      { path: "", Component: Home },
      { path: "profile", Component: Profile },
      { path: "tickets", Component: Tickets },
      { path: "host", Component: Host },
      { path: "admin", Component: Admin },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  { path: "/reset-password", Component: ResetPassword },
]);
function AppRouter() {
  const user = useUserStore((state) => state.user);
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider key={user} router={finalRouter} />;
}

export default AppRouter;
