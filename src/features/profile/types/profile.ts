export interface UserProfile {
  uid: string;
  slug: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoUrl: string | null;
  photoKey: string | null;
  provider?: string;
  phone: string | null;
  city?: string | null;
  homeTown: string | null;
  rating: number | null;
  defaultAddressUid?: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string | null;
  notificationPrefs?: ProfileNotificationPreferences | null;
  communityName?: string | null;
  defaultAddress?: ProfileAddress | null;
  location?: ProfileLocation | null;
}

export interface ProfileSummary {
  displayName: string;
  photoUrl: string | null;
  rating: number;
}

export interface ProfileNotificationPreferences {
  pushNewTripRequests: boolean;
  pushNewMessages: boolean;
  pushTripUpdates: boolean;
  pushPaymentsEscrow: boolean;
  pushCommunityAnnouncements: boolean;
  emailNotifications: boolean;
  notificationSound: boolean;
}

export interface ProfileAddress {
  uid: string;
  userUid: string;
  label: string;
  recipientName: string;
  line1: string;
  line2: string | null;
  cityUid: string;
  provinceUid: string;
  countryUid: string;
  postalCode: string;
  phone: string | null;
  notes: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileLocation {
  city: { uid: string; name: string } | null;
  province: { uid: string; name: string } | null;
  country: { uid: string; name: string } | null;
}

export interface UpdateUserProfilePayload {
  displayName?: string;
  photoUrl?: string | null;
  photoKey?: string | null;
  phone?: string | null;
  city?: string | null;
  homeTown?: string | null;
  rating?: number | null;
  defaultAddressUid?: string;
}

export interface ProfilePhotoFile {
  uri: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface ProfilePhotoUploadResponse {
  message: string;
  mediaKey: string;
  mediaUrl: string;
  photoKey: string;
  photoUrl: string;
  mediaType: "image";
}
