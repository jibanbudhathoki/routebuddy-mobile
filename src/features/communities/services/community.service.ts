import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../../shared/api/apiClient";
import {
  communityPageResponseSchema,
  communitySubmissionEnvelopeSchema,
  communitySubmissionSchema,
  communityTypesEnvelopeSchema,
  communityTypesSchema,
  joinCommunityResponseSchema,
  submitCommunityPayloadSchema,
} from "../validations/community";
import type {
  CommunityPage,
  CommunitySubmission,
  CommunityType,
  SubmitCommunityPayload,
} from "../types/community";

export const communityService = {
  async listApproved(params: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<CommunityPage> {
    const query = new URLSearchParams();
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    const suffix = query.size ? `?${query.toString()}` : "";
    const response = await apiRequest<unknown>(
      `${apiEndpoints.communities.listAllCommunities}${suffix}`,
      { method: "GET" },
    );
    return parseCommunityPage(response);
  },

  async listJoined(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<CommunityPage> {
    const response = await apiRequest<unknown>(
      withPagination(apiEndpoints.communities.listJoinedCommunities, params),
      { method: "GET" },
    );
    return parseCommunityPage(response);
  },

  async listMySubmissions(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<CommunityPage> {
    const response = await apiRequest<unknown>(
      withPagination(
        apiEndpoints.communities.listMySubmittedCommunities,
        params,
      ),
      { method: "GET" },
    );
    return parseCommunityPage(response);
  },

  async getTypes(): Promise<CommunityType[]> {
    const response = await apiRequest<unknown>(
      apiEndpoints.communities.getCommunityTypes,
      { method: "GET" },
    );
    const directResponse = communityTypesSchema.safeParse(response);
    if (directResponse.success) return directResponse.data;

    const envelopeResponse = communityTypesEnvelopeSchema.parse(response);
    if (!envelopeResponse.success) {
      throw new Error(envelopeResponse.message || "Unable to load community types.");
    }
    return communityTypesSchema.parse(envelopeResponse.data);
  },

  async submit(
    payload: SubmitCommunityPayload,
  ): Promise<CommunitySubmission> {
    const body = submitCommunityPayloadSchema.parse(payload);
    const response = await apiRequest<unknown>(
      apiEndpoints.communities.submitNewCommunity,
      { method: "POST", body },
    );
    const directResponse = communitySubmissionSchema.safeParse(response);
    if (directResponse.success) return directResponse.data;

    const envelopeResponse =
      communitySubmissionEnvelopeSchema.safeParse(response);
    if (!envelopeResponse.success) {
      throw new Error("The community submission response was invalid.");
    }
    if (!envelopeResponse.data.success) {
      throw new Error(
        envelopeResponse.data.message || "Unable to submit the community.",
      );
    }
    return communitySubmissionSchema.parse(envelopeResponse.data.data);
  },

  async join(uid: string): Promise<string> {
    const response = await apiRequest<unknown>(
      apiEndpoints.communities.joinCommunity.replace(":uid", encodeURIComponent(uid)),
      { method: "POST" },
    );
    return joinCommunityResponseSchema.parse(response).message;
  },
};

function withPagination(
  path: string,
  params: { page?: number; limit?: number },
) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  return query.size ? `${path}?${query.toString()}` : path;
}

function parseCommunityPage(response: unknown): CommunityPage {
  const parsed = communityPageResponseSchema.parse(response);
  if (!parsed.success) {
    throw new Error(parsed.message || "Unable to load communities.");
  }
  return {
    data: parsed.data,
    meta: {
      page: parsed.page,
      limit: parsed.limit,
      total: parsed.total,
    },
  };
}
