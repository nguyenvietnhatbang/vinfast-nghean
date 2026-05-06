"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Menu, X, ChevronRight } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteName = settings.site_name || "VinFast Nghệ An";
  const phoneNumber = settings.phone_number || "0961.194.881";
  const zaloLink = settings.zalo_link || `https://zalo.me/${phoneNumber.replace(/\./g, '')}`;
  const email = settings.email || "vinfastnghean1@gmail.com";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
          <button 
            className="md:hidden p-2 text-black hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">MENU</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <Link href="/" className="block px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            Trang chủ
          </Link>
          
          <div className="px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span>Sản phẩm</span>
            </div>
            <div className="pl-4 flex flex-col gap-3 mt-3 font-normal text-sm text-gray-600">
              {currentCars.map((car) => (
                <Link key={car.slug} href={`/chi-tiet-xe/${car.slug}`} onClick={() => setIsMenuOpen(false)}>
                  {car.name}
                </Link>
              ))}
              {serviceCars.map((car) => (
                <Link key={car.slug} href={`/chi-tiet-xe/${car.slug}`} onClick={() => setIsMenuOpen(false)}>
                  {car.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/su-kien" className="block px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            Sự kiện
          </Link>
          <Link href="/dang-ky-lai-thu" className="block px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            Đăng ký lái thử
          </Link>
          <Link href="/su-kien" className="block px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            Ưu đãi
          </Link>
          <Link href="/brochure" className="block px-6 py-3 font-bold text-gray-800 border-b border-gray-50">
            Brochure
          </Link>
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 text-[#c8102e] font-bold">
            <Phone size={18} fill="currentColor" />
            {phoneNumber}
          </a>
        </div>
      </div>
    </header>
  );
}
