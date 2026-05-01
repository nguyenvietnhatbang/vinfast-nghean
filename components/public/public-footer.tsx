"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { usePublicSiteCars } from "./public-site-cars-context";

function FacebookIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export function PublicFooter() {
  const { currentCars, settings } = usePublicSiteCars();

  const companyName = settings.company_name || "VINFAST VINH";
  const phoneNumber = settings.phone_number || "0961.194.881";
  const zaloLink = settings.zalo_link || `https://zalo.me/${phoneNumber.replace(/\./g, '')}`;
  const email = settings.email || "vinfastnghean1@gmail.com";
  const address = settings.address || "Số 79 Đại lộ Lê Nin, Tp. Vinh, Nghệ An";
  const siteName = settings.site_name || "VinFast Nghệ An";

  return (
    <footer className="bg-[#0F172A] text-slate-300 py-16 md:py-24 border-t-4 border-[#E11D48]">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="space-y-6">
          <h3 className="text-white font-bold text-[20px] uppercase tracking-wide">
            {companyName}
          </h3>
          <div className="w-12 h-1 bg-[#E11D48]" />
          <p className="text-[15px] leading-relaxed text-slate-400">
            Đại lý ủy quyền chính thức của VinFast tại Nghệ An. Chúng tôi cam kết
            mang đến những sản phẩm chất lượng và dịch vụ hậu mãi vượt trội.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={settings.facebook_link || "#"}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#E11D48] transition-colors text-white"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href={settings.youtube_link || "#"}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#E11D48] transition-colors text-white"
            >
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-[18px] uppercase tracking-wide">
            SẢN PHẨM MỚI
          </h3>
          <div className="w-12 h-1 bg-[#E11D48]" />
          <ul className="space-y-3 text-[15px]">
            {currentCars.map((car) => (
              <li key={car.slug || car.name}>
                <Link
                  href={`/chi-tiet-xe/${car.slug || ""}`}
                  className="flex items-center gap-2 hover:text-[#E11D48] transition-colors group"
                >
                  <ChevronRight
                    size={14}
                    className="text-slate-500 group-hover:text-[#E11D48] transition-colors"
                  />{" "}
                  {car.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-[18px] uppercase tracking-wide">
            HỖ TRỢ KHÁCH HÀNG
          </h3>
          <div className="w-12 h-1 bg-[#E11D48]" />
          <ul className="space-y-3 text-[15px] mb-6">
            {["Bảng giá lắp đặt", "Chính sách bảo hành", "Câu hỏi thường gặp"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-[#E11D48] transition-colors group"
                  >
                    <ChevronRight
                      size={14}
                      className="text-slate-500 group-hover:text-[#E11D48] transition-colors"
                    />{" "}
                    {item}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link
                href="/brochure"
                className="flex items-center gap-2 hover:text-[#E11D48] transition-colors group"
              >
                <ChevronRight
                  size={14}
                  className="text-slate-500 group-hover:text-[#E11D48] transition-colors"
                />{" "}
                Tải Brochure
              </Link>
            </li>
          </ul>
          <Link
            href="/dang-ky-lai-thu"
            className="inline-flex items-center justify-center w-full bg-[#E11D48] hover:bg-rose-700 text-white py-3.5 rounded-lg text-[15px] font-bold transition-all shadow-md uppercase tracking-wide"
          >
            Đăng ký lái thử
          </Link>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-[18px] uppercase tracking-wide">
            LIÊN HỆ
          </h3>
          <div className="w-12 h-1 bg-[#E11D48]" />
          <ul className="space-y-4 text-[15px]">
            <li className="flex items-start gap-3 text-slate-400">
              <MapPin size={20} className="text-[#E11D48] shrink-0 mt-0.5" />
              <span>
                {address}
              </span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Phone size={20} className="text-[#E11D48] shrink-0" />
              <span>
                Hotline:{" "}
                <a
                  href={zaloLink}
                  className="text-white hover:text-[#E11D48] transition-colors font-bold text-[16px]"
                >
                  {phoneNumber}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Mail size={20} className="text-[#E11D48] shrink-0" />
              <span>{email}</span>
            </li>
          </ul>
          <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden mt-4 relative group cursor-pointer border border-slate-700">
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <span className="bg-white text-[#0F172A] px-4 py-2 rounded-full font-bold text-sm">
                Xem bản đồ
              </span>
            </div>
            <Image
              src="/baner/imgi_4_4.jpg"
              alt="Map Placeholder"
              fill
              className="object-cover opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[14px] text-slate-500">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
        <div className="flex gap-4 text-[14px] text-slate-500">
          <Link href="#" className="hover:text-white transition-colors">
            Điều khoản sử dụng
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Chính sách bảo mật
          </Link>
        </div>
      </div>
    </footer>
  );
}
