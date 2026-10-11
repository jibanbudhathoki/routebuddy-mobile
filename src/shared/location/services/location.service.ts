import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../api/apiClient";
import type {
  CountriesResponse,
  Country,
  Province,
  ProvincesResponse,
} from "../types/location";

export const locationService = {
  async getCountries(): Promise<Country[]> {
    const response = await apiRequest<CountriesResponse>(
      `${apiEndpoints.countries}?page=1&limit=100`,
      { method: "GET" },
    );
    if (!Array.isArray(response?.data)) {
      throw new Error("The countries response did not include a valid list.");
    }
    return response.data;
  },

  async getProvinces(countryUid: string): Promise<Province[]> {
    const params = new URLSearchParams({
      countryUid,
      page: "1",
      limit: "100",
    });
    const response = await apiRequest<ProvincesResponse>(
      `${apiEndpoints.provinces}?${params.toString()}`,
      { method: "GET" },
    );
    if (!Array.isArray(response?.data)) {
      throw new Error("The provinces response did not include a valid list.");
    }
    return response.data;
  },
};
