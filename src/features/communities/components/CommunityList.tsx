import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { CommunityCard } from "./CommunityCard";
import type { CommunityTab } from "./CommunityScreenHeader";
import type { Community } from "../types/community";

interface CommunityListProps {
  activeTab: CommunityTab;
  communities: Community[];
  joinedUids: Set<string>;
  total: number;
  isLoading: boolean;
  isRefreshing: boolean;
  loadingMore: boolean;
  joiningUid: string | null;
  error: string | null;
  onRefresh: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onJoin: (community: Community) => void;
  onExplore: () => void;
  onSuggest: () => void;
}

export function CommunityList({
  activeTab,
  communities,
  joinedUids,
  total,
  isLoading,
  isRefreshing,
  loadingMore,
  joiningUid,
  error,
  onRefresh,
  onRetry,
  onLoadMore,
  onJoin,
  onExplore,
  onSuggest,
}: CommunityListProps) {
  const { theme } = useUnistyles();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.listContent,
        communities.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.text}
        />
      }
    >
      {error && communities.length > 0 ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.inlineRetry}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {isLoading && communities.length === 0 ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={theme.colors.text} />
          <Text style={styles.stateText}>Loading communities...</Text>
        </View>
      ) : error && communities.length === 0 ? (
        <View style={styles.state}>
          <MaterialCommunityIcons
            name="cloud-alert-outline"
            size={38}
            color={theme.colors.muted}
          />
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : communities.length ? (
        <>
          {communities.map((community) => {
            const joined = joinedUids.has(community.uid);
            return (
              <CommunityCard
                key={community.uid}
                community={community}
                actionLabel={
                  activeTab === "browse" ? (joined ? "Joined" : "Join") : undefined
                }
                actionDisabled={joined}
                actionLoading={joiningUid === community.uid}
                onAction={() => onJoin(community)}
              />
            );
          })}
          {communities.length < total ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ busy: loadingMore }}
              disabled={loadingMore}
              onPress={onLoadMore}
              style={styles.loadMoreButton}
            >
              {loadingMore ? (
                <ActivityIndicator color={theme.colors.text} />
              ) : (
                <Text style={styles.loadMoreText}>Load more</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </>
      ) : (
        <EmptyState
          activeTab={activeTab}
          onExplore={onExplore}
          onSuggest={onSuggest}
        />
      )}
    </ScrollView>
  );
}

function EmptyState({
  activeTab,
  onExplore,
  onSuggest,
}: Pick<CommunityListProps, "activeTab" | "onExplore" | "onSuggest">) {
  const { theme } = useUnistyles();
  const title =
    activeTab === "browse"
      ? "No communities found"
      : activeTab === "joined"
        ? "No joined communities yet"
        : "No submissions yet";
  const description =
    activeTab === "browse"
      ? "Try another search or suggest a community for your area."
      : activeTab === "joined"
        ? "Explore approved communities and join one to see it here."
        : "Communities you suggest will appear here while they are reviewed.";
  const action =
    activeTab === "joined"
      ? { label: "Explore communities", onPress: onExplore }
      : activeTab === "submissions"
        ? { label: "Suggest community", onPress: onSuggest }
        : null;

  return (
    <View style={styles.state}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons
          name={
            activeTab === "submissions"
              ? "clipboard-text-outline"
              : "account-group-outline"
          }
          size={34}
          color={theme.colors.text}
        />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.stateText}>{description}</Text>
      {action ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={action.onPress}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>{action.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  state: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  inlineError: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  inlineErrorText: {
    color: theme.colors.error,
    flex: 1,
    fontSize: 12,
  },
  inlineRetry: {
    padding: theme.spacing.xs,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  loadMoreButton: {
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  loadMoreText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
}));
