import type { Message } from "../types/message.types";
import { resolveAvatarUrl } from "./resolveAvatarUrl";

export async function getConversationParticipantAvatar(
  currentUserUid: string,
  getMessages: () => Promise<Message[]>,
): Promise<string | null> {
  const messages = await getMessages();
  const participant = [...messages]
    .reverse()
    .find(
      (message) =>
        message.sender?.uid &&
        message.sender.uid !== currentUserUid &&
        message.sender.photoUrl,
    )?.sender;
  return resolveAvatarUrl(participant?.photoUrl);
}
