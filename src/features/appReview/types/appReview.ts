export type AppReviewPlatform = "ios" | "android" | "web";

export interface SubmitAppReviewPayload {
  rating: number;
  comment?: string;
  platform?: AppReviewPlatform;
  appVersion?: string;
}

export interface AppReview {
  uid: string;
  rating: number;
  comment?: string | null;
  platform?: AppReviewPlatform | null;
  appVersion?: string | null;
  createdAt: string;
}
