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
  Trash2,
  AlertCircle,
  Building,
  User,
} from 'lucide-react';
import { formatTrangThaiDonNP } from '@/utils/formatters';
import { ProofUpload, ProofBadgeViewer } from '@/components/common/ImageUpload';

export const DonNghiPhepView: React.FC = () => {
  const {
    donNghiPheps,
    nhanViens,
    currentTaiKhoan,
    createDonNghiPhep,
    approveDonNghiPhep,
    rejectDonNghiPhep,
    deleteDonNghiPhep,
  } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const isEmployee = userRole === 'ROLE_EMPLOYEE';
  const isDeptLead = userRole === 'ROLE_DEPT_LEAD';
  const isHRorAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HR_MANAGER';

  // Current logged in employee record (to know department)
  const currentEmp = nhanViens.find(n => n.MaNhanVien === currentTaiKhoan?.MaNhanVien);

  // Tab filter: ALL / CHO_DUYET / DA_DUYET / TU_CHOI
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI'>('ALL');
  // Scope filter: ALL_SCOPE (for HR/Lead) / MY_LEAVES
  const [scopeFilter, setScopeFilter] = useState<'ALL_SCOPE' | 'MY_LEAVES'>(isEmployee ? 'MY_LEAVES' : 'ALL_SCOPE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Date calculation helper
  const calcDays = (start: string, end: string) => {
    try {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const initialTuNgay = new Date().toISOString().slice(0, 10);
  const initialDenNgay = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

  // Form state
  const [newDon, setNewDon] = useState({
    MaNhanVien: currentTaiKhoan?.MaNhanVien || nhanViens[0]?.MaNhanVien || 'NV001',
    TuNgay: initialTuNgay,
    DenNgay: initialDenNgay,
    SoNgayNghi: calcDays(initialTuNgay, initialDenNgay),
    LyDo: '',
    MinhChung: '',
  });

  // Modal response state
  const [reviewingDon, setReviewingDon] = useState<{ id: string; action: 'APPROVE' | 'REJECT' } | null>(null);
  const [responseComment, setResponseComment] = useState('');

  // Filter leaves based on user role and scopes
  const filteredLeaves = donNghiPheps.filter(d => {
    // 1. Role / Scope filter
    if (isEmployee || scopeFilter === 'MY_LEAVES') {
      if (d.MaNhanVien !== currentTaiKhoan?.MaNhanVien) return false;
    } else if (isDeptLead && scopeFilter === 'ALL_SCOPE') {
      // Dept lead sees leaves from their department
      const emp = nhanViens.find(n => n.MaNhanVien === d.MaNhanVien);
      if (emp?.MaPhongBan !== currentEmp?.MaPhongBan && d.MaNhanVien !== currentTaiKhoan?.MaNhanVien) {
        return false;
      }
    }

    // 2. Status filter
    const matchesStatus = activeFilter === 'ALL' || d.TrangThaiDNP === activeFilter;

    // 3. Search query
    const matchesSearch =
      (d.TenNhanVien && d.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.MaDonNP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.LyDo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleDateChange = (field: 'TuNgay' | 'DenNgay', val: string) => {
    const updated = { ...newDon, [field]: val };
    const days = calcDays(
      field === 'TuNgay' ? val : newDon.TuNgay,
      field === 'DenNgay' ? val : newDon.DenNgay
    );
    updated.SoNgayNghi = days;
    setNewDon(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDon.LyDo.trim()) {
      alert('Vui lòng nhập lý do nghỉ phép!');
      return;
    }
    if (new Date(newDon.DenNgay) < new Date(newDon.TuNgay)) {
      alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
      return;
    }

    try {
      await createDonNghiPhep(newDon);
      setIsCreateModalOpen(false);
      setNewDon({
        MaNhanVien: currentTaiKhoan?.MaNhanVien || 'NV001',
        TuNgay: initialTuNgay,
        DenNgay: initialDenNgay,
        SoNgayNghi: calcDays(initialTuNgay, initialDenNgay),
        LyDo: '',
        MinhChung: '',
      });
    } catch (err: any) {
      alert('Lỗi khi nộp đơn nghỉ phép: ' + (err?.message || 'Lỗi kết nối'));
    }
  };

  const handleConfirmReview = () => {
    if (!reviewingDon) return;
    if (reviewingDon.action === 'APPROVE') {
      approveDonNghiPhep(reviewingDon.id, responseComment || 'Đã đồng ý phê duyệt đơn nghỉ phép.');
    } else {
      if (!responseComment.trim()) {
        alert('Vui lòng nhập lý do từ chối để nhân viên nắm rõ thông tin!');
        return;
      }
      rejectDonNghiPhep(reviewingDon.id, responseComment);
    }
    setReviewingDon(null);
    setResponseComment('');
  };

  const handleCancelLeave = (donId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn xin nghỉ phép này?')) {
      deleteDonNghiPhep(donId);
    }
  };

  // Helper check if current user can approve this specific leave
  const canApproveDon = (don: typeof donNghiPheps[0]) => {
    if (don.TrangThaiDNP !== 'CHO_DUYET') return false;
    // Cannot approve own leave
    if (don.MaNhanVien === currentTaiKhoan?.MaNhanVien) return false;
    if (isHRorAdmin) return true;
    if (isDeptLead) {
      const emp = nhanViens.find(n => n.MaNhanVien === don.MaNhanVien);
      return emp?.MaPhongBan === currentEmp?.MaPhongBan;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            {isEmployee ? 'Quản Lý Đơn Nghỉ Phép Của Tôi' : 'Quản Lý & Phê Duyệt Đơn Nghỉ Phép'}
          </h2>
          <p className="text-xs text-slate-500">
            {isEmployee
              ? 'Theo dõi quá trình phê duyệt và nộp đơn xin nghỉ phép trực tuyến'
              : 'Tiếp nhận, kiểm tra minh chứng và xét duyệt các đơn xin nghỉ phép của nhân sự'}
          </p>
        </div>

        <button
          onClick={() => {
            setNewDon({
              MaNhanVien: currentTaiKhoan?.MaNhanVien || 'NV001',
              TuNgay: initialTuNgay,
              DenNgay: initialDenNgay,
              SoNgayNghi: calcDays(initialTuNgay, initialDenNgay),
              LyDo: '',
              MinhChung: '',
            });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Tạo Đơn Nghỉ Phép Mới
        </button>
      </div>

      {/* Scope switch for Managers / HR */}
      {!isEmployee && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
          <button
            onClick={() => setScopeFilter('ALL_SCOPE')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              scopeFilter === 'ALL_SCOPE'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {isDeptLead ? `Đơn Của Phòng Ban (${currentEmp?.TenPhongBan || 'Ban IT'})` : 'Toàn Bộ Đơn Công Ty'}
          </button>
          <button
            onClick={() => setScopeFilter('MY_LEAVES')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              scopeFilter === 'MY_LEAVES'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Đơn Nghỉ Của Tôi ({donNghiPheps.filter(d => d.MaNhanVien === currentTaiKhoan?.MaNhanVien).length})
          </button>
        </div>
      )}

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
            Tất Cả ({filteredLeaves.length})
          </button>
          <button
            onClick={() => setActiveFilter('CHO_DUYET')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'CHO_DUYET'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            Chờ Duyệt
          </button>
          <button
            onClick={() => setActiveFilter('DA_DUYET')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'DA_DUYET'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            Đã Duyệt
          </button>
          <button
            onClick={() => setActiveFilter('TU_CHOI')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === 'TU_CHOI'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            Từ Chối
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

      {/* Leave Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 pl-6">Mã Đơn</th>
                <th className="py-3.5 px-3">Người Gửi Đơn</th>
                <th className="py-3.5 px-3">Thời Gian Nghỉ</th>
                <th className="py-3.5 px-3">Lý Do & Minh Chứng</th>
                <th className="py-3.5 px-3">Người Duyệt</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 pr-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeaves.map(don => {
                const isOwnLeave = don.MaNhanVien === currentTaiKhoan?.MaNhanVien;
                const canApprove = canApproveDon(don);

                return (
                  <tr key={don.MaDonNP} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {don.MaDonNP}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {don.TenNhanVien}
                        </span>
                        {isOwnLeave && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                            Tôi
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {don.MaNhanVien}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-medium">
                        <span>{don.TuNgay}</span>
                        <span>→</span>
                        <span>{don.DenNgay}</span>
                      </div>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {don.SoNgayNghi} ngày nghỉ
                      </span>
                    </td>
                    <td className="py-4 px-3 max-w-xs text-slate-600 dark:text-slate-300">
                      <p className="italic">&ldquo;{don.LyDo}&rdquo;</p>
                      {don.MinhChung && (
                        <div className="mt-1">
                          <ProofBadgeViewer url={don.MinhChung} title="Ảnh minh chứng" />
                        </div>
                      )}
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
                        {formatTrangThaiDonNP(don.TrangThaiDNP)}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Can approve buttons */}
                        {canApprove && (
                          <>
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
                          </>
                        )}

                        {/* Employee can cancel own pending leave */}
                        {isOwnLeave && don.TrangThaiDNP === 'CHO_DUYET' && (
                          <button
                            onClick={() => handleCancelLeave(don.MaDonNP)}
                            title="Hủy đơn xin nghỉ phép này"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hủy đơn
                          </button>
                        )}

                        {!canApprove && (!isOwnLeave || don.TrangThaiDNP !== 'CHO_DUYET') && (
                          <span className="text-[11px] text-slate-400">Đã hoàn tất</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhân Viên Gửi Đơn
                </label>
                {isEmployee ? (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <User className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold">{currentTaiKhoan?.TenNhanVien || currentTaiKhoan?.TenDangNhap}</span>
                    <span className="font-mono text-slate-500">({currentTaiKhoan?.MaNhanVien})</span>
                  </div>
                ) : (
                  <select
                    value={newDon.MaNhanVien}
                    onChange={e => setNewDon({ ...newDon, MaNhanVien: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {nhanViens.map(nv => (
                      <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                        {nv.HoTen} ({nv.MaNhanVien} - {nv.TenPhongBan})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Từ Ngày <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDon.TuNgay}
                    onChange={e => handleDateChange('TuNgay', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Đến Ngày <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDon.DenNgay}
                    onChange={e => handleDateChange('DenNgay', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tổng Số Ngày Nghỉ (Tự động tính)
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 font-bold text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400">
                  {newDon.SoNgayNghi} ngày nghỉ
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lý Do Nghỉ Phép <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDon.LyDo}
                  onChange={e => setNewDon({ ...newDon, LyDo: e.target.value })}
                  placeholder="Nêu rõ lý do nghỉ phép (ốm đau, việc gia đình, du lịch...)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <ProofUpload
                  label="Tải lên ảnh minh chứng (Giấy khám bệnh / Đơn xin nghỉ)"
                  value={newDon.MinhChung}
                  onChange={url => setNewDon({ ...newDon, MinhChung: url })}
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                >
                  Gửi Đơn Xin Nghỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review (Duyệt / Từ chối) */}
      {reviewingDon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                {reviewingDon.action === 'APPROVE' ? 'Phê Duyệt Đơn Nghỉ Phép' : 'Từ Chối Đơn Nghỉ Phép'}
              </h3>
              <button
                onClick={() => setReviewingDon(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Bạn đang xét duyệt đơn: <strong className="text-indigo-600">{reviewingDon.id}</strong>
              </p>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ý kiến / Phản hồi của Cấp Quản Lý
                  {reviewingDon.action === 'REJECT' && <span className="text-rose-500"> *</span>}
                </label>
                <textarea
                  rows={3}
                  required={reviewingDon.action === 'REJECT'}
                  value={responseComment}
                  onChange={e => setResponseComment(e.target.value)}
                  placeholder={
                    reviewingDon.action === 'APPROVE'
                      ? 'Ghi chú phê duyệt (tùy chọn)...'
                      : 'Bắt buộc nhập lý do từ chối đơn...'
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewingDon(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReview}
                  className={`rounded-xl px-5 py-2 font-bold text-white shadow-md ${
                    reviewingDon.action === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  }`}
                >
                  {reviewingDon.action === 'APPROVE' ? 'Xác Nhận Phê Duyệt' : 'Xác Nhận Từ Chối'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
