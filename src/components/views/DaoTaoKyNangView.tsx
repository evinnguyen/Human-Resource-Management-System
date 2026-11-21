'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { KhoaDaoTao, QuaTrinhDaoTao, KetQuaDaoTao } from '@/types/hrms';
import { formatKetQuaDaoTao } from '@/utils/formatters';
import {
  GraduationCap,
  Award,
  Plus,
  BookOpen,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  X,
  Sparkles,
} from 'lucide-react';

export const DaoTaoKyNangView: React.FC = () => {
  const {
    khoaDaoTaos,
    quaTrinhDaoTaos,
    kyNangs,
    nhanViens,
    addKhoaDaoTao,
    assignDaoTao,
  } = useHrms();

  const [activeTab, setActiveTab] = useState<'khoa-hoc' | 'tien-do' | 'ky-nang'>('khoa-hoc');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New course form
  const [courseForm, setCourseForm] = useState({
    TenKhoa: '',
    HinhThucHoc: 'Trực tiếp' as 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp (Hybrid)',
    NgayBD: '2024-04-01',
    NgayKT: '2024-06-30',
    NguoiDay: '',
    DiaDiem: '',
    MoTa: '',
  });

  // Assign form
  const [assignForm, setAssignForm] = useState({
    MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
    MaKhoa: khoaDaoTaos[0]?.MaKhoa || 'KDT01',
    MaKyNang: kyNangs[0]?.MaKyNang || 'KN01',
    TienDo: 0,
    KetQua: 'CHUA_DANH_GIA' as KetQuaDaoTao,
    DiemSo: 8.0,
    NhanXet: '',
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.TenKhoa || !courseForm.NguoiDay) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }
    addKhoaDaoTao(courseForm);
    setIsAddCourseModalOpen(false);
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignDaoTao(assignForm);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            Đào Tạo & Phát Triển Kỹ Năng
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý các khóa đào tạo nội bộ, lộ trình phát triển và đánh giá kỹ năng nhân viên
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Plus className="h-4 w-4" /> Mở Khóa Học
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <UserCheck className="h-4 w-4" /> Phân Công Đào Tạo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('khoa-hoc')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'khoa-hoc'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Khóa Đào Tạo ({khoaDaoTaos.length})
        </button>
        <button
          onClick={() => setActiveTab('tien-do')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'tien-do'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Quá Trình & Tiến Độ Học Viên ({quaTrinhDaoTaos.length})
        </button>
        <button
          onClick={() => setActiveTab('ky-nang')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'ky-nang'
              ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Danh Mục Kỹ Năng ({kyNangs.length})
        </button>
      </div>

      {/* TAB 1: KHOA DAO TAO */}
      {activeTab === 'khoa-hoc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {khoaDaoTaos.map(kdt => {
            const traineesCount = quaTrinhDaoTaos.filter(q => q.MaKhoa === kdt.MaKhoa).length;

            return (
              <div
                key={kdt.MaKhoa}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {kdt.MaKhoa}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {kdt.HinhThucHoc}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {kdt.TenKhoa}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {kdt.MoTa}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <p className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                      Giảng viên: <strong>{kdt.NguoiDay}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      Thời gian: {kdt.NgayBD} → {kdt.NgayKT}
                    </p>
                    {kdt.DiaDiem && (
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        Địa điểm: {kdt.DiaDiem}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {traineesCount} nhân viên tham gia
                  </span>
                  <button
                    onClick={() => {
                      setAssignForm(prev => ({ ...prev, MaKhoa: kdt.MaKhoa }));
                      setIsAssignModalOpen(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    + Thêm học viên
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: QUA TRINH & TIEN DO */}
      {activeTab === 'tien-do' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 pl-6">Mã Quá Trình</th>
                  <th className="py-3.5 px-3">Học Viên (Duoc_Dao_Tao)</th>
                  <th className="py-3.5 px-3">Khóa Đào Tạo (Dao_Tao)</th>
                  <th className="py-3.5 px-3">Kỹ Năng Đánh Giá (DanhGia)</th>
                  <th className="py-3.5 px-3">Tiến Độ (% TienDo)</th>
                  <th className="py-3.5 px-3">Kết Quả (KetQua)</th>
                  <th className="py-3.5 pr-6 text-right">Điểm & Nhận Xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quaTrinhDaoTaos.map(qtdt => (
                  <tr key={qtdt.MaQuaTrinh} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {qtdt.MaQuaTrinh}
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {qtdt.TenNhanVien}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">{qtdt.MaNhanVien}</p>
                    </td>
                    <td className="py-4 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {qtdt.TenKhoa}
                    </td>
                    <td className="py-4 px-3">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {qtdt.TenKyNang}
                      </span>
                    </td>
                    <td className="py-4 px-3 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {qtdt.TienDo}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${qtdt.TienDo}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          qtdt.KetQua === 'DAT' || qtdt.KetQua === 'XUAT_SAC'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : qtdt.KetQua === 'CHUA_DANH_GIA'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {formatKetQuaDaoTao(qtdt.KetQua)}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      {qtdt.DiemSo && (
                        <span className="font-bold text-slate-900 dark:text-white">
                          {qtdt.DiemSo}/10
                        </span>
                      )}
                      {qtdt.NhanXet && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">
                          {qtdt.NhanXet}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KY NANG */}
      {activeTab === 'ky-nang' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kyNangs.map(kn => {
            const evaluatedCount = quaTrinhDaoTaos.filter(q => q.MaKyNang === kn.MaKyNang).length;

            return (
              <div
                key={kn.MaKyNang}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {kn.MaKyNang}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {kn.LoaiKyNang}
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {kn.TenKyNang}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  {kn.MoTa}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                  <span>Nhân viên được đánh giá:</span>
                  <strong className="text-slate-900 dark:text-white">{evaluatedCount} người</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Course */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Khởi Tạo Khóa Đào Tạo Mới</h3>
              <button onClick={() => setIsAddCourseModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Tên Khóa Học</label>
                <input
                  type="text"
                  required
                  value={courseForm.TenKhoa}
                  onChange={e => setCourseForm({ ...courseForm, TenKhoa: e.target.value })}
                  placeholder="Khóa học chuyên môn..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Hình Thức Học</label>
                <select
                  value={courseForm.HinhThucHoc}
                  onChange={e => setCourseForm({ ...courseForm, HinhThucHoc: e.target.value as 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp (Hybrid)' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Trực tiếp">Trực tiếp</option>
                  <option value="Trực tuyến">Trực tuyến</option>
                  <option value="Kết hợp (Hybrid)">Kết hợp (Hybrid)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Ngày Bắt Đầu</label>
                  <input
                    type="date"
                    required
                    value={courseForm.NgayBD}
                    onChange={e => setCourseForm({ ...courseForm, NgayBD: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Ngày Kết Thúc</label>
                  <input
                    type="date"
                    required
                    value={courseForm.NgayKT}
                    onChange={e => setCourseForm({ ...courseForm, NgayKT: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Giảng Viên / Người Dạy (NguoiDay)</label>
                <input
                  type="text"
                  required
                  value={courseForm.NguoiDay}
                  onChange={e => setCourseForm({ ...courseForm, NguoiDay: e.target.value })}
                  placeholder="ThS. Nguyễn Văn..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Mô Tả Mục Tiêu Khóa Học</label>
                <textarea
                  rows={2}
                  value={courseForm.MoTa}
                  onChange={e => setCourseForm({ ...courseForm, MoTa: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Lưu Khóa Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Trainee */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Phân Công Nhân Viên Tham Gia Đào Tạo</h3>
              <button onClick={() => setIsAssignModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAssign} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Học Viên (NhanVien)</label>
                <select
                  value={assignForm.MaNhanVien}
                  onChange={e => setAssignForm({ ...assignForm, MaNhanVien: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {nhanViens.map(nv => (
                    <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                      {nv.HoTen} ({nv.MaNhanVien})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Khóa Đào Tạo (KhoaDaoTao)</label>
                <select
                  value={assignForm.MaKhoa}
                  onChange={e => setAssignForm({ ...assignForm, MaKhoa: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {khoaDaoTaos.map(k => (
                    <option key={k.MaKhoa} value={k.MaKhoa}>
                      {k.TenKhoa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Kỹ Năng Đánh Giá (KyNang)</label>
                <select
                  value={assignForm.MaKyNang}
                  onChange={e => setAssignForm({ ...assignForm, MaKyNang: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {kyNangs.map(kn => (
                    <option key={kn.MaKyNang} value={kn.MaKyNang}>
                      {kn.TenKyNang} ({kn.LoaiKyNang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tiến Độ Ban Đầu (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignForm.TienDo}
                    onChange={e => setAssignForm({ ...assignForm, TienDo: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Kết Quả</label>
                  <select
                    value={assignForm.KetQua}
                    onChange={e => setAssignForm({ ...assignForm, KetQua: e.target.value as KetQuaDaoTao })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="CHUA_DANH_GIA">Chưa đánh giá</option>
                    <option value="DAT">Đạt</option>
                    <option value="XUAT_SAC">Xuất sắc</option>
                    <option value="CHUA_DAT">Chưa đạt</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Xác Nhận Phân Công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
