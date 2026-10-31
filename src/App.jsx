import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./routes/AppRouter";
import ServerWakeNotice from "./components/ServerWakeNotice";
import { preloadCategories } from "./hooks/useCategories";

function App() {
  // ปลุก server ทันทีที่เปิดแอป (รวมหน้า Login) ไม่ต้องรอผู้ใช้กดอะไร
  useEffect(() => {
    preloadCategories();
  }, []);

  return (
    <>
      <AppRouter />
      <ServerWakeNotice />
      <ToastContainer />
    </>
  );
}

export default App;
