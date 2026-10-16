import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { NotificationItem } from "../components/NotificationItem";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";
import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import type { AppNotification } from "../types/notification";

const notificationFilters = [
  { key: "all", label: "All" },
  { key: "trip", label: "Trips" },
  { key: "request", label: "Requests" },
  { key: "system", label: "System" },
] as const;

type NotificationFilter = (typeof notificationFilters)[number]["key"];

export function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const notificationsQuery = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const filteredNotifications = notifications.filter((notification) =>
    matchesFilter(notification, activeFilter),
  );

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id, {
      onError: (error) =>
        showToast(
          error instanceof Error
            ? error.message
            : "Unable to mark the notification as read.",
          { title: "Unable to update notification", variant: "error" },
        ),
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate(undefined, {
      onError: (error) =>
        showToast(
          error instanceof Error
            ? error.message
            : "Unable to mark notifications as read.",
          { title: "Unable to update notifications", variant: "error" },
        ),
    });
  };

  const handleNotificationPress = (notification: AppNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    const conversationUid = getConversationUid(notification);
    if (conversationUid) {
      router.push({
        pathname: "/chat/[id]",
        params: { id: conversationUid },
      });
    }
  };

  const renderListHeader = () => (
    <View style={styles.listHeader}>
    <View style={styles.filterBar}>
      {notificationFilters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <Pressable
            key={filter.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => setActiveFilter(filter.key)}
            style={[styles.filterTab, isActive && styles.activeFilterTab]}
          >
            <Text
              style={[
                styles.filterText,
                isActive && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
      {notificationsQuery.isError ? (
        <Text style={styles.inlineError}>
          Unable to refresh notifications:{" "}
          {notificationsQuery.error instanceof Error
            ? notificationsQuery.error.message
            : "Please try again."}
        </Text>
      ) : null}
    </View>
  );

  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: markAllAsRead.isPending }}
            disabled={markAllAsRead.isPending || markAsRead.isPending}
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        ) : (
          <View style={styles.headerActionPlaceholder} />
        )}
      </View>
      {notificationsQuery.isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={theme.colors.text} />
          <Text style={styles.stateMessage}>Loading notifications...</Text>
        </View>
      ) : notificationsQuery.isError && notifications.length === 0 ? (
        <View style={styles.state}>
          <MaterialCommunityIcons
            name="cloud-alert-outline"
            size={38}
            color={theme.colors.muted}
          />
          <Text style={styles.stateMessage}>
            {notificationsQuery.error instanceof Error
              ? notificationsQuery.error.message
              : "Unable to load notifications."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void notificationsQuery.refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.emptyListContent,
          ]}
          ItemSeparatorComponent={NotificationSeparator}
          refreshing={notificationsQuery.isRefetching}
          onRefresh={() => void notificationsQuery.refetch()}
          ListHeaderComponent={renderListHeader}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              disabled={
                markAsRead.isPending ||
                markAllAsRead.isPending
              }
              onPress={() => handleNotificationPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name={
                  filteredNotifications.length === 0 && notifications.length
                    ? "filter-outline"
                    : "bell-check-outline"
                }
                size={34}
                color={theme.colors.muted}
              />
              <Text style={styles.emptyTitle}>
                {filteredNotifications.length === 0 && notifications.length
                  ? "No notifications in this category"
                  : "You’re all caught up"}
              </Text>
              <Text style={styles.stateMessage}>
                {filteredNotifications.length === 0 && notifications.length
                  ? "Try another filter to see more."
                  : "New notifications will appear here."}
              </Text>
            </View>
          }
        />
      )}
    </AppScreen>
  );
}

function NotificationSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 52,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
  },
  markAllButton: {
    minHeight: 40,
    justifyContent: "center",
    paddingLeft: theme.spacing.xs,
  },
  markAllText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  headerActionPlaceholder: {
    width: 40,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  listHeader: {
    gap: theme.spacing.sm,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  separator: {
    backgroundColor: theme.colors.border,
    height: 1,
  },
  filterBar: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  filterTab: {
    alignItems: "center",
    borderRadius: theme.radius.lg,
    flex: 1,
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: theme.spacing.xs,
  },
  activeFilterTab: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  activeFilterText: {
    color: theme.colors.onPrimary,
    fontWeight: "700",
  },
  state: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  stateMessage: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  inlineError: {
    color: theme.colors.error,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    flexGrow: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
}));

function matchesFilter(
  notification: AppNotification,
  filter: NotificationFilter,
) {
  if (filter === "all") return true;
  const type = notification.type.toLowerCase();
  if (filter === "system") return type === "system";
  return type === filter;
}

function getConversationUid(notification: AppNotification) {
  const conversationUid = notification.data?.conversationUid;
  return typeof conversationUid === "string" && conversationUid.length > 0
    ? conversationUid
    : null;
}
