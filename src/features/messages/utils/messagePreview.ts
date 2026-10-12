import type { Message } from "../types/message.types";
import { parseRequestOfferMessage } from "./requestOfferMessage";

export function formatMessagePreview(
  content: string,
  type: Message["type"] | undefined,
  isOwnMessage: boolean,
) {
  const preview =
    type === "image"
      ? "Image"
      : type === "voice"
        ? "Audio"
        : type === "video"
          ? "Video"
          : parseRequestOfferMessage(content).visibleMessage;

  if (!preview) return "";
  return isOwnMessage ? `You: ${preview}` : preview;
}
