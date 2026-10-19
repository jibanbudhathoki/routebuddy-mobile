import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ChatDetailScreen } from "../../features/messages/screens/ChatDetailScreen";
import { RateDriverPrompt } from "../../features/ratings/components/RateDriverPrompt";
import { useRateDriver } from "../../features/ratings/hooks/useRateDriver";
import { useToast } from "../../shared/components/ToastProvider";
import {
  useConversationMessages,
  useListMessages,
  useMarkConversationRead,
} from "../../features/messages/hooks/useMessages";
import {
  useRespondToRequestOffer,
  useRespondToTripOrder,
} from "../../features/request/hooks/useRequestOffers";
import { useRequestDetails } from "../../features/request/hooks/useRequestDetails";
import { useConfirmDelivery } from "../../features/request/hooks/useDeliveryProof";
import { useTripDetails } from "../../features/trip/hooks/useTripDetails";

export default function ChatScreen() {
  const { id, requestUid: routeRequestUid } = useLocalSearchParams<{
    id?: string;
    requestUid?: string;
  }>();
  const conversationId = typeof id === "string" ? id : "";
  const queryClient = useQueryClient();
  const [isRatingPromptVisible, setIsRatingPromptVisible] = useState(false);
  const rateDriver = useRateDriver();
  const { showToast } = useToast();
  const confirmDelivery = useConfirmDelivery();
  const markConversationRead = useMarkConversationRead();
  const { data: conversations = [] } = useListMessages();
  const { data: messages = [] } = useConversationMessages(conversationId);
  useFocusEffect(
    useCallback(() => {
      if (!conversationId) return;
      markConversationRead.mutate(conversationId, {
        onError: (failure) => {
          showToast(
            failure instanceof Error
              ? failure.message
              : "Unable to mark conversation as read.",
          );
        },
      });
    }, [conversationId, markConversationRead.mutate, showToast]),
  );
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
  const respondToOffer = useRespondToRequestOffer(requestUid);
  const respondToTripOrder = useRespondToTripOrder();
  const tripOrderMessage = messages.find((message) => message.tripOrderUid);
  const tripOrderUid =
    tripOrderMessage?.tripOrderUid ??
    (request?.kind === "order" ? request.uid : "");
  const tripOrderDriverUid =
    tripOrderMessage?.tripOrderDriverUid ??
    request?.driver?.uid ??
    trip?.driver.uid ??
    "";
  const ratingRequestUid = request?.uid ?? requestUid;
  const driverName =
    request?.driver?.name ?? conversation?.recipientName ?? "your driver";
  const tripOrder =
    tripOrderUid
      ? {
          uid: tripOrderUid,
          status: request?.status ?? "pending",
          driverUid: tripOrderDriverUid,
        }
      : undefined;

  return (
    <>
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
        respondingOffer={
          respondToOffer.isPending && respondToOffer.variables
            ? {
                uid: respondToOffer.variables.offerUid,
                action: respondToOffer.variables.action,
              }
            : undefined
        }
        respondingOrder={
          respondToTripOrder.isPending && respondToTripOrder.variables
            ? {
                uid: respondToTripOrder.variables.orderUid,
                action: respondToTripOrder.variables.action,
              }
            : undefined
        }
        isConfirmingDelivery={confirmDelivery.isPending}
        onOfferAction={async (offerUid, action) => {
          await respondToOffer.mutateAsync({ offerUid, action });
        }}
        onOrderAction={async (orderUid, action) => {
          await respondToTripOrder.mutateAsync({ orderUid, action });
        }}
        onConfirmDelivery={async (requestId) => {
          await confirmDelivery.mutateAsync(requestId);
          await queryClient.invalidateQueries({
            queryKey: ["trips", "orders"],
          });
        }}
        onDeliveryConfirmed={() => {
          if (ratingRequestUid && request?.rating == null) {
            setIsRatingPromptVisible(true);
          } else {
            showToast("Delivery confirmed.", { variant: "success" });
          }
        }}
      />
      <RateDriverPrompt
        visible={isRatingPromptVisible}
        driverName={driverName}
        isSubmitting={rateDriver.isPending}
        onNotNow={() => setIsRatingPromptVisible(false)}
        onSubmit={(score, comment) =>
          rateDriver.mutate(
            { requestUid: ratingRequestUid, score, comment },
            {
              onSuccess: (response) => {
                setIsRatingPromptVisible(false);
                showToast(response.message, { variant: "success" });
              },
              onError: (failure) =>
                showToast(
                  failure instanceof Error
                    ? failure.message
                    : "Unable to submit your driver rating.",
                  { title: "Rating failed", variant: "error" },
                ),
            },
          )
        }
      />
    </>
  );
}
