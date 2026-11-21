'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NhanVien,
  PhongBan,
  ChucDanh,
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
import {
  initialNhanViens,
  initialPhongBans,
  initialChucDanhs,
  initialHopDongs,
  initialLoaiHopDongs,
  initialDonNghiPheps,
  initialBangChamCongs,
  initialKhoaDaoTaos,
  initialQuaTrinhDaoTaos,
  initialKyNangs,
  initialTaiLieus,
  initialLoaiTaiLieus,
  initialTaiKhoans,
  initialRoles,
  initialQuyens,
  initialNhatKyHoatDongs,
  initialCongViecs,
  initialTienDoThucHiens,
  initialKyLuongs,
  initialTongHopCongs,
  initialBangLuongChiTiets,
  initialChiTietKhoanBienDongs,
  initialKhieuNaiLuongs,
} from '@/data/mockData';
import {
  phongBanApi,
  chucDanhApi,
  nhanVienApi,
  hopDongApi,
  chamCongApi,
  donNghiPhepApi,
  congViecApi,
  daoTaoApi,
  taiLieuApi,
  luongApi,
  heThongApi,
} from '@/services/api';

interface HrmsContextType {
  // Data lists
  nhanViens: NhanVien[];
  phongBans: PhongBan[];
  chucDanhs: ChucDanh[];
  hopDongs: HopDong[];
  loaiHopDongs: LoaiHopDong[];
  donNghiPheps: DonNghiPhep[];
  bangChamCongs: BangChamCong[];
  khoaDaoTaos: KhoaDaoTao[];
  quaTrinhDaoTaos: QuaTrinhDaoTao[];
  kyNangs: KyNang[];
  taiLieus: TaiLieu[];
  loaiTaiLieus: LoaiTaiLieu[];
  taiKhoans: TaiKhoan[];
  roles: Role[];
  quyens: Quyen[];
  nhatKyHoatDongs: NhatKyHoatDong[];

  // CDM entities for Công việc & Lương
  congViecs: CongViec[];
  tienDoThucHiens: TienDoThucHien[];
  kyLuongs: KyLuong[];
  tongHopCongs: TongHopCongTheoThang[];
  bangLuongChiTiets: BangLuongChiTiet[];
  chiTietKhoanBienDongs: ChiTietKhoanBienDong[];
  khieuNaiLuongs: KhieuNaiLuong[];

  // Active user simulation & Authentication
  isAuthenticated: boolean;
  currentTaiKhoan: TaiKhoan;
  setCurrentTaiKhoan: (tk: TaiKhoan) => void;
  login: (tenDangNhap: string, matKhau: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  doiMatKhau: (matKhauCu: string, matKhauMoi: string) => Promise<{ success: boolean; message?: string }>;
  resetMatKhau: (maTK: string, matKhauMoi?: string) => Promise<{ success: boolean; message?: string }>;

  // Backend connection status
  isLoading: boolean;
  isConnectedBackend: boolean;
  refreshData: () => Promise<void>;

  // Actions - Phòng Ban & Chức Danh
  addPhongBan: (pb: Omit<PhongBan, 'MaPhongBan' | 'SoLuongNhanVien'>) => Promise<void>;
  updatePhongBan: (id: string, pb: Partial<PhongBan>) => Promise<void>;
  deletePhongBan: (id: string) => Promise<void>;
  addChucDanh: (cd: Omit<ChucDanh, 'MaChucDanh'>) => Promise<void>;
  updateChucDanh: (id: string, cd: Partial<ChucDanh>) => Promise<void>;
  deleteChucDanh: (id: string) => Promise<void>;

  // Actions - Nhân Viên
  addNhanVien: (nv: Omit<NhanVien, 'MaNhanVien'>) => Promise<void>;
  updateNhanVien: (maNV: string, nv: Partial<NhanVien>) => Promise<void>;
  deleteNhanVien: (maNV: string) => Promise<void>;

  // Actions - Hợp Đồng
  addHopDong: (hd: Omit<HopDong, 'MaHopDong'>) => Promise<void>;
  updateHopDong: (maHD: string, hd: Partial<HopDong>) => Promise<void>;
  deleteHopDong: (maHD: string) => Promise<void>;

  // Actions - Nghỉ Phép
  createDonNghiPhep: (don: Omit<DonNghiPhep, 'MaDonNP' | 'TrangThaiDNP' | 'NgayGui'>) => Promise<void>;
  approveDonNghiPhep: (maDonNP: string, phanHoi?: string) => Promise<void>;
  rejectDonNghiPhep: (maDonNP: string, phanHoi?: string) => Promise<void>;
  deleteDonNghiPhep: (maDonNP: string) => Promise<void>;

  // Actions - Chấm Công
  checkInToday: (maNV: string, ngay?: string) => Promise<void>;
  checkOutToday: (maNV: string, ngay?: string) => Promise<void>;

  // Actions - Đào Tạo & Kỹ Năng
  addKhoaDaoTao: (kdt: Omit<KhoaDaoTao, 'MaKhoa'>) => Promise<void>;
  deleteKhoaDaoTao: (maKhoa: string) => Promise<void>;
  addKyNang: (kn: Omit<KyNang, 'MaKyNang'>) => Promise<void>;
  assignDaoTao: (qtdt: Omit<QuaTrinhDaoTao, 'MaQuaTrinh'>) => Promise<void>;
  updateQuaTrinhDaoTao: (id: string, patch: Partial<QuaTrinhDaoTao>) => Promise<void>;
  deleteQuaTrinhDaoTao: (id: string) => Promise<void>;

  // Actions - Tài Liệu
  uploadTaiLieu: (tl: Omit<TaiLieu, 'MaTL' | 'NgayTaiLen'>) => Promise<void>;
  deleteTaiLieu: (maTL: string) => Promise<void>;

  // Actions - Hệ Thống & Tài Khoản
  addTaiKhoan: (tk: Omit<TaiKhoan, 'MaTK' | 'NgayTao'>) => Promise<void>;
  toggleTaiKhoanStatus: (maTK: string) => Promise<void>;

  // Actions - Công việc
  addCongViec: (cv: Omit<CongViec, 'MaCV' | 'MucDoHoanThanh'>) => Promise<void>;
  updateCongViec: (maCV: string, cv: Partial<CongViec>) => Promise<void>;
  deleteCongViec: (maCV: string) => Promise<void>;
  addTienDoThucHien: (td: Omit<TienDoThucHien, 'MaTienDo'>) => Promise<void>;

  // Actions - Lương & Khiếu Nại
  addKhieuNaiLuong: (kn: Omit<KhieuNaiLuong, 'MaKN' | 'NgayGui' | 'TrangThaiKN'>) => Promise<void>;
  resolveKhieuNaiLuong: (id: string, payload: { trangThai?: string; nguoiXuLy?: string; phanHoi?: string }) => Promise<void>;
  addChiTietKhoanBienDong: (bd: Omit<ChiTietKhoanBienDong, 'MaKhoanBD'>) => Promise<void>;
}

const HrmsContext = createContext<HrmsContextType | undefined>(undefined);

export const HrmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nhanViens, setNhanViens] = useState<NhanVien[]>(initialNhanViens);
  const [phongBans, setPhongBans] = useState<PhongBan[]>(initialPhongBans);
  const [chucDanhs, setChucDanhs] = useState<ChucDanh[]>(initialChucDanhs);
  const [hopDongs, setHopDongs] = useState<HopDong[]>(initialHopDongs);
  const [loaiHopDongs, setLoaiHopDongs] = useState<LoaiHopDong[]>(initialLoaiHopDongs);
  const [donNghiPheps, setDonNghiPheps] = useState<DonNghiPhep[]>(initialDonNghiPheps);
  const [bangChamCongs, setBangChamCongs] = useState<BangChamCong[]>(initialBangChamCongs);
  const [khoaDaoTaos, setKhoaDaoTaos] = useState<KhoaDaoTao[]>(initialKhoaDaoTaos);
  const [quaTrinhDaoTaos, setQuaTrinhDaoTaos] = useState<QuaTrinhDaoTao[]>(initialQuaTrinhDaoTaos);
  const [kyNangs, setKyNangs] = useState<KyNang[]>(initialKyNangs);
  const [taiLieus, setTaiLieus] = useState<TaiLieu[]>(initialTaiLieus);
  const [loaiTaiLieus, setLoaiTaiLieus] = useState<LoaiTaiLieu[]>(initialLoaiTaiLieus);
  const [taiKhoans, setTaiKhoans] = useState<TaiKhoan[]>(initialTaiKhoans);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [quyens, setQuyens] = useState<Quyen[]>(initialQuyens);
  const [nhatKyHoatDongs, setNhatKyHoatDongs] = useState<NhatKyHoatDong[]>(initialNhatKyHoatDongs);

  // States for Công việc & Lương
  const [congViecs, setCongViecs] = useState<CongViec[]>(initialCongViecs);
  const [tienDoThucHiens, setTienDoThucHiens] = useState<TienDoThucHien[]>(initialTienDoThucHiens);
  const [kyLuongs, setKyLuongs] = useState<KyLuong[]>(initialKyLuongs);
  const [tongHopCongs, setTongHopCongs] = useState<TongHopCongTheoThang[]>(initialTongHopCongs);
  const [bangLuongChiTiets, setBangLuongChiTiets] = useState<BangLuongChiTiet[]>(initialBangLuongChiTiets);
  const [chiTietKhoanBienDongs, setChiTietKhoanBienDongs] = useState<ChiTietKhoanBienDong[]>(initialChiTietKhoanBienDongs);
  const [khieuNaiLuongs, setKhieuNaiLuongs] = useState<KhieuNaiLuong[]>(initialKhieuNaiLuongs);

  // Authentication & active user state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTaiKhoan, setCurrentTaiKhoan] = useState<TaiKhoan>(initialTaiKhoans[0]);

  // Loading & Connection state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnectedBackend, setIsConnectedBackend] = useState<boolean>(false);

  // Restore authenticated session from localStorage on client mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('hrms_auth_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.MaTK) {
          setCurrentTaiKhoan(parsed);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error('Lỗi khi khôi phục phiên đăng nhập:', e);
    }
  }, []);

  // Helper log activity to context & backend
  const logActivity = useCallback(async (action: string, type: NhatKyHoatDong['LoaiHanhDong'], details?: string) => {
    const newLog: NhatKyHoatDong = {
      MaNhatKy: `LOG-${Date.now().toString().slice(-4)}`,
      MaTK: currentTaiKhoan?.MaTK || 'TK_GUEST',
      TenDangNhap: currentTaiKhoan?.TenDangNhap || 'guest',
      TenNhanVien: currentTaiKhoan?.TenNhanVien || 'Khách vãng lai',
      ThoiGian: new Date().toISOString().replace('T', ' ').slice(0, 19),
      HanhDong: action,
      LoaiHanhDong: type,
      DiaChiIP: '127.0.0.1',
      ChiTiet: details,
    };
    setNhatKyHoatDongs(prev => [newLog, ...prev]);

    try {
      await heThongApi.addLog(newLog);
    } catch {
      // Ignore if offline
    }
  }, [currentTaiKhoan]);

  // Login handler with Backend verification and Offline Fallback
  const login = useCallback(async (tenDangNhap: string, matKhau: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (isConnectedBackend) {
        try {
          const authUser = await heThongApi.login(tenDangNhap, matKhau);
          setCurrentTaiKhoan(authUser);
          setIsAuthenticated(true);
          try {
            localStorage.setItem('hrms_auth_user', JSON.stringify(authUser));
          } catch {}
          return { success: true };
        } catch (apiErr: any) {
          const msg = apiErr.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!';
          return { success: false, message: msg };
        }
      }

      // Offline Mock Fallback
      const found = taiKhoans.find(
        t =>
          t.TenDangNhap.toLowerCase() === tenDangNhap.toLowerCase() ||
          (t.Email && t.Email.toLowerCase() === tenDangNhap.toLowerCase()) ||
          t.MaNhanVien.toLowerCase() === tenDangNhap.toLowerCase()
      );

      if (!found) {
        return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
      }

      if (found.TrangThaiTK === 'KHOA') {
        return {
          success: false,
          message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ Admin!',
        };
      }

      const validPass = found.MatKhau || '123456';
      if (matKhau !== validPass) {
        return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
      }

      const updated: TaiKhoan = {
        ...found,
        LanDangNhapCuoi: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };

      setCurrentTaiKhoan(updated);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('hrms_auth_user', JSON.stringify(updated));
      } catch {}
      logActivity(`Đăng nhập thành công vào hệ thống (@${updated.TenDangNhap})`, 'DANG_NHAP');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi hệ thống khi đăng nhập.' };
    }
  }, [isConnectedBackend, taiKhoans, logActivity]);

  // Logout handler
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('hrms_auth_user');
    } catch {}
    setIsAuthenticated(false);
  }, []);

  // Change password for current logged-in user
  const doiMatKhau = useCallback(async (matKhauCu: string, matKhauMoi: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentTaiKhoan) return { success: false, message: 'Chưa đăng nhập!' };
    try {
      if (isConnectedBackend) {
        const res = await heThongApi.doiMatKhau(currentTaiKhoan.MaTK, matKhauCu, matKhauMoi);
        const updated = { ...currentTaiKhoan, MatKhau: matKhauMoi };
        setCurrentTaiKhoan(updated);
        try {
          localStorage.setItem('hrms_auth_user', JSON.stringify(updated));
        } catch {}
        return { success: true, message: res.message };
      }

      const currentPass = currentTaiKhoan.MatKhau || '123456';
      if (currentPass !== matKhauCu) {
        return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
      }

      const updated = { ...currentTaiKhoan, MatKhau: matKhauMoi };
      setCurrentTaiKhoan(updated);
      setTaiKhoans(prev => prev.map(t => (t.MaTK === updated.MaTK ? updated : t)));
      try {
        localStorage.setItem('hrms_auth_user', JSON.stringify(updated));
      } catch {}
      logActivity(`Đổi mật khẩu tài khoản thành công`, 'SUA');
      return { success: true, message: 'Đổi mật khẩu thành công!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể đổi mật khẩu!' };
    }
  }, [isConnectedBackend, currentTaiKhoan, logActivity]);

  // Reset password by Admin
  const resetMatKhau = useCallback(async (maTK: string, matKhauMoi?: string): Promise<{ success: boolean; message?: string }> => {
    const newPass = matKhauMoi || '123456';
    try {
      if (isConnectedBackend) {
        const res = await heThongApi.resetMatKhau(maTK, newPass);
        setTaiKhoans(prev => prev.map(t => (t.MaTK === maTK ? { ...t, MatKhau: newPass } : t)));
        return { success: true, message: res.message };
      }
      setTaiKhoans(prev => prev.map(t => (t.MaTK === maTK ? { ...t, MatKhau: newPass } : t)));
      logActivity(`Quản trị viên đặt lại mật khẩu cho tài khoản ${maTK}`, 'SUA');
      return { success: true, message: 'Đặt lại mật khẩu thành công (Mặc định: 123456)' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi khi đặt lại mật khẩu' };
    }
  }, [isConnectedBackend, logActivity]);

  // Fetch all initial data from Spring Boot Backend
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        nhanVienApi.getAll(),
        phongBanApi.getAll(),
        chucDanhApi.getAll(),
        hopDongApi.getAll(),
        hopDongApi.getLoai(),
        chamCongApi.getAll(),
        donNghiPhepApi.getAll(),
        congViecApi.getAll(),
        daoTaoApi.getCourses(),
        daoTaoApi.getSkills(),
        daoTaoApi.getProcesses(),
        taiLieuApi.getAll(),
        taiLieuApi.getLoai(),
        heThongApi.getAccounts(),
        heThongApi.getRoles(),
        heThongApi.getQuyens(),
        heThongApi.getAuditLogs(),
        luongApi.getKyLuongs(),
        luongApi.getPayslips(),
        luongApi.getBienDongs(),
        luongApi.getKhieuNais(),
        chamCongApi.getTongHop(),
        congViecApi.getAllProgress(),
      ]);

      let successCount = 0;

      if (results[0].status === 'fulfilled') {
        setNhanViens(results[0].value);
        successCount++;
      }
      if (results[1].status === 'fulfilled') {
        setPhongBans(results[1].value);
        successCount++;
      }
      if (results[2].status === 'fulfilled') {
        setChucDanhs(results[2].value);
        successCount++;
      }
      if (results[3].status === 'fulfilled') {
        setHopDongs(results[3].value);
        successCount++;
      }
      if (results[4].status === 'fulfilled') {
        setLoaiHopDongs(results[4].value);
        successCount++;
      }
      if (results[5].status === 'fulfilled') {
        setBangChamCongs(results[5].value);
        successCount++;
      }
      if (results[6].status === 'fulfilled') {
        setDonNghiPheps(results[6].value);
        successCount++;
      }
      if (results[7].status === 'fulfilled') {
        setCongViecs(results[7].value);
        successCount++;
      }
      if (results[8].status === 'fulfilled') {
        setKhoaDaoTaos(results[8].value);
        successCount++;
      }
      if (results[9].status === 'fulfilled') {
        setKyNangs(results[9].value);
        successCount++;
      }
      if (results[10].status === 'fulfilled') {
        setQuaTrinhDaoTaos(results[10].value);
        successCount++;
      }
      if (results[11].status === 'fulfilled') {
        setTaiLieus(results[11].value);
        successCount++;
      }
      if (results[12].status === 'fulfilled') {
        setLoaiTaiLieus(results[12].value);
        successCount++;
      }
      if (results[13].status === 'fulfilled' && results[13].value.length > 0) {
        const accounts = results[13].value;
        setTaiKhoans(accounts);
        setCurrentTaiKhoan(prev => {
          if (!prev) return accounts[0];
          const matched = accounts.find(t => t.MaTK === prev.MaTK);
          if (matched) {
            if (matched.TrangThaiTK === 'KHOA') {
              try { localStorage.removeItem('hrms_auth_user'); } catch {}
              setIsAuthenticated(false);
            }
            return matched;
          }
          return prev;
        });
        successCount++;
      }
      if (results[14].status === 'fulfilled') {
        setRoles(results[14].value);
        successCount++;
      }
      if (results[15].status === 'fulfilled') {
        setQuyens(results[15].value);
        successCount++;
      }
      if (results[16].status === 'fulfilled') {
        setNhatKyHoatDongs(results[16].value);
        successCount++;
      }
      if (results[17].status === 'fulfilled') {
        setKyLuongs(results[17].value);
        successCount++;
      }
      if (results[18].status === 'fulfilled') {
        setBangLuongChiTiets(results[18].value);
        successCount++;
      }
      if (results[19].status === 'fulfilled') {
        setChiTietKhoanBienDongs(results[19].value);
        successCount++;
      }
      if (results[20].status === 'fulfilled') {
        setKhieuNaiLuongs(results[20].value);
        successCount++;
      }
      if (results[21].status === 'fulfilled') {
        setTongHopCongs(results[21].value);
        successCount++;
      }
      if (results[22].status === 'fulfilled') {
        setTienDoThucHiens(results[22].value);
        successCount++;
      }

      setIsConnectedBackend(successCount > 0);
    } catch (err) {
      console.warn('Backend server unreachable, running with fallback:', err);
      setIsConnectedBackend(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ==================== PHÒNG BAN & CHỨC DANH ACTIONS ====================
  const addPhongBan = async (pbData: Omit<PhongBan, 'MaPhongBan' | 'SoLuongNhanVien'>) => {
    const payload: Partial<PhongBan> = {
      ...pbData,
      SoLuongNhanVien: 0,
    };
    try {
      const created = await phongBanApi.create(payload);
      setPhongBans(prev => [created, ...prev]);
      logActivity(`Tạo mới phòng ban: ${created.TenPhongBan} (${created.MaPhongBan})`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `PB${String(phongBans.length + 1).padStart(2, '0')}`;
      const newPB: PhongBan = { ...payload, MaPhongBan: newId, SoLuongNhanVien: 0 } as PhongBan;
      setPhongBans(prev => [newPB, ...prev]);
      logActivity(`Tạo mới phòng ban: ${newPB.TenPhongBan} (${newId})`, 'THEM');
    }
  };

  const updatePhongBan = async (id: string, patch: Partial<PhongBan>) => {
    try {
      const updated = await phongBanApi.update(id, patch);
      setPhongBans(prev => prev.map(p => (p.MaPhongBan === id ? updated : p)));
      logActivity(`Cập nhật thông tin phòng ban ${id}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setPhongBans(prev => prev.map(p => (p.MaPhongBan === id ? { ...p, ...patch } : p)));
      logActivity(`Cập nhật thông tin phòng ban ${id}`, 'SUA');
    }
  };

  const deletePhongBan = async (id: string) => {
    const target = phongBans.find(p => p.MaPhongBan === id);
    try {
      await phongBanApi.delete(id);
      setPhongBans(prev => prev.filter(p => p.MaPhongBan !== id));
      logActivity(`Xóa phòng ban ${target?.TenPhongBan || id}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setPhongBans(prev => prev.filter(p => p.MaPhongBan !== id));
      logActivity(`Xóa phòng ban ${target?.TenPhongBan || id}`, 'XOA');
    }
  };

  const addChucDanh = async (cdData: Omit<ChucDanh, 'MaChucDanh'>) => {
    try {
      const created = await chucDanhApi.create(cdData);
      setChucDanhs(prev => [created, ...prev]);
      logActivity(`Tạo chức danh mới: ${created.TenChucDanh}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `CD${String(chucDanhs.length + 1).padStart(2, '0')}`;
      const newCD: ChucDanh = { ...cdData, MaChucDanh: newId };
      setChucDanhs(prev => [newCD, ...prev]);
      logActivity(`Tạo chức danh mới: ${newCD.TenChucDanh}`, 'THEM');
    }
  };

  const updateChucDanh = async (id: string, patch: Partial<ChucDanh>) => {
    try {
      const updated = await chucDanhApi.update(id, patch);
      setChucDanhs(prev => prev.map(c => (c.MaChucDanh === id ? updated : c)));
      logActivity(`Cập nhật chức danh ${id}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setChucDanhs(prev => prev.map(c => (c.MaChucDanh === id ? { ...c, ...patch } : c)));
    }
  };

  const deleteChucDanh = async (id: string) => {
    try {
      await chucDanhApi.delete(id);
      setChucDanhs(prev => prev.filter(c => c.MaChucDanh !== id));
      logActivity(`Xóa chức danh ${id}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setChucDanhs(prev => prev.filter(c => c.MaChucDanh !== id));
    }
  };

  // ==================== NHÂN VIÊN ACTIONS ====================
  const addNhanVien = async (nvData: Omit<NhanVien, 'MaNhanVien'>) => {
    const pb = phongBans.find(p => p.MaPhongBan === nvData.MaPhongBan);
    const cd = chucDanhs.find(c => c.MaChucDanh === nvData.MaChucDanh);
    const ql = nhanViens.find(n => n.MaNhanVien === nvData.MaQuanLy);

    const payload: Partial<NhanVien> = {
      ...nvData,
      TenPhongBan: pb?.TenPhongBan,
      TenChucDanh: cd?.TenChucDanh,
      TenQuanLy: ql?.HoTen || null,
    };

    try {
      const created = await nhanVienApi.create(payload);
      setNhanViens(prev => {
        const filtered = prev.filter(n => n.MaNhanVien !== created.MaNhanVien);
        return [created, ...filtered];
      });
      logActivity(`Thêm nhân viên mới: ${created.HoTen} (${created.MaNhanVien})`, 'THEM', `Phòng ban: ${pb?.TenPhongBan}`);
      return;
    } catch (err: any) {
      if (isConnectedBackend) {
        throw err;
      }
      // Fallback local khi backend hoàn toàn offline
      const newId = `NV${String(nhanViens.length + 1).padStart(3, '0')}`;
      const newNV: NhanVien = {
        ...payload,
        MaNhanVien: newId,
      } as NhanVien;
      setNhanViens(prev => [newNV, ...prev]);
      logActivity(`Thêm nhân viên mới: ${newNV.HoTen} (${newId})`, 'THEM', `Phòng ban: ${pb?.TenPhongBan}`);
    }
  };

  const updateNhanVien = async (maNV: string, nvData: Partial<NhanVien>) => {
    const pb = nvData.MaPhongBan ? phongBans.find(p => p.MaPhongBan === nvData.MaPhongBan) : undefined;
    const cd = nvData.MaChucDanh ? chucDanhs.find(c => c.MaChucDanh === nvData.MaChucDanh) : undefined;
    const ql = nvData.MaQuanLy !== undefined ? nhanViens.find(n => n.MaNhanVien === nvData.MaQuanLy) : undefined;

    const payload: Partial<NhanVien> = {
      ...nvData,
      TenPhongBan: pb ? pb.TenPhongBan : nvData.TenPhongBan,
      TenChucDanh: cd ? cd.TenChucDanh : nvData.TenChucDanh,
      TenQuanLy: ql ? ql.HoTen : (nvData.MaQuanLy === null ? null : nvData.TenQuanLy),
    };

    try {
      const updated = await nhanVienApi.update(maNV, payload);
      setNhanViens(prev => prev.map(item => (item.MaNhanVien === maNV ? updated : item)));
      logActivity(`Cập nhật hồ sơ nhân viên ${maNV}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) {
        throw err;
      }
      // Fallback local
      setNhanViens(prev =>
        prev.map(item => (item.MaNhanVien === maNV ? { ...item, ...payload } : item))
      );
      logActivity(`Cập nhật hồ sơ nhân viên ${maNV}`, 'SUA');
    }
  };

  const deleteNhanVien = async (maNV: string) => {
    const target = nhanViens.find(n => n.MaNhanVien === maNV);
    try {
      const result = await nhanVienApi.delete(maNV);
      if (result && result.softDeleted) {
        // Soft-deleted by backend to preserve audit/financial records
        setNhanViens(prev =>
          prev.map(n => (n.MaNhanVien === maNV ? { ...n, TrangThaiLamViec: 'DA_NGHI_VIEC' } : n))
        );
        logActivity(`Chuyển trạng thái nhân viên ${target?.HoTen || maNV} sang Đã thôi việc (Bảo toàn kế toán)`, 'SUA');
      } else {
        // Hard deleted
        setNhanViens(prev => prev.filter(n => n.MaNhanVien !== maNV));
        logActivity(`Xóa nhân viên ${target?.HoTen || maNV}`, 'XOA');
      }
    } catch (err: any) {
      if (isConnectedBackend) {
        throw err;
      }
      setNhanViens(prev => prev.filter(n => n.MaNhanVien !== maNV));
      logActivity(`Xóa nhân viên ${target?.HoTen || maNV}`, 'XOA');
    }
  };

  // ==================== HỢP ĐỒNG ACTIONS ====================
  const addHopDong = async (hdData: Omit<HopDong, 'MaHopDong'>) => {
    const nv = nhanViens.find(n => n.MaNhanVien === hdData.MaNhanVien);
    const loai = loaiHopDongs.find(l => l.MaLoaiHopDong === hdData.MaLoaiHopDong);

    const payload: Partial<HopDong> = {
      ...hdData,
      TenNhanVien: nv?.HoTen,
      TenLoaiHopDong: loai?.TenLoai,
    };

    try {
      const created = await hopDongApi.create(payload);
      setHopDongs(prev => [created, ...prev]);
      logActivity(`Lập hợp đồng mới ${created.MaHopDong} cho nhân viên ${nv?.HoTen}`, 'THEM', `Loại: ${loai?.TenLoai}`);
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `HD-2024-${String(hopDongs.length + 1).padStart(3, '0')}`;
      const newHD: HopDong = { ...payload, MaHopDong: newId } as HopDong;
      setHopDongs(prev => [newHD, ...prev]);
      logActivity(`Lập hợp đồng mới ${newId} cho nhân viên ${nv?.HoTen}`, 'THEM', `Loại: ${loai?.TenLoai}`);
    }
  };

  const updateHopDong = async (maHD: string, hdData: Partial<HopDong>) => {
    try {
      const updated = await hopDongApi.update(maHD, hdData);
      setHopDongs(prev => prev.map(item => (item.MaHopDong === maHD ? updated : item)));
      logActivity(`Cập nhật thông tin hợp đồng ${maHD}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setHopDongs(prev => prev.map(item => (item.MaHopDong === maHD ? { ...item, ...hdData } : item)));
    }
  };

  const deleteHopDong = async (maHD: string) => {
    try {
      await hopDongApi.delete(maHD);
      setHopDongs(prev => prev.filter(h => h.MaHopDong !== maHD));
      logActivity(`Xóa hợp đồng ${maHD}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setHopDongs(prev => prev.filter(h => h.MaHopDong !== maHD));
    }
  };

  // ==================== ĐƠN NGHỈ PHÉP ACTIONS ====================
  const createDonNghiPhep = async (donData: Omit<DonNghiPhep, 'MaDonNP' | 'TrangThaiDNP' | 'NgayGui'>) => {
    const nv = nhanViens.find(n => n.MaNhanVien === donData.MaNhanVien);
    const ql = nhanViens.find(n => n.MaNhanVien === nv?.MaQuanLy);

    const payload: Partial<DonNghiPhep> = {
      ...donData,
      TenNhanVien: nv?.HoTen,
      TrangThaiDNP: 'CHO_DUYET',
      NgayGui: new Date().toISOString().slice(0, 10),
      NguoiDuyetMaNV: ql?.MaNhanVien || null,
      TenNguoiDuyet: ql?.HoTen || null,
    };

    try {
      const created = await donNghiPhepApi.create(payload);
      setDonNghiPheps(prev => [created, ...prev.filter(d => d.MaDonNP !== created.MaDonNP)]);
      donNghiPhepApi.getAll().then(fresh => {
        if (fresh && fresh.length > 0) setDonNghiPheps(fresh);
      }).catch(() => {});
      logActivity(`Tạo đơn xin nghỉ phép ${created.MaDonNP} (${nv?.HoTen})`, 'THEM', `Lý do: ${donData.LyDo}`);
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `DNP-2024-${String(donNghiPheps.length + 1).padStart(3, '0')}`;
      const newDon: DonNghiPhep = { ...payload, MaDonNP: newId } as DonNghiPhep;
      setDonNghiPheps(prev => [newDon, ...prev]);
      logActivity(`Tạo đơn xin nghỉ phép ${newId} (${nv?.HoTen})`, 'THEM', `Lý do: ${donData.LyDo}`);
    }
  };

  const approveDonNghiPhep = async (maDonNP: string, phanHoi?: string) => {
    try {
      const updated = await donNghiPhepApi.approve(maDonNP, phanHoi);
      setDonNghiPheps(prev => prev.map(d => (d.MaDonNP === maDonNP ? updated : d)));
      logActivity(`Phê duyệt đơn nghỉ phép ${maDonNP}`, 'DUYET');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setDonNghiPheps(prev =>
        prev.map(d =>
          d.MaDonNP === maDonNP
            ? { ...d, TrangThaiDNP: 'DA_DUYET', NgayDuyet: new Date().toISOString().slice(0, 10), PhanHoi: phanHoi || 'Đồng ý duyệt đơn nghỉ' }
            : d
        )
      );
      logActivity(`Phê duyệt đơn nghỉ phép ${maDonNP}`, 'DUYET');
    }
  };

  const rejectDonNghiPhep = async (maDonNP: string, phanHoi?: string) => {
    try {
      const updated = await donNghiPhepApi.reject(maDonNP, phanHoi);
      setDonNghiPheps(prev => prev.map(d => (d.MaDonNP === maDonNP ? updated : d)));
      logActivity(`Từ chối đơn nghỉ phép ${maDonNP}`, 'DUYET', phanHoi);
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setDonNghiPheps(prev =>
        prev.map(d =>
          d.MaDonNP === maDonNP
            ? { ...d, TrangThaiDNP: 'TU_CHOI', NgayDuyet: new Date().toISOString().slice(0, 10), PhanHoi: phanHoi || 'Từ chối đơn xin nghỉ' }
            : d
        )
      );
      logActivity(`Từ chối đơn nghỉ phép ${maDonNP}`, 'DUYET', phanHoi);
    }
  };

  const deleteDonNghiPhep = async (maDonNP: string) => {
    try {
      await donNghiPhepApi.delete(maDonNP);
      setDonNghiPheps(prev => prev.filter(d => d.MaDonNP !== maDonNP));
      logActivity(`Xóa đơn nghỉ phép ${maDonNP}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setDonNghiPheps(prev => prev.filter(d => d.MaDonNP !== maDonNP));
    }
  };

  // ==================== CHẤM CÔNG ACTIONS ====================
  const checkInToday = async (maNV: string, ngay?: string) => {
    const nv = nhanViens.find(n => n.MaNhanVien === maNV);
    try {
      const record = await chamCongApi.checkIn(maNV, nv?.HoTen, ngay);
      setBangChamCongs(prev => {
        const idx = prev.findIndex(c => c.MaChamCong === record.MaChamCong || (c.MaNhanVien === maNV && c.Ngay === record.Ngay));
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = record;
          return updated;
        }
        return [record, ...prev];
      });
      logActivity(`Nhân viên ${nv?.HoTen || maNV} Check-in lúc ${record.GioVao}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const today = ngay || new Date().toISOString().slice(0, 10);
      const nowTime = new Date().toTimeString().slice(0, 5);
      setBangChamCongs(prev => {
        const existing = prev.find(c => c.MaNhanVien === maNV && c.Ngay === today);
        if (existing) {
          return prev.map(c =>
            c.MaChamCong === existing.MaChamCong
              ? { ...c, GioVao: nowTime, DaChamCong: true, TrangThai: 'DUNG_GIO' }
              : c
          );
        }
        const newCC: BangChamCong = {
          MaChamCong: `CC-${Date.now().toString().slice(-4)}`,
          MaNhanVien: maNV,
          TenNhanVien: nv?.HoTen,
          Ngay: today,
          GioVao: nowTime,
          GioRa: null,
          DaChamCong: true,
          TrangThai: 'DUNG_GIO',
          SoGioLam: 0,
        };
        return [newCC, ...prev];
      });
      logActivity(`Nhân viên ${nv?.HoTen || maNV} Check-in lúc ${nowTime}`, 'THEM');
    }
  };

  const checkOutToday = async (maNV: string, ngay?: string) => {
    const nv = nhanViens.find(n => n.MaNhanVien === maNV);
    try {
      const record = await chamCongApi.checkOut(maNV, ngay);
      setBangChamCongs(prev => prev.map(c => (c.MaChamCong === record.MaChamCong ? record : c)));
      logActivity(`Nhân viên ${nv?.HoTen || maNV} Check-out lúc ${record.GioRa}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const today = ngay || new Date().toISOString().slice(0, 10);
      const nowTime = new Date().toTimeString().slice(0, 5);
      setBangChamCongs(prev =>
        prev.map(c => {
          if (c.MaNhanVien === maNV && c.Ngay === today) {
            let hours = 8;
            if (c.GioVao) {
              const [vH, vM] = c.GioVao.split(':').map(Number);
              const [rH, rM] = nowTime.split(':').map(Number);
              hours = Math.max(1, Number(((rH * 60 + rM - (vH * 60 + vM)) / 60).toFixed(1)));
            }
            return {
              ...c,
              GioRa: nowTime,
              SoGioLam: hours,
            };
          }
          return c;
        })
      );
      logActivity(`Nhân viên ${nv?.HoTen || maNV} Check-out lúc ${nowTime}`, 'THEM');
    }
  };

  // ==================== ĐÀO TẠO ACTIONS ====================
  const addKhoaDaoTao = async (kdtData: Omit<KhoaDaoTao, 'MaKhoa'>) => {
    try {
      const created = await daoTaoApi.createCourse(kdtData);
      setKhoaDaoTaos(prev => [created, ...prev]);
      logActivity(`Mở khóa đào tạo mới: ${created.TenKhoa}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `KDT${String(khoaDaoTaos.length + 1).padStart(2, '0')}`;
      const newKdt: KhoaDaoTao = { ...kdtData, MaKhoa: newId };
      setKhoaDaoTaos(prev => [newKdt, ...prev]);
      logActivity(`Mở khóa đào tạo mới: ${newKdt.TenKhoa}`, 'THEM');
    }
  };

  const deleteKhoaDaoTao = async (maKhoa: string) => {
    try {
      await daoTaoApi.deleteCourse(maKhoa);
      setKhoaDaoTaos(prev => prev.filter(k => k.MaKhoa !== maKhoa));
      logActivity(`Xóa khóa đào tạo ${maKhoa}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setKhoaDaoTaos(prev => prev.filter(k => k.MaKhoa !== maKhoa));
    }
  };

  const addKyNang = async (knData: Omit<KyNang, 'MaKyNang'>) => {
    try {
      const created = await daoTaoApi.createSkill(knData);
      setKyNangs(prev => [created, ...prev]);
      logActivity(`Thêm kỹ năng mới: ${created.TenKyNang}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `KN${String(kyNangs.length + 1).padStart(2, '0')}`;
      const newKn: KyNang = { ...knData, MaKyNang: newId };
      setKyNangs(prev => [newKn, ...prev]);
    }
  };

  const assignDaoTao = async (qtdtData: Omit<QuaTrinhDaoTao, 'MaQuaTrinh'>) => {
    const nv = nhanViens.find(n => n.MaNhanVien === qtdtData.MaNhanVien);
    const kdt = khoaDaoTaos.find(k => k.MaKhoa === qtdtData.MaKhoa);
    const kn = kyNangs.find(k => k.MaKyNang === qtdtData.MaKyNang);

    const payload: Partial<QuaTrinhDaoTao> = {
      ...qtdtData,
      TenNhanVien: nv?.HoTen,
      TenKhoa: kdt?.TenKhoa,
      TenKyNang: kn?.TenKyNang,
    };

    try {
      const created = await daoTaoApi.assignTraining(payload);
      setQuaTrinhDaoTaos(prev => [created, ...prev]);
      logActivity(`Giao khóa đào tạo ${kdt?.TenKhoa} cho ${nv?.HoTen}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `QTDT${String(quaTrinhDaoTaos.length + 1).padStart(2, '0')}`;
      const newQtdt: QuaTrinhDaoTao = { ...payload, MaQuaTrinh: newId } as QuaTrinhDaoTao;
      setQuaTrinhDaoTaos(prev => [newQtdt, ...prev]);
      logActivity(`Giao khóa đào tạo ${kdt?.TenKhoa} cho ${nv?.HoTen}`, 'THEM');
    }
  };

  const updateQuaTrinhDaoTao = async (id: string, patch: Partial<QuaTrinhDaoTao>) => {
    try {
      const updated = await daoTaoApi.updateProcess(id, patch);
      setQuaTrinhDaoTaos(prev => prev.map(q => (q.MaQuaTrinh === id ? updated : q)));
      logActivity(`Cập nhật kết quả đào tạo ${id}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setQuaTrinhDaoTaos(prev => prev.map(q => (q.MaQuaTrinh === id ? { ...q, ...patch } : q)));
    }
  };

  const deleteQuaTrinhDaoTao = async (id: string) => {
    try {
      await daoTaoApi.deleteProcess(id);
      setQuaTrinhDaoTaos(prev => prev.filter(q => q.MaQuaTrinh !== id));
      logActivity(`Xóa quá trình đào tạo ${id}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setQuaTrinhDaoTaos(prev => prev.filter(q => q.MaQuaTrinh !== id));
    }
  };

  // ==================== TÀI LIỆU ACTIONS ====================
  const uploadTaiLieu = async (tlData: Omit<TaiLieu, 'MaTL' | 'NgayTaiLen'>) => {
    const nv = nhanViens.find(n => n.MaNhanVien === tlData.MaNhanVien);
    const loai = loaiTaiLieus.find(l => l.MaLoaiTL === tlData.MaLoaiTL);

    const payload: Partial<TaiLieu> = {
      ...tlData,
      TenNhanVien: nv?.HoTen,
      TenLoaiTL: loai?.TenLoai,
      NgayTaiLen: new Date().toISOString().slice(0, 10),
    };

    try {
      const created = await taiLieuApi.create(payload);
      setTaiLieus(prev => [created, ...prev]);
      logActivity(`Tải lên tài liệu ${tlData.TenTL} cho ${nv?.HoTen}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `TL${String(taiLieus.length + 1).padStart(3, '0')}`;
      const newTL: TaiLieu = { ...payload, MaTL: newId } as TaiLieu;
      setTaiLieus(prev => [newTL, ...prev]);
      logActivity(`Tải lên tài liệu ${tlData.TenTL} cho ${nv?.HoTen}`, 'THEM');
    }
  };

  const deleteTaiLieu = async (maTL: string) => {
    const tl = taiLieus.find(t => t.MaTL === maTL);
    try {
      await taiLieuApi.delete(maTL);
      setTaiLieus(prev => prev.filter(t => t.MaTL !== maTL));
      logActivity(`Xóa tài liệu ${tl?.TenTL || maTL}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setTaiLieus(prev => prev.filter(t => t.MaTL !== maTL));
      logActivity(`Xóa tài liệu ${tl?.TenTL || maTL}`, 'XOA');
    }
  };

  // ==================== TÀI KHOẢN ACTIONS ====================
  const addTaiKhoan = async (tkData: Omit<TaiKhoan, 'MaTK' | 'NgayTao'>) => {
    const nv = nhanViens.find(n => n.MaNhanVien === tkData.MaNhanVien);
    const role = roles.find(r => r.MaRole === tkData.MaRole);

    const payload: Partial<TaiKhoan> = {
      ...tkData,
      TenNhanVien: nv?.HoTen,
      TenRole: role?.TenRole,
      NgayTao: new Date().toISOString().slice(0, 10),
    };

    try {
      const created = await heThongApi.createAccount(payload);
      setTaiKhoans(prev => [created, ...prev]);
      logActivity(`Cấp tài khoản mới ${tkData.TenDangNhap} cho ${nv?.HoTen}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `TK${String(taiKhoans.length + 1).padStart(3, '0')}`;
      const newTK: TaiKhoan = { ...payload, MaTK: newId } as TaiKhoan;
      setTaiKhoans(prev => [newTK, ...prev]);
      logActivity(`Cấp tài khoản mới ${tkData.TenDangNhap} cho ${nv?.HoTen}`, 'THEM');
    }
  };

  const toggleTaiKhoanStatus = async (maTK: string) => {
    try {
      const updated = await heThongApi.toggleStatus(maTK);
      setTaiKhoans(prev => prev.map(t => (t.MaTK === maTK ? updated : t)));
      logActivity(`Thay đổi trạng thái tài khoản ${maTK}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setTaiKhoans(prev =>
        prev.map(t =>
          t.MaTK === maTK
            ? { ...t, TrangThaiTK: t.TrangThaiTK === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG' }
            : t
        )
      );
      logActivity(`Thay đổi trạng thái tài khoản ${maTK}`, 'SUA');
    }
  };

  // ==================== CÔNG VIỆC ACTIONS ====================
  const addCongViec = async (cvData: Omit<CongViec, 'MaCV' | 'MucDoHoanThanh'>) => {
    try {
      const created = await congViecApi.create(cvData);
      setCongViecs(prev => [created, ...prev.filter(c => c.MaCV !== created.MaCV)]);
      const refreshedTasks = await congViecApi.getAll().catch(() => null);
      if (refreshedTasks && refreshedTasks.length > 0) {
        setCongViecs(refreshedTasks);
      }
      logActivity(`Giao công việc mới: ${created.TenCV || cvData.TenCV}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `CV${String(congViecs.length + 1).padStart(3, '0')}`;
      const newCV: CongViec = { ...cvData, MaCV: newId, MucDoHoanThanh: 0 };
      setCongViecs(prev => [newCV, ...prev]);
      logActivity(`Giao công việc mới: ${cvData.TenCV}`, 'THEM');
    }
  };

  const updateCongViec = async (maCV: string, patch: Partial<CongViec>) => {
    try {
      const updated = await congViecApi.update(maCV, patch);
      setCongViecs(prev => prev.map(c => (c.MaCV === maCV ? updated : c)));
      logActivity(`Cập nhật thông tin công việc ${maCV}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setCongViecs(prev => prev.map(c => (c.MaCV === maCV ? { ...c, ...patch } : c)));
      logActivity(`Cập nhật thông tin công việc ${maCV}`, 'SUA');
    }
  };

  const deleteCongViec = async (maCV: string) => {
    try {
      await congViecApi.delete(maCV);
      setCongViecs(prev => prev.filter(c => c.MaCV !== maCV));
      setTienDoThucHiens(prev => prev.filter(t => t.MaCV !== maCV));
      logActivity(`Xóa công việc ${maCV}`, 'XOA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setCongViecs(prev => prev.filter(c => c.MaCV !== maCV));
      setTienDoThucHiens(prev => prev.filter(t => t.MaCV !== maCV));
    }
  };

  const addTienDoThucHien = async (tdData: Omit<TienDoThucHien, 'MaTienDo'>) => {
    try {
      const saved = await congViecApi.addProgress(tdData);
      setTienDoThucHiens(prev => [saved, ...prev]);
      // Sync tasks
      const refreshedTasks = await congViecApi.getAll().catch(() => null);
      if (refreshedTasks) {
        setCongViecs(refreshedTasks);
      }
      logActivity(`Cập nhật tiến độ ${tdData.MucDoHoanThanh}% cho công việc ${tdData.MaCV}`, 'SUA');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `TD${String(tienDoThucHiens.length + 1).padStart(3, '0')}`;
      const newTD: TienDoThucHien = { ...tdData, MaTienDo: newId };
      setTienDoThucHiens(prev => [newTD, ...prev]);
      setCongViecs(prev =>
        prev.map(c => {
          if (c.MaCV === tdData.MaCV) {
            const newStatus =
              tdData.MucDoHoanThanh >= 100
                ? 'HOAN_THANH'
                : tdData.MucDoHoanThanh > 0
                ? 'DANG_THUC_HIEN'
                : c.TrangThai;
            return {
              ...c,
              MucDoHoanThanh: tdData.MucDoHoanThanh,
              TrangThai: newStatus,
            };
          }
          return c;
        })
      );
      logActivity(`Cập nhật tiến độ ${tdData.MucDoHoanThanh}% cho công việc ${tdData.MaCV}`, 'SUA');
    }
  };

  // ==================== LƯƠNG & KHIẾU NẠI ACTIONS ====================
  const addKhieuNaiLuong = async (knData: Omit<KhieuNaiLuong, 'MaKN' | 'NgayGui' | 'TrangThaiKN'>) => {
    try {
      const saved = await luongApi.submitKhieuNai(knData);
      setKhieuNaiLuongs(prev => [saved, ...prev]);
      const payslips = await luongApi.getPayslips().catch(() => null);
      if (payslips) setBangLuongChiTiets(payslips);
      logActivity(`Gửi khiếu nại phiếu lương ${knData.MaLuongCT}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `KN-${Date.now().toString().slice(-4)}`;
      const newKN: KhieuNaiLuong = {
        ...knData,
        MaKN: newId,
        NgayGui: new Date().toISOString().replace('T', ' ').slice(0, 16),
        TrangThaiKN: 'CHO_XU_LY',
      };
      setKhieuNaiLuongs(prev => [newKN, ...prev]);
      setBangLuongChiTiets(prev =>
        prev.map(bl =>
          bl.MaLuongCT === knData.MaLuongCT ? { ...bl, TrangThaiKhieuNai: 'DANG_KHIEU_NAI' } : bl
        )
      );
      logActivity(`Gửi khiếu nại phiếu lương ${knData.MaLuongCT}`, 'THEM');
    }
  };

  const resolveKhieuNaiLuong = async (
    id: string,
    payload: { trangThai?: string; nguoiXuLy?: string; phanHoi?: string }
  ) => {
    try {
      const updated = await luongApi.resolveKhieuNai(id, payload);
      setKhieuNaiLuongs(prev => prev.map(k => (k.MaKN === id ? updated : k)));
      const payslips = await luongApi.getPayslips().catch(() => null);
      if (payslips) setBangLuongChiTiets(payslips);
      logActivity(`Xử lý khiếu nại lương ${id}`, 'DUYET');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      setKhieuNaiLuongs(prev =>
        prev.map(k =>
          k.MaKN === id
            ? {
                ...k,
                TrangThaiKN: (payload.trangThai as any) || 'DA_GIAI_QUYET',
                NgayXuLy: new Date().toISOString().slice(0, 10),
                NguoiXuLy: payload.nguoiXuLy,
                PhanHoi: payload.phanHoi,
              }
            : k
        )
      );
    }
  };

  const addChiTietKhoanBienDong = async (bdData: Omit<ChiTietKhoanBienDong, 'MaKhoanBD'>) => {
    try {
      const saved = await luongApi.addBienDong(bdData);
      setChiTietKhoanBienDongs(prev => [saved, ...prev]);
      const payslips = await luongApi.getPayslips().catch(() => null);
      if (payslips) setBangLuongChiTiets(payslips);
      logActivity(`Thêm khoản biến động lương ${bdData.TenBD}`, 'THEM');
    } catch (err: any) {
      if (isConnectedBackend) throw err;
      const newId = `BD${String(chiTietKhoanBienDongs.length + 1).padStart(3, '0')}`;
      const newBD: ChiTietKhoanBienDong = { ...bdData, MaKhoanBD: newId };
      setChiTietKhoanBienDongs(prev => [newBD, ...prev]);
      logActivity(`Thêm khoản biến động lương ${bdData.TenBD}`, 'THEM');
    }
  };

  return (
    <HrmsContext.Provider
      value={{
        nhanViens,
        phongBans,
        chucDanhs,
        hopDongs,
        loaiHopDongs,
        donNghiPheps,
        bangChamCongs,
        khoaDaoTaos,
        quaTrinhDaoTaos,
        kyNangs,
        taiLieus,
        loaiTaiLieus,
        taiKhoans,
        roles,
        quyens,
        nhatKyHoatDongs,

        congViecs,
        tienDoThucHiens,
        kyLuongs,
        tongHopCongs,
        bangLuongChiTiets,
        chiTietKhoanBienDongs,
        khieuNaiLuongs,

        currentTaiKhoan,
        setCurrentTaiKhoan,
        isAuthenticated,
        login,
        logout,
        doiMatKhau,
        resetMatKhau,

        isLoading,
        isConnectedBackend,
        refreshData,

        addPhongBan,
        updatePhongBan,
        deletePhongBan,
        addChucDanh,
        updateChucDanh,
        deleteChucDanh,

        addNhanVien,
        updateNhanVien,
        deleteNhanVien,

        addHopDong,
        updateHopDong,
        deleteHopDong,

        createDonNghiPhep,
        approveDonNghiPhep,
        rejectDonNghiPhep,
        deleteDonNghiPhep,

        checkInToday,
        checkOutToday,

        addKhoaDaoTao,
        deleteKhoaDaoTao,
        addKyNang,
        assignDaoTao,
        updateQuaTrinhDaoTao,
        deleteQuaTrinhDaoTao,

        uploadTaiLieu,
        deleteTaiLieu,

        addTaiKhoan,
        toggleTaiKhoanStatus,

        addCongViec,
        updateCongViec,
        deleteCongViec,
        addTienDoThucHien,

        addKhieuNaiLuong,
        resolveKhieuNaiLuong,
        addChiTietKhoanBienDong,
      }}
    >
      {children}
    </HrmsContext.Provider>
  );
};

export const useHrms = () => {
  const context = useContext(HrmsContext);
  if (!context) {
    throw new Error('useHrms must be used within an HrmsProvider');
  }
  return context;
};
