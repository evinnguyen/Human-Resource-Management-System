import {
  TrangThaiLamViec,
  TrangThaiHopDong,
  TrangThaiDonNP,
  TrangThaiChamCong,
  KetQuaDaoTao,
  TrangThaiTaiKhoan,
  TrangThaiCongViec,
  MucDoUuTien,
  TrangThaiKhieuNai,
  LoaiBienDong,
} from '@/types/hrms';

export const formatTrangThaiLamViec = (status: TrangThaiLamViec | string): string => {
  switch (status) {
    case 'DANG_LAM_VIEC':
      return 'Đang làm việc';
    case 'THU_VIEC':
      return 'Thử việc';
    case 'NGHI_PHEP':
      return 'Nghỉ phép';
    case 'DA_NGHI_VIEC':
      return 'Đã nghỉ việc';
    default:
      return status;
  }
};

export const formatTrangThaiHopDong = (status: TrangThaiHopDong | string): string => {
  switch (status) {
    case 'CON_HIEU_LUC':
      return 'Còn hiệu lực';
    case 'HET_HAN':
      return 'Hết hạn';
    case 'CHO_DUYET':
      return 'Chờ duyệt';
    case 'DA_CHAM_DUT':
      return 'Đã chấm dứt';
    default:
      return status;
  }
};

export const formatTrangThaiDonNP = (status: TrangThaiDonNP | string): string => {
  switch (status) {
    case 'CHO_DUYET':
      return 'Chờ duyệt';
    case 'DA_DUYET':
      return 'Đã duyệt';
    case 'TU_CHOI':
      return 'Bị từ chối';
    default:
      return status;
  }
};

export const formatTrangThaiChamCong = (status: TrangThaiChamCong | string): string => {
  switch (status) {
    case 'DUNG_GIO':
      return 'Đúng giờ';
    case 'DI_MUON':
      return 'Đi muộn';
    case 'VE_SOM':
      return 'Về sớm';
    case 'NGHI_PHEP':
      return 'Nghỉ phép';
    case 'VANG_MAT':
      return 'Vắng mặt';
    default:
      return status;
  }
};

export const formatKetQuaDaoTao = (status: KetQuaDaoTao | string): string => {
  switch (status) {
    case 'CHUA_DANH_GIA':
      return 'Chưa đánh giá';
    case 'DAT':
      return 'Đạt';
    case 'XUAT_SAC':
      return 'Xuất sắc';
    case 'CHUA_DAT':
      return 'Chưa đạt';
    default:
      return status;
  }
};

export const formatTrangThaiTaiKhoan = (status: TrangThaiTaiKhoan | string): string => {
  switch (status) {
    case 'HOAT_DONG':
      return 'Đang hoạt động';
    case 'KHOA':
      return 'Đã bị khóa';
    case 'CHO_KICH_HOAT':
      return 'Chờ kích hoạt';
    default:
      return status;
  }
};

export const formatTrangThaiCongViec = (status: TrangThaiCongViec | string): string => {
  switch (status) {
    case 'CHUA_BAT_DAU':
      return 'Chưa bắt đầu';
    case 'DANG_THUC_HIEN':
      return 'Đang thực hiện';
    case 'HOAN_THANH':
      return 'Đã hoàn thành';
    case 'TRE_HAN':
      return 'Trễ hạn';
    default:
      return status;
  }
};

export const formatMucDoUuTien = (priority: MucDoUuTien | string): string => {
  switch (priority) {
    case 'KHAN_CAP':
      return 'Khẩn cấp';
    case 'CAO':
      return 'Cao';
    case 'TRUNG_BINH':
      return 'Trung bình';
    case 'THAP':
      return 'Thấp';
    default:
      return priority;
  }
};

export const formatTrangThaiKhieuNai = (status: TrangThaiKhieuNai | string): string => {
  switch (status) {
    case 'CHO_XU_LY':
      return 'Chờ xử lý';
    case 'DANG_KIEM_TRA':
      return 'Đang kiểm tra';
    case 'CHAP_NHAN':
      return 'Chấp nhận';
    case 'TU_CHOI':
      return 'Từ chối';
    case 'KHONG':
      return 'Không khiếu nại';
    case 'DANG_KHIEU_NAI':
      return 'Đang khiếu nại';
    case 'DA_GIAI_QUYET':
      return 'Đã giải quyết';
    default:
      return status;
  }
};

export const formatLoaiBienDong = (loai: LoaiBienDong | string): string => {
  switch (loai) {
    case 'CONG':
      return '+ Cộng thu nhập';
    case 'TRU':
      return '- Khấu trừ lương';
    default:
      return loai;
  }
};
