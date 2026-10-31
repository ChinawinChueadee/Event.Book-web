import React from "react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useServerStatusStore from "../stores/serverStatusStore";

// กล่องแจ้งกลางจอ แสดงเมื่อมี request ที่ช้า (server กำลังตื่นจากการหลับ)
function ServerWakeNotice() {
  const waking = useServerStatusStore((state) => state.slowRequests > 0);

  if (!waking) return null;
  // WakeCard ถูก mount ใหม่ทุกครั้งที่เริ่มแสดง → ตัวนับวินาทีเริ่มนับใหม่
  return <WakeCard />;
}

function WakeCard() {
  const [seconds, setSeconds] = useState(4); // แสดงหลังจากช้าไปแล้ว ~4 วินาที

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    // คลุมทั้งจอ แล้ววางกล่องไว้กลางจอ
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#F4F1EA]/70 backdrop-blur-[2px]">
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-sm bg-[#1A1A1A] text-[#F4F1EA] border border-[#1A1A1A] shadow-[8px_8px_0_#E8491D] px-7 py-8 text-center"
      >
        <Loader2
          size={40}
          strokeWidth={2.25}
          className="mx-auto mb-5 animate-spin text-[#E8491D]"
        />
        <p className="text-sm font-extrabold tracking-wider uppercase">
          Waking up the server…
        </p>
        <p className="text-[#8A8578] text-xs font-bold tabular-nums mt-1">
          {seconds}s
        </p>
        <p className="text-xs leading-5 text-[#cfcabf] mt-4">
          {seconds < 20
            ? "The server sleeps when nobody is using it. This can take up to a minute — please keep this page open."
            : "Almost there… the first load after a quiet period is the slowest. Thanks for waiting!"}
        </p>
        {/* หลอดวิ่งแบบไม่รู้เวลาที่แน่นอน */}
        <div className="mt-6 h-1 bg-[#F4F1EA]/15 overflow-hidden">
          <div className="h-full w-1/3 bg-[#E8491D] animate-[wake-progress_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

export default ServerWakeNotice;
