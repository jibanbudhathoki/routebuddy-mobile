import { useLocalSearchParams } from "expo-router";

import { ChatDetailScreen } from "../../features/messages/screens/ChatDetailScreen";
import {
  useConversationMessages,
  useListMessages,
} from "../../features/messages/hooks/useMessages";
import {
  useAcceptRequestOffer,
  useAcceptTripOrder,
} from "../../features/request/hooks/useRequestOffers";
import { useRequestDetails } from "../../features/request/hooks/useRequestDetails";
import { useTripDetails } from "../../features/trip/hooks/useTripDetails";

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
  const { data: trip } = useTripDetails(conversation?.tripId ?? "");
  const requestUid =
    (typeof routeRequestUid === "string" ? routeRequestUid : "") ||
    conversation?.requestId ||
    messages.find((message) => message.requestOffer)?.requestOffer?.requestUid ||
    messages.find((message) => message.tripOrderUid)?.tripOrderUid ||
    "";
  const { data: request } = useRequestDetails(requestUid, {
    refetchInterval: requestUid ? 10_000 : false,
  });
  const acceptOffer = useAcceptRequestOffer(requestUid);
  const acceptTripOrder = useAcceptTripOrder();
  const tripOrderMessage = messages.find((message) => message.tripOrderUid);
  const tripOrderUid =
    tripOrderMessage?.tripOrderUid ??
    (request?.kind === "order" ? request.uid : "");
  const tripOrderDriverUid =
    tripOrderMessage?.tripOrderDriverUid ??
    request?.driver?.uid ??
    trip?.driver.uid ??
    "";
  const tripOrder =
    tripOrderUid
      ? {
          uid: tripOrderUid,
          status: request?.status ?? "pending",
          driverUid: tripOrderDriverUid,
        }
      : undefined;

  return (
    <ChatDetailScreen
      requestUid={requestUid}
      request={request}
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
      tripOrder={tripOrder}
      orderDriverUid={tripOrderDriverUid}
      isAcceptingOffer={acceptOffer.isPending}
      isAcceptingOrder={acceptTripOrder.isPending}
      onAcceptOffer={async (offerUid) => {
        await acceptOffer.mutateAsync(offerUid);
      }}
      onAcceptOrder={async (orderUid) => {
        await acceptTripOrder.mutateAsync(orderUid);
      }}
    />
  );
}
