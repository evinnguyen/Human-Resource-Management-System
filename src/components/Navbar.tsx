'use client';

import React, { useState, useEffect } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { formatTrangThaiChamCong, formatTrangThaiDonNP } from '@/utils/formatters';
import {
  Bell,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  LogOut,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Server,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { ChangePasswordModal } from '@/components/common/ChangePasswordModal';

export const Navbar: React.FC<{ activeTabTitle?: string }> = () => {
  const {
    currentTaiKhoan,
    nhanViens,
    congViecs,
    donNghiPheps,
    hopDongs,
    bangChamCongs,
    checkInToday,
    checkOutToday,
    isConnectedBackend,
    isLoading,
    refreshData,
    logout,
  } = useHrms();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [today, setToday] = useState<string>('2024-03-14');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
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

  const userCheckin =
    bangChamCongs.find(c => c.MaNhanVien === currentTaiKhoan.MaNhanVien && c.Ngay === today) ||
    bangChamCongs.find(c => c.MaNhanVien === currentTaiKhoan.MaNhanVien && c.Ngay === '2024-03-14');

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const isEmployee = userRole === 'ROLE_EMPLOYEE';
  const isDeptLead = userRole === 'ROLE_DEPT_LEAD';
  const isHRorAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HR_MANAGER';
  const currentEmp = nhanViens.find(n => n.MaNhanVien === currentTaiKhoan?.MaNhanVien);

  // 1. Pending leave requests requiring current user's approval
  const leavesToApprove = donNghiPheps.filter(d => {
    if (d.TrangThaiDNP !== 'CHO_DUYET') return false;
    // Cannot approve own leave request
    if (d.MaNhanVien === currentTaiKhoan?.MaNhanVien) return false;
    if (isHRorAdmin) return true;
    if (isDeptLead) {
      const emp = nhanViens.find(n => n.MaNhanVien === d.MaNhanVien);
      return emp?.MaPhongBan === currentEmp?.MaPhongBan;
    }
    return false;
  });

  // 2. Personal notifications for employee / self (own leave statuses & assigned tasks)
  const myLeaves = donNghiPheps.filter(d => d.MaNhanVien === currentTaiKhoan?.MaNhanVien);
  const myAssignedTasks = congViecs.filter(
    c => c.MaNhanVien === currentTaiKhoan?.MaNhanVien && c.TrangThai !== 'HOAN_THANH'
  );

  // Badge notification count:
  const notificationCount = isEmployee
    ? myLeaves.filter(d => d.TrangThaiDNP === 'DA_DUYET' || d.TrangThaiDNP === 'TU_CHOI').length + myAssignedTasks.length
    : leavesToApprove.length;

  const expiringContracts = hopDongs.filter(h => h.TrangThaiHopDong === 'CON_HIEU_LUC');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/60">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">Hệ Thống Quản Trị Doanh Nghiệp</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend API Status Indicator */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs sm:flex dark:border-slate-800 dark:bg-slate-800/60">
          <Server className="h-3.5 w-3.5 text-slate-500" />
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={`inline-block h-2 w-2 rounded-full ${isConnectedBackend
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                  : 'bg-amber-400'
                }`}
            />

          </span>
          <button
            onClick={() => refreshData()}
            title="Tải lại dữ liệu từ Backend"
            disabled={isLoading}
            className="ml-1 rounded p-0.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

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
              ✓ {formatTrangThaiChamCong(userCheckin.TrangThai)} ({userCheckin.GioVao} - {userCheckin.GioRa})
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
            {notificationCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {notificationCount}
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
                  {notificationCount} mới
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {!isEmployee &&
                  leavesToApprove.map(don => (
                    <div
                      key={don.MaDonNP}
                      className="rounded-xl bg-amber-50/70 p-2.5 text-xs dark:bg-amber-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-amber-900 dark:text-amber-200">
                          Đơn chờ duyệt: {don.MaDonNP}
                        </p>
                        <span className="rounded bg-amber-200/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          Cần xét duyệt
                        </span>
                      </div>
                      <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                        <strong>{don.TenNhanVien}</strong> xin nghỉ {don.SoNgayNghi} ngày ({don.TuNgay} → {don.DenNgay})
                      </p>
                    </div>
                  ))}

                {isEmployee &&
                  myLeaves.map(don => (
                    <div
                      key={don.MaDonNP}
                      className={`rounded-xl p-2.5 text-xs ${
                        don.TrangThaiDNP === 'DA_DUYET'
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : don.TrangThaiDNP === 'TU_CHOI'
                          ? 'bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
                          : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                      }`}
                    >
                      <p className="font-semibold">
                        Đơn nghỉ phép {don.MaDonNP}: {formatTrangThaiDonNP(don.TrangThaiDNP)}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Thời gian: {don.TuNgay} → {don.DenNgay} ({don.SoNgayNghi} ngày)
                      </p>
                      {don.PhanHoi && (
                        <p className="text-[11px] italic mt-0.5 text-slate-500">
                          💬 Phản hồi: {don.PhanHoi}
                        </p>
                      )}
                    </div>
                  ))}

                {myAssignedTasks.slice(0, 3).map(task => (
                  <div
                    key={task.MaCV}
                    className="rounded-xl bg-indigo-50/70 p-2.5 text-xs dark:bg-indigo-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                        Nhiệm vụ: {task.TenCV}
                      </p>
                      <span className="text-[10px] text-indigo-600 font-medium">
                        Hạn: {task.HanChot}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                      Giao bởi: {task.TenNguoiGiao || 'Quản lý'} • Tiến độ: {task.MucDoHoanThanh}%
                    </p>
                  </div>
                ))}

                {notificationCount === 0 && (
                  <p className="py-4 text-center text-xs text-slate-500">
                    Không có thông báo mới nào
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu & Logout */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 font-semibold text-white shadow-sm">
              {currentTaiKhoan?.TenDangNhap?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                {currentTaiKhoan?.TenNhanVien || currentTaiKhoan?.TenDangNhap || 'Người dùng'}
              </p>
              <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                {currentTaiKhoan?.TenRole?.split('(')[0] || 'Tài khoản'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
              <div className="border-b border-slate-100 pb-3 mb-2 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/30">
                    {currentTaiKhoan?.TenDangNhap?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentTaiKhoan?.TenNhanVien || currentTaiKhoan?.TenDangNhap}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      @{currentTaiKhoan?.TenDangNhap}
                    </p>
                    <span className="inline-block mt-0.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {currentTaiKhoan?.TenRole?.split('(')[0] || 'Người dùng'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowChangePasswordModal(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Đổi mật khẩu</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                      logout();
                    }
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </header>
  );
};
