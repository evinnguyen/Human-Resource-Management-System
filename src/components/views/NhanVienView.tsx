'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { NhanVien } from '@/types/hrms';
import { formatTrangThaiLamViec } from '@/utils/formatters';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Network,
  LayoutGrid,
  List,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const NhanVienView: React.FC = () => {
  const {
    nhanViens,
    phongBans,
    chucDanhs,
    hopDongs,
    bangChamCongs,
    bangLuongChiTiets,
    congViecs,
    donNghiPheps,
    currentTaiKhoan,
    deleteNhanVien,
    updateNhanVien,
  } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const canManageEmployees = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HR_MANAGER';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'orgTree'>('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<NhanVien | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<NhanVien | null>(null);

  // Hàm xử lý xóa an toàn: Kiểm tra vai trò Trưởng phòng & bảo vệ dữ liệu lịch sử liên kết (Soft Delete)
  const handleDeleteEmployee = (emp: NhanVien) => {
    // 1. Chặn xóa nếu đang là Trưởng phòng
    const leadingDept = phongBans.find(p => p.MaTruongPhong === emp.MaNhanVien);
    if (leadingDept) {
      alert(
        `KHÔNG THỂ XÓA!\n\nNhân viên ${emp.HoTen} (${emp.MaNhanVien}) hiện đang là TRƯỞNG PHÒNG của: "${leadingDept.TenPhongBan}".\n\nVui lòng vào tab "Cơ Cấu Tổ Chức" để bổ nhiệm Trưởng phòng mới trước khi xóa hoặc cho thôi việc!`
      );
      return;
    }

    // 2. Kiểm tra các ràng buộc dữ liệu lịch sử liên kết
    const hasContracts = hopDongs.some(h => h.MaNhanVien === emp.MaNhanVien);
    const hasAttendance = bangChamCongs.some(c => c.MaNhanVien === emp.MaNhanVien);
    const hasPayroll = bangLuongChiTiets.some(p => p.MaNhanVien === emp.MaNhanVien);
    const hasTasks = congViecs.some(t => t.MaNhanVien === emp.MaNhanVien);
    const hasLeaves = donNghiPheps.some(d => d.MaNhanVien === emp.MaNhanVien);

    const hasHistory = hasContracts || hasAttendance || hasPayroll || hasTasks || hasLeaves;

    if (hasHistory) {
      const confirmSoftDelete = confirm(
        `CẢNH BÁO BẢO TOÀN DỮ LIỆU LIÊN KẾT:\n\nNhân viên ${emp.HoTen} (${emp.MaNhanVien}) đã có dữ liệu lịch sử trong hệ thống:\n` +
        `${hasContracts ? '• Hợp đồng lao động\n' : ''}` +
        `${hasAttendance ? '• Bảng điểm danh / chấm công\n' : ''}` +
        `${hasPayroll ? '• Bảng lương & thuế / bảo hiểm\n' : ''}` +
        `${hasTasks ? '• Công việc được giao\n' : ''}` +
        `${hasLeaves ? '• Đơn xin nghỉ phép\n' : ''}` +
        `\nNếu xóa vĩnh viễn (Hard Delete), các báo cáo tài chính, thuế và chấm công quá khứ sẽ bị mồ côi dữ liệu (Lỗi Foreign Key).\n\n` +
        `Hệ thống sẽ chuyển nhân viên sang chế độ "ĐÃ THÔI VIỆC" (Soft Delete) để bảo toàn lịch sử kế toán.\n\n` +
        `Bạn có đồng ý chuyển nhân viên sang trạng thái "Đã thôi việc" không?`
      );

      if (confirmSoftDelete) {
        updateNhanVien(emp.MaNhanVien, {
          TrangThaiLamViec: 'DA_NGHI_VIEC',
        });
      }
    } else {
      // Nhân viên mới chưa có bất kỳ dữ liệu ràng buộc nào -> Xóa vĩnh viễn an toàn
      if (
        confirm(
          `Nhân viên ${emp.HoTen} (${emp.MaNhanVien}) chưa có dữ liệu lịch sử phát sinh.\n\nBạn có chắc chắn muốn xóa vĩnh viễn hồ sơ này khỏi hệ thống?`
        )
      ) {
        deleteNhanVien(emp.MaNhanVien);
      }
    }
  };

  // Filtered employees
  const filteredEmployees = nhanViens.filter(nv => {
    const matchesSearch =
      nv.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nv.MaNhanVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nv.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nv.SDT.includes(searchTerm);

    const matchesDept = selectedPhongBan === 'ALL' || nv.MaPhongBan === selectedPhongBan;
    const matchesStatus = selectedStatus === 'ALL' || nv.TrangThaiLamViec === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for rendering Org Tree
  const topManagers = nhanViens.filter(n => !n.MaQuanLy);

  const renderOrgNode = (manager: NhanVien, level: number = 0) => {
    const directReports = nhanViens.filter(n => n.MaQuanLy === manager.MaNhanVien);

    return (
      <div key={manager.MaNhanVien} className="ml-4 sm:ml-8 border-l-2 border-indigo-200 pl-4 py-2 dark:border-indigo-900/60">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <img
            src={manager.Avatar}
            alt={manager.HoTen}
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
          />
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {manager.HoTen}
              </span>
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                {manager.MaNhanVien}
              </span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {manager.TenChucDanh} • {manager.TenPhongBan}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {directReports.length} cấp dưới
            </span>
            <button
              onClick={() => setDetailEmployee(manager)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {directReports.length > 0 && (
          <div className="mt-2 space-y-2">
            {directReports.map(sub => renderOrgNode(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Hồ Sơ & Danh Sách Nhân Viên
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý thực thể NhanVien, cơ cấu quan hệ Quan Ly, PhongBan, ChucDanh
          </p>
        </div>

        {canManageEmployees && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            Thêm Nhân Viên Mới
          </button>
        )}
      </div>

      {/* Filter and View mode switcher bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã nhân viên, email, số điện thoại..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department filter */}
          <select
            value={selectedPhongBan}
            onChange={e => setSelectedPhongBan(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả phòng ban</option>
            {phongBans.map(pb => (
              <option key={pb.MaPhongBan} value={pb.MaPhongBan}>
                {pb.TenPhongBan}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DANG_LAM_VIEC">Đang làm việc</option>
            <option value="THU_VIEC">Thử việc</option>
            <option value="NGHI_PHEP">Nghỉ phép</option>
            <option value="DA_NGHI_VIEC">Đã nghỉ việc</option>
          </select>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-white shadow text-indigo-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Dạng bảng"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'cards'
                  ? 'bg-white shadow text-indigo-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Dạng lưới thẻ"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('orgTree')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'orgTree'
                  ? 'bg-white shadow text-indigo-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Sơ đồ cây phân cấp quản lý"
            >
              <Network className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Nhân Viên</th>
                  <th className="px-3 py-3.5">Mã NV / CCCD</th>
                  <th className="px-3 py-3.5">Phòng Ban & Vị Trí</th>
                  <th className="px-3 py-3.5">Người Quản Lý</th>
                  <th className="px-3 py-3.5">Liên Hệ</th>
                  <th className="px-3 py-3.5">Trạng Thái</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map(emp => (
                  <tr
                    key={emp.MaNhanVien}
                    className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.Avatar}
                          alt={emp.HoTen}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {emp.HoTen}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {emp.GioiTinh} • {emp.NgaySinh}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {emp.MaNhanVien}
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono">{emp.CCCD}</p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {emp.TenChucDanh}
                      </p>
                      <p className="text-[11px] text-slate-500">{emp.TenPhongBan}</p>
                    </td>

                    <td className="px-3 py-4">
                      {emp.TenQuanLy ? (
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {emp.TenQuanLy}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            (Mã: {emp.MaQuanLy})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Ban Lãnh Đạo</span>
                      )}
                    </td>

                    <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-1 text-[11px]">
                        <Mail className="h-3 w-3 text-indigo-500" />
                        {emp.Email}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="h-3 w-3 text-emerald-500" />
                        {emp.SDT}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          emp.TrangThaiLamViec === 'DANG_LAM_VIEC'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : emp.TrangThaiLamViec === 'THU_VIEC'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {formatTrangThaiLamViec(emp.TrangThaiLamViec)}
                      </span>
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailEmployee(emp)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                          title="Hồ sơ 360°"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canManageEmployees && (
                          <>
                            <button
                              onClick={() => {
                                setEditingEmployee(emp);
                                setIsAddModalOpen(true);
                              }}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                              title="Xóa / Thôi việc"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Không tìm thấy nhân viên nào phù hợp với bộ lọc tìm kiếm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map(emp => (
            <div
              key={emp.MaNhanVien}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.Avatar}
                      alt={emp.HoTen}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-500/10"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {emp.HoTen}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {emp.MaNhanVien}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      emp.TrangThaiLamViec === 'DANG_LAM_VIEC'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {formatTrangThaiLamViec(emp.TrangThaiLamViec)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>{emp.TenChucDanh}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{emp.TenPhongBan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="truncate">{emp.Email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Quản lý: {emp.TenQuanLy || 'GĐ'}
                </span>
                <button
                  onClick={() => setDetailEmployee(emp)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Chi tiết 360° →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: ORGANIZATIONAL HIERARCHY TREE */}
      {viewMode === 'orgTree' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-indigo-600" />
                Sơ Đồ Cây Phân Cấp Quản Lý Nhân Sự
              </h3>
              <p className="text-xs text-slate-500">
                Mô hình trực quan mối quan hệ báo cáo giữa cấp quản lý và nhân viên trực thuộc
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {topManagers.map(manager => renderOrgNode(manager))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEmployeeModal
        key={editingEmployee ? `edit-${editingEmployee.MaNhanVien}` : 'new-employee'}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmployee(null);
        }}
        initialData={editingEmployee}
      />

      <EmployeeDetailModal
        isOpen={!!detailEmployee}
        onClose={() => setDetailEmployee(null)}
        employee={detailEmployee}
        onEdit={emp => {
          setEditingEmployee(emp);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
};
