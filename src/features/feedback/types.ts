export interface StaffEntry {
  id: string;
  date: string;
  startDate: string;
  endDate: string;
  staffIds: string[];
}

export interface WarehousePrepAssignments {
  level1: StaffEntry[];
  level2: StaffEntry[];
}

export interface InstallationAssignments {
  level1: StaffEntry[];
  level2: StaffEntry[];
  level3: StaffEntry[];
}

export interface NestedStaffSections {
  warehousePrep: WarehousePrepAssignments;
  installation: InstallationAssignments;
}

export interface FeedbackFormData {
  customerName: string;
  phoneNumber: string;
  position: string;
  email: string;
  organization: string;
  eventName: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  lookupCode: string;
  location: string;
  equipment: string[];
  otherEquipment: string;
  serviceQuality: string;
  staffAttitude: string;
  salesInCharge: string;
  techInCharge: string;
  warehousePrep: WarehousePrepAssignments;
  installation: InstallationAssignments;
  overnightGuard: StaffEntry[];
  programDuty: StaffEntry[];
  truckSupport: StaffEntry[];
  motorbikeTravel30To50: StaffEntry[];
  motorbikeTravelOver50: StaffEntry[];
  parking: StaffEntry[];
  otherInfo: string;
}

export type FeedbackStep = 'customer' | 'staff' | 'success';

export type FeedbackTextField =
  | 'customerName'
  | 'phoneNumber'
  | 'position'
  | 'email'
  | 'organization'
  | 'eventName'
  | 'eventStartDate'
  | 'eventStartTime'
  | 'eventEndDate'
  | 'eventEndTime'
  | 'lookupCode'
  | 'location'
  | 'otherEquipment'
  | 'serviceQuality'
  | 'staffAttitude'
  | 'salesInCharge'
  | 'techInCharge'
  | 'otherInfo';

export type NestedStaffSectionKey = keyof NestedStaffSections;
export interface NestedStaffSubSectionMap {
  warehousePrep: keyof WarehousePrepAssignments;
  installation: keyof InstallationAssignments;
}
export type SimpleStaffSectionKey =
  | 'overnightGuard'
  | 'programDuty'
  | 'truckSupport'
  | 'motorbikeTravel30To50'
  | 'motorbikeTravelOver50'
  | 'parking';
