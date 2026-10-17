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
        contentContainerStyle={styles.listContent}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
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
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
}));
