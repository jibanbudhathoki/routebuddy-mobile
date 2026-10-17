import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../api/apiClient";
import {
  addressDeleteResponseSchema,
  addressCreateResponseSchema,
  addressListResponseSchema,
  addressMutationResponseSchema,
  createAddressSchema,
  updateAddressSchema,
} from "../validations/address";
import type {
  Address,
  AddressMutationResponse,
  CreateAddressDto,
  UpdateAddressDto,
} from "../types/address";

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiRequest<unknown>(
      apiEndpoints.profile.listAllAddresses,
      { method: "GET" },
    );
    const parsed = addressListResponseSchema.parse(response);
    if (!parsed.success) {
      throw new Error(parsed.message || "Unable to load addresses.");
    }
    return parsed.data;
  },

  createAddress: async (dto: CreateAddressDto): Promise<Address> => {
    const body = createAddressSchema.parse(dto);
    const response = await apiRequest<unknown>(
      apiEndpoints.profile.addAddresses,
      { method: "POST", body },
    );
    return addressCreateResponseSchema.parse(response);
  },

  updateAddress: async (
    uid: string,
    dto: UpdateAddressDto,
  ): Promise<AddressMutationResponse> => {
    const body = updateAddressSchema.parse(dto);
    const response = await apiRequest<unknown>(
      apiEndpoints.profile.updateAddress.replace(":uid", encodeURIComponent(uid)),
      { method: "PATCH", body },
    );
    return addressMutationResponseSchema.parse(response);
  },

  deleteAddress: async (uid: string): Promise<void> => {
    const response = await apiRequest<unknown>(
      apiEndpoints.profile.removeAddress.replace(":uid", encodeURIComponent(uid)),
      { method: "DELETE" },
    );
    addressDeleteResponseSchema.parse(response);
  },
};
