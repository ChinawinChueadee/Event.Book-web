import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import useUserStore from "../stores/userStore";
import UserLayout from "../layouts/UserLayout";

const guestRouter = createBrowserRouter([
  { path: "/", Component: Login },
  { path: "*", element: <Navigate to="/" /> },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    Component: UserLayout,
    children: [
      { path: "", Component: Home },
      { path: "profile", Component: Profile },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
function AppRouter() {
  const user = useUserStore((state) => state.user);
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider key={user} router={finalRouter} />;
}

export default AppRouter;
