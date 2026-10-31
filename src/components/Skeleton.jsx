import React from "react";

// กล่องเทากระพริบแทนข้อมูลที่กำลังโหลด
export function SkeletonBlock({ className = "" }) {
  return <div className={`bg-[#1A1A1A]/10 animate-pulse ${className}`} />;
}

// การ์ด event หน้า Home — โครงเดียวกับการ์ดจริง (รูป 4:3, หมวด, ชื่อ, หลอดที่นั่ง, สถานที่)
export function EventGridSkeleton({ count = 6 }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading events"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 border-t border-l border-[#1A1A1A]"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col border-r border-b border-[#1A1A1A] bg-[#F4F1EA]"
        >
          <SkeletonBlock className="aspect-[4/3] border-b border-[#1A1A1A]" />
          <div className="p-5 flex flex-col">
            <SkeletonBlock className="h-2.5 w-16 mb-3" />
            <SkeletonBlock className="h-5 w-4/5 mb-2" />
            <SkeletonBlock className="h-5 w-1/2 mb-6" />
            <SkeletonBlock className="h-2.5 w-24 mb-2" />
            <SkeletonBlock className="h-1.5 w-full mb-5" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// แถวรายการ (Tickets / Host / Admin)
export function ListSkeleton({ rows = 3, withImage = false }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading"
      className="border border-[#1A1A1A] bg-white divide-y divide-[#1A1A1A]"
    >
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-4 px-4 py-4">
          {withImage && (
            <SkeletonBlock className="w-24 sm:w-32 aspect-[4/3] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <SkeletonBlock className="h-2.5 w-16 mb-2.5" />
            <SkeletonBlock className="h-4 w-3/5 mb-2" />
            <SkeletonBlock className="h-3 w-2/5" />
          </div>
          <SkeletonBlock className="hidden sm:block h-8 w-24" />
        </li>
      ))}
    </ul>
  );
}
