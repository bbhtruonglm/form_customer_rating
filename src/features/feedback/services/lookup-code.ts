const LOOKUP_CODE_ENDPOINT = 'https://redis-counter-nine.vercel.app/api/generate-code';
const LOOKUP_CODE_PREFIX = 'TG';
const LOOKUP_CODE_REQUEST_TIMEOUT_MS = 6000;

function generateLocalLookupCode() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${LOOKUP_CODE_PREFIX}${year}${month}${day}${time}${random}`;
}

function extractLookupCode(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const value = payload.trim();
    return value.length > 0 ? value : null;
  }

  if (typeof payload === 'number') {
    return String(payload);
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const nestedValue = extractLookupCode(item);

      if (nestedValue) {
        return nestedValue;
      }
    }

    return null;
  }

  for (const value of Object.values(payload as Record<string, unknown>)) {
    const nestedValue = extractLookupCode(value);

    if (nestedValue) {
      return nestedValue;
    }
  }

  return null;
}

export async function generateLookupCode() {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), LOOKUP_CODE_REQUEST_TIMEOUT_MS);

    const response = await fetch(LOOKUP_CODE_ENDPOINT, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      method: 'GET',
      signal: controller.signal,
    });

    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API tạo mã trả về lỗi ${response.status}.`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    const lookupCode = extractLookupCode(payload);

    if (!lookupCode) {
      throw new Error('Không đọc được Mã tra cứu từ API.');
    }

    return lookupCode;
  } catch {
    return generateLocalLookupCode();
  }
}
