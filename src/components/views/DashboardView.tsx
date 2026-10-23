'use client';

import React from 'react';
import { useHrms } from '@/context/HrmsContext';
import { TabId } from '@/components/Sidebar';
import {
  Users,
  Building2,
  Clock,
  CalendarDays,
  FileSignature,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: TabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    nhanViens,
    phongBans,
    hopDongs,
    donNghiPheps,
    bangChamCongs,
    nhatKyHoatDongs,
    khoaDaoTaos,
    approveDonNghiPhep,
    rejectDonNghiPhep,
  } = useHrms();

  const totalEmployees = nhanViens.length;
  const officialEmployees = nhanViens.filter(n => n.TrangThaiLamViec === 'DANG_LAM_VIEC').length;
  const probationEmployees = nhanViens.filter(n => n.TrangThaiLamViec === 'THU_VIEC').length;

  const maleCount = nhanViens.filter(n => n.GioiTinh === 'Nam').length;
  const femaleCount = nhanViens.filter(n => n.GioiTinh === 'Nữ').length;

  const today = '2024-03-14';
  const todayAttendance = bangChamCongs.filter(c => c.Ngay === today);
  const checkedInCount = todayAttendance.filter(c => c.DaChamCong).length;
  const lateCount = todayAttendance.filter(c => c.TrangThai === 'DI_MUON').length;

  const pendingLeaves = donNghiPheps.filter(d => d.TrangThaiDNP === 'CHO_DUYET');
  const activeContracts = hopDongs.filter(h => h.TrangThaiHopDong === 'CON_HIEU_LUC');

  const totalPayroll = activeContracts.reduce((sum, h) => sum + h.MucLuong, 0);
  const avgSalary = activeContracts.length > 0 ? Math.round(totalPayroll / activeContracts.length) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Hệ thống Quản Trị Nhân Sự Trực Tuyến
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-sm text-indigo-200">
            Hệ thống được thiết kế với đầy đủ các nghiệp vụ quản lý nhân sự, cơ cấu tổ chức, hợp đồng, chấm công, nghỉ phép và đào tạo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('nhan-vien')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-950 shadow-md transition hover:bg-indigo-50"
            >
              <Users className="h-4 w-4" />
              Xem Danh Sách Nhân Viên
            </button>
            <button
              onClick={() => onNavigate('cong-viec')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/60 border border-indigo-400/30 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700"
            >
              <Briefcase className="h-4 w-4" />
              Quản Lý Công Việc & Tiến Độ
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-10 h-64 w-64 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng Nhân Sự
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalEmployees}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {officialEmployees} chính thức
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span>{maleCount} Nam / {femaleCount} Nữ</span>
            <span className="font-medium text-amber-600">{probationEmployees} thử việc</span>
          </div>
        </div>

        {/* Attendance Today */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Chấm Công Hôm Nay
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {checkedInCount}/{totalEmployees}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {Math.round((checkedInCount / totalEmployees) * 100)}% có mặt
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span>Đi muộn: <strong className="text-amber-600">{lateCount}</strong></span>
            <button
              onClick={() => onNavigate('cham-cong')}
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Chi tiết →
            </button>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Đơn Nghỉ Phép Chờ Duyệt
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {pendingLeaves.length}
            </span>
            <span className="text-xs font-medium text-amber-600">Cần xử lý</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span>Đã duyệt tháng này: {donNghiPheps.filter(d => d.TrangThaiDNP === 'DA_DUYET').length}</span>
            <button
              onClick={() => onNavigate('nghi-phep')}
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Duyệt ngay →
            </button>
          </div>
        </div>

        {/* Active Contracts & Payroll */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Hợp Đồng & Quỹ Lương
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <FileSignature className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(totalPayroll / 1000000).toFixed(0)} Tr VND
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span>{activeContracts.length} hợp đồng hiệu lực</span>
            <span className="text-slate-700 dark:text-slate-300">
              Lương TB: {(avgSalary / 1000000).toFixed(1)} Tr
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Pending Leave Approvals & Department Headcount */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Leaves Quick Approvals (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Đơn Nghỉ Phép Chờ Phê Duyệt
              </h3>
              <p className="text-xs text-slate-500">
                Danh sách đơn xin nghỉ phép chờ người quản lý phê duyệt
              </p>
            </div>
            <button
              onClick={() => onNavigate('nghi-phep')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Xem tất cả ({donNghiPheps.length}) →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map(don => (
                <div
                  key={don.MaDonNP}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {don.TenNhanVien?.slice(0, 1) || 'NV'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {don.TenNhanVien}
                        </span>
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {don.MaDonNP}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Lý do: <em>&ldquo;{don.LyDo}&rdquo;</em>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Thời gian: <strong>{don.TuNgay}</strong> đến <strong>{don.DenNgay}</strong> ({don.SoNgayNghi} ngày) • Người duyệt: {don.TenNguoiDuyet || 'Quản lý trực tiếp'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => approveDonNghiPhep(don.MaDonNP, 'Chấp thuận đơn nghỉ')}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Duyệt Đơn
                    </button>
                    <button
                      onClick={() => rejectDonNghiPhep(don.MaDonNP, 'Từ chối do khối lượng công việc')}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Từ Chối
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500/50 mb-2" />
                Hiện không có đơn nghỉ phép nào đang chờ phê duyệt
              </div>
            )}
          </div>
        </div>

        {/* Department Breakdown (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Phân Bổ Phòng Ban
              </h3>
              <p className="text-xs text-slate-500">Thực thể PhongBan</p>
            </div>
            <button
              onClick={() => onNavigate('phong-ban')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Quản lý →
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {phongBans.map(pb => {
              const count = nhanViens.filter(n => n.MaPhongBan === pb.MaPhongBan).length;
              const percent = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;

              return (
                <div key={pb.MaPhongBan} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {pb.TenPhongBan}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {count} NV ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Logs & Training Courses */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Audit Logs (NhatKyHoatDong) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Nhật Ký Hoạt Động Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Thực thể NhatKyHoatDong liên kết TaiKhoan
              </p>
            </div>
            <button
              onClick={() => onNavigate('he-thong')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Chi tiết →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {nhatKyHoatDongs.slice(0, 5).map(log => (
              <div
                key={log.MaNhatKy}
                className="flex items-start gap-3 rounded-xl p-2.5 text-xs transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {log.LoaiHanhDong.slice(0, 3)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.HanhDong}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.ThoiGian}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Thực hiện bởi: <strong>{log.TenNhanVien || log.TenDangNhap}</strong> {log.ChiTiet && `• ${log.ChiTiet}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Training & Skills (KhoaDaoTao & KyNang) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Khóa Đào Tạo & Phát Triển Năng Lực
              </h3>
              <p className="text-xs text-slate-500">
                Các khóa đào tạo nâng cao chuyên môn và kỹ năng nhân sự
              </p>
            </div>
            <button
              onClick={() => onNavigate('dao-tao')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Quản lý đào tạo →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {khoaDaoTaos.map(kdt => (
              <div
                key={kdt.MaKhoa}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs transition dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {kdt.TenKhoa}
                  </span>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px]">
                    {kdt.HinhThucHoc}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {kdt.MoTa}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 dark:border-slate-800">
                  <span>Giảng viên: <strong>{kdt.NguoiDay}</strong></span>
                  <span>Thời gian: {kdt.NgayBD} → {kdt.NgayKT}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
