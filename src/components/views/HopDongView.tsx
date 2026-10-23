'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { HopDong, TrangThaiHopDong } from '@/types/hrms';
import {
  FileSignature,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
} from 'lucide-react';

export const HopDongView: React.FC = () => {
  const { hopDongs, loaiHopDongs, nhanViens, addHopDong } = useHrms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoai, setSelectedLoai] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
    MaLoaiHopDong: loaiHopDongs[0]?.MaLoaiHopDong || 'LHD01',
    NgayBatDau: '2024-03-14',
    NgayKetThuc: '2025-12-31',
    MucLuong: 15000000,
    TrangThaiHopDong: 'CON_HIEU_LUC' as TrangThaiHopDong,
    GhiChu: '',
  });

  const filteredContracts = hopDongs.filter(hd => {
    const matchesSearch =
      hd.MaHopDong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hd.TenNhanVien && hd.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLoai = selectedLoai === 'ALL' || hd.MaLoaiHopDong === selectedLoai;
    const matchesStatus = selectedStatus === 'ALL' || hd.TrangThaiHopDong === selectedStatus;

    return matchesSearch && matchesLoai && matchesStatus;
  });

  const totalSalary = hopDongs
    .filter(h => h.TrangThaiHopDong === 'CON_HIEU_LUC')
    .reduce((sum, h) => sum + h.MucLuong, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addHopDong(formData);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-indigo-600" />
            Hợp Đồng Lao Động
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý thông tin, thời hạn và phân loại hợp đồng lao động của nhân viên
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Ký Hợp Đồng Mới
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Tổng Hợp Đồng Hiệu Lực</span>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {hopDongs.filter(h => h.TrangThaiHopDong === 'CON_HIEU_LUC').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Đang áp dụng</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Tổng Quỹ Lương Cơ Bản</span>
          <p className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {(totalSalary / 1000000).toLocaleString('vi-VN')} Tr VND
          </p>
          <span className="text-[11px] text-slate-400">Chi trả hàng tháng</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Phân Loại Hợp Đồng</span>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {loaiHopDongs.length} loại
          </p>
          <span className="text-[11px] text-slate-400">Thực thể LoaiHopDong</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hợp đồng, tên nhân viên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedLoai}
            onChange={e => setSelectedLoai(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả loại hợp đồng</option>
            {loaiHopDongs.map(l => (
              <option key={l.MaLoaiHopDong} value={l.MaLoaiHopDong}>
                {l.TenLoai}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CON_HIEU_LUC">Còn hiệu lực</option>
            <option value="HET_HAN">Hết hạn</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DA_CHAM_DUT">Đã chấm dứt</option>
          </select>
        </div>
      </div>

      {/* Contract Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 pl-6">Mã Hợp Đồng (PK)</th>
                <th className="py-3.5 px-3">Nhân Viên Ký</th>
                <th className="py-3.5 px-3">Loại Hợp Đồng</th>
                <th className="py-3.5 px-3">Thời Hạn</th>
                <th className="py-3.5 px-3">Mức Lương (VND)</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 pr-6 text-right">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContracts.map(hd => (
                <tr key={hd.MaHopDong} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {hd.MaHopDong}
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {hd.TenNhanVien}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">{hd.MaNhanVien}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {hd.TenLoaiHopDong}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                    <p>{hd.NgayBatDau} → {hd.NgayKetThuc}</p>
                  </td>
                  <td className="py-4 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {hd.MucLuong.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {hd.TrangThaiHopDong}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right text-slate-500 text-[11px]">
                    {hd.GhiChu || '--'}
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không có hợp đồng nào thỏa mãn điều kiện
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contract Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                Lập Hợp Đồng Lao Động Mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nhân Viên Ký Hợp Đồng
                </label>
                <select
                  value={formData.MaNhanVien}
                  onChange={e => setFormData({ ...formData, MaNhanVien: e.target.value })}
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
                  Loại Hợp Đồng (LoaiHopDong)
                </label>
                <select
                  value={formData.MaLoaiHopDong}
                  onChange={e => setFormData({ ...formData, MaLoaiHopDong: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {loaiHopDongs.map(l => (
                    <option key={l.MaLoaiHopDong} value={l.MaLoaiHopDong}>
                      {l.TenLoai}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Ngày Bắt Đầu
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.NgayBatDau}
                    onChange={e => setFormData({ ...formData, NgayBatDau: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Ngày Kết Thúc
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.NgayKetThuc}
                    onChange={e => setFormData({ ...formData, NgayKetThuc: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Mức Lương (VND)
                </label>
                <input
                  type="number"
                  required
                  step="500000"
                  value={formData.MucLuong}
                  onChange={e => setFormData({ ...formData, MucLuong: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Ghi Chú Hợp Đồng
                </label>
                <input
                  type="text"
                  value={formData.GhiChu}
                  onChange={e => setFormData({ ...formData, GhiChu: e.target.value })}
                  placeholder="Điều khoản bổ sung..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Lưu & Ký Hợp Đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
