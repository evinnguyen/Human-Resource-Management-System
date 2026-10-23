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
  const { donNghiPheps, nhanViens, hopDongs, congViecs } = useHrms();

  const pendingLeavesCount = donNghiPheps.filter(d => d.TrangThaiDNP === 'CHO_DUYET').length;
  const activeTasksCount = congViecs.filter(c => c.TrangThai === 'DANG_THUC_HIEN' || c.TrangThai === 'TRE_HAN').length;
  const totalEmployeesCount = nhanViens.length;

  const menuItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Tổng Quan',
      sub: 'Dashboard KPI',
      icon: LayoutDashboard,
    },
    {
      id: 'cong-viec' as TabId,
      label: 'Công Việc & Tiến Độ',
      sub: 'CongViec, TienDoThucHien',
      icon: Briefcase,
      badge: activeTasksCount > 0 ? `${activeTasksCount} việc` : undefined,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'phieu-luong' as TabId,
      label: 'Phiếu Lương & Biến Động',
      sub: 'BangLuong, KhoanBienDong',
      icon: Wallet,
    },
    {
      id: 'nhan-vien' as TabId,
      label: 'Quản Lý Nhân Sự',
      sub: 'NhanVien, Cây Quản Lý',
      icon: Users,
      badge: `${totalEmployeesCount} NV`,
    },
    {
      id: 'phong-ban' as TabId,
      label: 'Phòng Ban & Vị Trí',
      sub: 'PhongBan, ChucDanh',
      icon: Building2,
    },
    {
      id: 'hop-dong' as TabId,
      label: 'Hợp Đồng Lao Động',
      sub: 'HopDong, LoaiHopDong',
      icon: FileSignature,
    },
    {
      id: 'cham-cong' as TabId,
      label: 'Chấm Công & Điểm Danh',
      sub: 'BangChamCong, ThoiDiem',
      icon: Clock,
    },
    {
      id: 'nghi-phep' as TabId,
      label: 'Đơn Nghỉ Phép',
      sub: 'DonNghiPhep, Duyệt đơn',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} chờ duyệt` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'dao-tao' as TabId,
      label: 'Đào Tạo & Kỹ Năng',
      sub: 'KhoaDaoTao, KyNang, Tiến độ',
      icon: GraduationCap,
    },
    {
      id: 'tai-lieu' as TabId,
      label: 'Hồ Sơ & Tài Liệu',
      sub: 'TaiLieu, LoaiTaiLieu',
      icon: FolderLock,
    },
    {
      id: 'he-thong' as TabId,
      label: 'Hệ Thống & Phân Quyền',
      sub: 'TaiKhoan, Role, Audit Log',
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-slate-900 text-slate-300">
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
          Danh mục chức năng
        </p>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition duration-150 ${isActive
                  ? 'bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div
                    className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Quick Info */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-800/60 p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Next.js 16 + NestJS</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Hệ thống Quản Trị Nhân Sự Doanh Nghiệp
          </p>
        </div>
      </div>
    </aside>
  );
};
