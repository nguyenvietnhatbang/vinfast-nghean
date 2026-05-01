'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Settings, Globe, Phone, Mail, MapPin, Share2, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: sData, error: sError } = await supabase.from('settings').select('*').order('key');
      if (sError) throw sError;
      setSettings(sData || []);
    } catch (err) {
      console.error('Lỗi fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
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
      alert('Đã lưu cấu hình thành công!');
    } catch (err) {
      alert('Lỗi khi lưu cấu hình');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.includes('phone')) return <Phone size={18} />;
    if (key.includes('email')) return <Mail size={18} />;
    if (key.includes('address')) return <MapPin size={18} />;
    if (key.includes('link')) return <Share2 size={18} />;
    return <Globe size={18} />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm font-medium text-slate-500">Đang tải cấu hình…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 sm:space-y-10 sm:pb-20">
      <div>
        <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
          <Settings className="h-5 w-5 shrink-0 text-blue-600 sm:h-6 sm:w-6" />
          Cấu hình website
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Thông tin hiển thị công khai (hotline, mạng xã hội…).{' '}
          <Link href="/admin/account" className="font-medium text-blue-600 hover:underline">
            Đổi tài khoản / mật khẩu
          </Link>{' '}
          ở trang riêng.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Thông tin chung &amp; liên hệ</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Hiển thị trên toàn bộ website.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Đang lưu…' : 'Lưu cấu hình'}
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-8 sm:space-y-8">
          {settings.map((s) => (
            <div key={s.key} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <span className="text-slate-500">{getIcon(s.key)}</span>
                {s.description || s.key}
              </div>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={s.value}
                onChange={(e) => handleUpdateSetting(s.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-blue-900 sm:p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold sm:text-base">
          <Globe size={18} /> Hướng dẫn
        </h3>
        <ul className="list-inside list-disc space-y-2 text-sm opacity-95">
          <li className="flex flex-wrap items-center gap-1">
            <strong className="font-semibold">Tài khoản admin:</strong>
            <Link
              href="/admin/account"
              className="inline-flex items-center gap-1 font-medium text-blue-700 underline-offset-2 hover:underline"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Tài khoản đăng nhập
            </Link>
          </li>
          <li>
            <strong className="font-semibold">Site Name:</strong> Tên hiển thị cạnh logo (header).
          </li>
          <li>
            <strong className="font-semibold">Phone Number:</strong> Hotline, hiển thị ở nút gọi và thanh trên.
          </li>
          <li>
            <strong className="font-semibold">Zalo Link:</strong> Định dạng{' '}
            <code className="rounded bg-white/60 px-1 py-0.5 text-xs">https://zalo.me/so_dien_thoai</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
