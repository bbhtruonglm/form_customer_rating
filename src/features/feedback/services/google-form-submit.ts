import type { FeedbackFormData, StaffEntry } from '@/features/feedback/types';

// The new Form Action URL
const GOOGLE_FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSetYIT4X_zbcjo-EDWP1KVEnJ4ncGM8MyyeBfBnbTyt5CC7Cg/formResponse';

const GOOGLE_FORM_STATIC_FIELDS = {
  fbzx: '-686816580566250189',
  fvv: '1',
  pageHistory: '0',
} as const;

function formatDate(value: string) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return !year || !month || !day ? value : `${day}/${month}/${year}`;
}

function buildDateTime(dateStr: string, timeStr: string) {
  const date = formatDate(dateStr);
  return [date, timeStr].filter(Boolean).join(' ');
}

function formatStaff(entries: StaffEntry[]) {
  return entries
    .map((e) => {
      const parts = [];
      if (e.date || e.startDate || e.endDate) {
        if (e.date) parts.push(`[${formatDate(e.date)}]`);
        else if (e.startDate && e.endDate) parts.push(`[${formatDate(e.startDate)} - ${formatDate(e.endDate)}]`);
      }
      if (e.staffIds.length > 0) parts.push(e.staffIds.join(', '));
      return parts.join(' ');
    })
    .filter(Boolean)
    .join('\n');
}

/** Lấy chung 1 ngày làm đại diện cho nhóm (trong trường hợp chọn ngày chung) */
function extractSharedDate(entries: StaffEntry[]) {
  const entryWithDate = entries.find((e) => e.date);
  if (entryWithDate) return formatDate(entryWithDate.date);

  const entryWithRange = entries.find((e) => e.startDate || e.endDate);
  if (entryWithRange) {
    if (entryWithRange.startDate && entryWithRange.endDate) {
       return `${formatDate(entryWithRange.startDate)} - ${formatDate(entryWithRange.endDate)}`;
    }
    return formatDate(entryWithRange.startDate || entryWithRange.endDate);
  }
  return '';
}

function buildGoogleFormPayload(formData: FeedbackFormData) {
  const payload = new URLSearchParams();

  payload.set('fvv', GOOGLE_FORM_STATIC_FIELDS.fvv);
  payload.set('pageHistory', GOOGLE_FORM_STATIC_FIELDS.pageHistory);
  payload.set('fbzx', GOOGLE_FORM_STATIC_FIELDS.fbzx);

  // === CUSTOMER INFO ===
  payload.set('entry.968271309', formData.lookupCode);
  payload.set('entry.1336195825', formData.customerName);
  payload.set('entry.2060852831', formData.phoneNumber);
  payload.set('entry.1736758168', formData.position);
  payload.set('entry.1147761026', formData.email);
  payload.set('entry.252395767', formData.organization);

  // === EVENT INFO ===
  payload.set('entry.1586549846', formData.eventName);
  payload.set('entry.1799889103', buildDateTime(formData.eventStartDate, formData.eventStartTime));
  payload.set('entry.106698113', buildDateTime(formData.eventEndDate, formData.eventEndTime));
  payload.set('entry.667410828', formData.location);

  // Equipment array
  payload.set('entry.253845127', formData.equipment.join(', '));
  
  payload.set('entry.1366320485', formData.otherEquipment);
  payload.set('entry.145038817', formData.serviceQuality);
  payload.set('entry.505510104', formData.staffAttitude);

  // === STAFF INFO ===
  payload.set('entry.1900880307', formData.salesInCharge);
  payload.set('entry.1777249788', formData.techInCharge);

  // Warehouse Prep
  payload.set('entry.217305236', extractSharedDate(formData.warehousePrep.level1));
  payload.set('entry.404425797', formatStaff(formData.warehousePrep.level1));
  payload.set('entry.492044026', formatStaff(formData.warehousePrep.level2));

  // Installation
  payload.set('entry.955548771', extractSharedDate(formData.installation.level1));
  payload.set('entry.2077669955', formatStaff(formData.installation.level1));
  payload.set('entry.1706442310', formatStaff(formData.installation.level2));
  payload.set('entry.1691509760', formatStaff(formData.installation.level3));

  // Overnight Guard
  payload.set('entry.1465216118', extractSharedDate(formData.overnightGuard));
  payload.set('entry.294382390', formatStaff(formData.overnightGuard));

  // Program Duty
  payload.set('entry.827728974', extractSharedDate(formData.programDuty));
  payload.set('entry.665789547', formatStaff(formData.programDuty));

  // Truck Support
  payload.set('entry.991533957', extractSharedDate(formData.truckSupport));
  payload.set('entry.1515894882', formatStaff(formData.truckSupport));

  // Motorbike 30-50km
  payload.set('entry.1076483016', extractSharedDate(formData.motorbikeTravel30To50));
  payload.set('entry.1598623157', formatStaff(formData.motorbikeTravel30To50));

  // Motorbike >50km
  payload.set('entry.1408787746', extractSharedDate(formData.motorbikeTravelOver50));
  payload.set('entry.854122927', formatStaff(formData.motorbikeTravelOver50));

  // Parking
  payload.set('entry.1411143016', extractSharedDate(formData.parking));
  payload.set('entry.633200803', formatStaff(formData.parking));

  // Other Info
  payload.set('entry.671987802', formData.otherInfo);

  return payload;
}

export async function submitFeedbackToGoogleForm(formData: FeedbackFormData) {
  const payload = buildGoogleFormPayload(formData);

  await fetch(GOOGLE_FORM_RESPONSE_URL, {
    body: payload,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    mode: 'no-cors',
  });
}
