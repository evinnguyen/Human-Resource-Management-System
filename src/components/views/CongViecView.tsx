'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { CongViec, MucDoUuTien, TrangThaiCongViec } from '@/types/hrms';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  User,
  CheckSquare,
  ArrowLeft,
  Paperclip,
  Flame,
  FileCheck,
  History,
  X,
} from 'lucide-react';

export const CongViecView: React.FC = () => {
  const { congViecs, tienDoThucHiens, nhanViens, currentTaiKhoan, addCongViec, addTienDoThucHien } = useHrms();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  // Selected Task for Detail View
  const [selectedTask, setSelectedTask] = useState<CongViec | null>(null);

  // Modal State for Updating Progress
  const [taskToUpdate, setTaskToUpdate] = useState<CongViec | null>(null);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('Đang thực hiện đúng tiến độ');
  const [progressNote, setProgressNote] = useState<string>('');
  const [progressFile, setProgressFile] = useState<string>('');

  // Modal State for New Task
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<MucDoUuTien>('TRUNG_BINH');
  const [newAssignee, setNewAssignee] = useState(nhanViens[0]?.MaNhanVien || 'NV003');

  // Filter tasks
  const filteredTasks = congViecs.filter(task => {
    const matchSearch =
      task.TenCV.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.MaCV.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || task.TrangThai === filterStatus;
    const matchPriority = filterPriority === 'ALL' || task.MucDoUuTien === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // Get Priority Badge
  const getPriorityBadge = (priority: MucDoUuTien) => {
    switch (priority) {
      case 'KHAN_CAP':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <Flame className="h-3 w-3 text-rose-600" /> Khẩn cấp
          </span>
        );
      case 'CAO':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            Cao
          </span>
        );
      case 'TRUNG_BINH':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            Trung bình
          </span>
        );
      case 'THAP':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            Thấp
          </span>
        );
    }
  };

  // Get Status Badge
  const getStatusBadge = (status: TrangThaiCongViec) => {
    switch (status) {
      case 'HOAN_THANH':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-3 w-3" /> Đã hoàn thành
          </span>
        );
      case 'TRE_HAN':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            <AlertCircle className="h-3 w-3" /> Trễ hạn
          </span>
        );
      case 'DANG_THUC_HIEN':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
            <Clock className="h-3 w-3" /> Đang thực hiện
          </span>
        );
      case 'CHUA_BAT_DAU':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
            Chưa bắt đầu
          </span>
        );
    }
  };

  // Handle open progress modal
  const handleOpenProgressModal = (task: CongViec) => {
    setTaskToUpdate(task);
    setProgressValue(task.MucDoHoanThanh);
    setProgressStatus(
      task.MucDoHoanThanh >= 100
        ? 'Đã hoàn thành'
        : 'Đang triển khai đúng tiến độ'
    );
    setProgressNote('');
    setProgressFile('');
  };

  // Submit Progress
  const handleSubmitProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToUpdate) return;

    addTienDoThucHien({
      MaCV: taskToUpdate.MaCV,
      MaNhanVien: currentTaiKhoan.MaNhanVien,
      TenNhanVien: currentTaiKhoan.TenNhanVien,
      NgayGio: new Date().toISOString().replace('T', ' ').slice(0, 16),
      MucDoHoanThanh: Number(progressValue),
      GhiChu: progressNote || 'Cập nhật tiến độ định kỳ',
      TrangThai: progressStatus,
      TepMinhChung: progressFile || undefined,
    });

    // Update locally selected task if open
    if (selectedTask && selectedTask.MaCV === taskToUpdate.MaCV) {
      setSelectedTask(prev =>
        prev
          ? {
              ...prev,
              MucDoHoanThanh: Number(progressValue),
              TrangThai: Number(progressValue) >= 100 ? 'HOAN_THANH' : 'DANG_THUC_HIEN',
            }
          : null
      );
    }

    setTaskToUpdate(null);
  };

  // Submit New Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignedPerson = nhanViens.find(n => n.MaNhanVien === newAssignee);

    addCongViec({
      TenCV: newTitle,
      MoTaCV: newDescription,
      HanChot: newDeadline || '2026-10-31',
      NguoiGiao: currentTaiKhoan.MaNhanVien,
      TenNguoiGiao: currentTaiKhoan.TenNhanVien,
      NgayGiao: new Date().toISOString().slice(0, 10),
      MucDoUuTien: newPriority,
      MaNhanVien: newAssignee,
      TenNhanVien: assignedPerson?.HoTen || 'Nhân viên',
      TrangThai: 'CHUA_BAT_DAU',
    });

    setShowNewTaskModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewDeadline('');
  };

  // ==========================================
  // VIEW 1: CHI TIẾT YÊU CẦU CÔNG VIỆC & LỊCH SỬ TIẾN ĐỘ
  // ==========================================
  if (selectedTask) {
    const taskProgressList = tienDoThucHiens
      .filter(t => t.MaCV === selectedTask.MaCV)
      .sort((a, b) => new Date(b.NgayGio).getTime() - new Date(a.NgayGio).getTime());

    return (
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setSelectedTask(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách công việc
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenProgressModal(selectedTask)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              <TrendingUp className="h-4 w-4" /> Cập nhật tiến độ
            </button>
          </div>
        </div>

        {/* Task Title Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                  {selectedTask.MaCV}
                </span>
                {getPriorityBadge(selectedTask.MucDoUuTien)}
                {getStatusBadge(selectedTask.TrangThai)}
              </div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                {selectedTask.TenCV}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-xs text-slate-500">Tiến độ hiện tại</p>
                <p className="text-2xl font-black text-indigo-600">{selectedTask.MucDoHoanThanh}%</p>
              </div>
              <div className="h-10 w-24 rounded-full bg-slate-100 p-1 flex items-center">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${selectedTask.MucDoHoanThanh}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Requirements & Files (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FileText className="h-5 w-5 text-indigo-600" /> Mô tả chi tiết yêu cầu công việc
              </h2>
              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 border border-slate-100 whitespace-pre-line">
                {selectedTask.MoTaCV}
              </div>

              {selectedTask.TepDinhKem && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tài liệu / Tệp hướng dẫn đính kèm
                  </h3>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{selectedTask.TepDinhKem}</p>
                        <p className="text-xs text-slate-400">Tài liệu đặc tả kỹ thuật • PDF/DWG</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Tải xuống tệp: ${selectedTask.TepDinhKem}`)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                    >
                      Tải về
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Progress History */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <History className="h-5 w-5 text-indigo-600" /> Lịch sử cập nhật tiến độ (TienDoThucHien)
              </h2>

              {taskProgressList.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  Chưa có mốc tiến độ nào được ghi nhận cho công việc này.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {taskProgressList.map((progress, idx) => (
                    <div key={progress.MaTienDo} className="relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-slate-50 transition">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-600 text-sm">
                              {progress.MucDoHoanThanh}% Hoàn thành
                            </span>
                            <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                              {progress.TrangThai}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {progress.NgayGio}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-700">{progress.GhiChu}</p>

                        {progress.TepMinhChung && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                            <Paperclip className="h-3.5 w-3.5 text-indigo-500" /> Minh chứng:{' '}
                            <span className="font-semibold">{progress.TepMinhChung}</span>
                          </div>
                        )}

                        <div className="mt-2 text-[11px] text-slate-400">
                          Người cập nhật: <span className="font-medium text-slate-600">{progress.TenNhanVien || progress.MaNhanVien}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Metadata & Assignment (1 col) */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Thông tin phân công & Thời hạn
              </h3>

              <div className="space-y-3 divide-y divide-slate-100 text-sm">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-slate-400" /> Người giao:
                  </span>
                  <span className="font-semibold text-slate-800">{selectedTask.TenNguoiGiao || selectedTask.NguoiGiao}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" /> Ngày giao việc:
                  </span>
                  <span className="font-medium text-slate-700">{selectedTask.NgayGiao}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-rose-500" /> Hạn chót (Deadline):
                  </span>
                  <span className="font-bold text-rose-600">{selectedTask.HanChot}</span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-indigo-500" /> Người thực hiện:
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {selectedTask.TenNhanVien || selectedTask.MaNhanVien}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <p className="font-bold">Lưu ý phân xưởng:</p>
                <p>
                  Mọi cập nhật tiến độ đều được lưu vết thời gian thực tế để tính điểm KPI và năng suất lao động cuối tháng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Modal (if opened) */}
        {taskToUpdate && renderProgressModal()}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: DANH SÁCH & TÌM KIẾM CÔNG VIỆC CỦA TÔI
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản Lý Công Việc & Tiến Độ Thực Hiện
          </h1>
          <p className="text-sm text-slate-500">
            Theo dõi, tra cứu nhiệm vụ được giao và báo cáo tiến độ công việc
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" /> Giao việc mới
        </button>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng công việc</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{congViecs.length}</p>
          <p className="mt-1 text-xs text-slate-400">Được phân công</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-sky-700 uppercase tracking-wider">Đang thực hiện</p>
          <p className="mt-2 text-3xl font-black text-sky-600">
            {congViecs.filter(c => c.TrangThai === 'DANG_THUC_HIEN').length}
          </p>
          <p className="mt-1 text-xs text-sky-700/70">Đang chạy tiến độ</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-rose-700 uppercase tracking-wider">Trễ hạn / Khẩn cấp</p>
          <p className="mt-2 text-3xl font-black text-rose-600">
            {congViecs.filter(c => c.TrangThai === 'TRE_HAN' || c.MucDoUuTien === 'KHAN_CAP').length}
          </p>
          <p className="mt-1 text-xs text-rose-700/70">Cần ưu tiên xử lý</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Đã hoàn thành</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {congViecs.filter(c => c.TrangThai === 'HOAN_THANH').length}
          </p>
          <p className="mt-1 text-xs text-emerald-700/70">Đạt 100% chỉ tiêu</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã CV, tên công việc..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="CHUA_BAT_DAU">Chưa bắt đầu</option>
              <option value="DANG_THUC_HIEN">Đang thực hiện</option>
              <option value="HOAN_THANH">Đã hoàn thành</option>
              <option value="TRE_HAN">Trễ hạn</option>
            </select>

            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">Tất cả mức ưu tiên</option>
              <option value="KHAN_CAP">Khẩn cấp</option>
              <option value="CAO">Cao</option>
              <option value="TRUNG_BINH">Trung bình</option>
              <option value="THAP">Thấp</option>
            </select>

            {(searchTerm || filterStatus !== 'ALL' || filterPriority !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('ALL');
                  setFilterPriority('ALL');
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Mã CV</th>
                <th className="px-6 py-4">Tên công việc</th>
                <th className="px-6 py-4">Mức ưu tiên</th>
                <th className="px-6 py-4">Hạn chót</th>
                <th className="px-6 py-4">Tiến độ (%)</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    Không tìm thấy công việc nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr
                    key={task.MaCV}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{task.MaCV}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 hover:text-indigo-600 transition">
                        {task.TenCV}
                      </div>
                      <div className="text-xs text-slate-400">Người giao: {task.TenNguoiGiao || task.NguoiGiao}</div>
                    </td>
                    <td className="px-6 py-4">{getPriorityBadge(task.MucDoUuTien)}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{task.HanChot}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{task.MucDoHoanThanh}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              task.MucDoHoanThanh >= 100
                                ? 'bg-emerald-500'
                                : task.TrangThai === 'TRE_HAN'
                                ? 'bg-rose-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${task.MucDoHoanThanh}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(task.TrangThai)}</td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handleOpenProgressModal(task)}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                        >
                          Tiến độ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cập nhật tiến độ */}
      {taskToUpdate && renderProgressModal()}

      {/* Modal Giao việc mới */}
      {showNewTaskModal && renderNewTaskModal()}
    </div>
  );

  // Helper render Progress Modal
  function renderProgressModal() {
    if (!taskToUpdate) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cập Nhật Tiến Độ Công Việc</h3>
              <p className="text-xs text-slate-400">Ghi nhận tiến độ mới cho bảng TienDoThucHien</p>
            </div>
            <button
              onClick={() => setTaskToUpdate(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitProgress} className="mt-4 space-y-4">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-1">
              <p className="font-semibold text-slate-800">{taskToUpdate.TenCV}</p>
              <p className="text-slate-500">
                Mã CV: <span className="font-mono font-bold text-indigo-600">{taskToUpdate.MaCV}</span> • Hạn chót:{' '}
                {taskToUpdate.HanChot}
              </p>
            </div>

            {/* Slider / Percent */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <label>Tỷ lệ hoàn thành (%):</label>
                <span className="text-lg font-black text-indigo-600">{progressValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressValue}
                onChange={e => setProgressValue(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0% Chưa làm</span>
                <span>50% Nửa chặng</span>
                <span>100% Hoàn tất</span>
              </div>
            </div>

            {/* Trạng thái thực tế */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Trạng thái công việc:</label>
              <select
                value={progressStatus}
                onChange={e => setProgressStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Đang thực hiện đúng tiến độ">Đang thực hiện đúng tiến độ</option>
                <option value="Gặp khó khăn kỹ thuật / Chờ vật tư">Gặp khó khăn kỹ thuật / Chờ vật tư</option>
                <option value="Đã hoàn thành / Chờ nghiệm thu">Đã hoàn thành / Chờ nghiệm thu</option>
              </select>
            </div>

            {/* Ghi chú báo cáo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ghi chú / Báo cáo kết quả:</label>
              <textarea
                rows={3}
                required
                placeholder="Mô tả cụ thể những việc đã làm được, linh kiện đã thay, vấn đề phát sinh..."
                value={progressNote}
                onChange={e => setProgressNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* File minh chứng */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tệp minh chứng kết quả (nếu có):</label>
              <input
                type="text"
                placeholder="Tên tệp hoặc link ảnh sản phẩm (vd: AnhNghiemThu_1810.jpg)"
                value={progressFile}
                onChange={e => setProgressFile(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTaskToUpdate(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                Lưu cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Helper render New Task Modal
  function renderNewTaskModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Phân Công & Giao Việc Mới</h3>
              <p className="text-xs text-slate-400">Khởi tạo bản ghi công việc mới trong thực thể CongViec</p>
            </div>
            <button
              onClick={() => setShowNewTaskModal(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tên công việc / Nhiệm vụ:</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Kiểm chuẩn hệ thống băng chuyền số 2"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mức độ ưu tiên:</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as MucDoUuTien)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="THAP">Thấp</option>
                  <option value="TRUNG_BINH">Trung bình</option>
                  <option value="CAO">Cao</option>
                  <option value="KHAN_CAP">Khẩn cấp</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hạn chót hoàn thành:</label>
                <input
                  type="date"
                  required
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Người thực hiện (Nhân viên):</label>
              <select
                value={newAssignee}
                onChange={e => setNewAssignee(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                {nhanViens.map(nv => (
                  <option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                    {nv.MaNhanVien} - {nv.HoTen} ({nv.TenPhongBan || 'Xưởng sản xuất'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mô tả yêu cầu kỹ thuật & kết quả cần đạt:</label>
              <textarea
                rows={3}
                required
                placeholder="Yêu cầu chi tiết các thông số, tiêu chuẩn an toàn..."
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                Tạo công việc
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
