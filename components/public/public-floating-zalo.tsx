"use client";

import { Phone } from "lucide-react";
import { usePublicSiteCars } from "./public-site-cars-context";

export function PublicFloatingZalo() {
  const { settings } = usePublicSiteCars();
  const phoneNumber = settings.phone_number || "0961.194.881";
  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const zaloLink =
    settings.zalo_link || `https://zalo.me/${phoneDigits || phoneNumber.replace(/\./g, "")}`;

  return (
    <>
      <a
        href={phoneDigits ? `tel:${phoneDigits}` : `tel:${phoneNumber}`}
        className="fixed bottom-6 left-6 z-50 flex items-center group cursor-pointer"
        aria-label={`Gọi ${phoneNumber}`}
      >
        <div className="bg-[#E11D48] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-10 hover:bg-rose-700 transition-colors">
          <Phone size={24} className="fill-current" />
        </div>
        <div className="bg-[#E11D48] text-white font-bold px-5 py-2.5 rounded-r-full -ml-6 pr-8 shadow-xl transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0">
          {phoneNumber}
        </div>
      </a>

      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center group cursor-pointer"
        aria-label="Mở Zalo"
      >
        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-10 border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/3840px-Icon_of_Zalo.svg.png"
            alt="Zalo"
            className="w-8 h-8 object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="bg-[#0F172A] text-white font-bold px-5 py-2.5 rounded-r-full -ml-6 pr-8 shadow-xl transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0">
          Zalo
        </div>
      </a>
    </>
  );
}
