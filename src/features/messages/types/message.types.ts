export interface MessageReaction {
  emoji: string;
  userUid?: string;
}

export interface Message {
  uid: string;
  conversationId: string;
  senderUid: string;
  content: string;
  type: "text" | "image" | "voice" | "video";
  replyToUid: string | null;
  reactions: MessageReaction[];
  createdAt: string;
}

export interface CreateConversationData {
  tripId?: string;
  requestId?: string;
  userId?: string;
}

export interface SendMessageData {
  content: string;
  type?: "text" | "image" | "voice" | "video";
  replyToUid?: string;
}

export interface InboxMessage {
  msgId: string;
  recipientName: string;
  latestMsg: string;
  contextType: string;
}
