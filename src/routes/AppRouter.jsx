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

const guestRouter = createBrowserRouter([
  { path: "/", Component: Login },
  { path: "*", element: <Navigate to="/" /> },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <p className="py-4 border">Header</p>
        <Outlet />
      </>
    ),
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
  return <RouterProvider key={user?.id} router={finalRouter} />;
}

export default AppRouter;
