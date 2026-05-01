"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, ChevronRight, Download, FileText, ArrowRight } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

export default function BrochurePage() {
  const { settings } = usePublicSiteCars();
  const [brochures, setBrochures] = useState<any[]>([]);

  const siteName = settings.site_name || "VinFast Nghệ An";
  const phoneNumber = settings.phone_number || "0961.194.881";
  const zaloLink = settings.zalo_link || `https://zalo.me/${phoneNumber.replace(/\./g, '')}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('brochures')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setBrochures(data);
      } catch (error) {
        console.error("Lỗi fetch brochure:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <PublicPageShell className="bg-[#F8FAFC]">
      {/* Banner Breadcrumb */}
      <div className="relative w-full h-[250px] sm:h-[350px] overflow-hidden bg-[#0F172A] flex flex-col justify-center items-center text-white">
        <img src="/baner/imgi_5_2.jpg" alt="Banner" className="absolute top-0 left-0 w-full h-full object-cover opacity-40 scale-105" />
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 animate-fade-in-up">TẢI BROCHURE</h1>
          <div className="flex items-center justify-center gap-3 text-sm tracking-widest uppercase font-bold text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="text-slate-500" />
            <span className="text-[#E11D48]">Brochure</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] uppercase mb-4 tracking-tight">
            Tài Liệu Sản Phẩm
          </h2>
          <div className="w-20 h-[3px] bg-[#E11D48] mx-auto rounded-full mb-6"></div>
          <p className="text-[#334155] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Tải về brochure chi tiết để khám phá thông số kỹ thuật, tính năng thông minh và các tùy chọn màu sắc của các dòng xe VinFast.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {brochures.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-slate-100">
              <div className="relative h-56 bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={item.image_url || "/logo/imgi_1_r3.png"}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                />
                <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white text-[#0F172A] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <FileText size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 uppercase tracking-wide group-hover:text-[#E11D48] transition-colors">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <FileText size={14} /> <span>PDF Document • {item.file_size || 'N/A'}</span>
                </div>
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0F172A] group-hover:bg-[#E11D48] text-white py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                  <Download size={18} /> Tải Brochure
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-32 bg-[#0F172A] rounded-[32px] p-8 md:p-16 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-600/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn cần thêm thông tin?</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Đội ngũ chuyên viên của {siteName} luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn về sản phẩm và chính sách ưu đãi.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a href={zaloLink} className="bg-[#E11D48] hover:bg-rose-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
                  <Phone size={20} /> Gọi ngay: {phoneNumber}
                </a>
                <Link href="/dang-ky-lai-thu" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
                  Đăng ký lái thử <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/3 aspect-square max-w-[300px] relative">
              <div className="absolute inset-0 bg-[#E11D48] rounded-full blur-[80px] opacity-20 animate-pulse"></div>
              <img src="/logo/imgi_1_r3.png" alt="VinFast Logo" className="w-full h-full object-contain relative z-10 animate-bounce-slow" />
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </PublicPageShell>
  );
}
