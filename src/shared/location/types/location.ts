export interface Country {
  uid: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface Province {
  uid: string;
  name: string;
  code: string;
  isActive: boolean;
  country: {
    uid: string;
    name: string;
  };
}

export interface LocationOption {
  uid: string;
  name: string;
  subtitle?: string;
}

interface LocationListResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export type CountriesResponse = LocationListResponse<Country>;
export type ProvincesResponse = LocationListResponse<Province>;
