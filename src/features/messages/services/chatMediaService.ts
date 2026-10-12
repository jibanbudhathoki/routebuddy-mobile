import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  ChatMediaFile,
  ChatMediaUploadResponse,
} from "../types/chatMedia.types";
import { chatMediaUploadResponseSchema } from "../validations/chatMedia";

export const chatMediaService = {
  upload: async (file: ChatMediaFile): Promise<ChatMediaUploadResponse> => {
    const formData = new FormData();
    formData.append(
      "file",
      {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      } as unknown as Blob,
    );

    const response = await apiRequest<unknown>(
      `${apiEndpoints.messages.uploadMedia}?folder=chat`,
      {
        method: "POST",
        body: formData,
        timeoutMs: 120_000,
      },
    );

    const responseRecord =
      typeof response === "object" && response !== null
        ? (response as Record<string, unknown>)
        : null;
    const dataRecord =
      responseRecord?.data !== null && typeof responseRecord?.data === "object"
        ? (responseRecord.data as Record<string, unknown>)
        : null;
    const failedResponse = dataRecord?.success === false
      ? dataRecord
      : responseRecord?.success === false
        ? responseRecord
        : null;
    if (failedResponse) {
      throw new Error(
        typeof failedResponse.message === "string"
          ? failedResponse.message
          : "Unable to upload this attachment.",
      );
    }
    const parsedResponse = chatMediaUploadResponseSchema.safeParse(response);
    if (!parsedResponse.success) {
      throw new Error(
        "The upload response did not include a valid mediaKey or photoKey.",
      );
    }
    return parsedResponse.data;
  },
};
