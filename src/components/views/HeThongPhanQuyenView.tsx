'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { TaiKhoan, Role, Quyen } from '@/types/hrms';
import {
  ShieldAlert,
  Key,
  ShieldCheck,
  Activity,
  UserCheck,
  Plus,
  Lock,
  Unlock,
  Search,
  CheckCircle2,
  X,
  History,
} from 'lucide-react';

export const HeThongPhanQuyenView: React.FC = () => {
  const {
    taiKhoans,
    roles,
    quyens,
    nhatKyHoatDongs,
    nhanViens,
    addTaiKhoan,
    toggleTaiKhoanStatus,
  } = useHrms();

  const [activeTab, setActiveTab] = useState<'tai-khoan' | 'vai-tro-quyen' | 'nhat-ky'>('tai-khoan');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // New account state
  const [accountForm, setAccountForm] = useState({
    TenDangNhap: '',
    MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
    MaRole: roles[0]?.MaRole || 'ROLE_EMPLOYEE',
    TrangThaiTK: 'HOAT_DONG' as const,
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.TenDangNhap) {
      alert('Vui lòng nhập tên đăng nhập');
      return;
    }
    addTaiKhoan(accountForm);
    setIsAddAccountModalOpen(false);
    setAccountForm({
      TenDangNhap: '',
      MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
      MaRole: roles[0]?.MaRole || 'ROLE_EMPLOYEE',
      TrangThaiTK: 'HOAT_DONG',
    });
  };

  const filteredLogs = nhatKyHoatDongs.filter(log =>
    log.HanhDong.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.TenDangNhap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-indigo-600" />
            Hệ Thống, Phân Quyền & Nhật Ký Hoạt Động
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý tài khoản người dùng, phân quyền truy cập và nhật ký hoạt động hệ thống
          </p>
        </div>

        <button
          onClick={() => setIsAddAccountModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Cấp Tài Khoản Mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('tai-khoan')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'tai-khoan'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Tài Khoản Người Dùng ({taiKhoans.length})
        </button>
        <button
          onClick={() => setActiveTab('vai-tro-quyen')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'vai-tro-quyen'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Vai Trò & Quyền Hạn ({roles.length} Roles)
        </button>
        <button
          onClick={() => setActiveTab('nhat-ky')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'nhat-ky'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Nhật Ký Audit Logs ({nhatKyHoatDongs.length})
        </button>
      </div>

      {/* TAB 1: TAI KHOAN */}
      {activeTab === 'tai-khoan' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 pl-6">Mã TK (PK)</th>
                  <th className="py-3.5 px-3">Tên Đăng Nhập (TenDangNhap)</th>
                  <th className="py-3.5 px-3">Nhân Viên Liên Kết (Co TaiKhoan)</th>
                  <th className="py-3.5 px-3">Vai Trò (Co Role)</th>
                  <th className="py-3.5 px-3">Trạng Thái (TrangThaiTK)</th>
                  <th className="py-3.5 px-3">Ngày Tạo / Đăng Nhập Cuối</th>
                  <th className="py-3.5 pr-6 text-right">Khóa / Mở Khóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {taiKhoans.map(tk => (
                  <tr key={tk.MaTK} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {tk.MaTK}
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        @{tk.TenDangNhap}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {tk.TenNhanVien}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">{tk.MaNhanVien}</p>
                    </td>
                    <td className="py-4 px-3">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {tk.TenRole}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          tk.TrangThaiTK === 'HOAT_DONG'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {tk.TrangThaiTK === 'HOAT_DONG' ? 'Đang hoạt động' : 'Đã bị khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-500">
                      <p>Tạo: {tk.NgayTao}</p>
                      <p className="text-[10px] text-slate-400">
                        Đăng nhập: {tk.LanDangNhapCuoi || 'Chưa'}
                      </p>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => toggleTaiKhoanStatus(tk.MaTK)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          tk.TrangThaiTK === 'HOAT_DONG'
                            ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {tk.TrangThaiTK === 'HOAT_DONG' ? (
                          <>
                            <Lock className="h-3 w-3" /> Khóa
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" /> Mở khóa
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VAI TRO & QUYEN HAN */}
      {activeTab === 'vai-tro-quyen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roles list */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Danh Mục Vai Trò (Thực thể Role & Quan hệ Co Role)
            </h3>
            {roles.map(r => (
              <div
                key={r.MaRole}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {r.MaRole}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {taiKhoans.filter(t => t.MaRole === r.MaRole).length} Tài khoản
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {r.TenRole}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  {r.MoTa}
                </p>
              </div>
            ))}
          </div>

          {/* Permissions catalogue */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Danh Mục Quyền Hạn (Thực thể Quyen & Quan hệ Co Quyen)
            </h3>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              {quyens.map(q => (
                <div
                  key={q.MaQuyen}
                  className="flex items-center justify-between border-b border-slate-100 pb-2.5 last:border-0 dark:border-slate-800"
                >
                  <div>
                    <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {q.MaQuyen}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {q.TenQuyen}
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Module: {q.Module}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NHAT KY HOAT DONG */}
      {activeTab === 'nhat-ky' && (
        <div className="space-y-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo hành động, người dùng..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
                  <tr>
                    <th className="py-3.5 pl-6">Mã Nhật Ký</th>
                    <th className="py-3.5 px-3">Thời Gian (ThoiGian)</th>
                    <th className="py-3.5 px-3">Tài Khoản (Thuc Hien)</th>
                    <th className="py-3.5 px-3">Hành Động (HanhDong)</th>
                    <th className="py-3.5 px-3">Loại Thao Tác</th>
                    <th className="py-3.5 pr-6 text-right">Chi Tiết / IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map(log => (
                    <tr key={log.MaNhatKy} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {log.MaNhatKy}
                      </td>
                      <td className="py-4 px-3 text-slate-500 font-mono">
                        {log.ThoiGian}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          @{log.TenDangNhap}
                        </span>
                        <p className="text-[10px] text-slate-400">{log.TenNhanVien}</p>
                      </td>
                      <td className="py-4 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {log.HanhDong}
                      </td>
                      <td className="py-4 px-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {log.LoaiHanhDong}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right text-slate-500">
                        <p>{log.ChiTiet || '--'}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{log.DiaChiIP}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Account */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Cấp Tài Khoản Người Dùng Mới</h3>
              <button onClick={() => setIsAddAccountModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tên Đăng Nhập (TenDangNhap) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="username..."
                  value={accountForm.TenDangNhap}
                  onChange={e => setAccountForm({ ...accountForm, TenDangNhap: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nhân Viên Liên Kết (Co TaiKhoan)
                </label>
                <select
                  value={accountForm.MaNhanVien}
                  onChange={e => setAccountForm({ ...accountForm, MaNhanVien: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {nhanViens.map(nv => (
                    <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                      {nv.HoTen} ({nv.MaNhanVien} - {nv.TenChucDanh})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Vai Trò Hệ Thống (Co Role)
                </label>
                <select
                  value={accountForm.MaRole}
                  onChange={e => setAccountForm({ ...accountForm, MaRole: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {roles.map(r => (
                    <option key={r.MaRole} value={r.MaRole}>
                      {r.TenRole}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
