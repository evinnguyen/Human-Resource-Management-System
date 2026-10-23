'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { NhanVien, TrangThaiLamViec } from '@/types/hrms';
import { X, UserPlus, Upload, Shield } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NhanVien | null;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { phongBans, chucDanhs, nhanViens, addNhanVien, updateNhanVien } = useHrms();

  const [formData, setFormData] = useState({
    HoTen: initialData?.HoTen || '',
    NgaySinh: initialData?.NgaySinh || '1995-01-01',
    GioiTinh: initialData?.GioiTinh || ('Nam' as 'Nam' | 'Nữ' | 'Khác'),
    CCCD: initialData?.CCCD || '',
    SDT: initialData?.SDT || '',
    Email: initialData?.Email || '',
    Avatar:
      initialData?.Avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    TrangThaiLamViec: initialData?.TrangThaiLamViec || ('DANG_LAM_VIEC' as TrangThaiLamViec),
    NgayVaoLam: initialData?.NgayVaoLam || '2024-03-14',
    MaPhongBan: initialData?.MaPhongBan || phongBans[0]?.MaPhongBan || 'PB01',
    MaChucDanh: initialData?.MaChucDanh || chucDanhs[0]?.MaChucDanh || 'CD01',
    MaQuanLy: initialData?.MaQuanLy || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.HoTen || !formData.Email) {
      alert('Vui lòng điền họ tên và email hợp lệ');
      return;
    }

    if (initialData) {
      updateNhanVien(initialData.MaNhanVien, {
        ...formData,
        MaQuanLy: formData.MaQuanLy || null,
      });
    } else {
      addNhanVien({
        ...formData,
        MaQuanLy: formData.MaQuanLy || null,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? 'Chỉnh Sửa Hồ Sơ Nhân Viên' : 'Thêm Nhân Viên Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Nhập thông tin lý lịch và phòng ban công tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* Row 1: Full name & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Họ và Tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.HoTen}
                onChange={e => setFormData({ ...formData, HoTen: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Email Công Ty <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.Email}
                onChange={e => setFormData({ ...formData, Email: e.target.value })}
                placeholder="a.nguyen@company.vn"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Row 2: Phone & CCCD */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Số Điện Thoại (SDT)
              </label>
              <input
                type="tel"
                value={formData.SDT}
                onChange={e => setFormData({ ...formData, SDT: e.target.value })}
                placeholder="0901234567"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Căn Cước Công Dân (CCCD)
              </label>
              <input
                type="text"
                value={formData.CCCD}
                onChange={e => setFormData({ ...formData, CCCD: e.target.value })}
                placeholder="07909500xxxx"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Row 3: Date of Birth & Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Ngày Sinh (NgaySinh)
              </label>
              <input
                type="date"
                value={formData.NgaySinh}
                onChange={e => setFormData({ ...formData, NgaySinh: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Giới Tính (GioiTinh)
              </label>
              <select
                value={formData.GioiTinh}
                onChange={e =>
                  setFormData({ ...formData, GioiTinh: e.target.value as 'Nam' | 'Nữ' | 'Khác' })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Row 4: Department & Position */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Phòng Ban (Thuộc PhongBan)
              </label>
              <select
                value={formData.MaPhongBan}
                onChange={e => setFormData({ ...formData, MaPhongBan: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {phongBans.map(pb => (
                  <option key={pb.MaPhongBan} value={pb.MaPhongBan}>
                    {pb.TenPhongBan} ({pb.MaPhongBan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Chức Danh (Giữ ChucDanh)
              </label>
              <select
                value={formData.MaChucDanh}
                onChange={e => setFormData({ ...formData, MaChucDanh: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {chucDanhs.map(cd => (
                  <option key={cd.MaChucDanh} value={cd.MaChucDanh}>
                    {cd.TenChucDanh} ({cd.CapBac})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Direct Manager (Self-relation CDM: Quan Ly) & Start Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Người Quản Lý Trực Tiếp (Quan hệ: Quan Ly)
              </label>
              <select
                value={formData.MaQuanLy}
                onChange={e => setFormData({ ...formData, MaQuanLy: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="">-- Không có (Ban Giám Đốc) --</option>
                {nhanViens
                  .filter(n => (initialData ? n.MaNhanVien !== initialData.MaNhanVien : true))
                  .map(nv => (
                    <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                      {nv.HoTen} ({nv.TenChucDanh || nv.MaNhanVien})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Ngày Vào Làm (NgayVaoLam)
              </label>
              <input
                type="date"
                value={formData.NgayVaoLam}
                onChange={e => setFormData({ ...formData, NgayVaoLam: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Row 6: Work Status & Avatar URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Trạng Thái Làm Việc
              </label>
              <select
                value={formData.TrangThaiLamViec}
                onChange={e =>
                  setFormData({ ...formData, TrangThaiLamViec: e.target.value as TrangThaiLamViec })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="DANG_LAM_VIEC">Đang làm việc</option>
                <option value="THU_VIEC">Thử việc</option>
                <option value="NGHI_PHEP">Nghỉ phép tạm thời</option>
                <option value="DA_NGHI_VIEC">Đã thôi việc</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Ảnh Đại Diện (URL Avatar)
              </label>
              <input
                type="url"
                value={formData.Avatar}
                onChange={e => setFormData({ ...formData, Avatar: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              {initialData ? 'Cập Nhật Hồ Sơ' : 'Lưu Nhân Viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
