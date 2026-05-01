'use client';

import { useState, useEffect } from "react";
import { Save, Settings, Globe, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [adminAccount, setAdminAccount] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch general settings
      const { data: sData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .order('key');
      if (sError) throw sError;
      setSettings(sData || []);

      // Fetch admin account
      const { data: aData, error: aError } = await supabase
        .from('admin_users')
        .select('username, password')
        .limit(1)
        .single();
      if (aError) throw aError;
      setAdminAccount(aData);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      for (const s of settings) {
        const { error } = await supabase
          .from('settings')
          .update({ value: s.value, updated_at: new Date() })
          .eq('key', s.key);
        if (error) throw error;
      }
      alert("Đã lưu cấu hình thành công!");
    } catch (err) {
      alert("Lỗi khi lưu cấu hình");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAdmin = async () => {
    if (!adminAccount.username || !adminAccount.password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }
    setIsSavingAdmin(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          username: adminAccount.username, 
          password: adminAccount.password,
          updated_at: new Date() 
        })
        .eq('username', adminAccount.username); // Simplified, usually use ID
      
      if (error) throw error;
      alert("Đã cập nhật tài khoản quản trị thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật tài khoản");
      console.error(err);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.includes('phone')) return <Phone size={18} />;
    if (key.includes('email')) return <Mail size={18} />;
    if (key.includes('address')) return <MapPin size={18} />;
    if (key.includes('link')) return <Share2 size={18} />;
    return <Globe size={18} />;
  };

  if (isLoading) return <div className="p-8 text-center font-bold">Đang tải cấu hình...</div>;

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-blue-600" /> Cấu hình Website
        </h1>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
           <div>
             <h2 className="font-bold text-gray-700">Tài khoản quản trị</h2>
             <p className="text-xs text-gray-500 mt-1">Thay đổi tên đăng nhập và mật khẩu hệ thống.</p>
           </div>
           <button 
            onClick={handleSaveAdmin}
            disabled={isSavingAdmin}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition disabled:opacity-50"
          >
            <Save size={16} /> {isSavingAdmin ? "Đang lưu..." : "Cập nhật tài khoản"}
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Tên đăng nhập</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
                value={adminAccount.username}
                onChange={(e) => setAdminAccount({...adminAccount, username: e.target.value})}
              />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Mật khẩu mới</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
                value={adminAccount.password}
                onChange={(e) => setAdminAccount({...adminAccount, password: e.target.value})}
              />
           </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
           <div>
             <h2 className="font-bold text-gray-700">Thông tin chung & Liên hệ</h2>
             <p className="text-xs text-gray-500 mt-1">Các thông tin này sẽ hiển thị trên toàn bộ Website.</p>
           </div>
           <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
        </div>
        
        <div className="p-8 space-y-8">
           {settings.map((s) => (
             <div key={s.key} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider">
                   {getIcon(s.key)} {s.description || s.key}
                </div>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-xl p-3 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
                  value={s.value}
                  onChange={(e) => handleUpdateSetting(s.key, e.target.value)}
                />
             </div>
           ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800">
         <h3 className="font-bold mb-2 flex items-center gap-2"><Globe size={18}/> Hướng dẫn</h3>
         <ul className="text-sm space-y-2 list-disc list-inside opacity-90">
            <li><strong>Tài khoản:</strong> Mật khẩu được lưu trực tiếp dưới dạng văn bản (không mã hóa).</li>
            <li><strong>Site Name:</strong> Tên hiển thị cạnh Logo (Header).</li>
            <li><strong>Phone Number:</strong> Số Hotline chính, hiển thị ở nút gọi và Top Bar.</li>
            <li><strong>Zalo Link:</strong> Phải có định dạng <code>https://zalo.me/so_dien_thoai</code>.</li>
         </ul>
      </div>
    </div>
  );
}
