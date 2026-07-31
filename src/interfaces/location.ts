export interface Province {
  province_code: string;
  province_kh: string;
  province_en: string;
}

export interface District {
  district_code: string;
  district_kh: string;
  district_en: string;
  province_code: string;
}

export interface Commune {
  commune_code: string;
  commune_kh: string;
  commune_en: string;
  district_code: string;
}

export interface Village {
  village_code: string;
  village_kh: string;
  village_en: string;
  commune_code: string;
}

export interface Props {
  provinces: Province[];
  districts: District[];
  communes: Commune[];
  villages: Village[];
}