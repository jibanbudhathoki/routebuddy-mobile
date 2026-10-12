import type { Message } from "./message.types";

export interface ChatMediaFile {
  uri: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface ChatMediaUploadResponse {
  success?: boolean;
  message?: string;
  mediaKey: string;
  mediaUrl?: string | null;
  mediaType?: string;
}

export type ChatMediaMessageType = Extract<Message["type"], "image" | "voice">;
