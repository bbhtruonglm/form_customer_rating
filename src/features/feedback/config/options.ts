import type { LucideIcon } from 'lucide-react';
import { Briefcase, Package } from 'lucide-react';

import type {
  InstallationAssignments,
  SimpleStaffSectionKey,
  WarehousePrepAssignments,
} from '@/features/feedback/types';

export const SALES_STAFF = [
  'Đinh Thị Sợi',
  'Bùi Thị Thu Hương',
  'Nguyễn Thị Thanh Hoài',
  'Lê Đức Long',
];

export const TECH_STAFF = [
  'Lăng Văn Biên',
  'Nguyễn Văn Công',
  'Nguyễn Quang Hiếu',
  'Lý Văn Hòa',
  'Dương Văn Hùng',
  'Trần Bá Hùng',
  'Nguyễn Chí Linh',
  'Trần Văn Lực',
  'Nguyễn Quốc Lưu',
  'Phùng Thái Quân',
  'Nguyễn Ngọc Tuấn',
  'Nguyễn Văn Tuấn',
  ''
];

export const EQUIPMENT_ITEMS = [
  'Âm thanh',
  'Ánh sáng',
  'Màn hình led',
  'Máy chiếu',
  'Tivi',
  'Thiết bị dịch',
  'Máy tính',
  'Bộ đàm',
  'Màn sao',
  'Dây led',
  'Sân khấu',
  'Giàn khung',
  'Backdrop',
  'Banner',
  'Standee',
  'Bàn',
  'Ghế',
  'Gian hàng',
  'Nhà giàn',
  'Nhà dù',
  'Cổng hơi',
  'Thảm',
  'Tiệc',
];

export type NestedStaffSectionConfig =
  | {
      section: 'warehousePrep';
      subSection: keyof WarehousePrepAssignments;
      label: string;
      icon: LucideIcon;
    }
  | {
      section: 'installation';
      subSection: keyof InstallationAssignments;
      label: string;
      icon: LucideIcon;
    };

export interface SimpleStaffSectionConfig {
  key: SimpleStaffSectionKey;
  label: string;
}

export const NESTED_STAFF_SECTIONS: NestedStaffSectionConfig[] = [
  {
    section: 'warehousePrep',
    subSection: 'level1',
    label: 'Chuẩn bị tại kho - Mức 1 (Nửa ngày)',
    icon: Package,
  },
  {
    section: 'warehousePrep',
    subSection: 'level2',
    label: 'Chuẩn bị tại kho - Mức 2 (Cả ngày)',
    icon: Package,
  },
  {
    section: 'installation',
    subSection: 'level1',
    label: 'Lắp đặt - Mức 1 (06h - 23h)',
    icon: Briefcase,
  },
  {
    section: 'installation',
    subSection: 'level2',
    label: 'Lắp đặt - Mức 2 (23h hôm nay - 5h hôm sau)',
    icon: Briefcase,
  },
  {
    section: 'installation',
    subSection: 'level3',
    label: 'Lắp đặt - Mức 3 (8h sáng hôm nay - 5h sáng hôm sau)',
    icon: Briefcase,
  },
];

export const SIMPLE_STAFF_SECTIONS: SimpleStaffSectionConfig[] = [
  { key: 'overnightGuard', label: 'Trông đồ đêm' },
  { key: 'programDuty', label: 'Trực chương trình' },
  { key: 'truckSupport', label: 'Hỗ trợ lái xe tải' },
  { key: 'motorbikeTravel30To50', label: 'Xe máy di chuyển 30 - 50km' },
  { key: 'motorbikeTravelOver50', label: 'Xe máy di chuyển trên 50km' },
  { key: 'parking', label: 'Gửi xe' },
];
