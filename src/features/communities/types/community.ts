export type CommunityType = "town" | "rural" | "city";

export interface CommunityLocation {
  uid: string;
  name: string;
}

export interface Community {
  uid: string;
  slug: string;
  name: string;
  type: CommunityType;
  status: "approved" | "pending";
  city?: CommunityLocation | null;
  province?: CommunityLocation | null;
}

export interface CommunityPage {
  data: Community[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SubmitCommunityPayload {
  name: string;
  provinceUid: string;
  cityUid: string;
  description?: string;
  type?: CommunityType;
}

export interface CommunitySubmission {
  uid: string;
  slug: string;
  name: string;
  status: "pending";
  type: CommunityType;
}
