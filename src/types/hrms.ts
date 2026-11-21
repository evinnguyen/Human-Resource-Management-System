// Types based on CDM (Conceptual Data Model) for HRMS

export type TrangThaiLamViec = 'DANG_LAM_VIEC' | 'THU_VIEC' | 'NGHI_PHEP' | 'DA_NGHI_VIEC';

export interface PhongBan {
  MaPhongBan: string;
  TenPhongBan: string;
  MoTa?: string;
  MaTruongPhong?: string;
  TenTruongPhong?: string;
  SoLuongNhanVien?: number;
}

export interface ChucDanh {
  MaChucDanh: string;
  TenChucDanh: string;
  MaPhongBan?: string;
  TenPhongBan?: string;
  CapBac?: string;
}

export interface NhanVien {
  MaNhanVien: string;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: 'Nam' | 'Nữ' | 'Khác';
  CCCD: string;
  SDT: string;
  Email: string;
  Avatar: string;
  TrangThaiLamViec: TrangThaiLamViec;
  NgayVaoLam: string;
  MaPhongBan: string;
  TenPhongBan?: string;
  MaChucDanh: string;
  TenChucDanh?: string;
  MaQuanLy?: string | null;
  TenQuanLy?: string | null;
  SoNgayNghiConLai?: number;
}

export interface LoaiHopDong {
  MaLoaiHopDong: string;
  TenLoai: string;
  ThoiHanThang?: number;
}

export type TrangThaiHopDong = 'CON_HIEU_LUC' | 'HET_HAN' | 'CHO_DUYET' | 'DA_CHAM_DUT';

export interface HopDong {
  MaHopDong: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  MaLoaiHopDong: string;
  TenLoaiHopDong?: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  MucLuong: number;
  TrangThaiHopDong: TrangThaiHopDong;
  GhiChu?: string;
}

export type TrangThaiDonNP = 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI';

export interface DonNghiPhep {
  MaDonNP: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  TuNgay: string;
  DenNgay: string;
  SoNgayNghi: number;
  TrangThaiDNP: TrangThaiDonNP;
  NgayGui: string;
  NgayDuyet?: string | null;
  NguoiDuyetMaNV?: string | null;
  TenNguoiDuyet?: string | null;
  LyDo: string;
  PhanHoi?: string;
  MinhChung?: string;
}

export interface ThoiDiem {
  NgayGio: string; // ISO format or YYYY-MM-DD HH:mm:ss
}

export type TrangThaiChamCong = 'DUNG_GIO' | 'DI_MUON' | 'VE_SOM' | 'NGHI_PHEP' | 'VANG_MAT';

export interface BangChamCong {
  MaChamCong: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  Ngay: string; // YYYY-MM-DD
  GioVao?: string | null;
  GioRa?: string | null;
  DaChamCong: boolean;
  TrangThai: TrangThaiChamCong;
  SoGioLam?: number;
  GhiChu?: string;
}

export interface KyNang {
  MaKyNang: string;
  TenKyNang: string;
  LoaiKyNang?: 'Chuyên môn' | 'Kỹ năng mềm' | 'Ngoại ngữ' | 'Công cụ';
  MoTa?: string;
}

export interface KhoaDaoTao {
  MaKhoa: string;
  TenKhoa: string;
  HinhThucHoc: 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp (Hybrid)';
  NgayBD: string;
  NgayKT: string;
  NguoiDay: string;
  DiaDiem?: string;
  SoLuongHocVien?: number;
  MoTa?: string;
}

export type KetQuaDaoTao = 'CHUA_DANH_GIA' | 'DAT' | 'XUAT_SAC' | 'CHUA_DAT';

export interface QuaTrinhDaoTao {
  MaQuaTrinh: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  MaKhoa: string;
  TenKhoa?: string;
  TienDo: number; // 0 - 100%
  KetQua: KetQuaDaoTao;
  MaKyNang?: string;
  TenKyNang?: string;
  DiemSo?: number;
  NhanXet?: string;
}

export interface LoaiTaiLieu {
  MaLoaiTL: string;
  TenLoai: string;
  MoTa?: string;
}

export interface TaiLieu {
  MaTL: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  TenTL: string;
  MaLoaiTL: string;
  TenLoaiTL?: string;
  DuongDan: string;
  KichThuoc?: string;
  NgayTaiLen: string;
}

export interface Quyen {
  MaQuyen: string;
  TenQuyen: string;
  MoTa?: string;
  Module?: string;
}

export interface Role {
  MaRole: string;
  TenRole: string;
  MoTa?: string;
  Quyens?: Quyen[];
}

export type TrangThaiTaiKhoan = 'HOAT_DONG' | 'KHOA' | 'CHO_KICH_HOAT';

export interface TaiKhoan {
  MaTK: string;
  TenDangNhap: string;
  MatKhau?: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  Email?: string;
  TrangThaiTK: TrangThaiTaiKhoan;
  MaRole: string;
  TenRole?: string;
  NgayTao: string;
  LanDangNhapCuoi?: string;
}

export interface NhatKyHoatDong {
  MaNhatKy: string;
  MaTK: string;
  TenDangNhap: string;
  TenNhanVien?: string;
  ThoiGian: string;
  HanhDong: string;
  LoaiHanhDong: 'DANG_NHAP' | 'THEM' | 'SUA' | 'XOA' | 'DUYET' | 'XUAT_BAO_CAO';
  DiaChiIP?: string;
  ChiTiet?: string;
}

// ==================== CÔNG VIỆC & TIẾN ĐỘ THỰC HIỆN ====================
export type MucDoUuTien = 'THAP' | 'TRUNG_BINH' | 'CAO' | 'KHAN_CAP';
export type TrangThaiCongViec = 'CHUA_BAT_DAU' | 'DANG_THUC_HIEN' | 'HOAN_THANH' | 'TRE_HAN';

export interface CongViec {
  MaCV: string;
  TenCV: string;
  HanChot: string; // YYYY-MM-DD
  NguoiGiao: string; // MaNhanVien
  TenNguoiGiao?: string;
  NgayGiao: string; // YYYY-MM-DD
  MoTaCV: string;
  MucDoUuTien: MucDoUuTien;
  MaNhanVien: string; // Người được phân công thực hiện
  TenNhanVien?: string;
  TrangThai: TrangThaiCongViec;
  MucDoHoanThanh: number; // 0 - 100%
  TepDinhKem?: string;
}

export interface TienDoThucHien {
  MaTienDo: string;
  MaCV: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  NgayGio: string; // ISO / YYYY-MM-DD HH:mm
  MucDoHoanThanh: number; // 0 - 100%
  GhiChu: string;
  TrangThai: string;
  TepMinhChung?: string;
}

// ==================== LƯƠNG, CHẤM CÔNG THÁNG & BIẾN ĐỘNG ====================
export interface KyLuong {
  MaKyLuong: string;
  TenKyLuong: string;
  NgayBD: string;
  NgayKT: string;
  SoNgayChuan: number;
  NgayChot: string;
  TrangThai: 'DANG_MO' | 'DA_CHOT' | 'DA_THANH_TOAN';
}

export interface TongHopCongTheoThang {
  MaTHC: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  MaKyLuong: string;
  SoNgayDiLam: number;
  SoNgayNghiCoLuong: number;
  SoNgayNghiKhongLuong: number;
  SoGioOT: number;
  SoLanDiMuon: number;
}

export interface BangLuongChiTiet {
  MaLuongCT: string;
  MaNhanVien: string;
  TenNhanVien?: string;
  TenPhongBan?: string;
  TenChucDanh?: string;
  MaKyLuong: string;
  TenKyLuong?: string;
  LuongTheoNgay: number;
  LuongOT: number;
  TienThuong: number;
  ChiPhiBH: number;
  ThueTNCN: number;
  TamUng: number;
  TongLuongCanTra: number;
  DaThanhToan: boolean;
  TrangThaiKhieuNai?: 'KHONG' | 'DANG_KHIEU_NAI' | 'DA_GIAI_QUYET';
}

export type LoaiBienDong = 'CONG' | 'TRU';

export interface ChiTietKhoanBienDong {
  MaKhoanBD: string;
  MaLuongCT: string;
  LoaiBD: LoaiBienDong;
  TenBD: string;
  SoTien: number;
  NgayPhatSinh?: string;
  LyDo?: string;
  SoQuyetDinh?: string;
}

// ==================== KHIẾU NẠI LƯƠNG ====================
export type TrangThaiKhieuNai = 'CHO_XU_LY' | 'DANG_KIEM_TRA' | 'CHAP_NHAN' | 'TU_CHOI';

export interface KhieuNaiLuong {
  MaKN: string;
  MaLuongCT: string;
  NguoiGuiKN: string; // MaNhanVien
  TenNguoiGui?: string;
  NgayGui: string;
  LyDoKhieuNai: string;
  KhoanMucKhieuNai: string;
  SoTienDeXuat?: number;
  MinhChung?: string;
  TrangThaiKN: TrangThaiKhieuNai;
  NguoiDuyetKN?: string;
  TenNguoiDuyet?: string;
  NgayDuyet?: string;
  PhanHoiKN?: string;
}

