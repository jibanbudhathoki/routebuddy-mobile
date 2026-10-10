export interface MessageReaction {
  emoji?: string;
  userUid?: string;
  [userUid: string]: string | undefined;
}

export interface Message {
  id: string;
  conversationUid?: string;
  senderId: string | null;
  text: string;
  createdAt: string;
  type: "system" | "text" | "image" | "voice" | "video";
  mediaUrl: string | null;
  replyToUid: string | null;
  reactions: MessageReaction[] | Record<string, string> | null;
  readBy?: string[];
  deletedAt?: string | null;
  updatedAt?: string;
  sender: {
    uid: string;
    displayName: string;
    photoUrl: string | null;
  } | null;
}

export interface MessageListResponse {
  success?: boolean;
  message?: string;
  data: MessageResponse[];
}

export interface MessageResponse {
  id?: string;
  uid?: string;
  conversationId?: string;
  conversationUid?: string;
  senderId?: string | null;
  senderUid?: string | null;
  text?: string;
  content?: string;
  createdAt: string;
  type: Message["type"];
  mediaUrl?: string | null;
  replyToUid?: string | null;
  reactions?: Message["reactions"];
  readBy?: string[];
  deletedAt?: string | null;
  updatedAt?: string;
  sender?: Message["sender"];
  metadata?: unknown;
}

export interface ConversationMessagesResponse {
  success?: boolean;
  message?: string;
  data: MessageListResponse["data"];
}

export interface SendMessageApiResponse {
  success: boolean;
  message: string;
  data: MessageListResponse["data"][number];
}

export interface MessageActionResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    deletedCount?: number;
  };
}

export interface ReactToMessageResponse {
  success: boolean;
  message: string;
  data: MessageListResponse["data"][number];
}

export interface CreateConversationData {
  tripId?: string;
  requestId?: string;
  userId?: string;
}

export interface CreateConversationResponse {
  id: string;
  participants:
    | string[]
    | Array<{
        uid: string;
        displayName: string;
        photoUrl: string | null;
      }>;
}

export interface CreateConversationApiResponse {
  success: boolean;
  message: string;
  data: CreateConversationResponse;
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
  avatarUrl?: string | null;
  timestamp?: string;
  unreadCount?: number;
}

export interface InboxMessageResponse {
  msgId?: string;
  uid?: string;
  recipientName?: string;
  latestMsg?: string;
  contextType?: string;
  avatarUrl?: string | null;
  timestamp?: string;
  unreadCount?: number;
  tripId?: string | null;
  requestId?: string | null;
  lastMessage?: {
    content?: string;
    senderUid?: string;
    createdAt?: string;
  } | null;
  createdAt?: string;
}
