'use client';

import React, { useState } from 'react';
import { useHrms } from '@/context/HrmsContext';
import { Lock, X, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { currentTaiKhoan, doiMatKhau } = useHrms();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!oldPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 4 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await doiMatKhau(oldPassword, newPassword);
      if (res.success) {
        setSuccessMessage('Đổi mật khẩu thành công!');
        setTimeout(() => {
          onClose();
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSuccessMessage('');
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Mật khẩu hiện tại không chính xác!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đổi mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Đổi Mật Khẩu Cá Nhân</h3>
              <p className="text-xs text-slate-500">Tài khoản: @{currentTaiKhoan?.TenDangNhap}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mật khẩu hiện tại <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 4 ký tự..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
