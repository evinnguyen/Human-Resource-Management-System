'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  FolderLock,
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Download,
  X,
  FileCheck,
} from 'lucide-react';

export const TaiLieuView: React.FC = () => {
  const {
    taiLieus,
    loaiTaiLieus,
    nhanViens,
    uploadTaiLieu,
    deleteTaiLieu,
  } = useHrms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoai, setSelectedLoai] = useState<string>('ALL');
  const [selectedEmp, setSelectedEmp] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
    MaLoaiTL: loaiTaiLieus[0]?.MaLoaiTL || 'LTL01',
    TenTL: '',
    DuongDan: '/uploads/documents/document.pdf',
    KichThuoc: '2.5 MB',
  });

  const filteredDocs = taiLieus.filter(tl => {
    const matchesSearch =
      tl.TenTL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tl.TenNhanVien && tl.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tl.MaTL.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoai = selectedLoai === 'ALL' || tl.MaLoaiTL === selectedLoai;
    const matchesEmp = selectedEmp === 'ALL' || tl.MaNhanVien === selectedEmp;

    return matchesSearch && matchesLoai && matchesEmp;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.TenTL) {
      alert('Vui lòng nhập tên tài liệu');
      return;
    }
    uploadTaiLieu(uploadForm);
    setIsUploadModalOpen(false);
    setUploadForm({
      MaNhanVien: nhanViens[0]?.MaNhanVien || 'NV001',
      MaLoaiTL: loaiTaiLieus[0]?.MaLoaiTL || 'LTL01',
      TenTL: '',
      DuongDan: '/uploads/documents/document.pdf',
      KichThuoc: '2.5 MB',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderLock className="h-6 w-6 text-indigo-600" />
            Hồ Sơ & Tài Liệu Nhân Viên
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý lưu trữ hồ sơ, tài liệu và văn bản liên quan của nhân viên
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Upload className="h-4 w-4" />
          Tải Lên Hồ Sơ Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên file, tên nhân viên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedLoai}
            onChange={e => setSelectedLoai(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả loại tài liệu</option>
            {loaiTaiLieus.map(l => (
              <option key={l.MaLoaiTL} value={l.MaLoaiTL}>
                {l.TenLoai}
              </option>
            ))}
          </select>

          <select
            value={selectedEmp}
            onChange={e => setSelectedEmp(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả nhân viên</option>
            {nhanViens.map(nv => (
              <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                {nv.HoTen}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 pl-6">Mã Tài Liệu (PK)</th>
                <th className="py-3.5 px-3">Tên File / Tài Liệu (TenTL)</th>
                <th className="py-3.5 px-3">Loại Tài Liệu (Thuoc Loai TL)</th>
                <th className="py-3.5 px-3">Chủ Sở Hữu (So Huu)</th>
                <th className="py-3.5 px-3">Dung Lượng</th>
                <th className="py-3.5 px-3">Ngày Tải Lên (NgayTaiLen)</th>
                <th className="py-3.5 pr-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map(tl => (
                <tr key={tl.MaTL} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-4 pl-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {tl.MaTL}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {tl.TenTL}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {tl.TenLoaiTL}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tl.TenNhanVien}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">{tl.MaNhanVien}</p>
                  </td>
                  <td className="py-4 px-3 text-slate-500">
                    {tl.KichThuoc || '1.8 MB'}
                  </td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                    {tl.NgayTaiLen}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => alert(`Đang tải file: ${tl.TenTL}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        title="Tải về"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa tài liệu ${tl.TenTL}?`)) {
                            deleteTaiLieu(tl.MaTL);
                          }
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy tài liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                Tải Lên Hồ Sơ & Tài Liệu
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nhân Viên Sở Hữu (So Huu)
                </label>
                <select
                  value={uploadForm.MaNhanVien}
                  onChange={e => setUploadForm({ ...uploadForm, MaNhanVien: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {nhanViens.map(nv => (
                    <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                      {nv.HoTen} ({nv.MaNhanVien} - {nv.TenPhongBan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Phân Loại Tài Liệu (Thuoc Loai TL)
                </label>
                <select
                  value={uploadForm.MaLoaiTL}
                  onChange={e => setUploadForm({ ...uploadForm, MaLoaiTL: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {loaiTaiLieus.map(l => (
                    <option key={l.MaLoaiTL} value={l.MaLoaiTL}>
                      {l.TenLoai}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tên File / Tiêu Đề Hồ Sơ (TenTL)
                </label>
                <input
                  type="text"
                  required
                  placeholder="CCCD_Scan_BanGoc.pdf"
                  value={uploadForm.TenTL}
                  onChange={e => setUploadForm({ ...uploadForm, TenTL: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <Upload className="mx-auto h-8 w-8 text-indigo-500" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Kéo thả file vào đây hoặc nhấn để chọn
                </p>
                <p className="text-[10px] text-slate-400">PDF, DOCX, PNG, JPG (tối đa 25MB)</p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700"
                >
                  Lưu & Tải Lên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
