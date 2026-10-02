import React from "react";
import { Ticket } from "lucide-react";

// โลโก้ Event.Book: ไอคอนตั๋วในกล่องสีส้ม + ชื่อแบรนด์
function BrandLogo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="w-7 h-7 flex items-center justify-center bg-[#E8491D] text-white">
        <Ticket size={16} strokeWidth={2.5} />
      </span>
      <span className="font-black text-[15px] tracking-wide uppercase">
        Event.Book
      </span>
    </span>
  );
}

export default BrandLogo;
