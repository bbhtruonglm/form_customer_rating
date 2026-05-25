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
    techTicketCreator: '',
    techInCharge: {
      level1: '',
      level2: '',
    },
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

function hasValue(value: string) {
  return value.trim().length > 0;
}

function buildEventDateTime(date: string, time: string) {
  if (!date) return null;

  return new Date(`${date}T${time || '00:00'}`);
}

export function validateCustomerForm(formData: FeedbackFormData) {
  const errors: string[] = [];

  if (!hasValue(formData.customerName)) errors.push('Vui lòng nhập tên khách hàng (I.1)');
  if (!hasValue(formData.phoneNumber)) errors.push('Vui lòng nhập số điện thoại (I.2)');
  if (!hasValue(formData.email)) errors.push('Vui lòng nhập email (I.4)');
  if (!hasValue(formData.eventName)) errors.push('Vui lòng nhập tên sự kiện (II.1)');
  if (!hasValue(formData.eventStartDate)) {
    errors.push('Vui lòng chọn ngày bắt đầu chương trình (II.2)');
  }
  if (!hasValue(formData.eventStartTime)) {
    errors.push('Vui lòng chọn giờ bắt đầu chương trình (II.2)');
  }
  if (!hasValue(formData.eventEndDate)) {
    errors.push('Vui lòng chọn ngày kết thúc chương trình (II.3)');
  }
  if (!hasValue(formData.eventEndTime)) {
    errors.push('Vui lòng chọn giờ kết thúc chương trình (II.3)');
  }
  if (!hasValue(formData.location)) {
    errors.push('Vui lòng nhập địa điểm (II.4)');
  }
  if (
    formData.eventStartDate &&
    formData.eventEndDate &&
    buildEventDateTime(formData.eventStartDate, formData.eventStartTime) >
      buildEventDateTime(formData.eventEndDate, formData.eventEndTime)
  ) {
    errors.push('Thời gian kết thúc chương trình phải sau hoặc bằng thời gian bắt đầu chương trình');
  }
  if (!hasValue(formData.serviceQuality)) {
    errors.push('Vui lòng đánh giá chất lượng thiết bị - dịch vụ (III.1)');
  }
  if (!hasValue(formData.staffAttitude)) {
    errors.push('Vui lòng đánh giá thái độ phục vụ của kỹ thuật viên (III.2)');
  }

  return errors;
}
