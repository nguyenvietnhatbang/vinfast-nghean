'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, KeyRound, ShieldAlert, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminAccountPage() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminAccount, setAdminAccount] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, username, password')
          .limit(1)
          .single();
        if (error) throw error;
        if (data) {
          setAdminId(data.id);
          setAdminAccount({ username: data.username ?? '', password: data.password ?? '' });
        }
      } catch (err) {
        console.error('Lỗi tải tài khoản:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!adminAccount.username || !adminAccount.password) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }
    if (!adminId) {
      alert('Chưa tải được tài khoản. Thử tải lại trang.');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          username: adminAccount.username,
          password: adminAccount.password,
          updated_at: new Date().toISOString(),
        })
        .eq('id', adminId);
      if (error) throw error;
      alert('Đã cập nhật tài khoản đăng nhập.');
    } catch (err) {
      alert('Lỗi khi cập nhật tài khoản');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm font-medium text-slate-500">Đang tải…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12 sm:space-y-8 sm:pb-20">
      <div>
        <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
          <KeyRound className="h-5 w-5 shrink-0 text-blue-600 sm:h-6 sm:w-6" />
          Tài khoản đăng nhập
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Đổi tên đăng nhập và mật khẩu dùng tại trang{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            /login
          </Link>
          .
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Thông tin đăng nhập</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Dùng để vào khu vực quản trị.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Tên đăng nhập
            </label>
            <input
              type="text"
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={adminAccount.username}
              onChange={(e) => setAdminAccount({ ...adminAccount, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Mật khẩu
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={adminAccount.password}
              onChange={(e) => setAdminAccount({ ...adminAccount, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 text-amber-950 sm:p-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
          <ShieldAlert size={18} /> Lưu ý bảo mật
        </h3>
        <ul className="list-inside list-disc space-y-1.5 text-sm opacity-95">
          <li>Mật khẩu đang lưu dạng văn bản trong cơ sở dữ liệu (chưa băm). Hạn chế dùng mật khẩu cá nhân.</li>
          <li>Sau khi đổi mật khẩu, đăng nhập lại bằng thông tin mới.</li>
        </ul>
      </div>

      <p className="text-center text-sm text-slate-500">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline"
        >
          <Settings className="h-4 w-4" />
          Cấu hình hiển thị website (hotline, Zalo…)
        </Link>
      </p>
    </div>
  );
}
