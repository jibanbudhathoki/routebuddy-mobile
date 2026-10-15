import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { NotificationItem } from "../components/NotificationItem";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";
import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";

export function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const notificationsQuery = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

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
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={styles.headerActionPlaceholder} />
        )}
      </View>
      {notificationsQuery.isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyListContent,
          ]}
          ItemSeparatorComponent={NotificationSeparator}
          refreshing={notificationsQuery.isRefetching}
          onRefresh={() => void notificationsQuery.refetch()}
          ListHeaderComponent={
            notificationsQuery.isError ? (
              <Text style={styles.inlineError}>
                Unable to refresh notifications:{" "}
                {notificationsQuery.error instanceof Error
                  ? notificationsQuery.error.message
                  : "Please try again."}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              disabled={
                item.isRead ||
                markAsRead.isPending ||
                markAllAsRead.isPending
              }
              onPress={() => handleMarkAsRead(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="bell-check-outline"
                size={34}
                color={theme.colors.muted}
              />
              <Text style={styles.emptyTitle}>You’re all caught up</Text>
              <Text style={styles.stateMessage}>
                New notifications will appear here.
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
    justifyContent: "space-between",
    minHeight: 48,
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
    fontSize: 20,
    fontWeight: "700",
  },
  markAllButton: {
    minHeight: 40,
    justifyContent: "center",
  },
  markAllText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  headerActionPlaceholder: {
    width: 40,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: theme.spacing.sm,
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
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
}));
