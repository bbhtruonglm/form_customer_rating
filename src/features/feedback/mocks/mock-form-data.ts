import type { FeedbackFormData } from '@/features/feedback/types';

/** ID cố định dùng cho nhóm kho trong mock 1 */
const MOCK_WAREHOUSE_GROUP_ID = 'mock-warehouse-group-1';

/** ID cố định dùng cho nhóm lắp đặt trong mock 1 */
const MOCK_INSTALLATION_GROUP_ID = 'mock-installation-group-1';

/** 
 * Chứa tập dữ liệu mock cơ bản cho một sự kiện ngắn ngày (2 ngày).
 * Tại sao: Giúp lập trình viên nhanh chóng mô phỏng quá trình submit form thông thường
 * mà không cần phải nhập thủ công nhiều trường dữ liệu phức tạp.
 */
export const MOCK_FORM_DATA: FeedbackFormData = {
  // Thông tin khách hàng
  customerName: 'Nguyễn Văn Test',
  phoneNumber: '0901234567',
  position: 'Giám đốc',
  email: 'test@example.com',
  organization: 'Công ty TNHH Test',

  // Thông tin sự kiện
  eventName: 'Sự kiện Test - Mock Data',
  eventStartDate: '2026-03-20',
  eventStartTime: '08:00',
  eventEndDate: '2026-03-21',
  eventEndTime: '22:00',
  location: 'Hà Nội',

  lookupCode: '',

  // Thiết bị
  equipment: ['Âm thanh', 'Ánh sáng', 'Sân khấu', 'Backdrop'],
  otherEquipment: '',

  // Đánh giá
  serviceQuality: 'Tốt',
  staffAttitude: 'Tốt',

  // Nhân sự phụ trách
  salesInCharge: 'Đinh Thị Sợi',
  techInCharge: 'Phùng Thái Quân',

  // Chuẩn bị kho
  warehousePrep: {
    level1: [
      {
        id: MOCK_WAREHOUSE_GROUP_ID,
        date: '2026-03-19',
        startDate: '',
        endDate: '',
        staffIds: ['Nguyễn Chí Linh', 'Nguyễn Văn Công'],
      },
    ],
    level2: [
      {
        id: MOCK_WAREHOUSE_GROUP_ID,
        date: '2026-03-19',
        startDate: '',
        endDate: '',
        staffIds: ['Trần Văn Lực'],
      },
    ],
  },

  // Lắp đặt
  installation: {
    level1: [
      {
        id: MOCK_INSTALLATION_GROUP_ID,
        date: '2026-03-20',
        startDate: '',
        endDate: '',
        staffIds: ['Nguyễn Ngọc Tuấn', 'Nguyễn Quang Hiếu'],
      },
    ],
    level2: [
      {
        id: MOCK_INSTALLATION_GROUP_ID,
        date: '2026-03-20',
        startDate: '',
        endDate: '',
        staffIds: [],
      },
    ],
    level3: [
      {
        id: MOCK_INSTALLATION_GROUP_ID,
        date: '2026-03-20',
        startDate: '',
        endDate: '',
        staffIds: [],
      },
    ],
  },

  // Trông đồ đêm
  overnightGuard: [
    {
      id: 'mock-overnight-guard',
      date: '2026-03-20',
      startDate: '',
      endDate: '',
      staffIds: ['Lăng Văn Biên'],
    },
  ],

  // Trực chương trình
  programDuty: [
    {
      id: 'mock-program-duty',
      date: '2026-03-21',
      startDate: '',
      endDate: '',
      staffIds: ['Trần Văn Hùng'],
    },
  ],

  // Mục phụ
  truckSupport: [{ id: 'mock-truck-support', date: '', startDate: '', endDate: '', staffIds: [] }],
  motorbikeTravel30To50: [{ id: 'mock-motorbike-3-5', date: '', startDate: '', endDate: '', staffIds: [] }],
  motorbikeTravelOver50: [{ id: 'mock-motorbike-over-5', date: '', startDate: '', endDate: '', staffIds: [] }],
  parking: [{ id: 'mock-parking', date: '', startDate: '', endDate: '', staffIds: [] }],
  otherInfo: 'Đây là dữ liệu test tự động.',
};

// =================================== Mock 2 ===================================

const M2_WH_1 = 'mock2-wh-group-1';
const M2_WH_2 = 'mock2-wh-group-2';
const M2_WH_3 = 'mock2-wh-group-3';
const M2_INST_1 = 'mock2-inst-group-1';
const M2_INST_2 = 'mock2-inst-group-2';

/** 
 * Chứa tập dữ liệu mock nâng cao cho sự kiện lớn (nhiều ngày, nhiều nhóm nhân sự).
 * Tại sao: Giúp lập trình viên kiểm thử khả năng hiển thị, phân phối nhân sự cho 
 * nhiều ngày khác nhau và các trường hợp nhiều nhóm (Groups) trong kho/lắp đặt.
 */
export const MOCK_FORM_DATA_2: FeedbackFormData = {
  customerName: 'Trần Thị Phức Tạp',
  phoneNumber: '0987654321',
  position: 'Trưởng phòng Sự kiện',
  email: 'phuc.tap@bigcorp.vn',
  organization: 'Tập đoàn BigCorp Việt Nam',
  eventName: 'Hội nghị Thường niên BigCorp 2026',
  eventStartDate: '2026-04-10',
  eventStartTime: '07:00',
  eventEndDate: '2026-04-13',
  eventEndTime: '21:30',
  location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
  lookupCode: '',
  equipment: ['Âm thanh', 'Ánh sáng', 'Màn hình led', 'Máy chiếu', 'Sân khấu', 'Backdrop', 'Banner', 'Standee', 'Bàn', 'Ghế', 'Thảm'],
  otherEquipment: 'Hệ thống dịch thuật đồng thời 3 cabin',
  serviceQuality: 'Xuất sắc',
  staffAttitude: 'Xuất sắc',
  salesInCharge: 'Bùi Thị Thu Hương',
  techInCharge: 'Nguyễn Chí Linh',

  warehousePrep: {
    level1: [
      { id: M2_WH_1, date: '2026-04-08', startDate: '', endDate: '', staffIds: ['Nguyễn Văn Công', 'Trần Văn Lực'] },
      { id: M2_WH_2, date: '2026-04-09', startDate: '', endDate: '', staffIds: ['Nguyễn Ngọc Tuấn', 'Lý Văn Hòa'] },
      { id: M2_WH_3, date: '2026-04-09', startDate: '', endDate: '', staffIds: ['Nguyễn Quốc Lưu', 'Nguyễn Đình Bính'] },
    ],
    level2: [
      { id: M2_WH_1, date: '2026-04-08', startDate: '', endDate: '', staffIds: ['Nguyễn Văn Công'] },
      { id: M2_WH_2, date: '2026-04-09', startDate: '', endDate: '', staffIds: ['Trần Văn Lực', 'Lý Văn Hòa'] },
      { id: M2_WH_3, date: '2026-04-09', startDate: '', endDate: '', staffIds: [] },
    ],
  },

  installation: {
    level1: [
      { id: M2_INST_1, date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Phùng Thái Quân', 'Nguyễn Chí Linh'] },
      { id: M2_INST_2, date: '2026-04-11', startDate: '', endDate: '', staffIds: ['Trần Văn Lực', 'Nguyễn Quang Hiếu'] },
    ],
    level2: [
      { id: M2_INST_1, date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Lăng Văn Biên', 'Vũ Hồng Việt'] },
      { id: M2_INST_2, date: '2026-04-11', startDate: '', endDate: '', staffIds: ['Nguyễn Ngọc Tuấn'] },
    ],
    level3: [
      { id: M2_INST_1, date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Trần Văn Hùng'] },
      { id: M2_INST_2, date: '2026-04-11', startDate: '', endDate: '', staffIds: [] },
    ],
  },

  overnightGuard: [
    { id: 'm2-night-1', date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Lăng Văn Biên', 'Nguyễn Quốc Lưu'] },
    { id: 'm2-night-2', date: '2026-04-11', startDate: '', endDate: '', staffIds: ['Vũ Hồng Việt', 'Nguyễn Đình Bính'] },
  ],

  programDuty: [
    { id: 'm2-duty-1', date: '2026-04-11', startDate: '', endDate: '', staffIds: ['Nguyễn Quang Hiếu', 'Lý Văn Hòa'] },
    { id: 'm2-duty-2', date: '2026-04-12', startDate: '', endDate: '', staffIds: ['Trần Văn Hùng', 'Nguyễn Văn Tuấn'] },
    { id: 'm2-duty-3', date: '2026-04-13', startDate: '', endDate: '', staffIds: ['Nguyễn Ngọc Tuấn'] },
  ],

  truckSupport: [
    { id: 'm2-tr-1', date: '2026-04-09', startDate: '', endDate: '', staffIds: ['Nguyễn Văn Công'] },
    { id: 'm2-tr-2', date: '2026-04-14', startDate: '', endDate: '', staffIds: ['Trần Văn Lực'] },
  ],

  motorbikeTravel30To50: [{ id: 'm2-30-1', date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Nguyễn Quốc Lưu', 'Nguyễn Đình Bính'] }],
  motorbikeTravelOver50: [{ id: 'm2-50-1', date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Lý Văn Hòa'] }],
  parking: [
    { id: 'm2-pk-1', date: '2026-04-10', startDate: '', endDate: '', staffIds: ['Vũ Hồng Việt'] },
    { id: 'm2-pk-2', date: '2026-04-11', startDate: '', endDate: '', staffIds: ['Nguyễn Văn Tuấn'] },
  ],

  otherInfo: 'Mock 2 — Test case phức tạp: nhiều nhóm kho/3 ngày, nhiều nhóm lắp đặt/2 ngày, trực 3 ngày, trông đồ 2 ca.',
};
