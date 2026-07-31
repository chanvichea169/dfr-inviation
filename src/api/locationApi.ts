import type {
  Province,
  District,
  Commune,
  Village,
} from "../interfaces/location";

interface ApiResponse<T> {
  items: T[];
}


const PROVINCE_URL =
  "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603700604c000123e144/json?page=1&page_size=25";

const DISTRICT_URL =
  "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603800604c000123e145/json";

const COMMUNE_URL =
  "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603900604c000123e146/json";

const VILLAGE_URL =
  "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603a00604c000123e147/json";


// For province only
async function fetchProvince(): Promise<Province[]> {
  const response = await fetch(PROVINCE_URL);

  if (!response.ok) {
    throw new Error("Failed to load provinces");
  }

  const data: ApiResponse<Province> =
    await response.json();

  return data.items;
}


async function fetchAllPages<T>(url: string): Promise<T[]> {
  const pageSize = 200;
  let page = 1;
  const allItems: T[] = [];

  while (true) {
    try {
      const response = await fetch(
        `${url}?page=${page}&page_size=${pageSize}`
      );

      // No more pages
      if (!response.ok) {
        if (response.status === 404) {
          break;
        }

        throw new Error(`HTTP ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();

      if (!data.items || data.items.length === 0) {
        break;
      }

      allItems.push(...data.items);

      console.log(
        `Page ${page}: ${data.items.length}`
      );

      page++;
    } catch (err) {
      console.log(`Stop at page ${page}`);
      break;
    }
  }

  console.log("Total:", allItems.length);

  return allItems;
}


export const getProvinces = () =>
  fetchProvince();


export const getDistricts = () =>
  fetchAllPages<District>(
    DISTRICT_URL
  );


export const getCommunes = () =>
  fetchAllPages<Commune>(
    COMMUNE_URL
  );


export const getVillages = () =>
  fetchAllPages<Village>(
    VILLAGE_URL
  );