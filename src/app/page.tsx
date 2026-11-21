'use client';

import React, { useState, useEffect } from 'react';
import { HrmsProvider, useHrms } from '@/context/HrmsContext';
import { Sidebar, TabId } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { LoginView } from '@/components/views/LoginView';
import { DashboardView } from '@/components/views/DashboardView';
import { NhanVienView } from '@/components/views/NhanVienView';
import { PhongBanChucDanhView } from '@/components/views/PhongBanChucDanhView';
import { HopDongView } from '@/components/views/HopDongView';
import { ChamCongView } from '@/components/views/ChamCongView';
import { DonNghiPhepView } from '@/components/views/DonNghiPhepView';
import { DaoTaoKyNangView } from '@/components/views/DaoTaoKyNangView';
import { TaiLieuView } from '@/components/views/TaiLieuView';
import { HeThongPhanQuyenView } from '@/components/views/HeThongPhanQuyenView';
import { CongViecView } from '@/components/views/CongViecView';
import { PhieuLuongView } from '@/components/views/PhieuLuongView';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

// Mapping of tabs allowed per role
const ROLE_PERMISSIONS: Record<string, TabId[]> = {
  ROLE_ADMIN: [
    'dashboard',
    'he-thong',
    'nhan-vien',
    'phong-ban',
    'hop-dong',
    'cham-cong',
    'nghi-phep',
    'cong-viec',
    'phieu-luong',
    'dao-tao',
    'tai-lieu',
  ],
  ROLE_HR_MANAGER: [
    'dashboard',
    'nhan-vien',
    'phong-ban',
    'hop-dong',
    'cham-cong',
    'nghi-phep',
    'dao-tao',
    'tai-lieu',
    'phieu-luong',
    'cong-viec',
  ],
  ROLE_DEPT_LEAD: [
    'dashboard',
    'cong-viec',
    'nghi-phep',
    'cham-cong',
    'nhan-vien',
    'dao-tao',
    'phieu-luong',
    'tai-lieu',
  ],
  ROLE_EMPLOYEE: [
    'cong-viec',
    'phieu-luong',
    'cham-cong',
    'nghi-phep',
    'dao-tao',
    'tai-lieu',
    'nhan-vien',
  ],
};

function HrmsApp() {
  const { isAuthenticated, currentTaiKhoan } = useHrms();

  const userRole = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
  const allowedTabs = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.ROLE_EMPLOYEE;

  // Initial tab based on role
  const defaultTab: TabId = userRole === 'ROLE_EMPLOYEE' ? 'cong-viec' : 'dashboard';
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  // Sync tab when user changes or role changes
  useEffect(() => {
    if (isAuthenticated) {
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab(allowedTabs[0] || 'cong-viec');
      }
    }
  }, [userRole, isAuthenticated, allowedTabs, activeTab]);

  const tabTitles: Record<TabId, string> = {
    'dashboard': 'Tổng Quan Hệ Thống Quản Lý Nhân Sự',
    'cong-viec': userRole === 'ROLE_EMPLOYEE' ? 'Công Việc Của Tôi & Tiến Độ Thực Hiện' : 'Quản Lý Công Việc & Tiến Độ Thực Hiện',
    'phieu-luong': userRole === 'ROLE_EMPLOYEE' ? 'Phiếu Lương Chi Tiết & Biến Động Thu Nhập' : 'Quản Lý Bảng Lương & Khoản Biến Động',
    'nhan-vien': userRole === 'ROLE_EMPLOYEE' ? 'Danh Bạ Nhân Viên & Cơ Cấu Tổ Chức' : 'Quản Lý Hồ Sơ & Nhân Viên',
    'phong-ban': 'Cơ Cấu Tổ Chức & Vị Trí Công Việc',
    'hop-dong': 'Quản Lý Hợp Đồng Lao Động',
    'cham-cong': userRole === 'ROLE_EMPLOYEE' ? 'Chấm Công & Điểm Danh Cá Nhân' : 'Quản Lý Chấm Công & Điểm Danh',
    'nghi-phep': userRole === 'ROLE_EMPLOYEE' ? 'Quản Lý Đơn Nghỉ Phép Cá Nhân' : 'Quản Lý & Phê Duyệt Đơn Nghỉ Phép',
    'dao-tao': userRole === 'ROLE_EMPLOYEE' ? 'Khóa Đào Tạo & Kỹ Năng Của Tôi' : 'Quản Lý Đào Tạo & Đánh Giá Kỹ Năng',
    'tai-lieu': userRole === 'ROLE_EMPLOYEE' ? 'Hồ Sơ & Tài Liệu Cá Nhân' : 'Quản Lý Hồ Sơ & Tài Liệu',
    'he-thong': 'Hệ Thống, Phân Quyền & Nhật Ký',
  };

  // If not authenticated, render LoginView gate
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => {
      const role = currentTaiKhoan?.MaRole || 'ROLE_EMPLOYEE';
      setActiveTab(role === 'ROLE_EMPLOYEE' ? 'cong-viec' : 'dashboard');
    }} />;
  }

  // Check if current tab is permitted for this role
  const isTabAllowed = allowedTabs.includes(activeTab);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar activeTabTitle={tabTitles[activeTab] || 'Hệ Thống Quản Trị Nhân Sự'} />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {!isTabAllowed ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-2xl bg-rose-50 p-4 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  <ShieldAlert className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Từ Chối Truy Cập (403 Forbidden)
                </h3>
                <p className="mt-1 text-sm text-slate-500 max-w-md">
                  Tài khoản của bạn với vai trò <strong className="text-indigo-600">{currentTaiKhoan.TenRole || userRole}</strong> không được cấp quyền truy cập vào chức năng này.
                </p>
                <button
                  onClick={() => setActiveTab(allowedTabs[0] || 'cong-viec')}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại chức năng được phép
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
                {activeTab === 'cong-viec' && <CongViecView />}
                {activeTab === 'phieu-luong' && <PhieuLuongView />}
                {activeTab === 'nhan-vien' && <NhanVienView />}
                {activeTab === 'phong-ban' && <PhongBanChucDanhView />}
                {activeTab === 'hop-dong' && <HopDongView />}
                {activeTab === 'cham-cong' && <ChamCongView />}
                {activeTab === 'nghi-phep' && <DonNghiPhepView />}
                {activeTab === 'dao-tao' && <DaoTaoKyNangView />}
                {activeTab === 'tai-lieu' && <TaiLieuView />}
                {activeTab === 'he-thong' && <HeThongPhanQuyenView />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HrmsProvider>
      <HrmsApp />
    </HrmsProvider>
  );
}
