import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useQueryClient } from "@tanstack/react-query";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import {
  messageKeys,
  useCreateConversation,
} from "../../messages/hooks/useMessages";
import { messageService } from "../../messages/services/messageService";
import { createRequestOfferMessage } from "../../messages/utils/requestOfferMessage";
import { useSubmitRequestOffer } from "../hooks/useRequestOffers";
import { RequestContactOptionsModal } from "../components/RequestContactOptionsModal";
import { RequestDetailsOverview } from "../components/RequestDetailsOverview";
import { RequestDetailsSummary } from "../components/RequestDetailsSummary";
import { MarketplaceRequestItems } from "../components/MarketplaceRequestItems";
import { SendRequestOfferModal } from "../components/SendRequestOfferModal";
import { useRequestDetails } from "../hooks/useRequestDetails";
import { createSharedDetailLink } from "../../../shared/utils/sharedDetailLink";

export function MarketplaceRequestDetailsScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [contactOptionsVisible, setContactOptionsVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const createConversation = useCreateConversation();
  const requestUid = typeof uid === "string" ? uid : "";
  const submitOffer = useSubmitRequestOffer(requestUid);
  const { data: request, error, isLoading, refetch } = useRequestDetails(requestUid);
  const firstStoreName = request?.stores?.[0]?.name;
  const title = firstStoreName
    ? `${firstStoreName} Items`
    : "Request Items";

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share request"
              accessibilityState={{ disabled: !request }}
              disabled={!request}
              onPress={() => void shareRequest()}
              style={styles.headerAction}
            >
              <MaterialCommunityIcons
                name="share-variant-outline"
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close request details"
              onPress={() => router.back()}
              style={styles.headerAction}
            >
              <MaterialCommunityIcons
                name="close"
                size={21}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Loading request items...</Text>
            </View>
          ) : error || !request ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>
                Could not load request details
              </Text>
              <Text style={styles.stateText}>
                {error?.message ??
                  (requestUid
                    ? "Request details are unavailable."
                    : "Request ID is missing.")}
              </Text>
              {requestUid ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => refetch()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View style={styles.sections}>
              <RequestDetailsOverview request={request} />
              <MarketplaceRequestItems request={request} />
              <RequestDetailsSummary request={request} />
            </View>
          )}
        </ScrollView>

        {request && !isLoading && !error ? (
          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setContactOptionsVisible(true)}
              style={styles.messageButton}
            >
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={19}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.messageButtonText}>
                Message Requester
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
      <RequestContactOptionsModal
        visible={contactOptionsVisible}
        onClose={() => setContactOptionsVisible(false)}
        onMessage={() => {
          setContactOptionsVisible(false);
          void handleMessageRequester();
        }}
        onSendOffer={() => {
          setContactOptionsVisible(false);
          setOfferModalVisible(true);
        }}
      />
      <SendRequestOfferModal
        visible={offerModalVisible}
        latestDeliveryBy={request?.latestDeliveryBy ?? ""}
        isSubmitting={submitOffer.isPending}
        onClose={() => setOfferModalVisible(false)}
        onValidationError={(message) => {
          setOfferModalVisible(false);
          showToast(message);
        }}
        onSubmit={async (payload) => {
          if (!request?.requester.uid) {
            showToast("Requester details are unavailable, so the offer cannot be sent.");
            return;
          }

          const offer = await submitOffer.mutateAsync(payload);
          setOfferModalVisible(false);

          try {
            const conversation = await createConversation.mutateAsync({
              requestId: request.uid,
              userId: request.requester.uid,
            });
            const proposedDate = new Date(
              offer.data.proposedLatestBy ?? payload.proposedLatestBy,
            );
            const proposedDateText = Number.isNaN(proposedDate.getTime())
              ? payload.proposedLatestBy
              : proposedDate.toLocaleString();
            const storeNames =
              request.stores?.map((store) => store.name).filter(Boolean).join(", ") ||
              "your requested items";
            const itemList = request.items
              ?.map((item) =>
                item.description
                  ? `• ${item.item} (${item.description})`
                  : `• ${item.item}`,
              )
              .join("\n");
            const offerMessage = [
              `Delivery offer for ${storeNames}`,
              `Proposed delivery by: ${proposedDateText}`,
              itemList ? `Requested items:\n${itemList}` : "",
              payload.message?.trim()
                ? `Driver's message: ${payload.message.trim()}`
                : "",
              "Open the request details to review and accept this offer.",
            ]
              .filter(Boolean)
              .join("\n\n");

            await messageService.sendMessage(conversation.id, {
              content: createRequestOfferMessage(
                { requestUid: request.uid, offerUid: offer.data.uid },
                offerMessage,
              ),
              type: "text",
            });
            await queryClient.invalidateQueries({
              queryKey: messageKeys.conversations(),
            });
            await refetch();
            showToast("Your offer and message were sent to the requester.");
          } catch (failure) {
            showToast(
              failure instanceof Error
                ? `Your offer was submitted, but its message could not be sent: ${failure.message}`
                : "Your offer was submitted, but its message could not be sent.",
            );
          }
        }}
      />
    </AppScreen>
  );

  async function handleMessageRequester() {
    if (createConversation.isPending) {
      return;
    }
    if (!request?.requester.uid) {
      showToast("Requester details are unavailable for this request.");
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({
        requestId: request.uid,
        userId: request.requester.uid,
      });
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: conversation.id,
          requestUid: request.uid,
          recipientName:
            request.requester.name ?? request.requester.fName ?? "Requester",
        },
      });
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to start a conversation with the requester.",
      );
    }
  }

  async function shareRequest() {
    if (!request) return;
    try {
      const link = createSharedDetailLink("request", request.uid);
      await Share.share({
        message: `Request: ${request.origin} to ${request.destination}.\n${link}`,
        url: link,
      });
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to share this request.",
      );
    }
  }
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
  },
  headerAction: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 34,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 68,
  },
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  sections: {
    gap: theme.spacing.sm,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: "600",
  },
  footer: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  messageButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.sm,
    height: 42,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  messageButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
}));
