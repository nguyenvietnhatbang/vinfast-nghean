'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, Calendar, User, Share2, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { settings } = usePublicSiteCars();
  const [isLoading, setIsLoading] = useState(true);

  const [postData, setPostData] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [sidebarCars, setSidebarCars] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;

        // Fetch bài viết
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('*, post_categories(name, slug)')
          .eq('slug', slug)
          .single();

        if (postError || !post) {
          loadStaticFallback();
          return;
        }

        setPostData(post);

        // Fetch khối nội dung
        const { data: blockData } = await supabase
          .from('post_blocks')
          .select('*')
          .eq('post_id', post.id)
          .order('sort_order', { ascending: true });
        
        if (blockData) setBlocks(blockData);

        // Fetch 4 bài viết mới nhất cho phần dưới (grid 4)
        const { data: latest } = await supabase
          .from('posts')
          .select('title, slug, cover_image, created_at, short_description')
          .order('created_at', { ascending: false })
          .limit(4);
        if (latest) setLatestPosts(latest);

        // Fetch xe cho sidebar
        const { data: cars } = await supabase.from('cars').select('name, price, main_image, slug').limit(5);
        if (cars) setSidebarCars(cars);

      } catch (error) {
        console.error("Lỗi fetch bài viết:", error);
        loadStaticFallback();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const loadStaticFallback = () => {
    setPostData({
      title: "BẠN ĐÃ LÁI THỬ VF7 CHƯA?",
      created_at: new Date().toISOString(),
      post_categories: { name: "SỰ KIỆN", slug: "su-kien" }
    });
    setBlocks([
        { block_type: 'text', content: 'Nội dung mẫu đang được cập nhật...' }
    ]);
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <PublicPageShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8102e]" />
        </div>
      </PublicPageShell>
    );

  return (
    <PublicPageShell>
      {/* Banner */}
      <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden bg-black flex flex-col justify-center items-center md:items-start text-white">
        <img src="/baner/imgi_6_1.jpg" alt="Banner" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center mt-12 md:mt-24">
           <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 md:mb-0">TIN TỨC</h1>
           <div className="text-sm tracking-widest uppercase">
             <Link href="/" className="hover:text-red-400">Trang chủ</Link> <span className="mx-2">»</span> 
             <Link href={`/${postData?.post_categories?.slug}`} className="hover:text-red-400 uppercase">{postData?.post_categories?.name}</Link> <span className="mx-2">»</span> CHI TIẾT
           </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Column - Expanded to 3/4 */}
          <div className="w-full lg:w-3/4">
             <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-snug uppercase">
               {postData?.title}
             </h1>
             
             <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 border-b border-gray-200 pb-4">
                <Calendar size={14} /> <span>{new Date(postData?.created_at).toLocaleDateString('vi-VN')}</span>
             </div>
             
             <article className="prose prose-lg max-w-none text-gray-900 space-y-6">
                {blocks.map((block, idx) => {
                    if (block.block_type === 'image') {
                        return <img key={idx} src={block.content} alt={postData?.title} className="w-full h-auto border border-gray-200 my-8 shadow-sm" />;
                    } else if (block.block_type === 'video') {
                        let videoUrl = block.content;
                        if (videoUrl.includes('youtube.com/watch?v=')) {
                          videoUrl = videoUrl.replace('watch?v=', 'embed/');
                        } else if (videoUrl.includes('youtu.be/')) {
                          videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
                        }
                        return (
                          <div key={idx} className="w-full aspect-video border border-gray-200 my-8 shadow-sm overflow-hidden bg-black">
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
                    } else {
                        return <div key={idx} className="whitespace-pre-wrap leading-relaxed text-lg">{block.content}</div>;
                    }
                })}
             </article>
             
             {/* Tags and Share */}
             <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="flex gap-2">
                   <span className="font-bold mr-2 text-black">Tags:</span>
                   <span className="bg-gray-100 px-3 py-1 text-sm text-gray-600">VinFast</span>
                   <span className="bg-gray-100 px-3 py-1 text-sm text-gray-600">Tin tức</span>
                </div>
                <div className="flex items-center gap-3">
                   <a href="#" className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center"><Share2 size={14} /></a>
                </div>
             </div>
          </div>

          {/* Sidebar - Narrowed to 1/4 */}
          <div className="w-full lg:w-1/4">
             <div className="sticky top-24 space-y-12">
               {/* Tư vấn online */}
               <div>
                 <h3 className="text-xl font-black text-black uppercase mb-4 border-b-2 border-gray-300 pb-2 relative">
                   TƯ VẤN ONLINE
                   <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
                 </h3>
                 <div className="flex items-start gap-4">
                   <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={32} className="text-gray-400" />
                   </div>
                   <div className="space-y-2 mt-1">
                     <div className="flex items-center gap-2 font-bold text-lg text-[#c8102e]">
                       <Phone size={16} className="fill-current" /> <a href={settings.zalo_link || `https://zalo.me/${(settings.phone_number || '0961194881').replace(/\./g, '')}`}>{settings.phone_number || "0961.194.881"}</a>
                     </div>
                     <div className="flex items-center gap-2 text-gray-900 text-[13px] font-bold">
                       <span className="bg-blue-500 text-white rounded-full p-0.5"><MessageCircle size={10} /></span> Zalo: {settings.phone_number || "0961.194.881"}
                     </div>
                     <div className="flex items-center gap-2 text-gray-900 text-[13px] font-bold">
                       <Mail size={14} /> {settings.email || "vinfastnghean1@gmail.com"}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Xe Nổi Bật */}
               <div>
                 <h3 className="text-xl font-black text-black uppercase mb-4 border-b-2 border-gray-300 pb-2 relative">
                   XE NỔI BẬT
                   <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
                 </h3>
                 <div className="space-y-4">
                   {sidebarCars.map((car, idx) => (
                     <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-20 h-14 shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={car.main_image} alt={car.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                           <Link href={`/chi-tiet-xe/${car.slug}`} className="font-bold text-black uppercase hover:text-[#c8102e] block mb-0.5 text-sm">
                              {car.name}
                           </Link>
                           <div className="text-[12px] text-gray-900 font-bold border-l-2 border-[#c8102e] pl-2">
                             {car.price}
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Bài viết mới nhất section */}
        <div className="mt-20 pt-16 border-t-2 border-gray-100">
           <h3 className="text-2xl font-black text-black uppercase mb-10 border-b-2 border-gray-300 pb-2 relative inline-block">
             BÀI VIẾT MỚI NHẤT
             <span className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-[#c8102e]"></span>
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {latestPosts.map((post: any, idx: number) => (
               <div key={idx} className="group">
                  <Link href={`/chi-tiet-bai-viet/${post.slug}`} className="block aspect-[4/3] overflow-hidden border border-gray-200 mb-4">
                     <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex items-center text-[12px] text-gray-500 mb-2 gap-2">
                    <Calendar size={12} /> <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <Link href={`/chi-tiet-bai-viet/${post.slug}`} className="font-bold text-lg text-black group-hover:text-[#c8102e] transition-colors line-clamp-2 uppercase leading-tight">
                     {post.title}
                  </Link>
               </div>
             ))}
           </div>
        </div>
      </main>
    </PublicPageShell>
  );
}
