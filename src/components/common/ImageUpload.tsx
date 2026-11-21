'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  Eye,
  Trash2,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Download,
} from 'lucide-react';
import { uploadApi } from '@/services/api';

/* ========================================================================= */
/* 1. AVATAR UPLOAD COMPONENT (DÀNH CHO ẢNH ĐẠI DIỆN NHÂN VIÊN)              */
/* ========================================================================= */
interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dimensionClass =
    size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('Dung lượng ảnh tối đa 15MB');
      return;
    }

    // Validate image mime type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh (JPG, PNG, WEBP, GIF)');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      const res = await uploadApi.uploadFile(file, 'avatars');
      onChange(res.url);
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Avatar Circle Container */}
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative group rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 bg-slate-100 dark:bg-slate-800 transition shadow-sm ${dimensionClass}`}
        >
          {value ? (
            <img
              src={value}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={e => {
                // If broken link, fallback to placeholder
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              <Camera className="w-6 h-6 stroke-[1.75]" />
              <span className="text-[10px] font-semibold mt-1">Chọn ảnh</span>
            </div>
          )}

          {/* Hover overlay with Camera */}
          {!disabled && (
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span className="text-[9px] font-medium mt-0.5">Đổi ảnh</span>
                </>
              )}
            </div>
          )}

          {/* Loading spinner */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          )}
        </div>

        {/* Buttons & Explanatory text */}
        <div className="flex-1 text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={disabled || isUploading}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {value ? 'Tải ảnh khác' : 'Chọn ảnh đại diện'}
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs font-semibold"
                title="Xóa ảnh"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa
              </button>
            )}
          </div>

          <p className="mt-1.5 text-[11px] text-slate-400">
            Hỗ trợ JPG, PNG, WEBP. Tối đa 15MB. Không cần nhập đường link.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 2. PROOF UPLOAD COMPONENT (DÀNH CHO ẢNH MINH CHỨNG / TỆP ĐÍNH KÈM)       */
/* ========================================================================= */
interface ProofUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  folder?: 'minh-chung' | 'documents' | 'general';
  accept?: string;
  className?: string;
  disabled?: boolean;
}

export const ProofUpload: React.FC<ProofUploadProps> = ({
  value,
  onChange,
  label = 'Ảnh minh chứng / Tệp đính kèm',
  placeholder = 'Kéo thả ảnh minh chứng hoặc nhấn để tải lên từ thiết bị',
  folder = 'minh-chung',
  accept = 'image/*,application/pdf',
  className = '',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage =
    value &&
    (value.startsWith('data:image') ||
      /\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i.test(value) ||
      value.includes('/avatars/') ||
      value.includes('/minh-chung/'));

  const handleFile = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      setError('Dung lượng tệp tối đa 25MB');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      const res = await uploadApi.uploadFile(file, folder);
      onChange(res.url);
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi tải tệp lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={accept}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* When a file is already uploaded */}
      {value ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 transition">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              {isImage ? (
                <div
                  onClick={() => setPreviewModalOpen(true)}
                  className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 cursor-pointer group relative"
                  title="Nhấn để xem kích thước đầy đủ"
                >
                  <img
                    src={value}
                    alt="Minh chứng"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">
                    {value.startsWith('data:')
                      ? 'Ảnh minh chứng (đã tải)'
                      : value.split('/').pop()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Đã tải lên thành công • Nhấn để xem trước
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isImage && (
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  title="Xem ảnh lớn"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Thay tệp
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Xóa tệp minh chứng"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone */
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40'
          }`}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center justify-center">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
              <p className="mt-2 text-xs font-semibold text-indigo-600">
                Đang tải minh chứng lên máy chủ...
              </p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {placeholder}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Hỗ trợ ảnh JPG, PNG, WEBP hoặc PDF (tối đa 25MB) • Không cần nhập link
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {/* Lightbox Preview Modal */}
      {previewModalOpen && value && (
        <div
          onClick={() => setPreviewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> Xem ảnh minh chứng chi tiết
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center bg-slate-950">
              <img
                src={value}
                alt="Minh chứng chi tiết"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở trong tab mới
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 3. PROOF VIEWER BUTTON & LIGHTBOX (DÙNG ĐỂ HIỂN THỊ TRONG BẢNG / DANH SÁCH) */
/* ========================================================================= */
export const ProofBadgeViewer: React.FC<{
  url?: string;
  title?: string;
}> = ({ url, title = 'Minh chứng' }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!url) return null;

  const isImage =
    url.startsWith('data:image') ||
    /\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i.test(url) ||
    url.includes('/avatars/') ||
    url.includes('/minh-chung/');

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold transition"
        title="Nhấn để xem minh chứng"
      >
        {isImage ? <ImageIcon className="w-3 h-3 text-indigo-600" /> : <FileText className="w-3 h-3 text-indigo-600" />}
        <span>{title}</span>
        <Eye className="w-3 h-3 text-indigo-500 ml-0.5" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> {title}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center bg-slate-950">
              {isImage ? (
                <img
                  src={url}
                  alt={title}
                  className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="py-12 px-8 text-center text-white">
                  <FileText className="w-16 h-16 mx-auto text-indigo-400 mb-3" />
                  <p className="text-sm font-semibold">{url.split('/').pop()}</p>
                  <p className="text-xs text-slate-400 mt-1">Tệp tài liệu văn bản</p>
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    <Download className="w-4 h-4" /> Tải về máy
                  </a>
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở trong tab mới
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
