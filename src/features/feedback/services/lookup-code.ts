const LOOKUP_CODE_ENDPOINT = 'https://redis-counter-nine.vercel.app/api/generate-code';

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
  const response = await fetch(LOOKUP_CODE_ENDPOINT, {
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'GET',
  });

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
}
