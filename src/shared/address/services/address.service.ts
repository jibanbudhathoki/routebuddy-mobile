import { apiRequest } from "../../api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import { Address, CreateAddressDto, UpdateAddressDto } from "../types/address";

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    return apiRequest<Address[]>(apiEndpoints.profile.addresses, {
      method: "GET",
    });
  },

  createAddress: async (dto: CreateAddressDto): Promise<Address> => {
    return apiRequest<Address>(apiEndpoints.profile.addresses, {
      method: "POST",
      body: dto,
    });
  },

  updateAddress: async (uid: string, dto: UpdateAddressDto): Promise<Address> => {
    return apiRequest<Address>(
      `${apiEndpoints.profile.addresses}/${uid}`,
      {
        method: "PATCH",
        body: dto,
      }
    );
  },

  deleteAddress: async (uid: string): Promise<void> => {
    await apiRequest<void>(`${apiEndpoints.profile.addresses}/${uid}`, {
      method: "DELETE",
    });
  },
};
