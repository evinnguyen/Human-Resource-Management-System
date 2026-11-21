'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { NhanVien } from '@/types/hrms';
import {
  formatTrangThaiLamViec,
  formatTrangThaiHopDong,
  formatTrangThaiChamCong,
  formatTrangThaiDonNP,
} from '@/utils/formatters';
import {
  X,
  User,
  Building2,
  Briefcase,
  FileText,
  Clock,
  Calendar,
  GraduationCap,
  FolderArchive,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Network,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Camera,
  Loader2,
} from 'lucide-react';
import { uploadApi } from '@/services/api';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: NhanVien | null;
  onEdit: (employee: NhanVien) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
}) => {
  const {
    nhanViens,
    hopDongs,
    donNghiPheps,
    bangChamCongs,
    quaTrinhDaoTaos,
    taiLieus,
    currentTaiKhoan,
    updateNhanVien,
  } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const canEditThisProfile =
    ['ROLE_ADMIN', 'ROLE_HR_MANAGER'].includes(userRole) ||
    currentTaiKhoan?.MaNhanVien === employee?.MaNhanVien;

  const [activeTab, setActiveTab] = useState<'info' | 'contracts' | 'attendance' | 'leaves' | 'training' | 'documents'>('info');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employee) return;
    try {
      setIsUploadingAvatar(true);
      const res = await uploadApi.uploadFile(file, 'avatars');
      await updateNhanVien(employee.MaNhanVien, { ...employee, Avatar: res.url });
    } catch (err: any) {
      alert('Lỗi cập nhật ảnh đại diện: ' + (err?.message || 'Không thể tải ảnh lên'));
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  if (!isOpen || !employee) return null;

  // Subordinates: employees managed by this employee (Self-relation CDM: Quan Ly)
  const subordinates = nhanViens.filter(n => n.MaQuanLy === employee.MaNhanVien);

  // Contracts of this employee
  const empContracts = hopDongs.filter(h => h.MaNhanVien === employee.MaNhanVien);

  // Attendance of this employee
  const empAttendance = bangChamCongs.filter(b => b.MaNhanVien === employee.MaNhanVien);

  // Leave requests of this employee
  const empLeaves = donNghiPheps.filter(d => d.MaNhanVien === employee.MaNhanVien);

  // Training progress of this employee
  const empTrainings = quaTrinhDaoTaos.filter(q => q.MaNhanVien === employee.MaNhanVien);

  // Documents owned by this employee
  const empDocuments = taiLieus.filter(t => t.MaNhanVien === employee.MaNhanVien);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header with Avatar & Basic Info */}
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white dark:border-slate-800">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarFile}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
              className="relative group h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl cursor-pointer flex-shrink-0"
              title="Nhấn để đổi ảnh đại diện trực tiếp"
            >
              <img
                src={employee.Avatar}
                alt={employee.HoTen}
                className="h-full w-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold">Đổi ảnh</span>
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold">{employee.HoTen}</h2>
                <span className="rounded-md bg-indigo-500/30 border border-indigo-400/30 px-2 py-0.5 text-xs font-mono font-bold text-indigo-200">
                  {employee.MaNhanVien}
                </span>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    employee.TrangThaiLamViec === 'DANG_LAM_VIEC'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : employee.TrangThaiLamViec === 'THU_VIEC'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {formatTrangThaiLamViec(employee.TrangThaiLamViec)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.TenChucDanh || 'Chức danh chưa cập nhật'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {employee.TenPhongBan || 'Phòng ban chưa phân'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Gia nhập: {employee.NgayVaoLam}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  {employee.Email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  {employee.SDT}
                </span>
              </div>
            </div>

            {canEditThisProfile && (
              <div className="self-center sm:self-start">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(employee);
                  }}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
                >
                  Chỉnh Sửa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto text-xs font-semibold dark:border-slate-800 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('info')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Thông Tin Chi Tiết & Phân Cấp
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Hợp Đồng ({empContracts.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Chấm Công
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'leaves'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Đơn Nghỉ Phép ({empLeaves.length})
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Đào Tạo & Kỹ Năng ({empTrainings.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`border-b-2 py-3 px-3 transition whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tài Liệu Hồ Sơ ({empDocuments.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {/* TAB 1: General Info & Management Hierarchy */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Detailed personal data */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Thông Tin Cá Nhân Nhân Viên
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div>
                    <span className="text-slate-400">Mã Nhân Viên</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.MaNhanVien}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Họ và Tên</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.HoTen}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Ngày Sinh</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.NgaySinh}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Giới Tính</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.GioiTinh}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">CCCD</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.CCCD}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Số Điện Thoại</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.SDT}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email Doanh Nghiệp</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.Email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Ngày Vào Làm</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.NgayVaoLam}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phòng Ban Trực Thuộc</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{employee.TenPhongBan} ({employee.MaPhongBan})</p>
                  </div>
                </div>
              </div>

              {/* Hierarchy: Manager & Subordinates */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4 text-indigo-600" />
                  Mối Quan Hệ Quản Lý & Báo Cáo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Direct Manager */}
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Cấp Trên Trực Tiếp (Người Quản Lý)
                    </span>
                    {employee.TenQuanLy ? (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                          {employee.TenQuanLy.slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {employee.TenQuanLy}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Mã QL: {employee.MaQuanLy}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-500 italic">
                        Thuộc Ban Giám Đốc (Không có người quản lý trực tiếp)
                      </p>
                    )}
                  </div>

                  {/* Subordinates */}
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Nhân Sự Cấp Dưới Trực Thuộc ({subordinates.length})
                    </span>
                    {subordinates.length > 0 ? (
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {subordinates.map(sub => (
                          <div
                            key={sub.MaNhanVien}
                            className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50"
                          >
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {sub.HoTen}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {sub.TenChucDanh}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-500 italic">
                        Không quản lý nhân viên nào
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Contracts (HopDong) */}
          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Danh Sách Hợp Đồng Lao Động (Thực thể HopDong & LoaiHopDong)
                </h4>
              </div>

              {empContracts.length > 0 ? (
                empContracts.map(hd => (
                  <div
                    key={hd.MaHopDong}
                    className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {hd.MaHopDong}
                        </span>
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          {hd.TenLoaiHopDong}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {formatTrangThaiHopDong(hd.TrangThaiHopDong)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400">Ngày Bắt Đầu:</span>
                        <p className="font-semibold">{hd.NgayBatDau}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ngày Kết Thúc:</span>
                        <p className="font-semibold">{hd.NgayKetThuc}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Mức Lương:</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">
                          {hd.MucLuong.toLocaleString('vi-VN')} VND/tháng
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  Chưa có thông tin hợp đồng được ghi nhận
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Attendance (BangChamCong) */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Lịch Sử Chấm Công (Thực thể BangChamCong & ThoiDiem)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800">
                    <tr>
                      <th className="p-3">Mã Công</th>
                      <th className="p-3">Ngày</th>
                      <th className="p-3">Giờ Vào</th>
                      <th className="p-3">Giờ Ra</th>
                      <th className="p-3">Số Giờ</th>
                      <th className="p-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {empAttendance.map(b => (
                      <tr key={b.MaChamCong}>
                        <td className="p-3 font-mono font-bold text-indigo-600">{b.MaChamCong}</td>
                        <td className="p-3">{b.Ngay}</td>
                        <td className="p-3 font-semibold text-emerald-600">{b.GioVao || '--:--'}</td>
                        <td className="p-3 font-semibold text-amber-600">{b.GioRa || '--:--'}</td>
                        <td className="p-3">{b.SoGioLam || 0}h</td>
                        <td className="p-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {formatTrangThaiChamCong(b.TrangThai)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {empAttendance.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400">
                          Chưa có dữ liệu chấm công gần đây
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Leave Requests (DonNghiPhep) */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Đơn Xin Nghỉ Phép (Thực thể DonNghiPhep)
              </h4>
              <div className="space-y-3">
                {empLeaves.map(don => (
                  <div
                    key={don.MaDonNP}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">{don.MaDonNP}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          don.TrangThaiDNP === 'DA_DUYET'
                            ? 'bg-emerald-100 text-emerald-800'
                            : don.TrangThaiDNP === 'CHO_DUYET'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {formatTrangThaiDonNP(don.TrangThaiDNP)}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      Lý do: &ldquo;{don.LyDo}&rdquo;
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-slate-400">
                      <span>Thời gian: {don.TuNgay} → {don.DenNgay} ({don.SoNgayNghi} ngày)</span>
                      <span>Ngày gửi: {don.NgayGui}</span>
                      <span>Người duyệt: {don.TenNguoiDuyet || 'Chưa duyệt'}</span>
                    </div>
                    {don.PhanHoi && (
                      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-indigo-600 dark:bg-slate-700/50 dark:text-indigo-300">
                        Phản hồi quản lý: {don.PhanHoi}
                      </p>
                    )}
                  </div>
                ))}
                {empLeaves.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    Nhân viên chưa gửi đơn nghỉ phép nào
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Training (QuaTrinhDaoTao & KyNang) */}
          {activeTab === 'training' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Quá Trình Đào Tạo & Kỹ Năng Đánh Giá (QuaTrinhDaoTao & KyNang)
              </h4>
              <div className="space-y-3">
                {empTrainings.map(qtdt => (
                  <div
                    key={qtdt.MaQuaTrinh}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {qtdt.TenKhoa}
                      </span>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                        {qtdt.TenKyNang}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Tiến độ hoàn thành:</span>
                        <span className="font-bold">{qtdt.TienDo}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${qtdt.TienDo}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-slate-500">
                      <span>Kết quả: <strong>{qtdt.KetQua}</strong></span>
                      {qtdt.DiemSo && <span>Điểm đánh giá: <strong>{qtdt.DiemSo}/10</strong></span>}
                    </div>
                  </div>
                ))}
                {empTrainings.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    Chưa có khóa đào tạo nào được phân công
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Documents (TaiLieu & LoaiTaiLieu) */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Tài Liệu Hồ Sơ Nhân Viên Sở Hữu (Thực thể TaiLieu & LoaiTaiLieu)
              </h4>
              <div className="space-y-2">
                {empDocuments.map(tl => (
                  <div
                    key={tl.MaTL}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{tl.TenTL}</p>
                        <p className="text-[11px] text-slate-400">
                          {tl.TenLoaiTL} • {tl.KichThuoc} • Tải lên: {tl.NgayTaiLen}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mở xem tài liệu: ${tl.TenTL}`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Xem Tài Liệu
                    </button>
                  </div>
                ))}
                {empDocuments.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    Chưa có tài liệu đính kèm nào được tải lên
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
