'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // New CDM entities for Công việc & Lương
  congViecs: CongViec[];
  tienDoThucHiens: TienDoThucHien[];
  kyLuongs: KyLuong[];
  tongHopCongs: TongHopCongTheoThang[];
  bangLuongChiTiets: BangLuongChiTiet[];
  chiTietKhoanBienDongs: ChiTietKhoanBienDong[];
  khieuNaiLuongs: KhieuNaiLuong[];

  // Active user simulation
  currentTaiKhoan: TaiKhoan;
  setCurrentTaiKhoan: (tk: TaiKhoan) => void;

  // Actions
  addNhanVien: (nv: Omit<NhanVien, 'MaNhanVien'>) => void;
  updateNhanVien: (maNV: string, nv: Partial<NhanVien>) => void;
  deleteNhanVien: (maNV: string) => void;

  addHopDong: (hd: Omit<HopDong, 'MaHopDong'>) => void;
  updateHopDong: (maHD: string, hd: Partial<HopDong>) => void;

  createDonNghiPhep: (don: Omit<DonNghiPhep, 'MaDonNP' | 'TrangThaiDNP' | 'NgayGui'>) => void;
  approveDonNghiPhep: (maDonNP: string, phanHoi?: string) => void;
  rejectDonNghiPhep: (maDonNP: string, phanHoi?: string) => void;

  checkInToday: (maNV: string) => void;
  checkOutToday: (maNV: string) => void;

  addKhoaDaoTao: (kdt: Omit<KhoaDaoTao, 'MaKhoa'>) => void;
  assignDaoTao: (qtdt: Omit<QuaTrinhDaoTao, 'MaQuaTrinh'>) => void;

  uploadTaiLieu: (tl: Omit<TaiLieu, 'MaTL' | 'NgayTaiLen'>) => void;
  deleteTaiLieu: (maTL: string) => void;

  addTaiKhoan: (tk: Omit<TaiKhoan, 'MaTK' | 'NgayTao'>) => void;
  toggleTaiKhoanStatus: (maTK: string) => void;

  // Actions for Công việc & Lương & Khiếu nại
  addCongViec: (cv: Omit<CongViec, 'MaCV' | 'MucDoHoanThanh'>) => void;
  updateCongViec: (maCV: string, cv: Partial<CongViec>) => void;
  addTienDoThucHien: (td: Omit<TienDoThucHien, 'MaTienDo'>) => void;
  addKhieuNaiLuong: (kn: Omit<KhieuNaiLuong, 'MaKN' | 'NgayGui' | 'TrangThaiKN'>) => void;
  addChiTietKhoanBienDong: (bd: Omit<ChiTietKhoanBienDong, 'MaKhoanBD'>) => void;
}

const HrmsContext = createContext<HrmsContextType | undefined>(undefined);

export const HrmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nhanViens, setNhanViens] = useState<NhanVien[]>(initialNhanViens);
  const [phongBans, setPhongBans] = useState<PhongBan[]>(initialPhongBans);
  const [chucDanhs, setChucDanhs] = useState<ChucDanh[]>(initialChucDanhs);
  const [hopDongs, setHopDongs] = useState<HopDong[]>(initialHopDongs);
  const [loaiHopDongs] = useState<LoaiHopDong[]>(initialLoaiHopDongs);
  const [donNghiPheps, setDonNghiPheps] = useState<DonNghiPhep[]>(initialDonNghiPheps);
  const [bangChamCongs, setBangChamCongs] = useState<BangChamCong[]>(initialBangChamCongs);
  const [khoaDaoTaos, setKhoaDaoTaos] = useState<KhoaDaoTao[]>(initialKhoaDaoTaos);
  const [quaTrinhDaoTaos, setQuaTrinhDaoTaos] = useState<QuaTrinhDaoTao[]>(initialQuaTrinhDaoTaos);
  const [kyNangs] = useState<KyNang[]>(initialKyNangs);
  const [taiLieus, setTaiLieus] = useState<TaiLieu[]>(initialTaiLieus);
  const [loaiTaiLieus] = useState<LoaiTaiLieu[]>(initialLoaiTaiLieus);
  const [taiKhoans, setTaiKhoans] = useState<TaiKhoan[]>(initialTaiKhoans);
  const [roles] = useState<Role[]>(initialRoles);
  const [quyens] = useState<Quyen[]>(initialQuyens);
  const [nhatKyHoatDongs, setNhatKyHoatDongs] = useState<NhatKyHoatDong[]>(initialNhatKyHoatDongs);

  // States for Công việc & Lương
  const [congViecs, setCongViecs] = useState<CongViec[]>(initialCongViecs);
  const [tienDoThucHiens, setTienDoThucHiens] = useState<TienDoThucHien[]>(initialTienDoThucHiens);
  const [kyLuongs, setKyLuongs] = useState<KyLuong[]>(initialKyLuongs);
  const [tongHopCongs, setTongHopCongs] = useState<TongHopCongTheoThang[]>(initialTongHopCongs);
  const [bangLuongChiTiets, setBangLuongChiTiets] = useState<BangLuongChiTiet[]>(initialBangLuongChiTiets);
  const [chiTietKhoanBienDongs, setChiTietKhoanBienDongs] = useState<ChiTietKhoanBienDong[]>(initialChiTietKhoanBienDongs);
  const [khieuNaiLuongs, setKhieuNaiLuongs] = useState<KhieuNaiLuong[]>(initialKhieuNaiLuongs);

  // Default active user is Admin
  const [currentTaiKhoan, setCurrentTaiKhoan] = useState<TaiKhoan>(initialTaiKhoans[0]);

  // Log activity helper
  const logActivity = (action: string, type: NhatKyHoatDong['LoaiHanhDong'], details?: string) => {
    const newLog: NhatKyHoatDong = {
      MaNhatKy: `LOG-${Date.now().toString().slice(-4)}`,
      MaTK: currentTaiKhoan.MaTK,
      TenDangNhap: currentTaiKhoan.TenDangNhap,
      TenNhanVien: currentTaiKhoan.TenNhanVien,
      ThoiGian: new Date().toISOString().replace('T', ' ').slice(0, 19),
      HanhDong: action,
      LoaiHanhDong: type,
      DiaChiIP: '192.168.1.50',
      ChiTiet: details,
    };
    setNhatKyHoatDongs(prev => [newLog, ...prev]);
  };

  // Nhan Vien Actions
  const addNhanVien = (nvData: Omit<NhanVien, 'MaNhanVien'>) => {
    const newId = `NV${String(nhanViens.length + 1).padStart(3, '0')}`;
    const pb = phongBans.find(p => p.MaPhongBan === nvData.MaPhongBan);
    const cd = chucDanhs.find(c => c.MaChucDanh === nvData.MaChucDanh);
    const ql = nhanViens.find(n => n.MaNhanVien === nvData.MaQuanLy);

    const newNV: NhanVien = {
      ...nvData,
      MaNhanVien: newId,
      TenPhongBan: pb?.TenPhongBan,
      TenChucDanh: cd?.TenChucDanh,
      TenQuanLy: ql?.HoTen || null,
    };

    setNhanViens(prev => [newNV, ...prev]);
    logActivity(`Thêm nhân viên mới: ${newNV.HoTen} (${newId})`, 'THEM', `Phòng ban: ${pb?.TenPhongBan}`);
  };

  const updateNhanVien = (maNV: string, nvData: Partial<NhanVien>) => {
    setNhanViens(prev =>
      prev.map(item => {
        if (item.MaNhanVien === maNV) {
          const pb = nvData.MaPhongBan ? phongBans.find(p => p.MaPhongBan === nvData.MaPhongBan) : undefined;
          const cd = nvData.MaChucDanh ? chucDanhs.find(c => c.MaChucDanh === nvData.MaChucDanh) : undefined;
          const ql = nvData.MaQuanLy !== undefined ? nhanViens.find(n => n.MaNhanVien === nvData.MaQuanLy) : undefined;

          return {
            ...item,
            ...nvData,
            TenPhongBan: pb ? pb.TenPhongBan : item.TenPhongBan,
            TenChucDanh: cd ? cd.TenChucDanh : item.TenChucDanh,
            TenQuanLy: ql ? ql.HoTen : (nvData.MaQuanLy === null ? null : item.TenQuanLy),
          };
        }
        return item;
      })
    );
    logActivity(`Cập nhật hồ sơ nhân viên ${maNV}`, 'SUA');
  };

  const deleteNhanVien = (maNV: string) => {
    const target = nhanViens.find(n => n.MaNhanVien === maNV);
    setNhanViens(prev => prev.filter(n => n.MaNhanVien !== maNV));
    logActivity(`Xóa nhân viên ${target?.HoTen || maNV}`, 'XOA');
  };

  // Hop Dong Actions
  const addHopDong = (hdData: Omit<HopDong, 'MaHopDong'>) => {
    const newId = `HD-2024-${String(hopDongs.length + 1).padStart(3, '0')}`;
    const nv = nhanViens.find(n => n.MaNhanVien === hdData.MaNhanVien);
    const loai = loaiHopDongs.find(l => l.MaLoaiHopDong === hdData.MaLoaiHopDong);

    const newHD: HopDong = {
      ...hdData,
      MaHopDong: newId,
      TenNhanVien: nv?.HoTen,
      TenLoaiHopDong: loai?.TenLoai,
    };

    setHopDongs(prev => [newHD, ...prev]);
    logActivity(`Lập hợp đồng mới ${newId} cho nhân viên ${nv?.HoTen}`, 'THEM', `Loại: ${loai?.TenLoai}`);
  };

  const updateHopDong = (maHD: string, hdData: Partial<HopDong>) => {
    setHopDongs(prev =>
      prev.map(item => (item.MaHopDong === maHD ? { ...item, ...hdData } : item))
    );
    logActivity(`Cập nhật thông tin hợp đồng ${maHD}`, 'SUA');
  };

  // Don Nghi Phep Actions
  const createDonNghiPhep = (donData: Omit<DonNghiPhep, 'MaDonNP' | 'TrangThaiDNP' | 'NgayGui'>) => {
    const newId = `DNP-2024-${String(donNghiPheps.length + 1).padStart(3, '0')}`;
    const nv = nhanViens.find(n => n.MaNhanVien === donData.MaNhanVien);
    const ql = nhanViens.find(n => n.MaNhanVien === nv?.MaQuanLy);

    const newDon: DonNghiPhep = {
      ...donData,
      MaDonNP: newId,
      TenNhanVien: nv?.HoTen,
      TrangThaiDNP: 'CHO_DUYET',
      NgayGui: new Date().toISOString().slice(0, 10),
      NguoiDuyetMaNV: ql?.MaNhanVien || null,
      TenNguoiDuyet: ql?.HoTen || null,
    };

    setDonNghiPheps(prev => [newDon, ...prev]);
    logActivity(`Tạo đơn xin nghỉ phép ${newId} (${nv?.HoTen})`, 'THEM', `Lý do: ${donData.LyDo}`);
  };

  const approveDonNghiPhep = (maDonNP: string, phanHoi?: string) => {
    setDonNghiPheps(prev =>
      prev.map(d =>
        d.MaDonNP === maDonNP
          ? {
              ...d,
              TrangThaiDNP: 'DA_DUYET',
              NgayDuyet: new Date().toISOString().slice(0, 10),
              PhanHoi: phanHoi || 'Đồng ý duyệt đơn nghỉ',
            }
          : d
      )
    );
    logActivity(`Phê duyệt đơn nghỉ phép ${maDonNP}`, 'DUYET');
  };

  const rejectDonNghiPhep = (maDonNP: string, phanHoi?: string) => {
    setDonNghiPheps(prev =>
      prev.map(d =>
        d.MaDonNP === maDonNP
          ? {
              ...d,
              TrangThaiDNP: 'TU_CHOI',
              NgayDuyet: new Date().toISOString().slice(0, 10),
              PhanHoi: phanHoi || 'Từ chối đơn xin nghỉ',
            }
          : d
      )
    );
    logActivity(`Từ chối đơn nghỉ phép ${maDonNP}`, 'DUYET', phanHoi);
  };

  // Cham Cong Actions
  const checkInToday = (maNV: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 5);
    const nv = nhanViens.find(n => n.MaNhanVien === maNV);

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
  };

  const checkOutToday = (maNV: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 5);
    const nv = nhanViens.find(n => n.MaNhanVien === maNV);

    setBangChamCongs(prev =>
      prev.map(c => {
        if (c.MaNhanVien === maNV && c.Ngay === today) {
          // Tính sơ bộ số giờ làm
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
  };

  // Dao Tao Actions
  const addKhoaDaoTao = (kdtData: Omit<KhoaDaoTao, 'MaKhoa'>) => {
    const newId = `KDT${String(khoaDaoTaos.length + 1).padStart(2, '0')}`;
    const newKdt: KhoaDaoTao = { ...kdtData, MaKhoa: newId };
    setKhoaDaoTaos(prev => [newKdt, ...prev]);
    logActivity(`Mở khóa đào tạo mới: ${newKdt.TenKhoa}`, 'THEM');
  };

  const assignDaoTao = (qtdtData: Omit<QuaTrinhDaoTao, 'MaQuaTrinh'>) => {
    const newId = `QTDT${String(quaTrinhDaoTaos.length + 1).padStart(2, '0')}`;
    const nv = nhanViens.find(n => n.MaNhanVien === qtdtData.MaNhanVien);
    const kdt = khoaDaoTaos.find(k => k.MaKhoa === qtdtData.MaKhoa);
    const kn = kyNangs.find(k => k.MaKyNang === qtdtData.MaKyNang);

    const newQtdt: QuaTrinhDaoTao = {
      ...qtdtData,
      MaQuaTrinh: newId,
      TenNhanVien: nv?.HoTen,
      TenKhoa: kdt?.TenKhoa,
      TenKyNang: kn?.TenKyNang,
    };

    setQuaTrinhDaoTaos(prev => [newQtdt, ...prev]);
    logActivity(`Giao khóa đào tạo ${kdt?.TenKhoa} cho ${nv?.HoTen}`, 'THEM');
  };

  // Tai Lieu Actions
  const uploadTaiLieu = (tlData: Omit<TaiLieu, 'MaTL' | 'NgayTaiLen'>) => {
    const newId = `TL${String(taiLieus.length + 1).padStart(3, '0')}`;
    const nv = nhanViens.find(n => n.MaNhanVien === tlData.MaNhanVien);
    const loai = loaiTaiLieus.find(l => l.MaLoaiTL === tlData.MaLoaiTL);

    const newTL: TaiLieu = {
      ...tlData,
      MaTL: newId,
      TenNhanVien: nv?.HoTen,
      TenLoaiTL: loai?.TenLoai,
      NgayTaiLen: new Date().toISOString().slice(0, 10),
    };

    setTaiLieus(prev => [newTL, ...prev]);
    logActivity(`Tải lên tài liệu ${tlData.TenTL} cho ${nv?.HoTen}`, 'THEM');
  };

  const deleteTaiLieu = (maTL: string) => {
    const tl = taiLieus.find(t => t.MaTL === maTL);
    setTaiLieus(prev => prev.filter(t => t.MaTL !== maTL));
    logActivity(`Xóa tài liệu ${tl?.TenTL || maTL}`, 'XOA');
  };

  // Tai Khoan Actions
  const addTaiKhoan = (tkData: Omit<TaiKhoan, 'MaTK' | 'NgayTao'>) => {
    const newId = `TK${String(taiKhoans.length + 1).padStart(3, '0')}`;
    const nv = nhanViens.find(n => n.MaNhanVien === tkData.MaNhanVien);
    const role = roles.find(r => r.MaRole === tkData.MaRole);

    const newTK: TaiKhoan = {
      ...tkData,
      MaTK: newId,
      TenNhanVien: nv?.HoTen,
      TenRole: role?.TenRole,
      NgayTao: new Date().toISOString().slice(0, 10),
    };

    setTaiKhoans(prev => [newTK, ...prev]);
    logActivity(`Cấp tài khoản mới ${tkData.TenDangNhap} cho ${nv?.HoTen}`, 'THEM');
  };

  const toggleTaiKhoanStatus = (maTK: string) => {
    setTaiKhoans(prev =>
      prev.map(t =>
        t.MaTK === maTK
          ? { ...t, TrangThaiTK: t.TrangThaiTK === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG' }
          : t
      )
    );
    logActivity(`Thay đổi trạng thái tài khoản ${maTK}`, 'SUA');
  };

  // Công Việc Actions
  const addCongViec = (cvData: Omit<CongViec, 'MaCV' | 'MucDoHoanThanh'>) => {
    const newId = `CV${String(congViecs.length + 1).padStart(3, '0')}`;
    const newCV: CongViec = {
      ...cvData,
      MaCV: newId,
      MucDoHoanThanh: 0,
    };
    setCongViecs(prev => [newCV, ...prev]);
    logActivity(`Giao công việc mới: ${cvData.TenCV}`, 'THEM');
  };

  const updateCongViec = (maCV: string, patch: Partial<CongViec>) => {
    setCongViecs(prev => prev.map(c => (c.MaCV === maCV ? { ...c, ...patch } : c)));
    logActivity(`Cập nhật thông tin công việc ${maCV}`, 'SUA');
  };

  const addTienDoThucHien = (tdData: Omit<TienDoThucHien, 'MaTienDo'>) => {
    const newId = `TD${String(tienDoThucHiens.length + 1).padStart(3, '0')}`;
    const newTD: TienDoThucHien = {
      ...tdData,
      MaTienDo: newId,
    };
    setTienDoThucHiens(prev => [newTD, ...prev]);

    // Cập nhật mức độ hoàn thành và trạng thái của công việc
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
  };

  // Khiếu nại lương Action
  const addKhieuNaiLuong = (knData: Omit<KhieuNaiLuong, 'MaKN' | 'NgayGui' | 'TrangThaiKN'>) => {
    const newId = `KN-${Date.now().toString().slice(-4)}`;
    const newKN: KhieuNaiLuong = {
      ...knData,
      MaKN: newId,
      NgayGui: new Date().toISOString().replace('T', ' ').slice(0, 16),
      TrangThaiKN: 'CHO_XU_LY',
    };
    setKhieuNaiLuongs(prev => [newKN, ...prev]);

    // Đánh dấu cờ đang khiếu nại lên phiếu lương tương ứng
    setBangLuongChiTiets(prev =>
      prev.map(bl =>
        bl.MaLuongCT === knData.MaLuongCT ? { ...bl, TrangThaiKhieuNai: 'DANG_KHIEU_NAI' } : bl
      )
    );

    logActivity(`Gửi khiếu nại phiếu lương ${knData.MaLuongCT}`, 'THEM');
  };

  const addChiTietKhoanBienDong = (bdData: Omit<ChiTietKhoanBienDong, 'MaKhoanBD'>) => {
    const newId = `BD${String(chiTietKhoanBienDongs.length + 1).padStart(3, '0')}`;
    const newBD: ChiTietKhoanBienDong = {
      ...bdData,
      MaKhoanBD: newId,
    };
    setChiTietKhoanBienDongs(prev => [newBD, ...prev]);
    logActivity(`Thêm khoản biến động lương ${bdData.TenBD}`, 'THEM');
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

        addNhanVien,
        updateNhanVien,
        deleteNhanVien,

        addHopDong,
        updateHopDong,

        createDonNghiPhep,
        approveDonNghiPhep,
        rejectDonNghiPhep,

        checkInToday,
        checkOutToday,

        addKhoaDaoTao,
        assignDaoTao,

        uploadTaiLieu,
        deleteTaiLieu,

        addTaiKhoan,
        toggleTaiKhoanStatus,

        addCongViec,
        updateCongViec,
        addTienDoThucHien,
        addKhieuNaiLuong,
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
