'use client';

import React, { useState } from 'react';
import { HrmsProvider } from '@/context/HrmsContext';
import { Sidebar, TabId } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
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

function HrmsApp() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const tabTitles: Record<TabId, string> = {
    'dashboard': 'Tổng Quan Hệ Thống Quản Lý Nhân Sự',
    'cong-viec': 'Quản Lý Công Việc & Tiến Độ Thực Hiện',
    'phieu-luong': 'Phiếu Lương Chi Tiết & Biến Động Thu Nhập',
    'nhan-vien': 'Quản Lý Hồ Sơ & Nhân Viên',
    'phong-ban': 'Cơ Cấu Tổ Chức & Vị Trí Công Việc',
    'hop-dong': 'Quản Lý Hợp Đồng Lao Động',
    'cham-cong': 'Chấm Công & Điểm Danh',
    'nghi-phep': 'Quản Lý Đơn Xin Nghỉ Phép',
    'dao-tao': 'Đào Tạo & Đánh Giá Kỹ Năng',
    'tai-lieu': 'Quản Lý Hồ Sơ & Tài Liệu',
    'he-thong': 'Hệ Thống, Phân Quyền & Nhật Ký',
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar activeTabTitle={tabTitles[activeTab]} />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
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
