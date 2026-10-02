import React from "react";

// หัวหน้าเพจโทนเดียวกับ Hero ของหน้า Home
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="bg-[#1A1A1A] text-[#F4F1EA] border-b border-[#1A1A1A]">
      <div className="px-6 sm:px-8 lg:px-10 xl:px-14 py-10 lg:py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="font-black text-[38px] sm:text-[46px] lg:text-[56px] leading-[0.95] tracking-tight uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm leading-6 text-[#E8491D] mt-4 max-w-md">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

export default PageHeader;
