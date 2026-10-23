'use client';

import React, { useState, useEffect } from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  Bell,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC<{ activeTabTitle: string }> = ({ activeTabTitle }) => {
  const {
    currentTaiKhoan,
    setCurrentTaiKhoan,
    taiKhoans,
    donNghiPheps,
    hopDongs,
    bangChamCongs,
    checkInToday,
    checkOutToday,
  } = useHrms();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const userCheckin = bangChamCongs.find(
    c => c.MaNhanVien === currentTaiKhoan.MaNhanVien && c.Ngay === today
  );

  const pendingLeaves = donNghiPheps.filter(d => d.TrangThaiDNP === 'CHO_DUYET');
  const expiringContracts = hopDongs.filter(h => h.TrangThaiHopDong === 'CON_HIEU_LUC');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeTabTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hệ thống Quản lý Nhân sự Doanh nghiệp
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Check-in Simulation Widget */}
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 p-1.5 px-3 md:flex dark:bg-slate-800/70">
          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {currentTime || '08:00:00'}
          </span>
          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />
          {!userCheckin?.DaChamCong ? (
            <button
              onClick={() => checkInToday(currentTaiKhoan.MaNhanVien)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-3 w-3" />
              Điểm danh Vào
            </button>
          ) : !userCheckin.GioRa ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Vào: {userCheckin.GioVao}
              </span>
              <button
                onClick={() => checkOutToday(currentTaiKhoan.MaNhanVien)}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-amber-700"
              >
                Ra về
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              ✓ Đã hoàn tất ({userCheckin.GioVao} - {userCheckin.GioRa})
            </span>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowUserMenu(false);
            }}
            className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            {pendingLeaves.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {pendingLeaves.length}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Thông báo hệ thống
                </span>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {pendingLeaves.length} mới
                </span>
              </div>
              <div className="space-y-2">
                {pendingLeaves.slice(0, 3).map(don => (
                  <div
                    key={don.MaDonNP}
                    className="rounded-xl bg-amber-50/70 p-2.5 text-xs dark:bg-amber-950/20"
                  >
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      Đơn nghỉ phép chờ duyệt ({don.MaDonNP})
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      {don.TenNhanVien} xin nghỉ {don.SoNgayNghi} ngày ({don.TuNgay} → {don.DenNgay})
                    </p>
                  </div>
                ))}
                {pendingLeaves.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-500">
                    Không có thông báo mới nào
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white shadow-sm">
              {currentTaiKhoan.TenDangNhap.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                {currentTaiKhoan.TenNhanVien || currentTaiKhoan.TenDangNhap}
              </p>
              <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                {currentTaiKhoan.TenRole?.split('(')[0] || 'Tài khoản'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 pb-2 mb-2 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Mô phỏng vai trò người dùng
                </span>
                <p className="text-xs text-slate-500">
                  Chuyển đổi tài khoản để kiểm tra phân quyền & góc nhìn
                </p>
              </div>
              <div className="space-y-1">
                {taiKhoans.map(tk => (
                  <button
                    key={tk.MaTK}
                    onClick={() => {
                      setCurrentTaiKhoan(tk);
                      setShowUserMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      currentTaiKhoan.MaTK === tk.MaTK
                        ? 'bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{tk.TenNhanVien}</p>
                      <p className="text-[11px] text-slate-400 font-normal">
                        @{tk.TenDangNhap} • {tk.TenRole?.split('(')[0]}
                      </p>
                    </div>
                    {currentTaiKhoan.MaTK === tk.MaTK && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
