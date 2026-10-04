import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Animated,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Swipeable, FlatList } from "react-native-gesture-handler";
import {
  useMessages,
  useConversations,
} from "../hooks/useMessages";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";

export function ChatDetailScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: conversations } = useConversations();
  const conversation = conversations?.find((c) => c.uid === id);

  const { data: apiMessages } = useMessages(id || "");

  const [messageText, setMessageText] = useState("");

  const chatData = conversation
    ? {
        name: `Participant ${conversation.participants.filter((p) => p !== "me")[0] || "Unknown"}`,
        tripTitle: conversation.tripId
          ? `Trip ${conversation.tripId.substring(0, 5)}...`
          : "Direct Message",
        logo: "https://cdn-icons-png.flaticon.com/512/615/615075.png",
        price: "$0.00",
        origin: "-",
        dest: "-",
        date: new Date(conversation.createdAt).toLocaleDateString(),
        time: "TBD",
        items: "-",
      }
    : {
        name: "Loading...",
        tripTitle: "...",
        logo: "",
        price: "",
        origin: "",
        dest: "",
        date: "",
        time: "",
        items: "",
      };

  const messages = (apiMessages || []).map((m) => ({
    id: m.uid,
    type: m.type === "text" ? "text" : "system",
    isMe: m.senderUid === "me", // Assuming "me" is current user's UID for now
    text: m.content,
    timestamp: new Date(m.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    avatarUrl: "",
    isRead: false,
    reactions: m.reactions,
  }));

  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  const toggleSelection = (msgId: string) => {
    if (selectedMessages.includes(msgId)) {
      setSelectedMessages((prev) => prev.filter((i) => i !== msgId));
    } else {
      setSelectedMessages((prev) => [...prev, msgId]);
    }
  };

  const handleLongPress = (item: any) => {
    if (item.type !== "date") {
      toggleSelection(item.id);
    }
  };

  const handlePress = (item: any) => {
    if (selectedMessages.length > 0 && item.type !== "date") {
      toggleSelection(item.id);
    }
  };

  const clearSelection = () => setSelectedMessages([]);

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete messages?",
      `Are you sure you want to delete ${selectedMessages.length} message(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // logic to delete messages goes here
            clearSelection();
          },
        },
      ],
    );
  };

  const renderHeader = () => (
    <View style={styles.tripCardContainer}>
      <View style={styles.tripCard}>
        <Image
          source={{ uri: chatData.logo }}
          style={styles.tripLogo}
          resizeMode="contain"
        />
        <View style={styles.tripCardContent}>
          <View style={styles.tripCardHeader}>
            <Text style={styles.tripTitle}>{chatData.tripTitle}</Text>
            <View style={styles.tripPriceContainer}>
              <Text style={styles.tripPriceLabel}>Order Total</Text>
              <Text style={styles.tripPrice}>{chatData.price}</Text>
            </View>
          </View>

          <View style={styles.tripRouteRow}>
            <Text style={styles.tripRouteText}>{chatData.origin}</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={14}
              color={theme.colors.muted}
              style={{ marginHorizontal: 4 }}
            />
            <Text style={styles.tripRouteText}>{chatData.dest}</Text>
          </View>

          <View style={styles.tripMetaRow}>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={14}
              color={theme.colors.muted}
            />
            <Text style={styles.tripMetaText}>{chatData.date}</Text>
          </View>
          <View style={[styles.tripMetaRow, { marginTop: 4 }]}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={theme.colors.muted}
            />
            <Text style={styles.tripMetaText}>{chatData.time}</Text>
            <Text style={styles.tripMetaDivider}>•</Text>
            <Text style={styles.tripItemsCount}>{chatData.items}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const MessageItem = ({ item }: { item: any }) => {
    const isSelected = selectedMessages.includes(item.id);
    const isSelectionMode = selectedMessages.length > 0;
    const swipeableRef = useRef<any>(null);

    if (item.type === "date") {
      return (
        <View style={styles.dateContainer}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    const renderLeftActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: "clamp",
      });

      return (
        <View style={styles.whatsappReplyActionContainer}>
          <Animated.View
            style={[
              styles.whatsappReplyIconWrapper,
              { transform: [{ scale }] },
            ]}
          >
            <MaterialCommunityIcons
              name="reply"
              size={20}
              color={theme.colors.text}
            />
          </Animated.View>
        </View>
      );
    };

    const onSwipeableOpen = () => {
      setReplyingTo(item);
      swipeableRef.current?.close();
    };

    const handleReaction = (emoji: string) => {
      // In a real app, save the reaction to state or backend here
      clearSelection();
    };

    const isReacting =
      selectedMessages.length === 1 && selectedMessages[0] === item.id;

    const renderReactionBar = (isMe: boolean = false) => {
      if (!isReacting) return null;
      return (
        <View
          style={[
            styles.reactionBar,
            isMe ? styles.reactionBarRight : styles.reactionBarLeft,
          ]}
        >
          {["❤️", "😂", "😮", "😢", "🙏", "👍"].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleReaction(emoji)}
              style={styles.reactionBtn}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    if (item.type === "system") {
      return (
        <Swipeable
          ref={swipeableRef}
          renderLeftActions={renderLeftActions}
          onSwipeableLeftOpen={onSwipeableOpen}
          enabled={!isSelectionMode}
        >
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
            style={[
              styles.messageRowLeft,
              isSelected && styles.selectedMessageRow,
            ]}
          >
            {item.avatarUrl ? (
              <Image
                source={{ uri: item.avatarUrl }}
                style={styles.chatAvatar}
              />
            ) : (
              <View style={[styles.chatAvatar, styles.chatAvatarFallback]}>
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color={theme.colors.surface}
                />
              </View>
            )}
            <View style={{ alignItems: "flex-start", flex: 1 }}>
              {renderReactionBar()}
              <View style={styles.systemMessageBubble}>
                <View style={styles.systemMessageHeader}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color={theme.colors.text}
                  />
                  <Text style={styles.systemMessageTitle}>{item.title}</Text>
                </View>
                <Text style={styles.systemMessageText}>{item.text}</Text>
              </View>
              <Text style={styles.systemMessageTime}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    }

    if (item.isMe) {
      return (
        <Swipeable
          ref={swipeableRef}
          renderLeftActions={renderLeftActions}
          onSwipeableLeftOpen={onSwipeableOpen}
          enabled={!isSelectionMode}
        >
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
            style={[
              styles.messageRowRight,
              isSelected && styles.selectedMessageRow,
            ]}
          >
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              {renderReactionBar(true)}
              <View style={styles.myMessageBubble}>
                <Text style={styles.myMessageText}>{item.text}</Text>
              </View>
              <View style={styles.myMessageFooter}>
                <Text style={styles.myMessageTime}>{item.timestamp}</Text>
                {item.isRead && (
                  <MaterialCommunityIcons
                    name="check-all"
                    size={14}
                    color="#6FA8FF"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    }

    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        onSwipeableLeftOpen={onSwipeableOpen}
        enabled={!isSelectionMode}
      >
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          onPress={() => handlePress(item)}
          activeOpacity={0.8}
          style={[
            styles.messageRowLeft,
            isSelected && styles.selectedMessageRow,
          ]}
        >
          {item.avatarUrl ? (
            <Image source={{ uri: item.avatarUrl }} style={styles.chatAvatar} />
          ) : (
            <View style={[styles.chatAvatar, styles.chatAvatarFallback]}>
              <Text style={styles.chatAvatarFallbackText}>
                {chatData.name ? chatData.name.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}
          <View style={{ alignItems: "flex-start", flex: 1 }}>
            {renderReactionBar()}
            <View style={styles.theirMessageBubble}>
              <Text style={styles.theirMessageText}>{item.text}</Text>
            </View>
            <Text style={styles.theirMessageTime}>{item.timestamp}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageItem item={item} />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: getTopSafeAreaInset(insets.top) }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        {selectedMessages.length > 0 ? (
          <View style={styles.selectionHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={clearSelection}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.selectionCount}>{selectedMessages.length}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={handleDeleteSelected}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{chatData.name}</Text>
              <Text style={styles.headerSubtitle}>{chatData.tripTitle}</Text>
            </View>
            <TouchableOpacity style={styles.optionsButton}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        extraData={selectedMessages}
      />

      <View style={styles.bottomAreaContainer}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <View style={styles.replyingToLeftBar} />
            <View style={styles.replyingToContent}>
              <Text style={styles.replyingToName}>
                {replyingTo.isMe ? "You" : chatData.name}
              </Text>
              <Text style={styles.replyingToText} numberOfLines={1}>
                {replyingTo.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.muted}
              multiline
            />
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={24}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={theme.colors.surface}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
  },
  normalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "1A", // light primary tint
  },
  selectionCount: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginLeft: 16,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 2,
  },
  optionsButton: {
    padding: theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  tripCardContainer: {
    paddingVertical: theme.spacing.md,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tripLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  tripCardContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  tripCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },
  tripPriceContainer: {
    alignItems: "flex-end",
  },
  tripPriceLabel: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  tripRouteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  tripRouteText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "500",
  },
  tripMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 4,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripMetaText: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: 4,
  },
  tripMetaDivider: {
    fontSize: 12,
    color: theme.colors.border,
    marginHorizontal: 2,
  },
  tripItemsCount: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  dateBadge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "600",
  },
  messageRowLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  messageRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  selectedMessageRow: {
    backgroundColor: theme.colors.primary + "1A", // subtle highlight
    zIndex: 100,
    elevation: 100,
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  chatAvatarFallback: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  chatAvatarFallbackText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  theirMessageBubble: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  theirMessageText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  theirMessageTime: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 4,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: "100%",
  },
  myMessageText: {
    fontSize: 15,
    color: theme.colors.onPrimary,
    lineHeight: 22,
  },
  myMessageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  myMessageTime: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  systemMessageBubble: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: "75%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  systemMessageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  systemMessageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginLeft: 6,
  },
  systemMessageText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  systemMessageTime: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 4,
  },
  bottomAreaContainer: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reactionBar: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reactionBarLeft: {
    alignSelf: "flex-start",
  },
  reactionBarRight: {
    alignSelf: "flex-end",
  },
  reactionBtn: {
    paddingHorizontal: 8,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: 8,
  },
  replyingToLeftBar: {
    width: 4,
    backgroundColor: theme.colors.primary,
    height: "100%",
    borderRadius: 2,
    marginRight: 8,
  },
  replyingToContent: {
    flex: 1,
  },
  replyingToName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: 2,
  },
  replyingToText: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: 12,
    maxHeight: 100,
  },
  cameraButton: {
    padding: theme.spacing.xs,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  whatsappReplyActionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  whatsappReplyIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  replyAction: {
    backgroundColor: theme.colors.google || "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
}));
