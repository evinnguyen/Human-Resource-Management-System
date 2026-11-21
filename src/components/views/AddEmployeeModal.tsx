'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { NhanVien, TrangThaiLamViec } from '@/types/hrms';
import { X, UserPlus, AlertCircle, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { AvatarUpload } from '@/components/common/ImageUpload';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NhanVien | null;
}

// Thuật toán duyệt đồ thị (BFS) tìm toàn bộ danh sách cấp dưới (trực tiếp & gián tiếp)
// nhằm ngăn chặn triệt để vòng lặp chu trình quản lý luẩn quẩn (A quản lý B, B quản lý A)
const getDescendantIds = (rootId: string, allEmployees: NhanVien[]): Set<string> => {
  const descendants = new Set<string>();
  const queue = [rootId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const directReports = allEmployees.filter(e => e.MaQuanLy === currentId);
    for (const report of directReports) {
      if (!descendants.has(report.MaNhanVien)) {
        descendants.add(report.MaNhanVien);
        queue.push(report.MaNhanVien);
      }
    }
  }
  return descendants;
};

// Hàm tính tuổi chính xác theo ngày tháng năm
const calculateAge = (dobString: string, refDateString: string): number => {
  if (!dobString || !refDateString) return 0;
  const dob = new Date(dobString);
  const refDate = new Date(refDateString);
  let age = refDate.getFullYear() - dob.getFullYear();
  const m = refDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách những người quản lý hợp lệ (Đã loại bỏ chính mình và TOÀN BỘ cấp dưới)
  const eligibleManagers = useMemo(() => {
    if (!initialData) {
      return nhanViens.filter(n => n.TrangThaiLamViec !== 'DA_NGHI_VIEC');
    }
    const descendantIds = getDescendantIds(initialData.MaNhanVien, nhanViens);
    return nhanViens.filter(
      n =>
        n.MaNhanVien !== initialData.MaNhanVien &&
        !descendantIds.has(n.MaNhanVien) &&
        n.TrangThaiLamViec !== 'DA_NGHI_VIEC'
    );
  }, [initialData, nhanViens]);

  // Tự động điền đầy đủ dữ liệu khi mở form chỉnh sửa hoặc reset khi thêm mới
  useEffect(() => {
    if (initialData) {
      setFormData({
        HoTen: initialData.HoTen || '',
        NgaySinh: initialData.NgaySinh ? initialData.NgaySinh.slice(0, 10) : '1995-01-01',
        GioiTinh: (initialData.GioiTinh as 'Nam' | 'Nữ' | 'Khác') || 'Nam',
        CCCD: initialData.CCCD || '',
        SDT: initialData.SDT || '',
        Email: initialData.Email || '',
        Avatar:
          initialData.Avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        TrangThaiLamViec: (initialData.TrangThaiLamViec as TrangThaiLamViec) || 'DANG_LAM_VIEC',
        NgayVaoLam: initialData.NgayVaoLam ? initialData.NgayVaoLam.slice(0, 10) : '2024-03-14',
        MaPhongBan: initialData.MaPhongBan || phongBans[0]?.MaPhongBan || 'PB01',
        MaChucDanh: initialData.MaChucDanh || chucDanhs[0]?.MaChucDanh || 'CD01',
        MaQuanLy: initialData.MaQuanLy || '',
      });
      setErrorMessage(null);
    } else {
      setFormData({
        HoTen: '',
        NgaySinh: '1995-01-01',
        GioiTinh: 'Nam',
        CCCD: '',
        SDT: '',
        Email: '',
        Avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        TrangThaiLamViec: 'DANG_LAM_VIEC',
        NgayVaoLam: '2024-03-14',
        MaPhongBan: phongBans[0]?.MaPhongBan || 'PB01',
        MaChucDanh: chucDanhs[0]?.MaChucDanh || 'CD01',
        MaQuanLy: '',
      });
      setErrorMessage(null);
    }
  }, [initialData, isOpen, phongBans, chucDanhs]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. RÀNG BUỘC THÔNG TIN BẮT BUỘC
    const trimmedName = formData.HoTen.trim();
    const trimmedEmail = formData.Email.trim().toLowerCase();
    const trimmedCCCD = formData.CCCD.trim();
    const trimmedSDT = formData.SDT.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Họ và tên nhân viên không được để trống (tối thiểu 2 ký tự)');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Vui lòng nhập email công ty hợp lệ');
      return;
    }

    // 2. RÀNG BUỘC ĐỘ TUỔI LAO ĐỘNG (>= 18 tuổi)
    const ageAtHire = calculateAge(formData.NgaySinh, formData.NgayVaoLam);
    if (ageAtHire < 18) {
      setErrorMessage(
        `Quy định Bộ luật Lao động: Nhân viên phải từ đủ 18 tuổi trở lên tại ngày vào làm (Hiện tại tính được: ${ageAtHire} tuổi). Vui lòng kiểm tra lại Ngày sinh hoặc Ngày vào làm.`
      );
      return;
    }

    // 3. RÀNG BUỘC ĐỊNH DẠNG CCCD (12 chữ số)
    if (trimmedCCCD && !/^[0-9]{12}$/.test(trimmedCCCD)) {
      setErrorMessage('Căn cước công dân (CCCD) phải gồm đúng 12 chữ số hợp lệ.');
      return;
    }

    // 4. RÀNG BUỘC ĐỊNH DẠNG SỐ ĐIỆN THOẠI (10 số, đầu số VN)
    if (trimmedSDT && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(trimmedSDT)) {
      setErrorMessage('Số điện thoại không hợp lệ (phải gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09).');
      return;
    }

    // 5. RÀNG BUỘC DUY NHẤT EMAIL (Không được trùng lặp)
    const duplicateEmail = nhanViens.find(
      n =>
        n.Email.trim().toLowerCase() === trimmedEmail &&
        (!initialData || n.MaNhanVien !== initialData.MaNhanVien)
    );
    if (duplicateEmail) {
      setErrorMessage(`Email "${trimmedEmail}" đã được sử dụng bởi nhân viên ${duplicateEmail.HoTen} (${duplicateEmail.MaNhanVien}).`);
      return;
    }

    // 6. RÀNG BUỘC DUY NHẤT CCCD (Không được trùng lặp)
    if (trimmedCCCD) {
      const duplicateCCCD = nhanViens.find(
        n =>
          n.CCCD &&
          n.CCCD.trim() === trimmedCCCD &&
          (!initialData || n.MaNhanVien !== initialData.MaNhanVien)
      );
      if (duplicateCCCD) {
        setErrorMessage(`Số CCCD "${trimmedCCCD}" đã tồn tại trên hồ sơ của ${duplicateCCCD.HoTen} (${duplicateCCCD.MaNhanVien}).`);
        return;
      }
    }

    // 7. RÀNG BUỘC CHU TRÌNH QUẢN LÝ
    if (initialData && formData.MaQuanLy) {
      const descendantIds = getDescendantIds(initialData.MaNhanVien, nhanViens);
      if (formData.MaQuanLy === initialData.MaNhanVien || descendantIds.has(formData.MaQuanLy)) {
        setErrorMessage('Lỗi quan hệ tổ chức: Không thể chọn chính mình hoặc nhân viên cấp dưới làm người quản lý trực tiếp!');
        return;
      }
    }

    // Tiến hành lưu
    const payload = {
      ...formData,
      HoTen: trimmedName,
      Email: trimmedEmail,
      CCCD: trimmedCCCD,
      SDT: trimmedSDT,
      MaQuanLy: formData.MaQuanLy || null,
    };

    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateNhanVien(initialData.MaNhanVien, payload);
        alert(`Cập nhật hồ sơ nhân viên "${trimmedName}" thành công!`);
      } else {
        await addNhanVien(payload);
        alert(`Thêm nhân viên mới "${trimmedName}" thành công vào hệ thống!`);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi lưu dữ liệu lên máy chủ backend!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
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
                Tuân thủ ràng buộc pháp lý, độ tuổi lao động và cấu trúc phòng ban
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

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <span className="font-bold">Cảnh báo vi phạm ràng buộc:</span>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

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
                Số Điện Thoại (10 số)
              </label>
              <input
                type="tel"
                value={formData.SDT}
                onChange={e => setFormData({ ...formData, SDT: e.target.value })}
                placeholder="0901234567"
                maxLength={10}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Căn Cước Công Dân (Đúng 12 số)
              </label>
              <input
                type="text"
                value={formData.CCCD}
                onChange={e => setFormData({ ...formData, CCCD: e.target.value })}
                placeholder="079095001234"
                maxLength={12}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Row 3: Date of Birth & Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Ngày Sinh (Đủ 18 tuổi trở lên) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.NgaySinh}
                onChange={e => setFormData({ ...formData, NgaySinh: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Giới Tính
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
                Phòng Ban Trực Thuộc
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
                Vị Trí Chức Danh
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

          {/* Row 5: Direct Manager (Self-relation CDM: Quan Ly - Chặn vòng lặp chu trình) & Start Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Người Quản Lý Trực Tiếp (Đã lọc chặn vòng lặp)
              </label>
              <select
                value={formData.MaQuanLy}
                onChange={e => setFormData({ ...formData, MaQuanLy: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="">-- Không có (Cấp cao nhất / Ban Giám Đốc) --</option>
                {eligibleManagers.map(nv => (
                  <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                    {nv.HoTen} ({nv.TenChucDanh || nv.MaNhanVien})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-400">
                * Tự động loại bỏ chính nhân viên này và toàn bộ cấp dưới để tránh lỗi vòng lặp quản lý luẩn quẩn.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Ngày Vào Làm
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
                <option value="NGHI_PHEP">Nghỉ phép</option>
                <option value="DA_NGHI_VIEC">Đã thôi việc (Lưu trữ lịch sử)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ảnh Đại Diện (Avatar - Không cần link)
              </label>
              <AvatarUpload
                value={formData.Avatar}
                onChange={url => setFormData({ ...formData, Avatar: url })}
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập Nhật Hồ Sơ' : 'Lưu Nhân Viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
