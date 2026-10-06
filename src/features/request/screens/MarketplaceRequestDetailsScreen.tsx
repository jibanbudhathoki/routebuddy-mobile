import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { RequestDetailsOverview } from "../components/RequestDetailsOverview";
import { RequestDetailsSummary } from "../components/RequestDetailsSummary";
import { MarketplaceRequestItems } from "../components/MarketplaceRequestItems";
import { useRequestDetails } from "../hooks/useRequestDetails";

export function MarketplaceRequestDetailsScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const requestUid = typeof uid === "string" ? uid : "";
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
              color={theme.colors.primary}
            />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
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
              onPress={() =>
                showToast("Requester messaging is not available yet.")
              }
              style={styles.messageButton}
            >
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={19}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.messageButtonText}>Message Requester</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
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
  headerTitle: {
    color: theme.colors.primary,
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
  messageButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
}));
