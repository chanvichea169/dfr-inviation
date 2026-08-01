import type {
  Province,
  District,
  Commune,
  Village,
} from "../interfaces/location";

interface ApiResponse<T> {
  items: T[];
  total_pages?: number;
}

const BASE = "https://data.mef.gov.kh/api/v1/public-datasets";

const PROVINCE_URL = `${BASE}/pd_66a8603700604c000123e144/json`;
const DISTRICT_URL = `${BASE}/pd_66a8603800604c000123e145/json`;
const COMMUNE_URL = `${BASE}/pd_66a8603900604c000123e146/json`;
const VILLAGE_URL = `${BASE}/pd_66a8603a00604c000123e147/json`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The MEF API is behind Cloudflare + rate limiting. A burst of requests gets
 * 429s (or a Cloudflare challenge). Retry with exponential backoff, honouring
 * the Retry-After header when present.
 */
async function fetchWithRetry(
  url: string,
  retries = 5,
  backoff = 1000
): Promise<Response> {
  let lastError: unknown;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : backoff * Math.pow(2, i);
        console.warn(`[locations] 429 on ${url}, retrying in ${delay}ms (${i + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      if (response.status >= 500 && response.status < 600) {
        const delay = backoff * Math.pow(2, i);
        console.warn(`[locations] ${response.status} on ${url}, retrying in ${delay}ms (${i + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      // Cloudflare challenge: 200 OK but an HTML "Just a moment..." page
      // instead of JSON. Treat as retryable.
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && !contentType.includes("application/json")) {
        const delay = backoff * Math.pow(2, i);
        console.warn(`[locations] non-JSON response on ${url}, retrying in ${delay}ms (${i + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      return response;
    } catch (err) {
      lastError = err;
      const delay = backoff * Math.pow(2, i);
      console.warn(`[locations] network error on ${url}, retrying in ${delay}ms (${i + 1}/${retries})`);
      await sleep(delay);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function fetchAllPages<T>(url: string, name: string): Promise<T[]> {
  const pageSize = 200;
  let page = 1;
  const allItems: T[] = [];

  while (true) {
    const pageUrl = `${url}?page=${page}&page_size=${pageSize}`;
    const response = await fetchWithRetry(pageUrl);

    if (!response.ok) {
      if (response.status === 404) break;
      throw new Error(`[${name}] HTTP ${response.status} at page ${page}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.items || data.items.length === 0) break;

    allItems.push(...data.items);

    // Last page reached.
    if (data.items.length < pageSize) break;
    if (data.total_pages && page >= data.total_pages) break;

    page++;
    // Be gentle with the rate limiter between pages.
    await sleep(150);
  }

  console.log(`[${name}] total: ${allItems.length}`);
  return allItems;
}

export const getProvinces = () => fetchAllPages<Province>(PROVINCE_URL, "provinces");
export const getDistricts = () => fetchAllPages<District>(DISTRICT_URL, "districts");
export const getCommunes = () => fetchAllPages<Commune>(COMMUNE_URL, "communes");
export const getVillages = () => fetchAllPages<Village>(VILLAGE_URL, "villages");
