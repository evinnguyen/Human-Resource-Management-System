'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import {
  Layers,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Building2,
  Sparkles,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, isLoading: isContextLoading } = useHrms();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo accounts for quick testing / presentation
  const demoAccounts = [
    {
      role: 'Quản Trị Viên (Admin)',
      roleCode: 'ROLE_ADMIN',
      username: 'admin',
      password: '123456',
      name: 'Nguyễn Văn An',
      title: 'Quản trị hệ thống, cấp tài khoản & phân quyền',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
      icon: ShieldCheck,
    },
    {
      role: 'Trưởng Phòng Nhân Sự (HR)',
      roleCode: 'ROLE_HR_MANAGER',
      username: 'hrmanager',
      password: '123456',
      name: 'Lê Hoàng Nam',
      title: 'Quản lý nhân sự, hợp đồng, chấm công & bảng lương',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300',
      icon: Users,
    },
    {
      role: 'Trưởng Phòng IT (Manager)',
      roleCode: 'ROLE_DEPT_LEAD',
      username: 'mai.tran',
      password: '123456',
      name: 'Trần Thị Mai',
      title: 'Trưởng phòng IT - Giao việc, duyệt đơn phòng ban',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      icon: Building2,
    },
    {
      role: 'Trưởng Phòng Sales (Manager)',
      roleCode: 'ROLE_DEPT_LEAD',
      username: 'ha.pham',
      password: '123456',
      name: 'Phạm Thu Hà',
      title: 'Trưởng phòng Kinh Doanh - Quản lý nhân viên & duyệt đơn Sales',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
      icon: Building2,
    },
    {
      role: 'Nhân Viên (Employee)',
      roleCode: 'ROLE_EMPLOYEE',
      username: 'tuan.do',
      password: '123456',
      name: 'Đỗ Minh Tuấn',
      title: 'Senior Dev IT - Chấm công, đơn nghỉ phép, lương & việc',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      icon: Briefcase,
    },
    {
      role: 'Nhân Viên Thử Việc (Employee)',
      roleCode: 'ROLE_EMPLOYEE',
      username: 'trong.bui',
      password: '123456',
      name: 'Bùi Đức Trọng',
      title: 'Sales thử việc - Xem lương thử việc, tạo đơn nghỉ phép',
      badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300',
      icon: User,
    },
    {
      role: 'Tài Khoản Bị Khóa (Testcase)',
      roleCode: 'ROLE_EMPLOYEE',
      username: 'khoa.acc',
      password: '123456',
      name: 'Tài Khoản Bị Khóa',
      title: 'Testcase bảo mật: Bị từ chối truy cập khi đăng nhập',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
      icon: ShieldAlert,
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email / mã nhân viên!');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username.trim(), password);
      if (res.success) {
        onLoginSuccess?.();
      } else {
        setErrorMessage(res.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã xảy ra lỗi trong quá trình xác thực.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemoAccount = (acc: typeof demoAccounts[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans text-slate-100">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Brand & Intro */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Hệ Thống Quản Lý Sản Xuất & Nhân Sự
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/30">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                HỆ THỐNG QUẢN LÝ NHÂN SỰ
              </h1>
            </div>
            <p className="text-base text-slate-300">
              Nền tảng Quản Trị Nhân Sự Chuẩn Doanh Nghiệp
            </p>
          </div>

    

          {/* Quick Demo Selector */}
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Đăng nhập nhanh
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {demoAccounts.map(acc => {
                const Icon = acc.icon;
                const isSelected = username === acc.username;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className={`rounded-xl border p-3 text-left transition duration-150 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/60 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Icon className="h-3.5 w-3.5 text-indigo-400" />
                        {acc.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${acc.badgeColor}`}>
                        {acc.role.split('(')[1]?.replace(')', '') || acc.role}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{acc.title}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>User: <strong className="text-slate-300 font-mono">@{acc.username}</strong></span>
                      <span>Pass: <strong className="text-slate-300 font-mono">123456</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Login Card */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            {/* Header */}
            <div className="mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Đăng Nhập</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập thông tin xác thực để truy cập hệ thống
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">Không thể đăng nhập</p>
                  <p className="mt-0.5 text-rose-300/90">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên Đăng Nhập / Email / Mã NV
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="ví dụ: nguyenvana"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mật khẩu của bạn..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>

                
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xác thực...
                  </span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Đăng Nhập Vào Hệ Thống
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-4 text-center">
              <p className="text-[11px] text-slate-500">
                Hệ Thống Quản Trị Nhân Sự Doanh Nghiệp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
