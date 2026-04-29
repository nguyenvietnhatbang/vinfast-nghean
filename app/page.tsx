"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";
import { supabase } from "@/lib/supabase";

function HomeContent() {
  const banners = [
    "/baner/imgi_4_4.jpg",
    "/baner/imgi_5_2.jpg",
    "/baner/imgi_6_1.jpg",
    "/baner/imgi_7_3.jpg",
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const { currentCars, serviceCars, isLoading: isCarsLoading } = usePublicSiteCars();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('posts')
          .select('id, title, slug, cover_image, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        if (data) setLatestPosts(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setIsPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);

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

          {isCarsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCars.map((car, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-gray-100"
                >
                  <Link
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="w-full aspect-[16/9] bg-white flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-1 border-t border-gray-50">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-[22px] font-bold text-[#0F172A] uppercase tracking-tighter">
                        {car.name}
                      </h3>
                      <div className="text-right">
                        <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">
                          Giá từ
                        </p>
                        <p className="text-[18px] font-black text-[#E11D48]">
                          {car.price}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/chi-tiet-xe/${car.slug || ""}`}
                      className="w-full text-center bg-[#0F172A] group-hover:bg-[#E11D48] text-white py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-lg hover:shadow-rose-200 uppercase tracking-widest"
                    >
                      Khám phá ngay
                    </Link>
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

          {isCarsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCars.map((car, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-gray-100"
                >
                  <Link
                    href={`/chi-tiet-xe/${car.slug || ""}`}
                    className="w-full aspect-[16/9] bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden"
                  >
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-1 border-t border-gray-50">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-[22px] font-bold text-[#0F172A] uppercase tracking-tighter">
                        {car.name}
                      </h3>
                      <div className="text-right">
                        <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">
                          Giá từ
                        </p>
                        <p className="text-[18px] font-black text-[#E11D48]">
                          {car.price}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/chi-tiet-xe/${car.slug || ""}`}
                      className="w-full text-center bg-[#0F172A] group-hover:bg-[#E11D48] text-white py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-lg hover:shadow-rose-200 uppercase tracking-widest"
                    >
                      Xem chi tiết
                    </Link>
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
            {isPostsLoading ? (
               [1,2,3,4].map(i => (
                 <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>
               ))
            ) : (
              latestPosts.map((item, index) => (
                <Link
                  href={`/chi-tiet-bai-viet/${item.slug}`}
                  key={index}
                  className="bg-white rounded-[20px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.cover_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#E11D48] text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                      Mới nhất
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[12px] text-[#64748B] mb-3 font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-[#E11D48]" /> <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h4 className="text-[17px] font-bold text-[#0F172A] mb-4 group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug uppercase tracking-tight h-12">
                      {item.title}
                    </h4>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[#E11D48] font-black text-[13px] uppercase tracking-widest">
                      <span>Đọc tiếp</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))
            )}
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
