import React from "react";

// จำนวนที่นั่งว่าง + หลอดแสดงสัดส่วนที่ถูกจองแล้ว
// _count.bookings = จำนวนการจองที่ยังไม่ยกเลิก (มาจาก API)
function SeatsBar({ event }) {
  const booked = event._count?.bookings ?? 0;
  const capacity = event.capacity || 0;
  const seatsLeft = Math.max(capacity - booked, 0);
  const fillRate = capacity ? Math.min((booked / capacity) * 100, 100) : 0;

  const isPast = new Date(event.eventDate) <= new Date();
  // งานที่ผ่านไปแล้วถือว่าปิดรับ (API ก็ไม่ให้จองแล้ว)
  const isOpen = event.status === "OPEN" && !isPast;
  const soldOut = isOpen && seatsLeft === 0;
  // เหลือน้อย = ไม่เกิน 5 ที่ หรือถูกจองไปแล้ว 80% ขึ้นไป
  const almostFull = isOpen && !soldOut && (seatsLeft <= 5 || fillRate >= 80);

  let label = `${seatsLeft} ${seatsLeft === 1 ? "seat" : "seats"} left`;
  if (event.status === "CANCELLED") label = "Cancelled";
  else if (isPast) label = "Ended";
  else if (!isOpen) label = "Closed";
  else if (soldOut) label = "Sold out";
  else if (almostFull) label = `Only ${seatsLeft} left`;

  const highlight = soldOut || almostFull || event.status === "CANCELLED";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span
          className={`text-[11px] font-extrabold tracking-wider uppercase ${
            highlight
              ? "text-[#E8491D]"
              : isOpen
                ? "text-[#1A1A1A]"
                : "text-[#8A8578]"
          }`}
        >
          {label}
        </span>
        <span className="text-[10.5px] font-semibold text-[#8A8578] tabular-nums">
          {booked}/{capacity}
        </span>
      </div>
      <div
        role="meter"
        aria-label="Seats booked"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={booked}
        className="h-1.5 bg-[#1A1A1A]/10"
      >
        <div
          // group-hover: hover ที่การ์ด (มี class "group") แล้วหลอดเปลี่ยนเป็นสีส้ม
          className={`h-full transition-[width,background-color] duration-500 group-hover:bg-[#E8491D] ${
            !isOpen
              ? "bg-[#8A8578]"
              : highlight
                ? "bg-[#E8491D]"
                : "bg-[#1A1A1A]"
          }`}
          style={{ width: `${fillRate}%` }}
        />
      </div>
    </div>
  );
}

export default SeatsBar;
