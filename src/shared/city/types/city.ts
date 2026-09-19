export interface Province {
  uid: string;
  name: string;
}

export interface City {
  uid: string;
  slug: string;
  name: string;
  province?: Province;
}

export interface CityResponse {
  success: boolean;
  message: string;
  data: {
    data: City[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetCitiesParams {
  provinceUid?: string;
  search?: string;
  page?: number;
  limit?: number;
}
