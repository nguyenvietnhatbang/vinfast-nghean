"use client";

import Link from "next/link";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

function HomeContent() {
  const banners = [
    "/baner/imgi_4_4.jpg",
    "/baner/imgi_5_2.jpg",
    "/baner/imgi_6_1.jpg",
    "/baner/imgi_7_3.jpg",
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const { currentCars, serviceCars, isLoading } = usePublicSiteCars();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () =>
    setCurrentBanner(
      (prev) => (prev - 1 + banners.length) % banners.length
    );

  const news = [
    {
      img: "/news/imgi_21_1.jpg",
      title:
        "VINFAST CHÍNH THỨC NHẬN ĐẶT CỌC DÒNG XE VF 5 PLUS TẠI THỊ TRƯỜNG VIỆT NAM",
    },
    {
      img: "/news/imgi_23_1.jpg",
      title: "VINFAST VF 7 CHÍNH THỨC NHẬN ĐẶT HÀNG TỪ NGÀY 02/12",
    },
    {
      img: "/news/imgi_24_z6030656124576_21079383d4ca1577cab231771bdd1f0d.jpg",
      title: "THU CŨ ĐỔI MỚI CÙNG FGF - TỰ HÀO THƯƠNG HIỆU VIỆT",
    },
    {
      img: "/news/imgi_26_5.jpg",
      title:
        "VINFAST ƯU ĐÃI LỚN CHO KHÁCH HÀNG TẠI VIỆT NAM NHÂN DỊP CUỐI NĂM",
    },
  ];

  return (
    <>
      <div className="relative w-full overflow-hidden bg-[#0F172A] h-[300px] sm:h-[400px] md:h-[550px] lg:h-[650px] group">
        {banners.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
              index === currentBanner
                ? "opacity-100 z-10 scale-105"
                : "opacity-0 z-0 scale-100"
            }`}
          />
        ))}

        <button
          type="button"
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-[#E11D48] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-[#E11D48] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentBanner
                  ? "w-8 bg-[#E11D48]"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      <section className="bg-[#F8FAFC] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] uppercase mb-4 tracking-tight">
              Các Dòng Xe VinFast Hiện Nay
            </h2>
            <div className="w-20 h-[3px] bg-[#E11D48] mx-auto rounded-full mb-6"></div>
            <p className="text-[#334155] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập xe điện thông minh đẳng cấp từ VinFast, mang đến
              trải nghiệm lái vượt trội và hướng tới tương lai di chuyển xanh.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCars.map((car, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100"
                >
                  <Link
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="w-full h-72 bg-white flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-1 border-t border-gray-50">
                    <h3 className="text-[22px] font-bold text-[#0F172A] mb-3 uppercase tracking-wide">
                      {car.name}
                    </h3>
                    <p className="text-[#334155] text-[15px] mb-6 line-clamp-2 leading-relaxed">
                      {car.desc}
                    </p>
                    <div className="mt-auto">
                      <p className="text-[#334155] text-[14px] mb-1 font-medium uppercase tracking-wider text-gray-500">
                        Giá bán từ
                      </p>
                      <p className="text-[20px] font-bold text-[#E11D48] mb-8">
                        {car.price}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/chi-tiet-xe/${car.slug || ""}`}
                          className="w-full text-center bg-[#E11D48] hover:bg-rose-700 text-white py-3 rounded-lg text-[15px] font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] uppercase mb-4 tracking-tight">
              Các Dòng Xe Dịch Vụ
            </h2>
            <div className="w-20 h-[3px] bg-[#E11D48] mx-auto rounded-full mb-6"></div>
            <p className="text-[#334155] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
              Giải pháp vận tải thông minh, tiết kiệm và thân thiện với môi
              trường dành riêng cho doanh nghiệp.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCars.map((car, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-200"
                >
                  <Link
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="w-full h-72 bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden"
                  >
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-3 uppercase tracking-wide">
                      {car.name}
                    </h3>
                    <p className="text-[#334155] text-[15px] mb-6 line-clamp-2 leading-relaxed">
                      {car.desc}
                    </p>
                    <div className="mt-auto">
                      <p className="text-[#334155] text-[14px] mb-1 font-medium uppercase tracking-wider text-gray-500">
                        Giá bán từ
                      </p>
                      <p className="text-[20px] font-bold text-[#E11D48] mb-8">
                        {car.price}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/chi-tiet-xe/${car.slug || ""}`}
                          className="w-full text-center bg-[#0F172A] hover:bg-slate-800 text-white py-3 rounded-lg text-[15px] font-bold transition-all shadow-md"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] uppercase mb-4 tracking-tight">
                Tin Tức & Sự Kiện
              </h2>
              <div className="w-20 h-[3px] bg-[#E11D48] rounded-full"></div>
            </div>
            <Link
              href="/su-kien"
              className="inline-flex items-center gap-2 text-[#E11D48] font-bold text-[16px] hover:text-rose-800 transition-colors"
            >
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {news.map((item, index) => (
              <Link
                href="/chi-tiet-bai-viet"
                key={index}
                className="bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group block border border-gray-100"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#E11D48] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    Tin tức
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3 font-medium">
                    <Calendar size={14} /> <span>11 Th12, 2023</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#0F172A] mb-4 group-hover:text-[#E11D48] transition-colors line-clamp-3 leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[#E11D48] font-bold text-[14px] flex items-center gap-1 group-hover:gap-3 transition-all uppercase tracking-wide">
                      Đọc tiếp <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <PublicPageShell>
      <HomeContent />
    </PublicPageShell>
  );
}
