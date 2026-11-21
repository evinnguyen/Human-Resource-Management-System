'use client';

import React from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileSignature,
  Clock,
  CalendarDays,
  GraduationCap,
  FolderLock,
  ShieldAlert,
  Layers,
  ChevronRight,
  Briefcase,
  Wallet,
  LogOut,
  UserCheck,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'cong-viec'
  | 'phieu-luong'
  | 'nhan-vien'
  | 'phong-ban'
  | 'hop-dong'
  | 'cham-cong'
  | 'nghi-phep'
  | 'dao-tao'
  | 'tai-lieu'
  | 'he-thong';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { donNghiPheps, nhanViens, hopDongs, congViecs, currentTaiKhoan, logout } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const isEmployee = userRole === 'ROLE_EMPLOYEE';
  const isDeptLead = userRole === 'ROLE_DEPT_LEAD';
  const isHRorAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HR_MANAGER';
  const currentEmp = nhanViens.find(n => n.MaNhanVien === currentTaiKhoan?.MaNhanVien);

  // Badges calculation based on role
  const pendingLeavesToApprove = donNghiPheps.filter(d => {
    if (d.TrangThaiDNP !== 'CHO_DUYET') return false;
    if (d.MaNhanVien === currentTaiKhoan?.MaNhanVien) return false;
    if (isHRorAdmin) return true;
    if (isDeptLead) {
      const emp = nhanViens.find(n => n.MaNhanVien === d.MaNhanVien);
      return emp?.MaPhongBan === currentEmp?.MaPhongBan;
    }
    return false;
  }).length;

  const myPendingLeavesCount = donNghiPheps.filter(
    d => d.MaNhanVien === currentTaiKhoan?.MaNhanVien && d.TrangThaiDNP === 'CHO_DUYET'
  ).length;

  const activeTasksCount = isEmployee
    ? congViecs.filter(c => c.MaNhanVien === currentTaiKhoan?.MaNhanVien && (c.TrangThai === 'DANG_THUC_HIEN' || c.TrangThai === 'TRE_HAN')).length
    : congViecs.filter(c => c.TrangThai === 'DANG_THUC_HIEN' || c.TrangThai === 'TRE_HAN').length;

  const totalEmployeesCount = nhanViens.length;

  const rawMenuItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Tổng Quan',
      sub: 'Dashboard KPI & Phân tích',
      icon: LayoutDashboard,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD'],
    },
    {
      id: 'cong-viec' as TabId,
      label: isEmployee ? 'Công Việc Của Tôi' : 'Công Việc & Tiến Độ',
      sub: isEmployee ? 'Tiến độ & Báo cáo công việc' : 'CongViec, TienDoThucHien',
      icon: Briefcase,
      badge: activeTasksCount > 0 ? `${activeTasksCount} việc` : undefined,
      badgeColor: 'bg-indigo-500 text-white',
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'phieu-luong' as TabId,
      label: isEmployee ? 'Phiếu Lương Của Tôi' : 'Phiếu Lương & Biến Động',
      sub: isEmployee ? 'Thu nhập, OT & Khiếu nại' : 'BangLuong, KhoanBienDong',
      icon: Wallet,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'nhan-vien' as TabId,
      label: isEmployee ? 'Danh Bạ Nhân Sự' : 'Quản Lý Nhân Sự',
      sub: isEmployee ? 'Thông tin đồng nghiệp' : 'NhanVien, Cây Quản Lý',
      icon: Users,
      badge: isEmployee ? undefined : `${totalEmployeesCount} NV`,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'phong-ban' as TabId,
      label: 'Phòng Ban & Vị Trí',
      sub: 'PhongBan, ChucDanh',
      icon: Building2,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER'],
    },
    {
      id: 'hop-dong' as TabId,
      label: 'Hợp Đồng Lao Động',
      sub: 'HopDong, LoaiHopDong',
      icon: FileSignature,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER'],
    },
    {
      id: 'cham-cong' as TabId,
      label: isEmployee ? 'Chấm Công Cá Nhân' : 'Chấm Công & Điểm Danh',
      sub: isEmployee ? 'Điểm danh Vào / Ra của tôi' : 'BangChamCong, ThoiDiem',
      icon: Clock,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'nghi-phep' as TabId,
      label: isEmployee ? 'Đơn Nghỉ Phép Của Tôi' : 'Đơn Nghỉ Phép',
      sub: isEmployee ? 'Tạo đơn & Theo dõi trạng thái' : 'DonNghiPhep, Xét duyệt',
      icon: CalendarDays,
      badge: isEmployee
        ? (myPendingLeavesCount > 0 ? `${myPendingLeavesCount} đang chờ` : undefined)
        : (pendingLeavesToApprove > 0 ? `${pendingLeavesToApprove} cần duyệt` : undefined),
      badgeColor: isEmployee ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white',
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'dao-tao' as TabId,
      label: isEmployee ? 'Khóa Học Của Tôi' : 'Đào Tạo & Kỹ Năng',
      sub: isEmployee ? 'Lộ trình phát triển bản thân' : 'KhoaDaoTao, KyNang, Tiến độ',
      icon: GraduationCap,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'tai-lieu' as TabId,
      label: isEmployee ? 'Hồ Sơ Của Tôi' : 'Hồ Sơ & Tài Liệu',
      sub: isEmployee ? 'Bằng cấp, chứng chỉ đính kèm' : 'TaiLieu, LoaiTaiLieu',
      icon: FolderLock,
      allowedRoles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'],
    },
    {
      id: 'he-thong' as TabId,
      label: 'Hệ Thống & Phân Quyền',
      sub: 'TaiKhoan, Role, Audit Log',
      icon: ShieldAlert,
      allowedRoles: ['ROLE_ADMIN'],
    },
  ];

  // Filter menu items strictly by current user's role
  const menuItems = rawMenuItems.filter(item =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
          <Layers className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            HTQLNS
            <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
              v1.0
            </span>
          </span>
          <p className="text-[11px] text-slate-400">Hệ Thống Quản Lý Nhân Sự</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Chức năng được phân quyền
        </p>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition duration-150 ${
                isActive
                  ? 'bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div
                    className={`text-[10px] ${
                      isActive ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl bg-slate-800/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 font-bold text-white shadow-sm">
                {currentTaiKhoan?.TenDangNhap?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {currentTaiKhoan?.TenNhanVien || currentTaiKhoan?.TenDangNhap}
                </p>
                <p className="text-[10px] text-indigo-400 truncate">
                  {currentTaiKhoan?.TenRole?.split('(')[0] || 'Tài khoản'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                  logout();
                }
              }}
              title="Đăng xuất"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
