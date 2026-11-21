/**
 * API Service for connecting HRMS Frontend (Next.js) with Spring Boot Backend (Port 8080)
 */

import {
  PhongBan,
  ChucDanh,
  NhanVien,
  HopDong,
  LoaiHopDong,
  DonNghiPhep,
  BangChamCong,
  KhoaDaoTao,
  QuaTrinhDaoTao,
  KyNang,
  TaiLieu,
  LoaiTaiLieu,
  TaiKhoan,
  Role,
  Quyen,
  NhatKyHoatDong,
  CongViec,
  TienDoThucHien,
  KyLuong,
  TongHopCongTheoThang,
  BangLuongChiTiet,
  ChiTietKhoanBienDong,
  KhieuNaiLuong,
} from '@/types/hrms';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:8080/api');

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || errorBody || `Lỗi máy chủ HTTP ${response.status} (${response.statusText})`);
      } catch (parseErr) {
        if (parseErr instanceof SyntaxError) {
          throw new Error(errorBody || `Lỗi máy chủ HTTP ${response.status} (${response.statusText})`);
        }
        throw parseErr;
      }
    }

    // Handle empty 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch {
      // If server returned plain text or message string
      return ({ message: text } as unknown) as T;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Máy chủ Backend (Port 8080) không phản hồi sau 10 giây. Vui lòng kiểm tra lại tiến trình backend!');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ==================== 1. PHÒNG BAN ==================== */
export const phongBanApi = {
  getAll: () => fetchJson<PhongBan[]>('/phong-ban'),
  getById: (id: string) => fetchJson<PhongBan>(`/phong-ban/${id}`),
  create: (data: Partial<PhongBan>) =>
    fetchJson<PhongBan>('/phong-ban', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<PhongBan>) =>
    fetchJson<PhongBan>(`/phong-ban/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/phong-ban/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 2. CHỨC DANH ==================== */
export const chucDanhApi = {
  getAll: () => fetchJson<ChucDanh[]>('/chuc-danh'),
  getByPhongBan: (phongBanId: string) =>
    fetchJson<ChucDanh[]>(`/chuc-danh/phong-ban/${phongBanId}`),
  getById: (id: string) => fetchJson<ChucDanh>(`/chuc-danh/${id}`),
  create: (data: Partial<ChucDanh>) =>
    fetchJson<ChucDanh>('/chuc-danh', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ChucDanh>) =>
    fetchJson<ChucDanh>(`/chuc-danh/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/chuc-danh/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 3. NHÂN VIÊN ==================== */
export const nhanVienApi = {
  getAll: () => fetchJson<NhanVien[]>('/nhan-vien'),
  getById: (id: string) => fetchJson<NhanVien>(`/nhan-vien/${id}`),
  create: (data: Partial<NhanVien>) =>
    fetchJson<NhanVien>('/nhan-vien', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<NhanVien>) =>
    fetchJson<NhanVien>(`/nhan-vien/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<{ message?: string; softDeleted?: boolean }>(`/nhan-vien/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 4. HỢP ĐỒNG ==================== */
export const hopDongApi = {
  getAll: () => fetchJson<HopDong[]>('/hop-dong'),
  getLoai: () => fetchJson<LoaiHopDong[]>('/hop-dong/loai'),
  getById: (id: string) => fetchJson<HopDong>(`/hop-dong/${id}`),
  create: (data: Partial<HopDong>) =>
    fetchJson<HopDong>('/hop-dong', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<HopDong>) =>
    fetchJson<HopDong>(`/hop-dong/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/hop-dong/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 5. CHẤM CÔNG ==================== */
export const chamCongApi = {
  getAll: () => fetchJson<BangChamCong[]>('/cham-cong'),
  getTongHop: () => fetchJson<TongHopCongTheoThang[]>('/cham-cong/tong-hop'),
  save: (data: Partial<BangChamCong>) =>
    fetchJson<BangChamCong>('/cham-cong', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkIn: (maNhanVien: string, tenNhanVien?: string, ngay?: string) =>
    fetchJson<BangChamCong>('/cham-cong/check-in', {
      method: 'POST',
      body: JSON.stringify({ maNhanVien, tenNhanVien: tenNhanVien || '', ngay }),
    }),
  checkOut: (maNhanVien: string, ngay?: string) =>
    fetchJson<BangChamCong>('/cham-cong/check-out', {
      method: 'POST',
      body: JSON.stringify({ maNhanVien, ngay }),
    }),
};

/* ==================== 6. ĐƠN NGHỈ PHÉP ==================== */
export const donNghiPhepApi = {
  getAll: () => fetchJson<DonNghiPhep[]>('/don-nghi-phep'),
  create: (data: Partial<DonNghiPhep>) =>
    fetchJson<DonNghiPhep>('/don-nghi-phep', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  approve: (id: string, phanHoi?: string) =>
    fetchJson<DonNghiPhep>(`/don-nghi-phep/${id}/duyet`, {
      method: 'PUT',
      body: JSON.stringify({ phanHoi: phanHoi || 'Đồng ý phê duyệt' }),
    }),
  reject: (id: string, phanHoi?: string) =>
    fetchJson<DonNghiPhep>(`/don-nghi-phep/${id}/tu-choi`, {
      method: 'PUT',
      body: JSON.stringify({ phanHoi: phanHoi || 'Từ chối đơn' }),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/don-nghi-phep/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 7. CÔNG VIỆC ==================== */
export const congViecApi = {
  getAll: () => fetchJson<CongViec[]>('/cong-viec'),
  getById: (id: string) => fetchJson<CongViec>(`/cong-viec/${id}`),
  create: (data: Partial<CongViec>) =>
    fetchJson<CongViec>('/cong-viec', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CongViec>) =>
    fetchJson<CongViec>(`/cong-viec/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/cong-viec/${id}`, {
      method: 'DELETE',
    }),
  getAllProgress: () => fetchJson<TienDoThucHien[]>('/cong-viec/tien-do'),
  getProgressList: (id: string) => fetchJson<TienDoThucHien[]>(`/cong-viec/${id}/tien-do`),
  addProgress: (data: Partial<TienDoThucHien>) =>
    fetchJson<TienDoThucHien>('/cong-viec/tien-do', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

/* ==================== 8. ĐÀO TẠO & KỸ NĂNG ==================== */
export const daoTaoApi = {
  getCourses: () => fetchJson<KhoaDaoTao[]>('/dao-tao/khoa-hoc'),
  createCourse: (data: Partial<KhoaDaoTao>) =>
    fetchJson<KhoaDaoTao>('/dao-tao/khoa-hoc', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: string) =>
    fetchJson<void>(`/dao-tao/khoa-hoc/${id}`, {
      method: 'DELETE',
    }),
  getSkills: () => fetchJson<KyNang[]>('/dao-tao/ky-nang'),
  createSkill: (data: Partial<KyNang>) =>
    fetchJson<KyNang>('/dao-tao/ky-nang', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getProcesses: () => fetchJson<QuaTrinhDaoTao[]>('/dao-tao/qua-trinh'),
  assignTraining: (data: Partial<QuaTrinhDaoTao>) =>
    fetchJson<QuaTrinhDaoTao>('/dao-tao/qua-trinh', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProcess: (id: string, data: Partial<QuaTrinhDaoTao>) =>
    fetchJson<QuaTrinhDaoTao>(`/dao-tao/qua-trinh/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProcess: (id: string) =>
    fetchJson<void>(`/dao-tao/qua-trinh/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 9. TÀI LIỆU ==================== */
export const taiLieuApi = {
  getAll: () => fetchJson<TaiLieu[]>('/tai-lieu'),
  getLoai: () => fetchJson<LoaiTaiLieu[]>('/tai-lieu/loai'),
  create: (data: Partial<TaiLieu>) =>
    fetchJson<TaiLieu>('/tai-lieu', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<void>(`/tai-lieu/${id}`, {
      method: 'DELETE',
    }),
};

/* ==================== 10. LƯƠNG & PHIẾU LƯƠNG ==================== */
export const luongApi = {
  getKyLuongs: () => fetchJson<KyLuong[]>('/luong/ky-luong'),
  getPayslips: () => fetchJson<BangLuongChiTiet[]>('/luong/chi-tiet'),
  getPayslipById: (id: string) => fetchJson<BangLuongChiTiet>(`/luong/chi-tiet/${id}`),
  getBienDongs: (maLuongCT?: string) =>
    fetchJson<ChiTietKhoanBienDong[]>(
      maLuongCT ? `/luong/bien-dong?maLuongCT=${encodeURIComponent(maLuongCT)}` : '/luong/bien-dong'
    ),
  addBienDong: (data: Partial<ChiTietKhoanBienDong>) =>
    fetchJson<ChiTietKhoanBienDong>('/luong/bien-dong', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getKhieuNais: (maLuongCT?: string) =>
    fetchJson<KhieuNaiLuong[]>(
      maLuongCT ? `/luong/khieu-nai?maLuongCT=${encodeURIComponent(maLuongCT)}` : '/luong/khieu-nai'
    ),
  submitKhieuNai: (data: Partial<KhieuNaiLuong>) =>
    fetchJson<KhieuNaiLuong>('/luong/khieu-nai', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resolveKhieuNai: (id: string, payload: { trangThai?: string; nguoiXuLy?: string; phanHoi?: string }) =>
    fetchJson<KhieuNaiLuong>(`/luong/khieu-nai/${id}/xu-ly`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

/* ==================== 11. HỆ THỐNG & PHÂN QUYỀN ==================== */
export const heThongApi = {
  login: (tenDangNhap: string, matKhau: string) =>
    fetchJson<TaiKhoan>('/he-thong/login', {
      method: 'POST',
      body: JSON.stringify({ tenDangNhap, matKhau }),
    }),
  doiMatKhau: (maTK: string, matKhauCu: string, matKhauMoi: string) =>
    fetchJson<{ message: string }>('/he-thong/doi-mat-khau', {
      method: 'POST',
      body: JSON.stringify({ maTK, matKhauCu, matKhauMoi }),
    }),
  resetMatKhau: (maTK: string, matKhauMoi?: string) =>
    fetchJson<{ message: string }>('/he-thong/reset-mat-khau', {
      method: 'POST',
      body: JSON.stringify({ maTK, matKhauMoi: matKhauMoi || '123456' }),
    }),
  getAccounts: () => fetchJson<TaiKhoan[]>('/he-thong/tai-khoan'),
  createAccount: (data: Partial<TaiKhoan>) =>
    fetchJson<TaiKhoan>('/he-thong/tai-khoan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleStatus: (id: string) =>
    fetchJson<TaiKhoan>(`/he-thong/tai-khoan/${id}/toggle`, {
      method: 'PUT',
    }),
  getRoles: () => fetchJson<Role[]>('/he-thong/roles'),
  getQuyens: () => fetchJson<Quyen[]>('/he-thong/quyens'),
  getAuditLogs: () => fetchJson<NhatKyHoatDong[]>('/he-thong/audit-log'),
  addLog: (data: Partial<NhatKyHoatDong>) =>
    fetchJson<NhatKyHoatDong>('/he-thong/audit-log', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

/* ==================== 12. TẢI LÊN TẬP TIN & HÌNH ẢNH (AVATAR & MINH CHỨNG) ==================== */
export interface UploadResponse {
  success: boolean;
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  contentType?: string;
  folder?: string;
}

export const uploadApi = {
  uploadFile: async (
    file: File,
    folder: 'avatars' | 'minh-chung' | 'documents' | 'general' = 'general'
  ): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(errorText || `Tải tệp lên thất bại (HTTP ${response.status})`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Backend upload unavailable or error, converting to local DataURL preview:', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            success: true,
            url: reader.result as string,
            fileName: file.name,
            originalName: file.name,
            size: file.size,
            contentType: file.type,
            folder,
          });
        };
        reader.onerror = () => reject(err);
        reader.readAsDataURL(file);
      });
    }
  },
};
