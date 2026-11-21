'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { BangLuongChiTiet, ChiTietKhoanBienDong, KhieuNaiLuong } from '@/types/hrms';
import { formatTrangThaiKhieuNai } from '@/utils/formatters';
import {
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Plus,
  HelpCircle,
  FileText,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Paperclip,
} from 'lucide-react';
import { ProofUpload, ProofBadgeViewer } from '@/components/common/ImageUpload';

export const PhieuLuongView: React.FC = () => {
  const {
    bangLuongChiTiets,
    chiTietKhoanBienDongs,
    khieuNaiLuongs,
    kyLuongs,
    nhanViens,
    currentTaiKhoan,
    addKhieuNaiLuong,
    resolveKhieuNaiLuong,
    addChiTietKhoanBienDong,
  } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const isEmployee = userRole === 'ROLE_EMPLOYEE';
  const isDeptLead = userRole === 'ROLE_DEPT_LEAD';
  const isHRorAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HR_MANAGER';

  // Current logged in employee record
  const currentEmp = nhanViens.find(n => n.MaNhanVien === currentTaiKhoan?.MaNhanVien);

  // Filter visible payslips strictly based on role
  const visiblePayslips = bangLuongChiTiets.filter(b => {
    if (isEmployee) return b.MaNhanVien === currentTaiKhoan?.MaNhanVien;
    if (isDeptLead) {
      const emp = nhanViens.find(n => n.MaNhanVien === b.MaNhanVien);
      return b.MaNhanVien === currentTaiKhoan?.MaNhanVien || emp?.MaPhongBan === currentEmp?.MaPhongBan;
    }
    return true; // HR/Admin sees all
  });

  // Modals state
  const [showBienDongModal, setShowBienDongModal] = useState(false);
  const [showKhieuNaiModal, setShowKhieuNaiModal] = useState(false);
  const [showAddBienDongModal, setShowAddBienDongModal] = useState(false);
  const [reviewingKhieuNai, setReviewingKhieuNai] = useState<KhieuNaiLuong | null>(null);
  const [knPhanHoi, setKnPhanHoi] = useState('');

  // Khiếu nại Form State
  const [knKhoanMuc, setKnKhoanMuc] = useState('Lương làm thêm giờ (OT)');
  const [knSoTienDeXuat, setKnSoTienDeXuat] = useState('');
  const [knLyDo, setKnLyDo] = useState('');
  const [knMinhChung, setKnMinhChung] = useState('');

  // Thêm biến động Form State (cho Kế toán/Quản lý)
  const [bdTen, setBdTen] = useState('');
  const [bdLoai, setBdLoai] = useState<'CONG' | 'TRU'>('CONG');
  const [bdSoTien, setBdSoTien] = useState('');
  const [bdLyDo, setBdLyDo] = useState('');
  const [bdQuyetDinh, setBdQuyetDinh] = useState('');

  // Selected Payslip
  const [selectedPayslipId, setSelectedPayslipId] = useState<string>(
    visiblePayslips[0]?.MaLuongCT || ''
  );

  // Keep selected payslip synchronized if list changes
  const currentPayslip =
    visiblePayslips.find(b => b.MaLuongCT === selectedPayslipId) || visiblePayslips[0];

  // Các khoản biến động của phiếu lương này
  const relatedBienDongs = chiTietKhoanBienDongs.filter(
    b => b.MaLuongCT === currentPayslip?.MaLuongCT
  );

  // Tính tổng biến động cộng và trừ
  const tongBienDongCong = relatedBienDongs
    .filter(b => b.LoaiBD === 'CONG')
    .reduce((sum, item) => sum + item.SoTien, 0);

  const tongBienDongTru = relatedBienDongs
    .filter(b => b.LoaiBD === 'TRU')
    .reduce((sum, item) => sum + item.SoTien, 0);

  // Format currency
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Submit Khiếu Nại
  const handleSubmitKhieuNai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPayslip || !knLyDo.trim()) return;

    addKhieuNaiLuong({
      MaLuongCT: currentPayslip.MaLuongCT,
      NguoiGuiKN: currentTaiKhoan.MaNhanVien,
      TenNguoiGui: currentTaiKhoan.TenNhanVien,
      KhoanMucKhieuNai: knKhoanMuc,
      SoTienDeXuat: knSoTienDeXuat ? Number(knSoTienDeXuat) : undefined,
      LyDoKhieuNai: knLyDo,
      MinhChung: knMinhChung || undefined,
    });

    alert('Gửi khiếu nại phiếu lương thành công! Bộ phận kế toán sẽ sớm kiểm tra và phản hồi.');
    setShowKhieuNaiModal(false);
    setKnLyDo('');
    setKnSoTienDeXuat('');
    setKnMinhChung('');
  };

  // Submit Thêm Khoản Biến Động
  const handleAddBienDong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPayslip || !bdTen.trim() || !bdSoTien) return;

    addChiTietKhoanBienDong({
      MaLuongCT: currentPayslip.MaLuongCT,
      TenBD: bdTen,
      LoaiBD: bdLoai,
      SoTien: Number(bdSoTien),
      LyDo: bdLyDo || undefined,
      SoQuyetDinh: bdQuyetDinh || undefined,
      NgayPhatSinh: new Date().toISOString().slice(0, 10),
    });

    setShowAddBienDongModal(false);
    setBdTen('');
    setBdSoTien('');
    setBdLyDo('');
    setBdQuyetDinh('');
  };

  if (!currentPayslip || visiblePayslips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Wallet className="h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Chưa Có Dữ Liệu Phiếu Lương
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md">
          {isEmployee
            ? 'Hiện tại chưa có phiếu lương nào được phát hành cho tài khoản của bạn. Vui lòng liên hệ Phòng Nhân Sự hoặc Kế Toán để được kiểm tra.'
            : 'Chưa có dữ liệu phiếu lương nào phù hợp với phạm vi phân quyền.'}
        </p>
      </div>
    );
  }

  // Danh sách khiếu nại của phiếu lương này
  const relatedKhieuNais = khieuNaiLuongs.filter(
    k => k.MaLuongCT === currentPayslip.MaLuongCT
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Phiếu Lương Chi Tiết & Biến Động Thu Nhập
          </h1>
          <p className="text-sm text-slate-500">
            Minh bạch các khoản thu nhập theo ngày công, OT, phụ cấp thưởng và khấu trừ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Chọn kỳ lương */}
          <select
            value={selectedPayslipId}
            onChange={e => setSelectedPayslipId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            {visiblePayslips.map(b => (
              <option key={b.MaLuongCT} value={b.MaLuongCT}>
                {b.TenKyLuong || b.MaKyLuong} - {b.TenNhanVien} {isEmployee ? '' : `(${b.MaNhanVien})`}
              </option>
            ))}
          </select>

          <button
            onClick={() => alert('Xuất phiếu lương PDF định dạng A4 chuẩn bị in!')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" /> Xuất PDF
          </button>

          <button
            onClick={() => setShowKhieuNaiModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 transition"
          >
            <AlertTriangle className="h-4 w-4" /> Khiếu nại lương
          </button>
        </div>
      </div>

      {/* Main Payslip Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Payslip Header Info */}
        <div className="border-b border-slate-200 bg-slate-900 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="rounded bg-indigo-500/30 px-2.5 py-1 text-xs font-bold text-indigo-300">
                MÃ PHIẾU: {currentPayslip.MaLuongCT}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                {currentPayslip.TenKyLuong || 'Kỳ Lương Tháng 09/2026'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-indigo-400" /> Nhân viên:{' '}
                  <b className="text-white">{currentPayslip.TenNhanVien || currentPayslip.MaNhanVien}</b>
                </span>
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-indigo-400" /> Phòng ban:{' '}
                  <span className="text-white">{currentPayslip.TenPhongBan || 'Phân xưởng sản xuất'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Chức danh:{' '}
                  <span className="text-white">{currentPayslip.TenChucDanh || 'Kỹ sư'}</span>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  currentPayslip.DaThanhToan
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {currentPayslip.DaThanhToan ? 'Đã thanh toán' : 'Chờ giải ngân'}
              </span>
              {currentPayslip.TrangThaiKhieuNai === 'DANG_KHIEU_NAI' && (
                <p className="mt-2 text-xs font-bold text-rose-400 flex items-center justify-end gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> {formatTrangThaiKhieuNai(currentPayslip.TrangThaiKhieuNai)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Thu Nhập & Giảm Trừ */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* CỘT I: CÁC KHOẢN THU NHẬP */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
                <TrendingUp className="h-4 w-4" /> I. Các Khoản Thu Nhập
              </h3>
              <span className="text-xs text-slate-400 font-medium">Theo ngày công & OT</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">1. Lương theo ngày công làm việc:</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.LuongTheoNgay)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">2. Lương làm thêm giờ (OT):</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.LuongOT)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">3. Tiền thưởng hiệu suất & chuyên cần:</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.TienThuong)}</span>
              </div>

              {/* Khoản biến động tăng */}
              <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-emerald-900">4. Các khoản biến động tăng (+):</span>
                    <p className="text-xs text-emerald-700">Thưởng vượt tiến độ, phụ cấp trách nhiệm</p>
                  </div>
                  <span className="font-bold text-emerald-700">+{formatVND(tongBienDongCong)}</span>
                </div>
                <button
                  onClick={() => setShowBienDongModal(true)}
                  className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  Xem chi tiết {relatedBienDongs.filter(b => b.LoaiBD === 'CONG').length} khoản tăng &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* CỘT II: CÁC KHOẢN GIẢM TRỪ */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-700">
                <TrendingDown className="h-4 w-4" /> II. Các Khoản Giảm Trừ
              </h3>
              <span className="text-xs text-slate-400 font-medium">Bảo hiểm, thuế & khấu trừ</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">1. Chi phí Bảo hiểm xã hội (BHXH, BHYT, BHTN):</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.ChiPhiBH)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">2. Thuế thu nhập cá nhân (TNCN):</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.ThueTNCN)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">3. Tạm ứng lương trong kỳ:</span>
                <span className="font-semibold text-slate-900">{formatVND(currentPayslip.TamUng)}</span>
              </div>

              {/* Khoản biến động giảm */}
              <div className="rounded-xl bg-rose-50/60 p-3 border border-rose-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-rose-900">4. Các khoản biến động giảm (-):</span>
                    <p className="text-xs text-rose-700">Phạt đi muộn, khấu trừ quy chế</p>
                  </div>
                  <span className="font-bold text-rose-700">-{formatVND(tongBienDongTru)}</span>
                </div>
                <button
                  onClick={() => setShowBienDongModal(true)}
                  className="text-xs font-semibold text-rose-800 underline hover:text-rose-950"
                >
                  Xem chi tiết {relatedBienDongs.filter(b => b.LoaiBD === 'TRU').length} khoản trừ &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng Thực Nhận (Chân Trang Nổi Bật) */}
        <div className="border-t border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Lương Thực Nhận (Tổng Lương Cần Trả)
              </p>
              <p className="text-3xl font-black text-indigo-600 md:text-4xl">
                {formatVND(currentPayslip.TongLuongCanTra)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                = (Thu nhập ngày công + OT + Thưởng + Biến động tăng) - (BH + Thuế + Tạm ứng + Biến động giảm)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBienDongModal(true)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Tra cứu tất cả biến động ({relatedBienDongs.length})
              </button>
              <button
                onClick={() => setShowKhieuNaiModal(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                Gửi khiếu nại phiếu này
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Khiếu nại đã gửi cho phiếu lương này */}
      {relatedKhieuNais.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Lịch sử khiếu nại của phiếu lương này (KhieuNaiLuong)
          </h3>

          <div className="divide-y divide-slate-100">
            {relatedKhieuNais.map(kn => (
              <div key={kn.MaKN} className="py-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-800">{kn.MaKN}</span>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      Khoản mục: {kn.KhoanMucKhieuNai}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                      {formatTrangThaiKhieuNai(kn.TrangThaiKN)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{kn.NgayGui}</span>
                </div>

                <p className="text-sm text-slate-700">{kn.LyDoKhieuNai}</p>

                {kn.SoTienDeXuat && (
                  <p className="text-xs font-semibold text-indigo-600">
                    Số tiền đề xuất xem xét lại: {formatVND(kn.SoTienDeXuat)}
                  </p>
                )}

                {kn.MinhChung && (
                  <div className="mt-1">
                    <ProofBadgeViewer url={kn.MinhChung} title="Xem ảnh minh chứng" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: XEM CHI TIẾT KHOẢN BIẾN ĐỘNG LƯƠNG               */}
      {/* ======================================================== */}
      {showBienDongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chi Tiết Các Khoản Biến Động Lương</h3>
                <p className="text-xs text-slate-400">
                  Dữ liệu thực thể ChiTietKhoanBienDong liên kết với {currentPayslip.MaLuongCT}
                </p>
              </div>
              <button
                onClick={() => setShowBienDongModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Bảng danh sách khoản biến động */}
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {relatedBienDongs.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  Kỳ lương này không có khoản biến động tăng hoặc giảm nào phát sinh.
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedBienDongs.map(bd => (
                    <div
                      key={bd.MaKhoanBD}
                      className={`rounded-xl p-4 border transition ${
                        bd.LoaiBD === 'CONG'
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">{bd.MaKhoanBD}</span>
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              bd.LoaiBD === 'CONG'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {bd.LoaiBD === 'CONG' ? '+ BIẾN ĐỘNG TĂNG' : '- BIẾN ĐỘNG GIẢM'}
                          </span>
                        </div>
                        <span
                          className={`text-base font-black ${
                            bd.LoaiBD === 'CONG' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {bd.LoaiBD === 'CONG' ? '+' : '-'}
                          {formatVND(bd.SoTien)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-900">{bd.TenBD}</p>

                      {bd.LyDo && <p className="mt-1 text-xs text-slate-600">Lý do giải trình: {bd.LyDo}</p>}

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                        {bd.NgayPhatSinh && <span>Ngày phát sinh: {bd.NgayPhatSinh}</span>}
                        {bd.SoQuyetDinh && <span>Căn cứ quyết định: {bd.SoQuyetDinh}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              {isHRorAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowBienDongModal(false);
                    setShowAddBienDongModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Plus className="h-4 w-4" /> Thêm khoản biến động (Admin/HR)
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setShowBienDongModal(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: GỬI KHIẾU NẠI PHIẾU LƯƠNG                         */}
      {/* ======================================================== */}
      {showKhieuNaiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Gửi Khiếu Nại Phiếu Lương</h3>
                <p className="text-xs text-slate-400">
                  Phản hồi sai sót số liệu đến Kế toán tiền lương (KhieuNaiLuong)
                </p>
              </div>
              <button
                onClick={() => setShowKhieuNaiModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitKhieuNai} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-1">
                <p className="text-slate-500">
                  Phiếu lương khiếu nại: <b className="text-slate-800">{currentPayslip.MaLuongCT}</b>
                </p>
                <p className="text-slate-500">
                  Kỳ lương: <b className="text-slate-800">{currentPayslip.TenKyLuong}</b>
                </p>
                <p className="text-slate-500">
                  Người gửi: <b className="text-indigo-600">{currentTaiKhoan.TenNhanVien} ({currentTaiKhoan.MaNhanVien})</b>
                </p>
              </div>

              {/* Khoản mục khiếu nại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khoản mục sai sót cần khiếu nại:</label>
                <select
                  value={knKhoanMuc}
                  onChange={e => setKnKhoanMuc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Lương làm thêm giờ (OT)">Lương làm thêm giờ (OT)</option>
                  <option value="Lương theo ngày công làm việc">Lương theo ngày công làm việc</option>
                  <option value="Tiền thưởng & Chuyên cần">Tiền thưởng & Chuyên cần</option>
                  <option value="Khoản biến động thu nhập / Khấu trừ phạt">Khoản biến động thu nhập / Khấu trừ phạt</option>
                  <option value="Chi phí bảo hiểm / Thuế TNCN">Chi phí bảo hiểm / Thuế TNCN</option>
                  <option value="Khác">Khoản mục khác</option>
                </select>
              </div>

              {/* Số tiền đề xuất điều chỉnh */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Số tiền đề xuất điều chỉnh (VNĐ) (nếu có):
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 500000"
                  value={knSoTienDeXuat}
                  onChange={e => setKnSoTienDeXuat(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Lý do khiếu nại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lý do & Giải trình chi tiết:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Trình bày rõ ngày làm thêm chưa được tính, chứng từ kèm theo..."
                  value={knLyDo}
                  onChange={e => setKnLyDo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Tệp / Ảnh minh chứng không cần link */}
              <ProofUpload
                label="Ảnh minh chứng / Tài liệu đối soát (Không cần nhập link):"
                placeholder="Nhấn hoặc kéo thả ảnh chụp màn hình, bảng chấm công, biên nhận vào đây"
                value={knMinhChung}
                onChange={url => setKnMinhChung(url)}
                folder="minh-chung"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKhieuNaiModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition"
                >
                  Gửi khiếu nại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: THÊM KHOẢN BIẾN ĐỘNG (Dành cho Kế toán/HR)      */}
      {/* ======================================================== */}
      {showAddBienDongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Thêm Khoản Biến Động Lương</h3>
              <button
                onClick={() => setShowAddBienDongModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBienDong} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên khoản biến động:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thưởng sáng kiến cải tiến kỹ thuật"
                  value={bdTen}
                  onChange={e => setBdTen(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Loại biến động:</label>
                  <select
                    value={bdLoai}
                    onChange={e => setBdLoai(e.target.value as 'CONG' | 'TRU')}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="CONG">+ Cộng thu nhập (Thưởng / Phụ cấp)</option>
                    <option value="TRU">- Khấu trừ lương (Phạt / Trừ khác)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Số tiền (VNĐ):</label>
                  <input
                    type="number"
                    required
                    placeholder="500000"
                    value={bdSoTien}
                    onChange={e => setBdSoTien(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lý do giải trình:</label>
                <input
                  type="text"
                  placeholder="Căn cứ áp dụng thưởng/phạt"
                  value={bdLyDo}
                  onChange={e => setBdLyDo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số quyết định / Văn bản đính kèm:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: QĐ-2026/045"
                  value={bdQuyetDinh}
                  onChange={e => setBdQuyetDinh(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBienDongModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                >
                  Lưu biến động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
