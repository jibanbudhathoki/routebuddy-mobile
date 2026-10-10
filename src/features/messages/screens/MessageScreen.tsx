import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TextField } from "../../../shared/components/TextField";
import { MessageListItem } from "../components/MessageListItem";
import { MessageDialog, type MessageDialogAction } from "../components/MessageDialog";
import {
  useDeleteConversation,
  useListMessages,
  useMarkConversationAsRead,
} from "../hooks/useMessages";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";

export function MessageScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: conversations, isLoading, isError, error, refetch } =
    useListMessages();
  const markAsRead = useMarkConversationAsRead();
  const deleteConversation = useDeleteConversation();
  const [dialog, setDialog] = useState<{
    title: string;
    message?: string;
    actions: MessageDialogAction[];
  } | null>(null);

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
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
            <Text style={{ color: theme.colors.primary, marginTop: theme.spacing.sm }}>
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

    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.msgId}
        renderItem={({ item }) => (
          <MessageListItem
            id={item.msgId}
            avatarUrl={item.avatarUrl ?? ""}
            name={item.recipientName}
            tripInfo={
              item.contextType === "request"
                ? "Request"
                : item.contextType === "trip"
                  ? "Trip"
                  : "Direct Message"
            }
            messagePreview={item.latestMsg || "No messages yet"}
            timestamp={formatInboxTime(item.timestamp)}
            unreadCount={item.unreadCount}
            onPress={() => router.push(`/chat/${item.msgId}`)}
            onMarkRead={() =>
              markAsRead.mutate(item.msgId, {
                onError: (error) => setDialog({
                  title: "Unable to mark as read",
                  message: error instanceof Error ? error.message : "Please try again.",
                  actions: [{ label: "OK", onPress: () => {} }],
                }),
              })
            }
            onDelete={() => handleDeleteConversation(item.msgId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: getTopSafeAreaInset(insets.top) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={28}
            color={theme.colors.primary}
          />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <TextField
            placeholder="Search messages"
            leftElement={
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={theme.colors.muted}
                style={{ marginRight: 8 }}
              />
            }
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons
            name="tune-variant"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
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
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
  },
  notificationBtn: {
    position: "relative",
    padding: theme.spacing.xs,
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: "center",
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
}));
