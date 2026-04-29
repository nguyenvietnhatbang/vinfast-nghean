"use client";

import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

export default function CarDetail() {
  const { slug } = useParams();
  const { settings } = usePublicSiteCars();

  const [selectedColor, setSelectedColor] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [carData, setCarData] = useState<any>(null);
  const [colors, setColors] = useState<any[]>([]);
  const [detailBlocks, setDetailBlocks] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  // Lead Modal states
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        if (!slug) return;

        // Fetch thông tin xe
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('slug', slug)
          .single();

        if (carError || !car) {
          // Fallback tĩnh nếu không tìm thấy (để UI không chết)
          loadStaticData();
          return;
        }

        setCarData(car);

        // Fetch colors
        const { data: colorData } = await supabase
          .from('car_colors')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (colorData && colorData.length > 0) {
          setColors(colorData);
        } else {
          // Fallback màu
          setColors([
             { color_name: "Mặc định", hex_code: "#d1d5db", image_url: car.main_image || "/chi tiết xe/xe theo mau/imgi_4_z5423562096141_871c1d73895398d6b5d4d60c867d9a0b.jpg" }
          ]);
        }

        // Fetch chi tiết đan xen
        const { data: blocks } = await supabase
          .from('car_detail_blocks')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (blocks && blocks.length > 0) {
          setDetailBlocks(blocks);
        }

        // Fetch thông số
        const { data: specData } = await supabase
          .from('car_specifications')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (specData && specData.length > 0) {
          setSpecs(specData);
        }

      } catch (error) {
        console.error("Lỗi fetch chi tiết xe:", error);
        loadStaticData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetail();
  }, [slug]);

  const loadStaticData = () => {
    // Tạm thời nếu DB trống thì hiện data cũ
    setCarData({
      name: "VINFAST VF 3",
      price: "235.000.000 VNĐ",
      general_description: "Mẫu xe điện cỡ nhỏ tiên phong của VinFast mang đậm cá tính, thiết kế năng động và cực kỳ tiện dụng. Với ngoại hình mạnh mẽ cùng khả năng di chuyển linh hoạt trong đô thị, VF 3 hứa hẹn sẽ trở thành mẫu xe quốc dân mới của người Việt."
    });
    setColors([
      { color_name: "Màu 1", hex_code: "#d1d5db", image_url: "/chi tiết xe/xe theo mau/imgi_4_z5423562096141_871c1d73895398d6b5d4d60c867d9a0b.jpg" },
      { color_name: "Màu 2", hex_code: "#fbbf24", image_url: "/chi tiết xe/xe theo mau/imgi_5_z5423562165419_948c075aa982cd110626688de87c9f68.jpg" },
      { color_name: "Màu 3", hex_code: "#3b82f6", image_url: "/chi tiết xe/xe theo mau/imgi_6_z5423562243183_bc4148cc0bb9acb826d7abe1fa74db35.jpg" },
    ]);
    setDetailBlocks([
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_12_vf3-1.jpg' },
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_13_vf3-2.jpg' },
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_14_vf3-3.jpg' }
    ]);
    setSpecs([
      { image_url: '/chi tiết xe/thông số xe/imgi_19_TSKT-VF-3-3-scaled.jpg' }
    ]);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8102e]" />
        </div>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell>
      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-16">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-[#c8102e]">Trang chủ</Link> <span className="mx-2">/</span>
            <span className="text-black">{carData?.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm">
            <div className="relative aspect-[16/10] flex items-center justify-center overflow-hidden mb-8">
              <img src={colors[selectedColor]?.image_url} alt={`Xe ${carData?.name}`} className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[13px] mb-1">MÀU XE NGOẠI THẤT</h3>
                <p className="text-[#c8102e] font-bold text-sm uppercase tracking-wide">
                  {colors[selectedColor]?.color_name}
                </p>
              </div>
              <div className="flex justify-center gap-3 flex-nowrap overflow-x-auto pb-2 no-scrollbar">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className="flex flex-col items-center shrink-0"
                  >
                    <div 
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-300 ${selectedColor === index ? 'border-[#c8102e] scale-110 shadow-md ring-2 ring-red-50' : 'border-gray-200 hover:border-gray-400'}`}
                      style={{ backgroundColor: color.hex_code }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold uppercase mb-4 text-black">{carData?.name}</h1>
            <div className="w-16 h-[2px] bg-[#c8102e] mb-6"></div>
            <p className="text-2xl font-bold text-[#c8102e] mb-6">
              {carData?.is_contact ? 'Liên Hệ' : `Giá từ: ${carData?.price}`}
            </p>
            <div className="text-gray-800 mb-8 text-lg leading-relaxed whitespace-pre-wrap">
              {carData?.general_description}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button onClick={() => setShowModal(true)} className="bg-[#c8102e] border-2 border-[#c8102e] text-white px-8 py-3.5 font-bold uppercase text-[15px] hover:bg-red-800 hover:border-red-800 transition">
                Nhận thông tin tư vấn
              </button>
              <a href={settings.zalo_link || `https://zalo.me/${(settings.phone_number || '0961194881').replace(/\./g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black text-black px-8 py-3.5 font-bold uppercase text-[15px] hover:bg-black hover:text-white transition flex items-center justify-center gap-2">
                <Phone size={18} /> Liên hệ Zalo
              </a>
            </div>
          </div>
        </div>

        {/* Scroll down description and details */}
        {detailBlocks.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-black uppercase mb-3">CHI TIẾT XE</h2>
              <div className="w-16 h-[2px] bg-[#c8102e] mx-auto"></div>
            </div>
            <div className="space-y-8 flex flex-col items-center">
               {detailBlocks.map((block, idx) => {
                 if (block.block_type === 'image') {
                   return <img key={idx} src={block.content} className="w-full max-w-5xl mx-auto border border-gray-200 shadow-sm" />;
                 } else if (block.block_type === 'text') {
                   return <div key={idx} className="w-full max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</div>;
                 } else if (block.block_type === 'video') {
                   // Extract video ID and convert to embed URL if needed
                   let videoUrl = block.content;
                   if (videoUrl.includes('youtube.com/watch?v=')) {
                     videoUrl = videoUrl.replace('watch?v=', 'embed/');
                   } else if (videoUrl.includes('youtu.be/')) {
                     videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
                   }
                   
                   return (
                     <div key={idx} className="w-full max-w-5xl mx-auto aspect-video border border-gray-200 shadow-sm overflow-hidden bg-black">
                       <iframe
                         width="100%"
                         height="100%"
                         src={videoUrl}
                         title="YouTube video player"
                         frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                         allowFullScreen
                       ></iframe>
                     </div>
                   );
                 }
                 return null;
               })}
            </div>
          </div>
        )}
        
        {specs.length > 0 && (
          <div className="mt-24 mb-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-black uppercase mb-3">THÔNG SỐ KỸ THUẬT</h2>
              <div className="w-16 h-[2px] bg-[#c8102e] mx-auto"></div>
            </div>
            <div className="space-y-8">
               {specs.map((spec, idx) => (
                 <img key={idx} src={spec.image_url} className="w-full max-w-5xl mx-auto border border-gray-200 shadow-sm" />
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom right support button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-black text-white px-5 py-2.5 shadow-lg font-bold flex items-center gap-2 hover:bg-[#333] transition-colors border border-gray-700 uppercase text-sm">
          Hỗ trợ <Menu size={16} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full relative shadow-2xl border-t-4 border-[#c8102e]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <X size={28} />
            </button>
            <h3 className="text-2xl font-bold uppercase mb-2 text-center text-black">Nhận thông tin</h3>
            <div className="w-12 h-1 bg-[#c8102e] mx-auto mb-6"></div>
            <form 
              className="space-y-4 text-left"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!leadForm.name || !leadForm.phone) {
                  alert("Vui lòng nhập họ tên và số điện thoại.");
                  return;
                }
                setIsSubmittingLead(true);
                try {
                  const { error } = await supabase.from('lead_registrations').insert([{
                    full_name: leadForm.name,
                    phone: leadForm.phone,
                    email: leadForm.email,
                    notes: leadForm.notes || carData?.name,
                    car_model: carData?.name,
                    type: 'Nhận thông tin',
                    status: 'Mới'
                  }]);
                  if (error) throw error;
                  alert("Gửi thông tin thành công! Chúng tôi sẽ sớm liên hệ lại.");
                  setShowModal(false);
                  setLeadForm({ name: "", phone: "", email: "", notes: "" });
                } catch (err) {
                  console.error(err);
                  alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                } finally {
                  setIsSubmittingLead(false);
                }
              }}
            >
              <div>
                <label className="block text-[15px] font-bold text-gray-800 mb-1">Họ và tên *</label>
                <input 
                  type="text" required 
                  value={leadForm.name}
                  onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập họ và tên của bạn" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Số điện thoại *</label>
                <input 
                  type="text" required 
                  value={leadForm.phone}
                  onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập số điện thoại" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Email</label>
                <input 
                  type="email" 
                  value={leadForm.email}
                  onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập email" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Nội dung tư vấn</label>
                <textarea 
                  value={leadForm.notes}
                  onChange={e => setLeadForm({...leadForm, notes: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium h-24 focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Dòng xe bạn đang quan tâm..." 
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingLead}
                className="w-full bg-[#c8102e] text-white py-3 font-bold uppercase text-[15px] mt-2 hover:bg-red-800 transition disabled:opacity-50"
              >
                {isSubmittingLead ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PublicPageShell>
  )
}
