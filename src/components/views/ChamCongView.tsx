'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

export const ChamCongView: React.FC = () => {
  const { bangChamCongs, nhanViens, currentTaiKhoan, checkInToday, checkOutToday } = useHrms();

  const [filterDate, setFilterDate] = useState<string>('2024-03-14');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const currentEmpCheckin = bangChamCongs.find(
    b => b.MaNhanVien === currentTaiKhoan.MaNhanVien && b.Ngay === filterDate
  );

  const filteredAttendance = bangChamCongs.filter(b => {
    const matchesSearch =
      (b.TenNhanVien && b.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.MaNhanVien.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || b.TrangThai === filterStatus;
    const matchesDate = !filterDate || b.Ngay === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const onTimeCount = bangChamCongs.filter(b => b.TrangThai === 'DUNG_GIO').length;
  const lateCount = bangChamCongs.filter(b => b.TrangThai === 'DI_MUON').length;
  const leaveCount = bangChamCongs.filter(b => b.TrangThai === 'NGHI_PHEP').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-6 w-6 text-indigo-600" />
            Chấm Công & Điểm Danh
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi bảng chấm công hàng ngày và quản lý điểm danh nhân viên
          </p>
        </div>

        {/* Action check-in for current active user */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="px-2">
            <p className="text-[11px] text-slate-400">Bạn đang đăng nhập:</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {currentTaiKhoan.TenNhanVien || currentTaiKhoan.TenDangNhap}
            </p>
          </div>
          <button
            onClick={() => checkInToday(currentTaiKhoan.MaNhanVien)}
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-700"
          >
            Check-in Hôm Nay
          </button>
          <button
            onClick={() => checkOutToday(currentTaiKhoan.MaNhanVien)}
            className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-amber-700"
          >
            Check-out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Đúng Giờ</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">{onTimeCount}</p>
          <span className="text-[11px] text-slate-400">Trạng thái DUNG_GIO</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Đi Muộn</span>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">{lateCount}</p>
          <span className="text-[11px] text-slate-400">Trạng thái DI_MUON</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Nghỉ Có Phép</span>
          <p className="mt-2 text-2xl font-extrabold text-indigo-600">{leaveCount}</p>
          <span className="text-[11px] text-slate-400">Trạng thái NGHI_PHEP</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Đã Điểm Danh</span>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {bangChamCongs.filter(b => b.DaChamCong).length}
          </p>
          <span className="text-[11px] text-slate-400">Thuộc tính DaChamCong</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên nhân viên, mã nhân viên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="bg-transparent outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DUNG_GIO">Đúng giờ</option>
            <option value="DI_MUON">Đi muộn</option>
            <option value="VE_SOM">Về sớm</option>
            <option value="NGHI_PHEP">Nghỉ phép</option>
            <option value="VANG_MAT">Vắng mặt</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 pl-6">Mã Công</th>
                <th className="py-3.5 px-3">Nhân Viên (DiemDanh)</th>
                <th className="py-3.5 px-3">Thời Điểm (NgayGio)</th>
                <th className="py-3.5 px-3">Giờ Vào</th>
                <th className="py-3.5 px-3">Giờ Ra</th>
                <th className="py-3.5 px-3">Số Giờ Làm</th>
                <th className="py-3.5 px-3">Đã Chấm Công</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 pr-6 text-right">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttendance.map(b => (
                <tr key={b.MaChamCong} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {b.MaChamCong}
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {b.TenNhanVien}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">{b.MaNhanVien}</p>
                  </td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                    {b.Ngay}
                  </td>
                  <td className="py-4 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {b.GioVao || '--:--'}
                  </td>
                  <td className="py-4 px-3 font-semibold text-amber-600 dark:text-amber-400">
                    {b.GioRa || '--:--'}
                  </td>
                  <td className="py-4 px-3 font-bold text-slate-800 dark:text-slate-200">
                    {b.SoGioLam || 0} giờ
                  </td>
                  <td className="py-4 px-3">
                    {b.DaChamCong ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đúng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <XCircle className="h-3.5 w-3.5" /> Chưa
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        b.TrangThai === 'DUNG_GIO'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : b.TrangThai === 'DI_MUON'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : b.TrangThai === 'VE_SOM'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}
                    >
                      {b.TrangThai}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right text-slate-400 text-[11px]">
                    {b.GhiChu || '--'}
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy dữ liệu điểm danh cho ngày đã chọn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
