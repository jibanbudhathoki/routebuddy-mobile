import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { useToast } from "../../../shared/components/ToastProvider";
import { MyRequestCard } from "../components/MyRequestCard";
import type { MyRequestListItem } from "../types/request";
import { useListMyRequests } from "../hooks/useListMyRequests";

export function MyRequestsScreen() {
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const {
    data: requests,
    error,
    isLoading,
    refetch,
  } = useListMyRequests();

  const showRequestDetails = (_request: MyRequestListItem) => {
    showToast("Request details are not available yet.");
  };

  return (
    <View>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionTitleGroup}>
          <MaterialCommunityIcons
            name="bag-personal-outline"
            size={20}
            color={theme.colors.text}
          />
          <Text style={styles.sectionTitle}>Requests Coming Up</Text>
        </View>
        <View style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={theme.colors.text}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading your requests...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Could not load requests</Text>
          <Text style={styles.emptyStateText}>
            {error.message || "Please try again."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : requests?.length ? (
        <View style={styles.requestList}>
          {requests.map((request) => (
            <MyRequestCard
              key={request.uid}
              request={request}
              onViewDetails={showRequestDetails}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={30}
            color={theme.colors.muted}
          />
          <Text style={styles.emptyStateTitle}>No upcoming requests</Text>
          <Text style={styles.emptyStateText}>
            Requests you place will show up here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  sectionTitleGroup: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  viewAll: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  viewAllText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "500",
  },
  requestList: {
    gap: theme.spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  emptyStateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  emptyStateText: {
    color: theme.colors.muted,
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: "600",
  },
}));
