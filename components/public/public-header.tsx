"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePublicSiteCars } from "./public-site-cars-context";

function navItemClass(active: boolean) {
  return `transition-colors py-2 ${active ? "text-[#c8102e]" : "hover:text-[#c8102e]"}`;
}

export function PublicHeader() {
  const pathname = usePathname() ?? "";
  const { currentCars, serviceCars, settings } = usePublicSiteCars();
  const [isScrolled, setIsScrolled] = useState(false);

  const siteName = settings.site_name || "VinFast Hoàn";
  const phoneNumber = settings.phone_number || "0961.194.881";
  const zaloLink = settings.zalo_link || `https://zalo.me/${phoneNumber.replace(/\./g, '')}`;
  const email = settings.email || "vinfastnghean1@gmail.com";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productsActive = pathname.startsWith("/chi-tiet-xe");

  return (
    <header className="w-full bg-white border-b border-gray-300 sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4">
        <div
          className={`flex justify-end items-center py-2 text-xs text-gray-700 gap-6 border-b border-gray-200 hidden md:flex transition-all duration-300 overflow-hidden ${isScrolled ? "h-0 py-0 border-none opacity-0" : "h-10"}`}
        >
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold hover:opacity-80 transition-opacity"
          >
            <Phone size={14} className="text-[#c8102e] fill-current" />
            <span className="text-[#c8102e]">{phoneNumber}</span>
          </a>
          <div className="flex items-center gap-1.5">
            <Mail size={14} className="text-[#c8102e]" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#c8102e] text-white px-1.5 py-0.5 text-[11px] font-bold">
              FB
            </div>
            <div className="bg-[#c8102e] text-white px-1.5 py-0.5 text-[11px] font-bold">
              YT
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src="/logo/imgi_1_r3.png"
                fill
                alt="Logo"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-bold uppercase tracking-wide text-black">
                {siteName}
              </span>
            </div>
          </Link>
          <div className="md:hidden">
            <Menu size={28} className="text-black" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold text-black uppercase tracking-wider">
            <Link
              href="/"
              className={navItemClass(pathname === "/")}
            >
              Trang chủ
            </Link>

            <div className="group relative py-2 cursor-pointer">
              <span
                className={`flex items-center gap-1 transition-colors ${productsActive ? "text-[#c8102e]" : "hover:text-[#c8102e]"}`}
              >
                Sản phẩm
              </span>
              <div className="absolute top-full left-0 bg-[#e08e0b] min-w-[220px] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col">
                {currentCars.map((car) => (
                  <Link
                    key={car.slug || car.name}
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="text-white hover:bg-white/20 px-4 py-3 border-b border-white/10 text-[14px] font-normal"
                  >
                    {car.name}
                  </Link>
                ))}
                {serviceCars.map((car) => (
                  <Link
                    key={car.slug || car.name}
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="text-white hover:bg-white/20 px-4 py-3 border-b border-white/10 text-[14px] font-normal"
                  >
                    {car.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/su-kien"
              className={navItemClass(pathname === "/su-kien")}
            >
              Sự kiện
            </Link>
            <Link
              href="/dang-ky-lai-thu"
              className={navItemClass(pathname === "/dang-ky-lai-thu")}
            >
              Đăng ký lái thử
            </Link>
            <Link
              href="/su-kien"
              className={navItemClass(pathname === "/su-kien")}
            >
              Ưu đãi
            </Link>
            <Link
              href="/brochure"
              className={navItemClass(pathname === "/brochure")}
            >
              Brochure
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
