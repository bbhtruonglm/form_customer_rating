import type { FeedbackFormData, StaffEntry } from '@/features/feedback/types';

function createEntryId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
}

export function createStaffEntry(id = createEntryId()): StaffEntry {
  return {
    id,
    date: '',
    startDate: '',
    endDate: '',
    staffIds: [],
  };
}

export function createInitialFormData(): FeedbackFormData {
  return {
    customerName: '',
    phoneNumber: '',
    position: '',
    email: '',
    organization: '',
    eventName: '',
    eventStartDate: '',
    eventStartTime: '',
    eventEndDate: '',
    eventEndTime: '',
    lookupCode: '',
    location: '',
    equipment: [],
    otherEquipment: '',
    serviceQuality: '',
    staffAttitude: '',
    salesInCharge: '',
    techInCharge: '',
    warehousePrep: {
      level1: [createStaffEntry('warehouse-prep-group-1')],
      level2: [createStaffEntry('warehouse-prep-group-1')],
    },
    installation: {
      level1: [createStaffEntry('installation-group-1')],
      level2: [createStaffEntry('installation-group-1')],
      level3: [createStaffEntry('installation-group-1')],
    },
    overnightGuard: [createStaffEntry('overnight-guard')],
    programDuty: [createStaffEntry('program-duty')],
    truckSupport: [createStaffEntry('truck-support')],
    motorbikeTravel30To50: [createStaffEntry('motorbike-travel-30-to-50')],
    motorbikeTravelOver50: [createStaffEntry('motorbike-travel-over-50')],
    parking: [createStaffEntry('parking')],
    otherInfo: '',
  };
}

export function toggleSelection(items: string[], value: string) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function validateCustomerForm(formData: FeedbackFormData) {
  const errors: string[] = [];

  if (!formData.customerName) errors.push('Vui lòng nhập tên khách hàng');
  if (!formData.phoneNumber) errors.push('Vui lòng nhập số điện thoại');
  if (!formData.email) errors.push('Vui lòng nhập email');
  if (!formData.eventName) errors.push('Vui lòng nhập tên sự kiện');
  if (!formData.eventStartDate) errors.push('Vui lòng chọn từ ngày tổ chức');
  if (!formData.eventStartTime) errors.push('Vui lòng chọn giờ bắt đầu');
  if (!formData.eventEndDate) errors.push('Vui lòng chọn đến ngày tổ chức');
  if (!formData.eventEndTime) errors.push('Vui lòng chọn giờ kết thúc');
  if (
    formData.eventStartDate &&
    formData.eventEndDate &&
    formData.eventStartDate > formData.eventEndDate
  ) {
    errors.push('Đến ngày phải lớn hơn hoặc bằng từ ngày');
  }
  if (!formData.serviceQuality) errors.push('Vui lòng đánh giá chất lượng dịch vụ');
  if (!formData.staffAttitude) errors.push('Vui lòng đánh giá thái độ nhân viên');

  return errors;
}
