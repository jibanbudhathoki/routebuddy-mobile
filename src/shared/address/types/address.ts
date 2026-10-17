export interface AddressLocation {
  city: { uid: string; name: string };
  province: { uid: string; name: string };
  country: { uid: string; name: string };
}

export interface Address {
  uid: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string | null;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  countryUid: string;
  city?: AddressLocation['city'] | null;
  province?: AddressLocation['province'] | null;
  country?: AddressLocation['country'] | null;
  phone?: string | null;
  notes?: string | null;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  label: string;
  recipientName: string;
  line1: string;
  line2?: string | null;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  countryUid: string;
  phone?: string | null;
  notes?: string | null;
  isDefault?: boolean;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface AddressMutationResponse {
  uid: string;
  label?: string;
  recipientName?: string;
  line1?: string;
  line2?: string | null;
  cityUid?: string;
  provinceUid?: string;
  postalCode?: string;
  countryUid?: string;
  phone?: string | null;
  notes?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
