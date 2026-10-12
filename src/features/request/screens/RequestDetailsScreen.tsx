import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { Button } from "../../../shared/components/Button";
import { ConfirmationDialog } from "../../../shared/components/ConfirmationDialog";
import { useToast } from "../../../shared/components/ToastProvider";
import { styles } from "../components/requestDetailsScreen.styles";
import { RequestDetailsOverview } from "../components/RequestDetailsOverview";
import { RequestOptionsSheet } from "../components/RequestOptionsSheet";
import { RequestDetailsSummary } from "../components/RequestDetailsSummary";
import { RequestOffersList } from "../components/RequestOffersList";
import { RequestShoppingList } from "../components/RequestShoppingList";
import { RequestStatusTimeline } from "../components/RequestStatusTimeline";
import { useAcceptRequestOffer } from "../hooks/useRequestOffers";
import {
  useCancelRequest,
  useDeleteRequest,
} from "../hooks/useRequestActions";
import { useRequestDetails } from "../hooks/useRequestDetails";

type RequestConfirmation = "cancel" | "delete" | null;

export function RequestDetailsScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const [showOptions, setShowOptions] = useState(false);
  const [confirmation, setConfirmation] = useState<RequestConfirmation>(null);
  const requestUid = typeof uid === "string" ? uid : "";
  const { data: request, error, isLoading, refetch } = useRequestDetails(requestUid);
  const acceptOffer = useAcceptRequestOffer(requestUid);
  const cancelRequest = useCancelRequest(requestUid);
  const deleteRequest = useDeleteRequest(requestUid);

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
          <Text style={styles.headerTitle}>Request Details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Request options"
            accessibilityState={{ disabled: !request }}
            disabled={!request}
            onPress={() => setShowOptions(true)}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={22}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Loading request details...</Text>
            </View>
          ) : error || !request ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Could not load request details</Text>
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
              <RequestOffersList
                offers={request.offers ?? []}
                requestStatus={request.status}
                acceptingOfferUid={
                  acceptOffer.isPending ? acceptOffer.variables : undefined
                }
                onAccept={(offerUid) =>
                  acceptOffer.mutate(offerUid, {
                    onSuccess: () => showToast("Offer accepted."),
                    onError: (failure) =>
                      showToast(
                        failure instanceof Error
                          ? failure.message
                          : "Unable to accept this offer.",
                      ),
                  })
                }
              />
              <RequestStatusTimeline request={request} />
              <RequestShoppingList request={request} />
              <RequestDetailsSummary request={request} />
            </View>
          )}
        </ScrollView>

        {request ? (
          <View style={styles.footer}>
            <Button
              title="Message Driver"
              onPress={() =>
                showToast(
                  request.driver
                    ? "Messaging is not available yet."
                    : "A driver has not been assigned to this request yet.",
                )
              }
            />
          </View>
        ) : null}
      </View>
      <RequestOptionsSheet
        visible={showOptions}
        isCancelling={cancelRequest.isPending}
        isDeleting={deleteRequest.isPending}
        canCancel={
          request
            ? ["pending", "open"].includes(request.status.toLowerCase())
            : false
        }
        onClose={() => setShowOptions(false)}
        onCancelRequest={() => {
          setShowOptions(false);
          setConfirmation("cancel");
        }}
        onDeleteRequest={() => {
          setShowOptions(false);
          setConfirmation("delete");
        }}
      />
      <ConfirmationDialog
        visible={confirmation !== null}
        title={confirmation === "cancel" ? "Cancel this request?" : "Delete this request?"}
        message={
          confirmation === "cancel"
            ? "This request can only be cancelled before a driver accepts it."
            : "This will hide and cancel the request. This action cannot be undone."
        }
        icon={confirmation === "cancel" ? "cancel" : "delete-outline"}
        confirmLabel={
          confirmation === "cancel" ? "Cancel Request" : "Delete Request"
        }
        cancelLabel="Keep Request"
        isLoading={cancelRequest.isPending || deleteRequest.isPending}
        destructive
        onCancel={() => setConfirmation(null)}
        onConfirm={performConfirmation}
      />
    </AppScreen>
  );

  function performConfirmation() {
    if (confirmation === "cancel") {
      cancelRequest.mutate(undefined, {
        onSuccess: (response) => {
          setConfirmation(null);
          showToast(response.message || "Request cancelled.", {
            variant: "success",
          });
        },
        onError: (failure) =>
          showToast(
            failure instanceof Error
              ? failure.message
              : "Unable to cancel this request.",
          ),
      });
    } else if (confirmation === "delete") {
      deleteRequest.mutate(undefined, {
        onSuccess: (response) => {
          setConfirmation(null);
          showToast(response.message || "Request deleted.", {
            variant: "success",
          });
          router.back();
        },
        onError: (failure) =>
          showToast(
            failure instanceof Error
              ? failure.message
              : "Unable to delete this request.",
          ),
      });
    }
  }
}
