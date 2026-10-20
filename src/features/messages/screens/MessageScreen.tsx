import {
  ActivityIndicator,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { MessageListItem } from "../components/MessageListItem";
import { MessageDialog, type MessageDialogAction } from "../components/MessageDialog";
import {
  useDeleteConversation,
  useListMessages,
} from "../hooks/useMessages";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { NotificationBellButton } from "../../../shared/components/NotificationBellButton";
import { useUnreadNotificationCount } from "../../notifications/hooks/useNotifications";

export function MessageScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unreadCount = useUnreadNotificationCount();

  const { data: conversations, isLoading, isError, error, refetch } =
    useListMessages();
  const deleteConversation = useDeleteConversation();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationFilter, setConversationFilter] = useState<"all" | "unread">("all");
  const [dialog, setDialog] = useState<{
    title: string;
    message?: string;
    actions: MessageDialogAction[];
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const handleDeleteConversation = (conversationId: string) => {
    setDialog({
      title: "Delete conversation?",
      message: "This will hide the conversation from your inbox.",
      actions: [
        { label: "Cancel", onPress: () => {} },
        {
          label: "Delete",
          destructive: true,
          onPress: () =>
            deleteConversation.mutate(conversationId, {
              onError: (error) => setDialog({
                title: "Unable to delete conversation",
                message: error instanceof Error ? error.message : "Please try again.",
                actions: [{ label: "OK", onPress: () => {} }],
              }),
              }),
        },
      ],
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.text} />
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.colors.error }}>
            {error instanceof Error
              ? error.message
              : "Failed to load conversations"}
          </Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => refetch()}>
            <Text style={{ color: theme.colors.text, marginTop: theme.spacing.sm }}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!conversations || conversations.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.colors.muted }}>No messages yet</Text>
        </View>
      );
    }

    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
    const visibleConversations = conversations.filter((conversation) => {
      const matchesFilter =
        conversationFilter === "all" || (conversation.unreadCount ?? 0) > 0;
      const matchesSearch =
        !normalizedSearch ||
        `${conversation.recipientName} ${conversation.latestMsg}`
          .toLocaleLowerCase()
          .includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });

    return (
      <FlatList
        data={visibleConversations}
        keyExtractor={(item) => item.msgId}
        renderItem={({ item }) => (
          <MessageListItem
            id={item.msgId}
            avatarUrl={item.avatarUrl ?? ""}
            name={item.recipientName}
            messagePreview={item.latestMsg || "No messages yet"}
            timestamp={formatInboxTime(item.timestamp)}
            unreadCount={item.unreadCount}
            latestMessageIsOwn={item.latestMsgIsOwn}
            latestMessageIsRead={item.isRead}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item.msgId,
                  ...(item.requestId ? { requestUid: item.requestId } : {}),
                },
              })
            }
            onDelete={() => handleDeleteConversation(item.msgId)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          visibleConversations.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            {conversationFilter === "unread"
              ? "No unread conversations"
              : "No conversations found"}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: getTopSafeAreaInset(insets.top) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={() => router.push("/notifications")}
        />
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={theme.colors.muted}
        />
        <TextInput
          accessibilityLabel="Search messages"
          placeholder="Search messages"
          placeholderTextColor={theme.colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>
      <View style={styles.filterRow}>
        {(["all", "unread"] as const).map((filter) => {
          const isSelected = conversationFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setConversationFilter(filter)}
              style={[
                styles.filterChip,
                isSelected && styles.selectedFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  isSelected && styles.selectedFilterLabel,
                ]}
              >
                {filter === "all" ? "All" : "Unread"}
                {filter === "unread"
                  ? ` ${conversations?.filter((item) => (item.unreadCount ?? 0) > 0).length ?? 0}`
                  : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderContent()}
      <MessageDialog
        visible={dialog !== null}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions ?? []}
        onDismiss={() => setDialog(null)}
      />
    </View>
  );
}

function formatInboxTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  return date.toDateString() === now.toDateString()
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: theme.colors.text,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    flexDirection: "row",
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
  },
  searchInput: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    marginLeft: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  filterChip: {
    borderColor: theme.colors.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  selectedFilterChip: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  filterLabel: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  selectedFilterLabel: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  noResults: {
    color: theme.colors.muted,
    fontSize: 14,
    padding: theme.spacing.lg,
    textAlign: "center",
  },
}));
