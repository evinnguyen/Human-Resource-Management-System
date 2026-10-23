'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  X,
  Send,
  MessageSquare,
} from 'lucide-react';

export const DonNghiPhepView: React.FC = () => {
  const {
    donNghiPheps,
    nhanViens,
    currentTaiKhoan,
    createDonNghiPhep,
    approveDonNghiPhep,
    rejectDonNghiPhep,
  } = useHrms();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [newDon, setNewDon] = useState({
    MaNhanVien: currentTaiKhoan.MaNhanVien || nhanViens[0]?.MaNhanVien || 'NV001',
    TuNgay: '2024-03-18',
    DenNgay: '2024-03-20',
    SoNgayNghi: 2,
    LyDo: '',
  });

  // Modal response state
  const [reviewingDon, setReviewingDon] = useState<{ id: string; action: 'APPROVE' | 'REJECT' } | null>(null);
  const [responseComment, setResponseComment] = useState('');

  const filteredLeaves = donNghiPheps.filter(d => {
    const matchesSearch =
      (d.TenNhanVien && d.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.MaDonNP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.LyDo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeFilter === 'ALL' || d.TrangThaiDNP === activeFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDon.LyDo) {
      alert('Vui lòng nhập lý do nghỉ phép');
      return;
    }
    createDonNghiPhep(newDon);
    setIsCreateModalOpen(false);
    setNewDon({
      MaNhanVien: currentTaiKhoan.MaNhanVien || 'NV001',
      TuNgay: '2024-03-18',
      DenNgay: '2024-03-20',
      SoNgayNghi: 2,
      LyDo: '',
    });
  };

  const handleConfirmReview = () => {
    if (!reviewingDon) return;
    if (reviewingDon.action === 'APPROVE') {
      approveDonNghiPhep(reviewingDon.id, responseComment || 'Đã đồng ý phê duyệt');
    } else {
      rejectDonNghiPhep(reviewingDon.id, responseComment || 'Đã từ chối đơn xin nghỉ');
    }
    setReviewingDon(null);
    setResponseComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Quản Lý Đơn Nghỉ Phép
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý và xét duyệt các đơn xin nghỉ phép của nhân sự
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Tạo Đơn Nghỉ Phép Mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tất Cả ({donNghiPheps.length})
          </button>
          <button
            onClick={() => setActiveFilter('CHO_DUYET')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'CHO_DUYET'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            Chờ Duyệt ({donNghiPheps.filter(d => d.TrangThaiDNP === 'CHO_DUYET').length})
          </button>
          <button
            onClick={() => setActiveFilter('DA_DUYET')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'DA_DUYET'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            Đã Duyệt ({donNghiPheps.filter(d => d.TrangThaiDNP === 'DA_DUYET').length})
          </button>
          <button
            onClick={() => setActiveFilter('TU_CHOI')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'TU_CHOI'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            Từ Chối ({donNghiPheps.filter(d => d.TrangThaiDNP === 'TU_CHOI').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo nhân viên, lý do..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Leave Requests Cards / Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 pl-6">Mã Đơn (PK)</th>
                <th className="py-3.5 px-3">Người Gửi (GuiDon)</th>
                <th className="py-3.5 px-3">Thời Gian Nghỉ (TuNgay → DenNgay)</th>
                <th className="py-3.5 px-3">Lý Do</th>
                <th className="py-3.5 px-3">Người Duyệt (DuyetDon)</th>
                <th className="py-3.5 px-3">Trạng Thái (TrangThaiDNP)</th>
                <th className="py-3.5 pr-6 text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeaves.map(don => (
                <tr key={don.MaDonNP} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {don.MaDonNP}
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {don.TenNhanVien}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Mã NV: {don.MaNhanVien} • Gửi: {don.NgayGui}
                    </p>
                  </td>
                  <td className="py-4 px-3 text-slate-700 dark:text-slate-300">
                    <p className="font-semibold">{don.TuNgay} → {don.DenNgay}</p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {don.SoNgayNghi} ngày nghỉ
                    </span>
                  </td>
                  <td className="py-4 px-3 max-w-xs text-slate-600 dark:text-slate-300">
                    <p className="italic">&ldquo;{don.LyDo}&rdquo;</p>
                    {don.PhanHoi && (
                      <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400">
                        💬 Phản hồi: {don.PhanHoi}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                    {don.TenNguoiDuyet ? (
                      <div>
                        <p className="font-semibold">{don.TenNguoiDuyet}</p>
                        {don.NgayDuyet && (
                          <span className="text-[10px] text-slate-400">Ngày: {don.NgayDuyet}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Chờ duyệt</span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        don.TrangThaiDNP === 'DA_DUYET'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : don.TrangThaiDNP === 'CHO_DUYET'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {don.TrangThaiDNP === 'DA_DUYET'
                        ? 'Đã Duyệt'
                        : don.TrangThaiDNP === 'CHO_DUYET'
                        ? 'Chờ Phê Duyệt'
                        : 'Bị Từ Chối'}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    {don.TrangThaiDNP === 'CHO_DUYET' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReviewingDon({ id: don.MaDonNP, action: 'APPROVE' })}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Duyệt
                        </button>
                        <button
                          onClick={() => setReviewingDon({ id: don.MaDonNP, action: 'REJECT' })}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                        >
                          <XCircle className="h-3 w-3" /> Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Đã hoàn tất</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không có đơn xin nghỉ phép nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Leave Request */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" />
                Gửi Đơn Xin Nghỉ Phép Mới
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nhân Viên Gửi Đơn (GuiDon)
                </label>
                <select
                  value={newDon.MaNhanVien}
                  onChange={e => setNewDon({ ...newDon, MaNhanVien: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {nhanViens.map(nv => (
                    <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                      {nv.HoTen} ({nv.MaNhanVien} - {nv.TenPhongBan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Từ Ngày (TuNgay)
                  </label>
                  <input
                    type="date"
                    required
                    value={newDon.TuNgay}
                    onChange={e => setNewDon({ ...newDon, TuNgay: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Đến Ngày (DenNgay)
                  </label>
                  <input
                    type="date"
                    required
                    value={newDon.DenNgay}
                    onChange={e => setNewDon({ ...newDon, DenNgay: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Số Ngày Nghỉ
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={newDon.SoNgayNghi}
                  onChange={e => setNewDon({ ...newDon, SoNgayNghi: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Lý Do Nghỉ Phép (LyDo) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDon.LyDo}
                  onChange={e => setNewDon({ ...newDon, LyDo: e.target.value })}
                  placeholder="Ghi rõ lý do xin nghỉ phép..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Gửi Đơn Lên Quản Lý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Approve / Reject Comment */}
      {reviewingDon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {reviewingDon.action === 'APPROVE' ? 'Phê Duyệt Đơn Nghỉ Phép' : 'Từ Chối Đơn Nghỉ Phép'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Nhập ý kiến phản hồi cho đơn {reviewingDon.id} (sẽ được lưu vào trường PhanHoi / NgayDuyet)
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ý Kiến Phản Hồi Từ Quản Lý
              </label>
              <textarea
                rows={3}
                value={responseComment}
                onChange={e => setResponseComment(e.target.value)}
                placeholder={
                  reviewingDon.action === 'APPROVE'
                    ? 'Đồng ý cho nghỉ phép theo lịch đăng ký...'
                    : 'Nêu lý do từ chối (vd: bận dự án gấp)...'
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setReviewingDon(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReview}
                className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow ${
                  reviewingDon.action === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Xác Nhận {reviewingDon.action === 'APPROVE' ? 'Duyệt' : 'Từ Chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
