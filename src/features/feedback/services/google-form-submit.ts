import type { FeedbackFormData } from '@/features/feedback/types';

const GOOGLE_FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdyYh4hbffA7AqJ75VW69mqZrErzi_Tz7H2BqP-Tf2qdzSREQ/formResponse';

const GOOGLE_FORM_STATIC_FIELDS = {
  fbzx: '8389412980617376386',
  fvv: '1',
  pageHistory: '0',
  partialResponse: '[null,null,"8389412980617376386"]',
} as const;

function formatDate(value: string) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function buildTimeValue(formData: FeedbackFormData) {
  if (formData.eventStartDate && formData.eventEndDate) {
    return `${formatDate(formData.eventStartDate)} - ${formatDate(formData.eventEndDate)}`;
  }

  return formatDate(formData.eventStartDate || formData.eventEndDate);
}

function buildGoogleFormPayload(formData: FeedbackFormData) {
  const payload = new URLSearchParams();

  payload.set('fvv', GOOGLE_FORM_STATIC_FIELDS.fvv);
  payload.set('partialResponse', GOOGLE_FORM_STATIC_FIELDS.partialResponse);
  payload.set('pageHistory', GOOGLE_FORM_STATIC_FIELDS.pageHistory);
  payload.set('fbzx', GOOGLE_FORM_STATIC_FIELDS.fbzx);

  payload.set('entry.902103418', buildTimeValue(formData));
  payload.set('entry.1551578083', formData.lookupCode);
  payload.set('entry.403647896', formData.customerName);
  payload.set('entry.205417557', formData.phoneNumber);

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
