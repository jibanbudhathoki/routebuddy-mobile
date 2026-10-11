import { useLocalSearchParams } from "expo-router";

import { ChatDetailScreen } from "../../features/messages/screens/ChatDetailScreen";
import {
  useConversationMessages,
  useListMessages,
} from "../../features/messages/hooks/useMessages";
import { useAcceptRequestOffer } from "../../features/request/hooks/useRequestOffers";
import { useRequestDetails } from "../../features/request/hooks/useRequestDetails";

export default function ChatScreen() {
  const { id, requestUid: routeRequestUid } = useLocalSearchParams<{
    id?: string;
    requestUid?: string;
  }>();
  const conversationId = typeof id === "string" ? id : "";
  const { data: conversations = [] } = useListMessages();
  const { data: messages = [] } = useConversationMessages(conversationId);
  const conversation = conversations.find(
    (item) => item.msgId === conversationId,
  );
  const requestUid =
    (typeof routeRequestUid === "string" ? routeRequestUid : "") ||
    conversation?.requestId ||
    messages.find((message) => message.requestOffer)?.requestOffer?.requestUid ||
    "";
  const { data: request } = useRequestDetails(requestUid);
  const acceptOffer = useAcceptRequestOffer(requestUid);

  return (
    <ChatDetailScreen
      requestUid={requestUid}
      requesterUid={request?.requester.uid ?? ""}
      requestOffers={
        request?.offers.map((offer) => ({
          uid: offer.uid,
          driverUid: offer.driver.uid,
          message: offer.message,
          proposedLatestBy: offer.proposedLatestBy,
          status: offer.status,
        })) ?? []
      }
      isAcceptingOffer={acceptOffer.isPending}
      onAcceptOffer={async (offerUid) => {
        await acceptOffer.mutateAsync(offerUid);
      }}
    />
  );
}
