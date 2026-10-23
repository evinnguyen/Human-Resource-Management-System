'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { PhongBan, ChucDanh } from '@/types/hrms';
import {
  Building2,
  Briefcase,
  Plus,
  Users,
  Search,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

export const PhongBanChucDanhView: React.FC = () => {
  const { phongBans, chucDanhs, nhanViens } = useHrms();

  const [activeTab, setActiveTab] = useState<'phong-ban' | 'chuc-danh'>('phong-ban');
  const [selectedDept, setSelectedDept] = useState<PhongBan | null>(phongBans[0] || null);

  // Employees in currently selected department
  const deptEmployees = selectedDept
    ? nhanViens.filter(n => n.MaPhongBan === selectedDept.MaPhongBan)
    : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            Cơ Cấu Tổ Chức & Vị Trí Công Việc
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý cơ cấu tổ chức phòng ban và hệ thống chức danh vị trí công việc
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('phong-ban')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === 'phong-ban'
                ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Phòng Ban ({phongBans.length})
          </button>
          <button
            onClick={() => setActiveTab('chuc-danh')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === 'chuc-danh'
                ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Chức Danh ({chucDanhs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PHONG BAN */}
      {activeTab === 'phong-ban' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department List (Left column) */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Danh Sách Phòng Ban
              </span>
            </div>

            {phongBans.map(pb => {
              const isSelected = selectedDept?.MaPhongBan === pb.MaPhongBan;
              const count = nhanViens.filter(n => n.MaPhongBan === pb.MaPhongBan).length;

              return (
                <div
                  key={pb.MaPhongBan}
                  onClick={() => setSelectedDept(pb)}
                  className={`cursor-pointer rounded-2xl border p-4 transition duration-150 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {pb.MaPhongBan}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {pb.TenPhongBan}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {pb.MoTa}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {count} NV
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span>Trưởng phòng: <strong>{pb.TenTruongPhong || 'Chưa bổ nhiệm'}</strong></span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Detail & Member Roster (Right column) */}
          <div className="lg:col-span-2">
            {selectedDept ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Mã Phòng: {selectedDept.MaPhongBan}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedDept.TenPhongBan}
                      </h3>
                    </div>
                    <span className="rounded-xl bg-indigo-50 px-3 py-1 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs">
                      {deptEmployees.length} Nhân sự trực thuộc
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    {selectedDept.MoTa}
                  </p>
                </div>

                {/* Leader Info */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Trưởng Bộ Phận / Lãnh Đạo
                  </span>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {selectedDept.TenTruongPhong || 'Chưa có trưởng phòng'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Mã nhân viên: {selectedDept.MaTruongPhong || 'N/A'}
                  </p>
                </div>

                {/* Member Table */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                    Danh Sách Nhân Viên Thuộc Phòng ({deptEmployees.length})
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800">
                        <tr>
                          <th className="p-3">Nhân Viên</th>
                          <th className="p-3">Mã NV</th>
                          <th className="p-3">Chức Danh</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {deptEmployees.map(emp => (
                          <tr key={emp.MaNhanVien} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <img
                                src={emp.Avatar}
                                alt={emp.HoTen}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              {emp.HoTen}
                            </td>
                            <td className="p-3 font-mono font-bold text-indigo-600">{emp.MaNhanVien}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{emp.TenChucDanh}</td>
                            <td className="p-3 text-slate-500">{emp.Email}</td>
                            <td className="p-3">
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                {emp.TrangThaiLamViec}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400">
                Chọn một phòng ban để xem chi tiết
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHUC DANH */}
      {activeTab === 'chuc-danh' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Danh Mục Vị Trí & Chức Danh Doanh Nghiệp (Thực thể ChucDanh)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="p-3.5 pl-6">Mã Chức Danh</th>
                  <th className="p-3.5">Tên Chức Danh</th>
                  <th className="p-3.5">Phòng Ban Trực Thuộc</th>
                  <th className="p-3.5">Cấp Bậc (Level)</th>
                  <th className="p-3.5 pr-6 text-right">Số Nhân Sự Đang Giữ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chucDanhs.map(cd => {
                  const count = nhanViens.filter(n => n.MaChucDanh === cd.MaChucDanh).length;
                  return (
                    <tr key={cd.MaChucDanh} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {cd.MaChucDanh}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {cd.TenChucDanh}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {cd.TenPhongBan}
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {cd.CapBac}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right font-bold text-slate-900 dark:text-white">
                        {count} người
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
