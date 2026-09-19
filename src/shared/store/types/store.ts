export interface City {
  uid: string;
  name: string;
}

export interface Province {
  uid: string;
  name: string;
}

export interface Store {
  uid: string;
  slug: string;
  name: string;
  type: string;
  image: string | null;
  isActive: boolean;
  city?: City;
  province?: Province;
}

export interface StoreResponse {
  success: boolean;
  message: string;
  data: {
    data: Store[];
    // Include pagination meta if backend returns it
  };
}

export interface GetStoresParams {
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
  type?: string;
  provinceUid?: string;
  cityUid?: string;
  search?: string;
  page?: number;
  limit?: number;
}
