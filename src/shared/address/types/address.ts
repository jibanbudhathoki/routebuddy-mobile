export interface Address {
  uid: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  city: { uid: string; name: string };
  province: { uid: string; name: string };
  postalCode: string;
  country: { uid: string; name: string };
  phone?: string;
  notes?: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface CreateAddressDto {
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  countryUid: string;
  phone?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
